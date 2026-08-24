# Agent Commands

`sp agent` manages and inspects Supaterm's coding-agent integration.

## Inspect Detection

Explain the active manifest, process proof, matched rule, published rule, and every evaluated rule
condition for the current or selected pane:

```bash
sp agent explain
sp agent explain 1/2/1
sp agent explain <pane-uuid> --json
```

Local manifests live in `$SUPATERM_STATE_HOME/agent-detection/<agent>.toml`, or
`~/.config/supaterm/agent-detection/<agent>.toml` without an explicit state root. Reload all local
overrides atomically after an edit:

```bash
sp agent reload-rules
```

An invalid reload fails and keeps the prior rule generation active.

## Install Skill

Install Supaterm's bundled agent skill:

```bash
sp skills install
```

The running Supaterm app copies its bundled discovery skill to `~/.agents/skills/supaterm`. Existing Supaterm skill directories or symlinks are replaced. Detailed instructions stay in the app bundle and are loaded through `sp skills get`.

## Install Hooks

Install Supaterm's managed hook bridge into an agent configuration:

```bash
sp agent install-hooks
sp agent install-hook claude
sp agent install-hook codex
```

Effects:

- `install-hooks` installs Claude and then Codex, and stops at the first failure
- `claude` installs Supaterm hooks into `~/.claude/settings.json`
- `codex` requires Codex 0.144.1 or newer, enables hooks, installs Supaterm hooks into `~/.codex/hooks.json`, and registers native trust through Codex app-server

The running app does the writing. These commands need a reachable Supaterm instance and change nothing without one.

## Remove Hooks

Remove Supaterm-managed hooks from an agent configuration:

```bash
sp agent remove-hook claude
sp agent remove-hook codex
```

Removing Codex hooks also removes Supaterm hook trust through Codex app-server.

## Forward Hook Events

`sp agent receive-agent-hook --agent <agent>` reads one hook payload from stdin and forwards it to Supaterm.

```bash
printf '{"hook_event_name":"SessionStart","session_id":"session-1","cwd":"/tmp/project"}' \
  | sp agent receive-agent-hook --agent claude
```

Installed hooks pass the parent process ID:

```bash
printf '{"hook_event_name":"SessionStart","session_id":"session-1","cwd":"/tmp/project"}' \
  | sp agent receive-agent-hook --agent codex --pid 123
```

For Claude and Codex, Supaterm uses only root `SessionStart` events. It ignores every other hook event. Session-start payloads should include the agent's absolute `cwd`. Supaterm uses it for the agent panel Workspace row, Git status, and forked session working directory.

An agent-panel fork starts the account login shell in a new pane and enters the agent's native fork command visibly. The pane returns to that same shell when the forked agent exits.

Use this when wiring an external agent hook system into Supaterm. This is lower-level than `install-hook` and `remove-hook`.

Pi integrations use this lower-level forwarding command from the Pi extension:

```bash
printf '{"hook_event_name":"session_start","session_id":"session-1","source":"pi-notify-supaterm"}' \
  | sp agent receive-agent-hook --agent pi --pid 123
```

## Output

`receive-agent-hook` forwards a payload and prints nothing.

`install-hook`, `remove-hook`, and `install-hooks` print nothing on success. `explain` and
`reload-rules` print detection details. `skills install` prints the installed path.

Failures go to stderr with a non-zero exit status. With no reachable Supaterm instance:

- every one of them prints `Error: No reachable Supaterm instance was found.`
- `sp agent` commands exit 64
- `sp skills` commands exit 1, and `--json` prints `{"success":false,"error":"..."}` on stdout instead
