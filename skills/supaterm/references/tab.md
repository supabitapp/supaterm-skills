# Tab Commands

`sp tab` creates, selects, renames, closes, and navigates tabs.

## Create

`sp tab new` creates a tab in the current space when run inside Supaterm. Use `--in` to target a specific space. Trailing arguments and `--shell` become startup input for the new tab's shell.

```bash
sp tab new -- ping 1.1.1.1
sp tab new --shell $'echo 1\necho 2'
sp tab new --focus -- git status
sp tab new --in 1 --cwd ~/tmp -- ping 1.1.1.1
sp tab new --in <space-uuid> --cwd ~/tmp -- ping 1.1.1.1
```

Flags:

- `--focus` focuses the new tab
- `--cwd <path>` sets the starting working directory
- `--shell <script>` sends raw startup input
- `--in <space>` targets a space selector or UUID

## Focus

`sp tab focus [tab]` selects a tab.

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

Use these commands to move between tabs in a space. The optional target is a space selector or UUID.

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
