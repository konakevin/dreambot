/**
 * The visible "•••" options menu on a feed post (a discoverable entry point for
 * App Store 1.2 flag/block, in addition to long-press). Centralizes Report +
 * Block, including the block confirm and the "report too?" follow-up (so a block
 * also notifies the developer of the content, per Apple's wording).
 *
 * Lib (imperative) so the feed card calls it without re-implementing the flow.
 * `blockUser` is the useToggleBlock().mutate from the caller (hooks can't run
 * here).
 */
import * as Haptics from 'expo-haptics';
import { showAlert } from '@/components/CustomAlert';
import { reportContent } from '@/lib/reportContent';

type BlockMutate = (args: { userId: string; currentlyBlocked: boolean }) => void;

type OptionButton = { text: string; style?: 'cancel' | 'destructive'; onPress?: () => void };

export function openPostOptions(opts: {
  uploadId: string;
  authorId: string;
  authorName: string;
  /** Bot authors are first-party curated content — Report (to flag bad AI
   *  output) is offered, but Block is hidden (you don't block our own bot). */
  isBot?: boolean;
  blockUser: BlockMutate;
}): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  const name = opts.authorName || 'user';
  const buttons: OptionButton[] = [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Report post',
      style: 'destructive',
      onPress: () => reportContent({ uploadId: opts.uploadId }),
    },
  ];
  if (!opts.isBot) {
    buttons.push({
      text: `Block @${name}`,
      style: 'destructive',
      onPress: () =>
        showAlert(`Block @${name}?`, "They won't be able to see your posts or contact you.", [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Block',
            style: 'destructive',
            onPress: () => {
              opts.blockUser({ userId: opts.authorId, currentlyBlocked: false });
              // Apple 1.2: a block should also notify the developer of the
              // content — offer to report so it feeds the report pipeline.
              showAlert(
                'Report this user too?',
                'Send it to our team to review and remove abusive content.',
                [
                  { text: 'Not now', style: 'cancel' },
                  {
                    text: 'Report',
                    style: 'destructive',
                    onPress: () => reportContent({ reportedUserId: opts.authorId }),
                  },
                ]
              );
            },
          },
        ]),
    });
  }
  showAlert('Options', '', buttons);
}
