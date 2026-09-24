/**
 * Locks the fleet's model default for new bot paths (Kevin, 2026-09-24):
 *
 *   A path that would pin flux-1.1-pro rolls 50/50 flux-1.1-pro / flux-1.1-pro-ultra
 *   unless a MEASURED reason (a signature rate, a framing loss) is written next to the pin.
 *
 * Why it is locked: wherever 1.1-pro performs well, ultra usually does too, and the coin flip
 * buys a slight variation in look for free. The 2026-09-24 fleet inventory found 197 live
 * paths already coin-flipping, 127 ultra-only, and only 4 pro-only — every one of the 4 a
 * per-path pin written by the agent that built the path. This test makes a NEW pro-only pin
 * fail CI unless it is added to the exception list below together with its reason, so the
 * default cannot erode one path at a time.
 *
 * Scope: `modelByPath` entries only (a pin is the only way a single path becomes pro-only;
 * the picker pools are shared per medium and are Kevin's to set in the DB).
 */

import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

const PRO = 'black-forest-labs/flux-1.1-pro';
const ULTRA = 'black-forest-labs/flux-1.1-pro-ultra';

/**
 * Documented pro-only pins. Add a path here ONLY with the measured reason that excludes ultra
 * (and keep the same reason as a comment next to the pin in the bot's index.js).
 */
const DOCUMENTED_PRO_ONLY: Record<string, string> = {
  'faebot/acorn-boat-regatta': 'ultra signed 1 of 3 round-0 renders (readable text = rubric fail)',
  'faebot/star-charting':
    'lighting-condition path (playbook lesson 6) and ultra signs; rolled back from flux-2-pro 2026-09-24',
  'steambot/brass-glasshouse': 'ultra frames tighter and crops the glazed dome that is the subject',
  'tinybot/snow-globe-world':
    'ultra loses the cropped-glass arc that is the path (measured on ToyBot)',
};

type ModelPin = string | string[] | Record<string, number>;
interface BotModule {
  paths?: string[];
  shadowPaths?: string[];
  modelByPath?: Record<string, ModelPin>;
}

const BOTS_DIR = join(__dirname, '../../scripts/bots');
const botNames = readdirSync(BOTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(BOTS_DIR, d.name, 'index.js')))
  .map((d) => d.name);

/** The models a pin can resolve to, with a non-zero share. */
function modelsOf(pin: ModelPin): string[] {
  if (typeof pin === 'string') return [pin];
  if (Array.isArray(pin)) return pin;
  return Object.entries(pin)
    .filter(([, w]) => w > 0)
    .map(([m]) => m);
}

describe('model default for new bot paths — a flux-1.1-pro pin rolls 50/50 with ultra unless documented', () => {
  it('finds the bot modules', () => {
    expect(botNames.length).toBeGreaterThan(10);
  });

  describe.each(botNames)('%s', (botName) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bot = require(join(BOTS_DIR, botName, 'index.js')) as BotModule;
    const registered = new Set([...(bot.paths || []), ...(bot.shadowPaths || [])]);
    const pins = Object.entries(bot.modelByPath || {}).filter(([p]) => registered.has(p));

    it('has no undocumented pro-only pin', () => {
      const proOnly = pins
        .filter(([, pin]) => {
          const models = modelsOf(pin);
          return models.length === 1 && models[0] === PRO;
        })
        .map(([p]) => `${botName}/${p}`)
        .filter((key) => !(key in DOCUMENTED_PRO_ONLY));
      // A new pro-only pin: either make it [PRO, ULTRA] (the default) or document why ultra is out.
      expect(proOnly).toEqual([]);
    });

    it('lists no documented exception that no longer exists', () => {
      const stale = Object.keys(DOCUMENTED_PRO_ONLY)
        .filter((key) => key.startsWith(botName + '/'))
        .filter((key) => {
          const p = key.slice(botName.length + 1);
          const pin = bot.modelByPath && bot.modelByPath[p];
          if (!pin) return true; // pin removed → drop it from the list
          const models = modelsOf(pin);
          return !(models.length === 1 && models[0] === PRO); // now rolls ultra → drop it
        });
      expect(stale).toEqual([]);
    });
  });

  it('names the two models it reasons about', () => {
    expect(PRO).not.toEqual(ULTRA);
  });
});
