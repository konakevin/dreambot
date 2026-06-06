# dotfiles

Backups of Kevin's shell config so the DreamBot dev commands survive a machine
wipe / OS reinstall / move to a new laptop. These files are NOT auto-synced —
update them when the upstream file changes.

## Files

- **`zshrc`** — snapshot of `~/.zshrc`. Contains the `dreambot` and `realbot`
  zsh functions (simulator + physical-device dev-build launchers) plus the
  prompt config and PATH setup.

## Refreshing a backup

```bash
cp ~/.zshrc dreambot/dotfiles/zshrc
git add dotfiles/zshrc && git commit -m "Refresh dotfiles/zshrc"
```

## Restoring on a new machine

```bash
cp dreambot/dotfiles/zshrc ~/.zshrc
source ~/.zshrc
```

Note: the file assumes Homebrew at `/opt/homebrew` (Apple Silicon), nvm at
`$HOME/.nvm`, and the DreamBot repo at `~/Development/apps/dreambot`. Adjust
paths if any of those move.
