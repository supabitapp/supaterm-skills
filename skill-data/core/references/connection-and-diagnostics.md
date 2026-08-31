# Connection and diagnostics

`sp` targets a Supaterm app socket, then applies command-specific space, tab, or pane targeting.

## Inside Supaterm

Inside a Supaterm pane, `sp` gets its socket and pane context from the environment:

- `SUPATERM_SOCKET_PATH`
- `SUPATERM_CLI_PATH`
- `SUPATERM_SURFACE_ID`
- `SUPATERM_TAB_ID`

Most commands can omit explicit targets inside Supaterm:

```bash
sp ls
sp tab new
sp pane split right
sp pane capture
```

## Outside Supaterm

Outside Supaterm, discover reachable app instances and pass an explicit target when needed:

```bash
sp instance ls
sp instance ls --json
sp ls --instance work-mac
sp diagnostic --instance work-mac --json
```

Every socket-backed command accepts:

- `--instance <name-or-endpoint-id>`
- `--socket <path>`

Examples:

```bash
sp ls --socket /tmp/supaterm-501/instance-default-pid-1234
sp pane capture --instance work-mac 1/2/3
sp tab new --instance work-mac --in 1
```

Normal socket-backed commands require `--instance` or `--socket` when multiple app instances are
reachable. Durable Codex root session-start routing is the exception: without an explicit target,
the hidden hook receiver checks every discovered instance. It tries a direct nonshared process,
same-ID compact owner, exact raw session-title token, guarded startup fork, then a unique cwd. The
fork route requires one eligible same-workspace pane running `codex fork` from a live session owned
by another pane. The cwd route requires one match across all compatible instances. Missing instance
replies and ambiguous evidence block delivery. Supaterm binds the pane's live PID and start time and
never reads the transcript.
Managed sockets use the fixed per-user `/tmp/supaterm-<uid>` namespace, independent of
`XDG_RUNTIME_DIR` and `TMPDIR`.

## Diagnostics

Use diagnostics when a command cannot find or reach the app:

```bash
sp diagnostic
sp diagnostic --json
sp diagnostic --instance work-mac
```

The Current Pane section shows the live foreground process-group ID and tty. JSON output exposes
the same values as `foregroundProcessGroupID` and `ttyName` on each live pane under `app.windows`;
unavailable values are omitted.

Use onboarding to print shortcuts and integration setup commands:

```bash
sp onboard
sp onboard --plain
```

## Config

Inspect and change Supaterm settings:

```bash
sp config path
sp config list
sp config get updates.channel
sp config set appearance.mode system
sp config set notifications.tab_move_haptics false
sp config reset privacy.analytics_enabled
sp config validate
```

`notifications.tab_move_haptics` controls feedback when a dragged tab enters a new drop target.

Validate another settings file:

```bash
sp config validate --path ./settings.toml --json
```

The app owns the settings file. `list`, `get`, `set`, `reset`, and `validate` run in the app, so they need a reachable instance and exit 64 without one. A `set` or `reset` takes effect at once. Only `sp config path` works with no app running.
