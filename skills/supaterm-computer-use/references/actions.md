# Actions

Element click:

```bash
sp computer-use click --pid 123 --window 456 --element 7 --json
```

Coordinate click:

```bash
sp computer-use click --pid 123 --window 456 --x 320 --y 240 --json
```

Coordinates are in the same pixel space as the latest window screenshot.

Type text:

```bash
sp computer-use type --pid 123 "hello" --json
```

Press keys:

```bash
sp computer-use key --pid 123 return --json
sp computer-use key --pid 123 --modifier command s --json
```

Scroll:

```bash
sp computer-use scroll --pid 123 --window 456 --direction down --json
```

Set an element value:

```bash
sp computer-use set-value --pid 123 --window 456 --element 9 "new value" --json
```

After every action, run `snapshot` again to verify the result.
