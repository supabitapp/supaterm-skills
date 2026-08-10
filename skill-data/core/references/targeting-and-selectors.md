# Targeting and selectors

Use `sp ls --json` to discover the current Supaterm tree, including selectors and UUIDs. `sp ls` and `sp ls --plain` include pane display titles.

```bash
sp ls
sp ls --json
sp ls --plain
sp ls --instance work-mac
```

## Ambient Targeting

When a command runs inside Supaterm, many commands can omit their target:

- `sp space focus` uses the space this window displays
- `sp tab focus` uses the current tab
- `sp group collapse` uses the group containing the current tab
- `sp pane focus` uses the current pane
- `sp tab new` creates a tab beside the current tab and inherits its group when possible
- `sp pane split` splits the current pane

That ambient context comes from:

- `SUPATERM_SOCKET_PATH`
- `SUPATERM_SURFACE_ID`
- `SUPATERM_TAB_ID`

`SUPATERM_SOCKET_PATH` chooses the app socket. `SUPATERM_SURFACE_ID` and `SUPATERM_TAB_ID` choose the pane or tab target after the socket is connected.

They also choose the window. Space commands, and `sp tab new --in <space>`, act on the window that owns that pane or tab, switching it in place and leaving every other window alone. Outside Supaterm the key window is used instead.

## Selector Forms

- Space selector: `1`
- Tab selector: `1/2`
- Pane selector: `1/2/3`

You can also pass UUIDs anywhere the CLI accepts a space, tab, or pane target.

Space indexes follow the shared space order, the same order as `sp space ls` and the switcher dots, so `1` means the same space in every window. Tab and pane selectors are read inside the window the command acts on, because tabs belong to one window.

Numeric tab selectors remain flat across the displayed root order. Group membership does not add another numeric selector component.

Group targets use either a UUID or an exact title. UUIDs resolve globally. Titles resolve only within the ambient or targeted space and fail when duplicated there.

## Creation JSON

`sp ls --json` returns the full tree with generic object `id` fields. Each window carries `displayedSpaceID` and lists every space in shared order. Each space carries `isWarm` and ordered `rootItems`: root tabs have `kind: "tab"`, while groups have `kind: "group"` and contain their ordered `tabs`.

A space with `isWarm: false` has not been opened in that window yet in this run. Its tabs and panes come from the saved layout, so its pane IDs are real but have no live terminal. `sp space focus` or `sp tab new --in <space>` opens it first.

The CLI resolves selectors from a fresh tree and sends stable IDs. Reordering a space, tab, or pane cannot make the app act on a different item.

Creation commands return typed IDs instead:

```bash
sp tab new --json -- git status
```

```json
{
  "spaceID": "BBBDD2AB-3F53-4BCA-B120-CE4A5E8C7F18",
  "tabID": "3734DE02-672F-4914-95DE-35D093CE1B3A",
  "paneID": "5E6E9773-222B-468A-AA65-11341F2926FF",
  "spaceIndex": 2,
  "tabIndex": 1,
  "paneIndex": 1
}
```

Use `tabID` or `paneID` from creation output when chaining follow-up commands like `sp pane split --in <tabID>` or `sp pane send <paneID> ...`.

## `--in`

Targeted creation commands use `--in`:

- `sp tab new --in <space>` resolves the space inside the window the command runs in and opens its saved tabs first when needed. Add `--focus` to switch that window to the space as well.
- `sp group new <title> --in <space>`
- `sp pane split --in <tab>`
- `sp pane split --in <pane>`

Arguments after `--` on `sp tab new` and `sp pane split` remain exact process arguments. When the command exits, the tab or pane returns to its login shell.

`--script` takes raw code for the login shell to parse. The shell remains open after the script ends.

Examples:

```bash
sp tab new --in 1 --cwd ~/tmp -- git status
sp tab new --in <space-uuid> --focus -- ping 1.1.1.1
sp group new Build --in <space-uuid>
sp pane split --in 1/2 left
sp pane split --in 1/2/3 down -- tail -f /tmp/server.log
sp pane split --in <tab-uuid> right
sp pane split --in <pane-uuid> up
```

## Target Rules By Family

- `space` commands accept a space selector or UUID, and act on the window they run in
- `group` commands accept a group UUID or an exact title in the relevant space
- `tab focus`, `tab close`, and `tab rename` accept a tab selector or UUID
- `tab move` accepts a tab selector or UUID, then requires a group or root destination
- `tab next`, `tab prev`, and `tab last` accept an optional space selector or UUID
- `pane focus`, `pane close`, `pane capture`, `pane resize`, and `pane notify` accept a pane selector or UUID
- `pane split` accepts a tab selector, pane selector, or UUID through `--in`
- `pane layout` accepts an optional tab selector or UUID
- `pane send` accepts an optional pane selector or UUID as its first argument

## Outside Supaterm

Outside Supaterm, omit ambient assumptions and pass an explicit target. If more than one app instance is reachable, also pass `--instance` or `--socket`.

```bash
sp tab new --in 1 -- git status
sp pane split --in 1/2 right
sp tab focus 1/2
sp pane focus 1/2/3
sp pane capture --instance work-mac 1/2/3
```
