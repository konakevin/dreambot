---
name: rad
description: Start up the full Rad or Bad development environment (simulator, Xcode, Metro)
disable-model-invocation: true
---

Start the full dev environment for the Rad or Bad app. Run these steps:

0. **Read the full project context** first — read BOTH of these files so you have complete knowledge of the app:
   - `~/.claude/projects/-Users-kevinmchenry-Development-apps-rad-or-bad/memory/project_architecture.md` — app architecture, DB schema, screens, components, data flow, ranking system
   - `~/.claude/projects/-Users-kevinmchenry-Development-apps-rad-or-bad/memory/dev_tooling.md` — Supabase connection, git workflow, Expo, Xcode, seed script, screenshots, ad-hoc DB queries

1. **Display the startup banner** — Print this ASCII art banner first thing:

```
 ██████╗  █████╗ ██████╗      ██████╗ ██████╗     ██████╗  █████╗ ██████╗
 ██╔══██╗██╔══██╗██╔══██╗    ██╔═══██╗██╔══██╗    ██╔══██╗██╔══██╗██╔══██╗
 ██████╔╝███████║██║  ██║    ██║   ██║██████╔╝    ██████╔╝███████║██║  ██║
 ██╔══██╗██╔══██║██║  ██║    ██║   ██║██╔══██╗    ██╔══██╗██╔══██║██║  ██║
 ██║  ██║██║  ██║██████╔╝    ╚██████╔╝██║  ██║    ██████╔╝██║  ██║██████╔╝
 ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝      ╚═════╝ ╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═════╝
```

   Then generate a short, funny, unique motivational one-liner underneath. Make it different every time — hype up the dev session, reference shipping code, building something sick, etc. Keep it punchy and fun. Examples of the vibe (don't reuse these):
   - "Time to ship code so fire it needs its own extinguisher."
   - "Another day, another mass swiping event. Let's build."
   - "Legend has it every line of code you write today will be LEGENDARY tier."
2. **Check for a booted simulator:** `xcrun simctl list devices available | grep Booted`
3. **Open the Xcode workspace:** `open ios/*.xcworkspace`
4. **Start Expo Metro in the background** (source nvm first):
   ```bash
   export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && npx expo start
   ```
   Run this with `run_in_background: true`.
5. **Tell Kevin to hit play in Xcode** to build to the simulator
6. **Print a "ready to code" message** so he knows the environment is live

Important notes:
- Node is managed via nvm — always source nvm before running node/npx commands
- This app uses a dev build (not Expo Go) — it must be built via Xcode
- The booted simulator is usually iPhone 17 Pro
- **Screenshots:** See CLAUDE.md for screenshot rules.
