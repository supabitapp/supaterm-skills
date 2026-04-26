---
name: supaterm-computer-use
description: "Inspect and control native macOS apps through Supaterm's `sp computer-use` CLI. Use when Codex needs to operate a real app window on the host: list apps/windows, capture screenshots, inspect accessibility elements, click, type, press keys, scroll, set values, or verify UI changes after actions."
---

Use this skill when you need to operate a native macOS app from a Supaterm terminal.

## Workflow

Start with permission, launch, and target discovery:

```bash
sp computer-use permissions --json
sp computer-use launch --bundle-id com.apple.TextEdit --json
sp computer-use apps --json
sp computer-use windows --app TextEdit --on-screen-only --json
```

Capture a window before acting:

```bash
sp computer-use snapshot --pid 123 --window 456 --mode som --image-out /tmp/window.png --json
sp computer-use snapshot --pid 123 --window 456 --query save --json
```

Prefer `elementIndex` actions from the latest snapshot:

```bash
sp computer-use click --pid 123 --window 456 --element 7 --action press --json
sp computer-use type --pid 123 --window 456 --element 8 "hello" --json
sp computer-use key --pid 123 --window 456 --element 8 return --json
sp computer-use scroll --pid 123 --window 456 --element 10 --direction down --unit page --json
sp computer-use set-value --pid 123 --window 456 --element 9 "new value" --json
```

Use `set-value` for popup buttons when a click response returns a popup warning.
Re-run `snapshot` after each action and inspect the changed element state or screenshot.

## Rules

- The Supaterm app must be running.
- Run `snapshot` for the target window before using `--element`.
- `--query` only filters returned elements; it does not renumber cached indices.
- Use coordinates only when there is no usable element.
- Keep `--image-out` paths under `/tmp` unless the user asks for a specific location.
- If permissions are missing, tell the user to open Supaterm Settings > Computer Use.

## References

- Permissions: `references/permissions.md`
- Apps and windows: `references/apps-and-windows.md`
- Snapshots and elements: `references/snapshot-and-elements.md`
- Actions: `references/actions.md`
