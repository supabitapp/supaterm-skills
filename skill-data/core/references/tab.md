# Tab commands

`sp tab` creates, selects, moves, pins, unpins, renames, closes, and navigates tabs.

## Create

`sp tab new` creates a tab in the space this window displays when run inside Supaterm. Use `--in` to target another space in the same window; the space opens its saved tabs first when this window has not displayed it yet, and `--focus` also switches the window to that space. Trailing arguments after `--` are treated as a terminal startup command. `--script` runs shell script text as the terminal startup command.

```bash
sp tab new -- ping 1.1.1.1
sp tab new --script 'echo hi; pwd'
sp tab new --script 'printf "ready\n"; exec "${SHELL:-/bin/zsh}" -l'
sp tab new --focus -- git status
sp tab new --group Build -- git status
sp tab new --group <group-uuid>
sp tab new --root
sp tab new --in 1 --cwd ~/tmp -- ping 1.1.1.1
sp tab new --in <space-uuid> --cwd ~/tmp -- ping 1.1.1.1
```

Flags:

- `--focus` focuses the new tab
- `--no-focus` leaves focus unchanged
- `--cwd <path>` sets the starting working directory
- `--script <script>` runs shell script text as the terminal startup command
- `--in <space>` targets a space selector or UUID inside this window
- `--group <group>` creates the tab in a group selected by exact title or UUID
- `--root` creates the tab at the space root

Do not combine `--group` and `--root`. When both are omitted, a new tab inherits the current tab's group when possible and otherwise appears at the space root.

Pass commands as trailing arguments after `--` so `sp` preserves each argument. Use `sp skills get coding-agents` for multiline coding-agent prompts.

## Move

`sp tab move [tab]` moves a tab into a group or to the space root. `--index` is a 1-based index within the destination.

```bash
sp tab move --group Build
sp tab move 1/2 --group <group-uuid> --index 1
sp tab move --root
sp tab move <tab-uuid> --root --pin --index 1
```

Provide exactly one of `--group` or `--root`. `--pin` is valid only with `--root`.

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

## Pin

`sp tab pin [tab]` pins a tab. Pinning a grouped tab extracts it to the pinned space root.

```bash
sp tab pin
sp tab pin 1/2
sp tab pin <tab-uuid>
```

## Unpin

`sp tab unpin [tab]` unpins a tab.

```bash
sp tab unpin
sp tab unpin 1/2
sp tab unpin <tab-uuid>
```

## Close

`sp tab close [tab]` closes a tab.

```bash
sp tab close
sp tab close 1/2
sp tab close <tab-uuid>
```

## Navigate

Use these commands to move between tabs in a space, inside the window the command runs in. The optional target is a space selector or UUID.

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
