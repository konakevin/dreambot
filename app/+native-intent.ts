/**
 * +native-intent — Expo Router's pre-navigation hook for incoming native URLs.
 *
 * Honor the LAUNCH URL only on the first JS load of the process. iOS keeps the
 * URL the process was launched with (widget tap, push, universal link) and
 * re-reports it to every fresh JS context — so every Metro/dev reload ("r")
 * yanked the app back to the widget's dream. isFirstJsLoad is a native
 * process-lifetime counter (modules/dreambot-widget), so a REAL relaunch still
 * navigates normally; only same-process replays are swallowed to home.
 *
 * Non-initial URLs (links tapped while the app runs) always pass through.
 */

import { isFirstJsLoad } from '@/modules/dreambot-widget';

export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }): string {
  if (initial && !isFirstJsLoad) return '/';
  return path;
}
