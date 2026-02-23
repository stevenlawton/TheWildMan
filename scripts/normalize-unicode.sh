#!/usr/bin/env bash

# Normalizes LLM-produced Unicode characters using SplatLLM.
# Wraps the stdin/stdout tool to work with files and directories.
#
# Usage:
#   ./scripts/normalize-unicode.sh <file-or-dir>
#   ./scripts/normalize-unicode.sh --check <file-or-dir>
#
# Requires: uvx (from uv) with splatllm available

set -euo pipefail

SPLATLLM_FLAGS=(
  --keep-headings --keep-code-blocks --keep-inline-code
  --keep-bold --keep-italics --keep-strikethrough
  --keep-images --keep-links --keep-blockquotes
  --keep-unordered-lists --keep-ordered-lists
  --keep-horizontal-rules --keep-tables --no-lint
)

EXTENSIONS_RE='\.(jsx?|tsx?|css|json|md)$'

check_only=false
targets=()

for arg in "$@"; do
  if [[ "$arg" == "--check" ]]; then
    check_only=true
  else
    targets+=("$arg")
  fi
done

if [[ ${#targets[@]} -eq 0 ]]; then
  echo "Usage: normalize-unicode.sh [--check] <file-or-dir>" >&2
  exit 1
fi

dirty=()

process_file() {
  local fp="$1"

  # Skip non-matching extensions
  if ! echo "$fp" | grep -qE "$EXTENSIONS_RE"; then
    return
  fi

  local original normalized
  original=$(cat "$fp")
  normalized=$(printf '%s' "$original" | uvx splatllm "${SPLATLLM_FLAGS[@]}" 2>/dev/null) || return

  if [[ "$original" != "$normalized" ]]; then
    dirty+=("$fp")
    if [[ "$check_only" == false ]]; then
      printf '%s' "$normalized" > "$fp"
    fi
  fi
}

collect_files() {
  local target="$1"
  if [[ -d "$target" ]]; then
    while IFS= read -r -d '' f; do
      process_file "$f"
    done < <(find "$target" -type f \( -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.json' -o -name '*.md' \) -not -path '*/node_modules/*' -not -path '*/dist/*' -not -path '*/.*' -print0)
  else
    process_file "$target"
  fi
}

for target in "${targets[@]}"; do
  collect_files "$target"
done

if [[ ${#dirty[@]} -gt 0 ]]; then
  if [[ "$check_only" == true ]]; then
    verb="contain"
  else
    verb="normalized"
  fi
  echo "${#dirty[@]} file(s) ${verb} LLM Unicode characters:"
  for f in "${dirty[@]}"; do
    echo "  $f"
  done
  if [[ "$check_only" == true ]]; then
    exit 1
  fi
else
  echo "No LLM Unicode characters found."
fi
