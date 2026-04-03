Spin up the DreamBot dev environment. Run these checks in order:

1. Check for a booted iOS simulator: `xcrun simctl list devices available | grep Booted`
   - If none booted, boot iPhone 16 Pro: `xcrun simctl boot "iPhone 16 Pro"` (or latest available)
2. Check if Xcode has the workspace open: `ps aux | grep Xcode | grep -v grep`
   - If not running, open it: `open ios/dreambot.xcworkspace`
   - Remind me to hit Play in Xcode to install the dev build
3. Start Metro bundler: run `export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npx expo start` in the background
   - Use `--dev-client` flag since we need the dev build (not Expo Go)

Report status of each step. If anything fails, diagnose and suggest a fix.
