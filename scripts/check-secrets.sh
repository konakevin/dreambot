#!/usr/bin/env sh
# Pre-commit secret scanner — blocks commits that introduce common credential
# patterns. Lightweight inline regex scan, no external dependencies.
#
# Bypass in an emergency with `git commit --no-verify`. Don't abuse it.
#
# Patterns covered (add more as needed):
#   - Hardcoded password literals matching the bot pattern
#   - generic password=/secret=/api_key= with quoted long-string values
#   - AWS access keys
#   - Slack webhooks
#   - PEM-format private keys

set -e

# Get the diff of staged content (added lines only).
# Allowlist: this scanner itself, and the rotation script that has to
# reference the historical leaked prefix as a non-force fallback.
STAGED_DIFF=$(git diff --cached --diff-filter=ACMR -U0 -- \
  ':!*.lock' \
  ':!package-lock.json' \
  ':!scripts/check-secrets.sh' \
  ':!scripts/rotate-bot-passwords.js' \
  || true)
if [ -z "$STAGED_DIFF" ]; then
  exit 0
fi

# Only scan added lines (those starting with `+` but not the `+++` file headers).
ADDED=$(printf "%s\n" "$STAGED_DIFF" | grep -E "^\+[^+]" || true)
if [ -z "$ADDED" ]; then
  exit 0
fi

HITS=""

check() {
  pattern="$1"
  label="$2"
  match=$(printf "%s\n" "$ADDED" | grep -iE "$pattern" || true)
  if [ -n "$match" ]; then
    HITS="${HITS}\n  ✗ ${label}\n${match}\n"
  fi
}

# Bot literal — the specific pattern that GitGuardian flagged.
check "BotAccount2026" "Hardcoded bot password literal"
# Hardcoded password assignments with quoted values (>=8 chars).
check "(password|passwd)\s*[:=]\s*['\"][^'\"]{8,}['\"]" "Hardcoded password literal"
# api_key/secret_key with quoted long-string values.
check "(api[_-]?key|secret[_-]?key|access[_-]?token)\s*[:=]\s*['\"][a-zA-Z0-9_\-]{20,}" "Hardcoded API key/secret"
# AWS access keys.
check "AKIA[0-9A-Z]{16}" "AWS Access Key ID"
# Slack webhook URLs.
check "hooks\.slack\.com/services/T[A-Z0-9]+/B[A-Z0-9]+/[a-zA-Z0-9]+" "Slack webhook URL"
# PEM private keys.
check "BEGIN ((RSA |EC |DSA |OPENSSH )?PRIVATE) KEY" "PEM private key"

if [ -n "$HITS" ]; then
  printf "\n❌ Possible secret leak detected in staged changes:\n"
  printf "%b" "$HITS"
  printf "\nIf this is a false positive, bypass with: git commit --no-verify\n\n"
  exit 1
fi

exit 0
