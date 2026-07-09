/**
 * Sync-lock: the client's isSoloSwapPhoto mirror must agree with the engine's
 * routeNewSceneSubject fork for EVERY signal combination. If the engine fork
 * ever changes, this fails and points at lib/newSceneRoute.ts.
 */

import { isSoloSwapPhoto } from '@/lib/newSceneRoute';
// Deno source resolved by the jest moduleNameMapper (@engine/* → _shared/*);
// this file is excluded from tsc (tsconfig exclude) like every @engine test.
import { routeNewSceneSubject } from '@engine/newSceneDirective';

describe('isSoloSwapPhoto mirrors routeNewSceneSubject', () => {
  const faces = ['clean', 'multi', 'none', 'unclear'];
  const types = ['person', 'group', 'animal', 'object', 'scenery', 'unclear'];
  const counts = [0, 1, 2, 4];

  it('agrees across the full signal grid', () => {
    for (const num_people of counts) {
      for (const num_animals of counts) {
        for (const face of faces) {
          for (const type of types) {
            const engine = routeNewSceneSubject({ type, num_people, num_animals, face });
            const client = isSoloSwapPhoto({ num_people, num_animals, face });
            expect({ num_people, num_animals, face, type, client }).toEqual({
              num_people,
              num_animals,
              face,
              type,
              client: engine.mode === 'solo_swap',
            });
          }
        }
      }
    }
  });

  it('treats missing/negative counts as reference-safe', () => {
    expect(isSoloSwapPhoto({ num_people: NaN, num_animals: 0, face: 'clean' })).toBe(false);
    expect(isSoloSwapPhoto({ num_people: -1, num_animals: 0, face: 'clean' })).toBe(false);
    expect(isSoloSwapPhoto({ num_people: 1, num_animals: -2, face: 'clean' })).toBe(true);
  });
});
