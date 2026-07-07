# Connection And Diagnostics

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
sp tab new -- git status
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
sp tab new --instance work-mac --in 1 -- git status
```

If multiple reachable app instances exist, `sp` requires `--instance` or `--socket`.

## Diagnostics

Use diagnostics when a command cannot find or reach the app:

```bash
sp diagnostic
sp diagnostic --json
sp diagnostic --instance work-mac
```

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
sp config reset privacy.analytics_enabled
sp config validate
```

Validate another settings file:

```bash
sp config validate --path ./settings.toml --json
```

## Compatibility

Run a child process with Supaterm's tmux compatibility layer enabled:

```bash
sp run -- zsh -lc 'echo hi'
sp run --instance work-mac -- zsh -lc 'echo hi'
```

Run tmux-compatible commands against Supaterm:

```bash
sp tmux list-panes
sp tmux split-window -h -P
sp tmux --instance work-mac display-message -p '#{session_name}:#{window_index}.#{pane_index}'
```
