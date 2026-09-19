# "Send your friend a dream" — idea board (2026-09-18)

Spitballing session (Kevin: "creative ideas that would make prompt or image sharing funner in the app and make people
laugh, love, be delighted"). Nothing here is built. Every idea is grounded in machinery that already exists: the sequel
pins (`REDREAM.md`: look / vibe / cast role / world), the cast roster + consent sheet, the inbox (`notifications`), the
Dream Off invite codes, the holiday postcard overlay pipeline, and Bot & Taco (`MASCOT_LORE.md`). Delight rule
(memory `feedback_delight_pure_joy_not_upsell`): these are joy features, never upsell vehicles.

## Constraints that shape every design

- **Faces need consent.** A friend appears in a dream only if their photo is in the SENDER's roster with consent
  (the existing cast flow). Everything else can send scenes and solos of the sender.
- **The sender spends the sparkle.** A "Send one back" reply is where the friend spends theirs, which keeps gifting
  from feeling like begging.
- **Delivery = an inbox row + an album entry**, both of which exist. The only new table is a "sent dream" record
  (sender, recipient, upload, message, revealed_at).

## A. Sending a dream to a friend

1. **Dream Delivery.** In Create, a "Send to…" toggle picks a friend. The dream renders and lands in THEIR Dreams
   album with an inbox card: "@kevin sent you a dream." One-tap "Send one back" opens Create already addressed.
   Cheapest full version of the idea; the reply loop is what spreads it.
2. **Dream Postcard.** Delivery as a postcard: the image, a hand-written line from the sender, a Bot & Taco stamp,
   the sender's location card name as the postmark. Reuses the holiday postcard overlay pipeline
   (`holiday-postcard` edge fn). A postcard reads as a gift, not a notification.
3. **Cast them in it.** If the friend is in your roster, send a dream they STAR in ("I dreamed you were a pirate
   captain"). The laugh-out-loud one; consent already solved by the roster.
4. **Sealed dream.** The friend sees the card first and taps to reveal ("Bot is holding a dream for you").
   Two seconds of delayed gratification for almost no work.

## B. Doing something fun with an existing dream

5. **Recast.** The sequel machinery pins look, vibe and world; add a cast picker on any dream: "Put me in it",
   "Make it a couple", "Just my +1", "Swap in [friend]". Same scene, new people: a solo becomes a couple sequel, a
   couple becomes a solo. The direct extension of "Dream the sequel" (`force_cast_role` is already a pin) — ~1 day.
6. **Send the sequel.** From a nightly: "Dream the sequel for [friend]" — same world and look, starring them (from
   your roster), delivered to their album. "We were in Tombstone last night, here is your episode."
7. **Dream Duet.** Two friends each get half of a diptych: same world and look, each one solo, side by side in both
   albums. A shared dream without needing each other's photos.
8. **Tag, you're it.** A dream is passed along a chain; each friend redreams it in their own style and it
   accumulates a strip the app shows like a comic.

## C. Playful loops that bring people back

9. **Dream Roulette.** Send a friend a dream where you choose the world and they choose the look (or the reverse);
   neither sees the result until it lands. Uses the two pins we already separate.
10. **Guess the world.** Send a dream with the location name hidden; the friend guesses where it was set; the reveal
    shows the card. Works beautifully with the iconic spots.
11. **Birthday dream.** Bot notices a friend's birthday (if set) and offers to send a celebration sequel in their
    favourite look. Pure delight, no ask attached.
12. **Nightly for two.** Couples on the roster opt in to a shared nightly: one dream, both albums, one inbox line
    each. Waking up in the same dream.

## Where to start (Claude's recommendation)

**Recast + Send the sequel.** Recast reuses tonight's pins with one new option; Send the sequel adds delivery on top.
Together they turn every nightly into something you can hand to someone, which is the emotional core of the idea.
Dream Delivery in Create follows as the general case once the delivery plumbing (sent-dream record + inbox card +
"Send one back") exists.

## Open questions for Kevin

- Who can receive: followers only, mutual follows, or anyone with a Dream Off-style code?
- Does a received dream count toward the recipient's album quota / feed, or live in a separate "From friends" shelf?
- Should a delivered dream be private by default (recipient decides to post), or inherit the sender's visibility?
