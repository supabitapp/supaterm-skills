---
name: supaterm
description: Control Supaterm spaces, tabs, panes, coding-agent integrations, and new-tab task launches with `sp`. Use when an agent needs to launch commands, scripts, or multiline coding-agent tasks in Supaterm.
---

Use this skill when you need to control Supaterm from a terminal that is already running inside Supaterm.

## Terminology

- Space: the top-level container that contains multiple tabs, users might use this to separate work / life profile.
- Tab: a terminal tab inside a space
- Pane: a split terminal region inside a tab

## Fast Start

Show setup commands and diagnostics:

```bash
sp onboard
sp diagnostic
sp instance ls
```

Discover selectors and UUIDs:

```bash
sp ls --json
```

Creation commands use typed JSON keys instead of a generic `id`:

```bash
sp tab new --json -- git status
# => { "spaceID": "...", "tabID": "...", "paneID": "...", ... }

sp pane split --json right
# => { "spaceID": "...", "tabID": "...", "paneID": "...", ... }
```

Create and focus spaces:

```bash
sp space new Work
sp space new --focus Build
sp space focus 1
```

Create, focus, and pin tabs:

```bash
sp tab new --focus -- git status
sp tab focus 1/2
sp tab pin 1/2
sp tab unpin 1/2
```

Trailing arguments after `--` are treated as a terminal startup command.

`--script` runs shell script text as the terminal startup command. End setup scripts with `exec "${SHELL:-/bin/zsh}" -l` when the tab or pane should stay open.

```bash
sp tab new --script 'make worktree-create WORKTREE=exploration && exec wt exec exploration -- "${SHELL:-/bin/zsh}" -l'
```

For multi-line or heavily quoted new-tab launches, use `scripts/start_tab.py`. It creates a plain Supaterm tab, writes a temporary shell launcher, waits for pane readiness, and sends that launcher path with `sp pane send`.

```bash
scripts/start_tab.py --cwd "$PWD" -- git status
printf 'echo one\necho two\n' | scripts/start_tab.py --cwd "$PWD" --stdin
```

Read the JSON output for `tabID`, `paneID`, `launcherPath`, and `sendText`. Capture the tab later with `sp pane capture --scope scrollback --lines 160 <pane-uuid>`.

Split panes and send commands:

```bash
sp pane split down -- htop
sp pane split --layout keep right
sp pane send --newline 'echo hello'
```

Trailing arguments after `--` are treated as a terminal startup command.

`--script` runs shell script text as the terminal startup command. End setup scripts with `exec "${SHELL:-/bin/zsh}" -l` when the pane should stay open.

## Deep-Dive References

- [Connection and diagnostics](references/connection-and-diagnostics.md)
- [Targeting and selectors](references/targeting-and-selectors.md)
- [Space commands](references/space.md)
- [Tab commands](references/tab.md)
- [Pane commands](references/pane.md)
- [Agent commands](references/agent.md)
