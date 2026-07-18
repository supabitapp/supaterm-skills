---
name: core
description: Core Supaterm CLI guide for controlling spaces, tabs, panes, selectors, diagnostics, settings, and coding-agent integrations with `sp`. Read this before running Supaterm commands.
---

# Supaterm core

Use `sp` to control Supaterm from a terminal already running inside Supaterm. Run `sp skills get coding-agents` before launching or prompting a coding agent.

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

`--script` runs shell script text as the terminal startup command. End scripts with `exec "${SHELL:-/bin/zsh}" -l` when the tab or pane should stay open.

```bash
sp tab new --script 'printf "ready\n"; exec "${SHELL:-/bin/zsh}" -l'
```

Read JSON creation output for `tabID` and `paneID`. Capture the pane later with `sp pane capture --scope scrollback --lines 160 <pane-uuid>`.

Split panes and send commands:

```bash
sp pane split down -- htop
sp pane split --layout keep right
sp pane send --newline 'echo hello'
```

Trailing arguments after `--` are treated as a terminal startup command.

`--script` runs shell script text as the terminal startup command. End setup scripts with `exec "${SHELL:-/bin/zsh}" -l` when the pane should stay open.

## Deep-Dive References

Load every reference:

```bash
sp skills get core --full
```

Resolve the version-matched directory when reading one reference directly:

```bash
sp skills path core
```

- [Connection and diagnostics](references/connection-and-diagnostics.md)
- [Targeting and selectors](references/targeting-and-selectors.md)
- [Space commands](references/space.md)
- [Tab commands](references/tab.md)
- [Pane commands](references/pane.md)
- [Agent commands](references/agent.md)
