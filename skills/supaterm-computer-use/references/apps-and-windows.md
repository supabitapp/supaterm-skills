# Apps And Windows

List running apps:

```bash
sp computer-use apps --json
```

Launch an app without taking focus:

```bash
sp computer-use launch --bundle-id com.apple.TextEdit --json
sp computer-use launch --name TextEdit --url /tmp/example.txt --argument=--foreground --env=FOO=bar --json
```

Launch returns the pid, bundle ID, active flag, and currently known windows.

List windows:

```bash
sp computer-use windows --json
sp computer-use windows --app com.apple.TextEdit --json
sp computer-use windows --app 123 --json
sp computer-use windows --app TextEdit --on-screen-only --json
```

Use the returned `pid` and window `id` for `snapshot` and action commands.
Window results include `zIndex`, `layer`, `isOnScreen`, `onCurrentSpace`, and `spaceIDs`.

Prefer bundle ID or pid filters over app names when more than one app may match.
