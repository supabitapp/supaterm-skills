---
name: core
description: Core Supaterm CLI guide for controlling spaces, projects, tabs, panes, selectors, diagnostics, settings, and coding-agent integrations with `sp`. Read this before running Supaterm commands.
---

# Supaterm core

Use `sp` to control Supaterm from a terminal already running inside Supaterm. Run `sp skills get coding-agents` before launching or prompting a coding agent.

## Terminology

- Space: the top-level container, used to separate areas such as work and personal use. Spaces are shared across windows: a space has one name, color, Project catalog, and position in the list, and every window can display it.
- Project: a folder-backed collection of tabs inside a Space. Project identity, canonical path, pin state, and order are shared across windows. Every Space has a Home Project.
- Tab: a terminal tab inside one Project. Tabs belong to one window, so the same Space and Project can hold different tabs in each window.
- Pane: a split terminal region inside a tab

A window displays one space at a time and switches in place. Space commands switch the window they
run in and never open, close, or touch another window.

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

List, create, and display spaces:

```bash
sp space ls
sp space new Work
sp space focus 1
```

Add a Project and create a Tab in it:

```bash
sp project add "$PWD"
sp tab new --project "$PWD" --focus -- git status
sp tab focus 1/2
```

Pin or collapse the Project, or move a Tab to another Project:

```bash
sp project pin "$PWD"
sp project collapse "$PWD"
sp tab move 1/2 --project Home
```

Trailing arguments after `--` are treated as a terminal startup command.

`--script` runs shell script text as the terminal startup command. End scripts with `exec "${SHELL:-/bin/zsh}" -l` when the tab or pane should stay open.

```bash
sp tab new --script 'printf "ready\n"; exec "${SHELL:-/bin/zsh}" -l'
```

Read JSON creation output for `tabID` and `paneID`. Capture the pane later with `sp pane capture --scope scrollback --lines 160 <pane-uuid>`.

Split panes and send commands:

Splits leave focus unchanged by default. Add `--focus` when the new pane should become active.

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
- [Project commands](references/project.md)
- [Tab commands](references/tab.md)
- [Pane commands](references/pane.md)
- [Agent commands](references/agent.md)
