---
name: core
description: Core Supaterm CLI guide for controlling spaces, tab groups, tabs, panes, selectors, diagnostics, settings, and coding-agent integrations with `sp`. Read this before running Supaterm commands.
---

# Supaterm core

Use `sp` to control Supaterm from a terminal already running inside Supaterm. Run `sp skills get coding-agents` before launching or prompting a coding agent.

## Terminology

- Space: the top-level container, users might use this to separate work / life profile. Spaces are shared across windows: a space has one name, color, and position in the list, and every window can display it.
- Group: an ordered collection of tabs inside a space
- Tab: a terminal tab inside a space. Tabs belong to one window and one space, so the same space holds different tabs in each window.
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

Create, focus, and pin tabs:

```bash
sp tab new --focus -- git status
sp tab focus 1/2
sp tab pin 1/2
sp tab unpin 1/2
```

Create a group and place tabs in it:

```bash
sp group new Build --color blue
sp tab new --group Build -- git status
sp tab move 1/2 --group Build
sp group collapse Build
```

Arguments after `--` remain exact process arguments. When the command exits, the tab or pane returns to its login shell.

`--script` takes raw code for the login shell to parse. The shell remains open after the script ends.

Shell startup files must not read from the terminal before the first prompt. Such a read takes the queued command.

```bash
sp tab new --script 'printf "ready\n"; pwd'
```

Read JSON creation output for `tabID` and `paneID`. Capture the pane later with `sp pane capture --scope scrollback --lines 160 <pane-uuid>`.

Split panes and send commands:

Splits leave focus unchanged by default. Add `--focus` when the new pane should become active.

```bash
sp pane split down -- htop
sp pane split --layout keep right
sp pane send --newline 'echo hello'
```

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
- [Group commands](references/group.md)
- [Tab commands](references/tab.md)
- [Pane commands](references/pane.md)
- [Agent commands](references/agent.md)
