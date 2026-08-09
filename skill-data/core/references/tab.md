# Tab commands

`sp tab` creates, selects, moves, renames, closes, and navigates Tabs. Every Tab belongs to one Project.

## Create

`sp tab new` creates a tab in the space this window displays when run inside Supaterm. Use `--in` to target another space in the same window; the space opens its saved tabs first when this window has not displayed it yet, and `--focus` also switches the window to that space. Trailing arguments after `--` are treated as a terminal startup command. `--script` runs shell script text as the terminal startup command.

```bash
sp tab new -- ping 1.1.1.1
sp tab new --script 'echo hi; pwd'
sp tab new --script 'printf "ready\n"; exec "${SHELL:-/bin/zsh}" -l'
sp tab new --focus -- git status
sp tab new --project Build -- git status
sp tab new --project <project-uuid>
sp tab new --project /Users/me/Code/supaterm
sp tab new --in 1 --cwd ~/tmp -- ping 1.1.1.1
sp tab new --in <space-uuid> --cwd ~/tmp -- ping 1.1.1.1
```

Flags:

- `--focus` focuses the new tab
- `--no-focus` leaves focus unchanged
- `--cwd <path>` sets the starting working directory
- `--script <script>` runs shell script text as the terminal startup command
- `--in <space>` targets a space selector or UUID inside this window
- `--project <project>` targets a Project UUID, canonical path, or exact rendered label

When `--project` is omitted, the new Tab uses the selected Tab's Project when it belongs to the target Space, then Home.

A Tab with no startup command opens a local shell at its Project root, even when the source Pane runs SSH. `--cwd` changes only the launch directory; it does not change Project membership.

Pass commands as trailing arguments after `--` so `sp` preserves each argument. Use `sp skills get coding-agents` for multiline coding-agent prompts.

## Move

`sp tab move [tab] --project <project>` moves a Tab to another Project in the same window and Space. `--index` is a 1-based index within the destination Project.

```bash
sp tab move --project Build
sp tab move 1/2 --project <project-uuid> --index 1
sp tab move <tab-uuid> --project /Users/me/Code/supaterm
```

Moving preserves the Tab ID, processes, Panes, current working directories, and title.

## Focus

`sp tab focus [tab]` selects a tab. It switches the window to the tab's space when the tab sits in
another one.

```bash
sp tab focus
sp tab focus 1/2
sp tab focus <tab-uuid>
```

## Rename

`sp tab rename <title> [tab]` locks a tab title.

```bash
sp tab rename Build
sp tab rename Logs 1/2
sp tab rename Deploy <tab-uuid>
```

## Close

`sp tab close [tab]` closes a tab.

```bash
sp tab close
sp tab close 1/2
sp tab close <tab-uuid>
```

## Navigate

Use these commands to move between Tabs in a Space, inside the window the command runs in. The optional target is a Space selector or UUID. Order is flattened across pinned Projects first, then regular Projects, preserving each Project's Tab order.

```bash
sp tab next
sp tab prev 1
sp tab last <space-uuid>
```

## Output

Mutating `tab` commands support the standard output flags:

```bash
sp tab new --json --focus -- git status
sp tab focus --plain 1/2
sp tab close --quiet 1/2
```
