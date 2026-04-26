# Apps And Windows

List running apps:

```bash
sp computer-use apps --json
```

List windows:

```bash
sp computer-use windows --json
sp computer-use windows --app com.apple.TextEdit --json
sp computer-use windows --app 123 --json
```

Use the returned `pid` and window `id` for `snapshot` and action commands.

Prefer bundle ID or pid filters over app names when more than one app may match.
