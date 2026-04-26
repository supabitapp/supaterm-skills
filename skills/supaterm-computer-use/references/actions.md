# Actions

Element click:

```bash
sp computer-use click --pid 123 --window 456 --element 7 --action press --json
```

Element actions are `press`, `show-menu`, `pick`, `confirm`, `cancel`, and `open`.
Use the `actions` array from the latest snapshot to choose the action.

Coordinate click:

```bash
sp computer-use click --pid 123 --window 456 --x 320 --y 240 --json
```

Coordinates are in the same pixel space as the latest window screenshot.
Coordinate clicks can target background windows. Prefer element clicks when the element supports AX actions.

Right click:

```bash
sp computer-use click --pid 123 --window 456 --element 7 --action show-menu --json
```

Double click:

```bash
sp computer-use click --pid 123 --window 456 --x 320 --y 240 --count 2 --json
```

Modified click:

```bash
sp computer-use click --pid 123 --window 456 --element 7 --modifier command --json
```

Type text:

```bash
sp computer-use type --pid 123 "hello" --json
sp computer-use type --pid 123 --window 456 --element 7 --delay-ms 10 "hello" --json
```

Element-targeted typing tries selected-text insertion first, then falls back to character events.

Press keys:

```bash
sp computer-use key --pid 123 return --json
sp computer-use key --pid 123 --window 456 --element 7 return --json
sp computer-use key --pid 123 --modifier command s --json
```

Scroll:

```bash
sp computer-use scroll --pid 123 --window 456 --direction down --json
sp computer-use scroll --pid 123 --window 456 --element 7 --direction down --unit page --json
```

Scroll uses keyboard navigation. Use `--unit line` for arrow keys and `--unit page` for page keys.

Set an element value:

```bash
sp computer-use set-value --pid 123 --window 456 --element 9 "new value" --json
```

For popup buttons, prefer `set-value` with the visible option title or value.
After every action, run `snapshot` again to verify the result.
