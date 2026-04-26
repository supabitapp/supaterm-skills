# Actions

Element click:

```bash
sp computer-use click --pid 123 --window 456 --element 7 --action press --json
```

Element actions are `press`, `show-menu`, `pick`, `confirm`, `cancel`, and `open`.
Use the `actions` array from the latest snapshot to choose the action.
If the selected AX action fails, the click returns `action_failed`; re-snapshot and use a coordinate click only when no AX action can drive the target.

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

Browser page text and DOM:

```bash
sp computer-use page get-text --pid 123 --window 456 --json
sp computer-use page query-dom --pid 123 --window 456 --selector a --attribute href --json
sp computer-use page execute-javascript --pid 123 --window 456 '(() => document.title)()' --json
sp computer-use page enable-javascript-apple-events --browser chrome --json
sp computer-use page enable-javascript-apple-events --browser safari --json
```

Use page commands for web content. `get-text` reads page body text when the browser supports it and can fall back to AX for WKWebView-style apps. `query-dom` returns typed JSON. `execute-javascript` is for page JavaScript, not native AX controls.

If a browser returns an error that says JavaScript from Apple Events must be enabled, stop and notify the user. Do not retry JavaScript or Safari select fallback commands until the setting is enabled.
