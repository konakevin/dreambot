/**
 * A CAST NAME IS REQUIRED WHERE IT IS DECIDED, AND ONLY A VALIDATED ONE EVER REACHES THE STORE.
 *
 * Two rules, one mechanism.
 *
 * WHERE. The name used to be demanded on the way OUT: a dialog when you tried to leave the
 * screen, backed by a disabled back gesture so you could not miss it. That is the latest
 * possible moment to ask and the furthest from the decision (Kevin, 2026-09-21: "move it further
 * left in the chain to when they first upload the photo - make them name it right there, or
 * remove it"). requireName now asks the instant an unnamed member's field is left empty, and the
 * exit guard is gone.
 *
 * WHAT REACHES THE STORE. Typing used to write straight to the store on every keystroke, so an
 * unvalidated name was live and savable the entire time you typed, and the ONLY thing rejecting
 * a duplicate was the TextInput's onBlur. Blur is not a reliable hook here: switching a member
 * off moves their card from IN YOUR DREAMS to BACKSTAGE, which are two separate lists, so the
 * input UNMOUNTS and never blurs — and the toggle's own persist() saved the duplicate ("if the
 * user fat fingers the 'tap away' from the box onto the toggle ... it is allowing a duplicate").
 *
 * The fix is one choke point, not a patch per control: the name being typed is a local DRAFT,
 * and persist() — which every control already calls — commits it through validation first. So
 * whichever control ends the edit, the same rules run.
 *
 * A source guard, because this is a React screen the pure-logic lane cannot mount. The pure
 * helpers it leans on (finalizePartnerName, isNameTaken) are unit-tested in
 * dreamCastRoster.test.ts; what is locked HERE is the wiring that decides when they run.
 */
import fs from 'fs';
import path from 'path';

const SRC = fs.readFileSync(
  path.join(__dirname, '..', '..', 'components', 'DreamCastRoster.tsx'),
  'utf8'
);

/** The name field's JSX, where "what does typing do" is decided. */
const INPUT = SRC.slice(SRC.indexOf('<TextInput'), SRC.indexOf('placeholder="Add a name"'));

describe('Dream Cast: the name draft never reaches the store unvalidated', () => {
  it('the field is driven by the local draft, not by the stored name', () => {
    // value={p.name} is the shape of the bug: it can only work if every keystroke writes the
    // store, which is what made an unvalidated name savable at any instant.
    expect(INPUT).toContain('value={draft}');
    expect(INPUT).not.toContain('value={p.name');
  });

  it('typing touches only the draft — never updatePartner', () => {
    expect(INPUT).toContain('draftRef.current = { id: p.id, text: clean }');
    expect(INPUT).not.toContain('updatePartner');
  });

  it('persist() commits the draft BEFORE saving, so every control validates', () => {
    // The choke point. Without this, each control (toggle, relationship pill, star, remove)
    // would need its own flush and the one that got missed would save a duplicate.
    expect(SRC).toMatch(/const persist = async \(\) => \{[^}]*commitDraft\(\);/s);
  });

  it('commitDraft holds off while the photo is still analyzing', () => {
    // addNewPartner opens the field the moment a photo is PICKED, so the upload's own success
    // persist() would otherwise flush an empty draft and demand a name before the user has been
    // shown anything to type into. Read live from the store: `busy` is stale in that closure.
    expect(SRC).toMatch(
      /if \(useOnboardingStore\.getState\(\)\.castUploadsInFlight > 0\) return false;/
    );
  });

  it('starting a new edit commits the one it replaces', () => {
    // Tapping a second card's pencil unmounts the first input without blurring it.
    expect(SRC).toMatch(
      /if \(draftRef\.current && draftRef\.current\.id !== id\) commitDraft\(\);/
    );
  });

  it('an emptied field reverts instead of unnaming someone', () => {
    // Clearing a name is not a thing a user can want, and it silently made that member
    // unsummonable. No `name: undefined` write survives.
    expect(SRC).not.toContain('name: undefined');
  });
});

describe('Dream Cast: the name is required at the upload, not at the exit', () => {
  it('requireName offers exactly name-or-remove, and cannot be tapped away', () => {
    expect(SRC).toContain('const requireName = (');
    // The title names the problem: the two routes in are different problems with the same two
    // answers (Kevin, 2026-09-21: "for a duplicate name check dialog ... change the title to
    // say 'Duplicate Name'").
    expect(SRC).toContain("why ? 'Duplicate Name' : 'Name Required'");
    expect(SRC).toContain("text: 'Name them'");
    expect(SRC).toContain("text: 'Remove them'");
    // Dismissing the scrim would leave exactly the state this dialog exists to prevent: a
    // member with a face and no name (Kevin, 2026-09-21: "make it modal, the user can't tap
    // off the dialog to release it").
    expect(SRC).toContain('{ dismissible: false }');
  });

  it('an empty field asks whether or not they had a name before', () => {
    // Kevin, 2026-09-21: "later if they go in to edit it and tap away while empty, it should
    // also trigger the same dialog". Gating this on !p.name would let someone clear a name and
    // walk away, which is the exact state the rule exists to prevent.
    expect(SRC).toMatch(/if \(!next\) \{\s*requireName\(p\);\s*return true;/);
  });

  it('typing never raises it — only leaving the field does', () => {
    // Kevin, 2026-09-21: "if someone clears out the text field, don't trigger it then, only if
    // they tap away from the input with it empty". onChangeText touches the draft and nothing
    // else, so an empty box under an active cursor is just an empty box.
    expect(INPUT).not.toContain('requireName');
    expect(INPUT).not.toContain('commitDraft');
  });

  it("EVERY route out of the field asks, not just the TextInput's own blur event", () => {
    // Kevin, 2026-09-21: "that's what I meant by 'on blur' only, but I think you took it too
    // literally" — after a stricter reading let the chevron walk past the rule. There is no
    // opt-in flag on commitDraft any more: reaching it at all means the field was left.
    expect(SRC).not.toContain('opts?.prompt');
    expect(SRC).not.toContain('commitDraft({ prompt');
    // Navigating away is one of those routes, and it was the one that flushed nothing.
    expect(SRC).toMatch(
      /addListener\('beforeRemove'[\s\S]{0,200}?if \(!draftRef\.current\) return;[\s\S]{0,120}?if \(commitDraft\(\)\) e\.preventDefault\(\);/
    );
  });

  it('that listener is dormant unless a name is actually being typed', () => {
    // It must not become the roster-wide exit guard again: no scan of who is unnamed, and no
    // preventDefault for anyone who is not mid-edit.
    expect(SRC).not.toContain('unnamedPartners');
    const listener = SRC.slice(SRC.indexOf("addListener('beforeRemove'"));
    expect(listener.slice(0, 400)).toContain('if (!draftRef.current) return;');
  });

  it('"Name them" hands the field back, focused and seeded', () => {
    // The dialog cannot be tapped away, so this is the only non-destructive way out of it —
    // and it must land the user back in the field, not just close (Kevin, 2026-09-21: "when
    // the 'name required' dialog is closed, it should focus back to the text field").
    expect(SRC).toMatch(/text: 'Name them'[^}]*onPress: \(\) => beginEditing\(p\.id, p\.name\)/);
    // beginEditing works by (re)mounting the input, so autoFocus is what actually raises the
    // keyboard. Without it the field would reopen dead.
    expect(SRC).toContain('autoFocus');
  });

  it('a rejected duplicate produces ONE message, never a toast and a dialog', () => {
    // Blurring off an unnamed member -> the dialog that asks, carrying the reason. Every other
    // case (they already have a name to fall back on, or this was not a blur) -> the toast.
    expect(SRC).toMatch(
      /if \(p\.name\) \{[\s\S]{0,400}?Toast\.show\(why,[\s\S]{0,120}?return false;\s*\}\s*requireName\(p, why\);/
    );
  });
});
