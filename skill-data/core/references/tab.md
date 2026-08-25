# Tab commands

`sp tab` creates, selects, moves, pins, unpins, renames, closes, and navigates tabs.

## Create

`sp tab new` creates a tab in the space this window displays when run inside Supaterm. Use `--in` to target another space in the same window; the space opens its saved tabs first when this window has not displayed it yet, and `--focus` also switches the window to that space.

```bash
sp tab new -- ping 1.1.1.1
sp tab new --script 'echo hi; pwd'
sp tab new --focus
sp tab new --project Build
sp tab new --project <project-uuid>
sp tab new --in 1 --cwd ~/tmp -- ping 1.1.1.1
sp tab new --in <space-uuid> --cwd ~/tmp -- ping 1.1.1.1
```

Flags:

- `--focus` focuses the new tab
- `--no-focus` leaves focus unchanged
- `--cwd <path>` sets the starting working directory
- `--script <script>` runs raw code in the login shell
- `--in <space>` targets a space inside this window
- `--project <project>` assigns the new Tab to a targeted Project

When `--project` is omitted, a new Tab is Unassigned. Explicit `--cwd` wins. Otherwise a Project Tab uses its stored root when it exists, then the normal cwd fallback.

A tab with no command starts the account login shell.

Free mode allows five open tabs across every window and space. At the limit, `sp tab new` exits nonzero with the `license_required` error. Do not retry it. Close a tab or follow the [license playbook](license.md). The user must handle payment and paste the key into the hidden `sp license activate` prompt.

Pass an executable and its arguments after `--` to launch it directly. Supaterm resolves the executable with the caller's `PATH`, preserves each argument exactly, skips shell startup files, and closes the tab when the executable exits. Use `--script` for builtins, aliases, or raw shell code. Supaterm enters the text visibly in the account login shell and returns to that same shell when the script ends. Use `sp skills get coding-agents` for multiline coding-agent prompts.

## Move

`sp tab move [tab]` assigns a Tab to a Project or clears its membership. `--index` is one-based within the destination's pinned or regular lane.

```bash
sp tab move --project Build
sp tab move 1/2 --project <project-uuid> --pin --index 1
sp tab move --unassigned
sp tab move <tab-uuid> --unassigned --unpin --index 1
```

Provide exactly one of `--project` or `--unassigned`. Add `--pin` or `--unpin` to change the Tab lane; omit both to retain it.

## Focus

`sp tab focus [tab]` selects a tab. It switches the window to the tab's space when the tab sits in
another one.

```bash
sp tab focus
sp tab focus 1/2
sp tab focus <tab-uuid>
```

## Title

`sp tab title [tab]` prints a tab title. It uses the current tab when the target is omitted inside
Supaterm.

```bash
sp tab title
sp tab title 1/2
sp tab title <tab-uuid> --json
```

## Rename

`sp tab rename <title> [tab]` locks a tab title. Pass an empty title to clear the lock and restore
the live terminal title.

```bash
sp tab rename Build
sp tab rename ''
sp tab rename Logs 1/2
sp tab rename Deploy <tab-uuid>
```

## Pin

`sp tab pin [tab]` pins a Tab within its Project or Unassigned section. It does not change membership.

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

Use these commands to move between tabs in a space, inside the window the command runs in. The optional value is a space target.

```bash
sp tab next
sp tab prev 1
sp tab last <space-uuid>
```

## Output

Mutating `tab` commands support the standard output flags:

```bash
sp tab new --json --focus
sp tab focus --plain 1/2
sp tab close --quiet 1/2
```
