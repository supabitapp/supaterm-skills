# Agent Commands

`sp agent` manages Supaterm's coding-agent hook bridge.

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

## Explain Agent Detection

Inspect the agent state for the ambient pane or an explicit pane:

```bash
sp agent explain
sp agent explain 1/2/3
sp agent explain 1/2/3 --json
sp agent explain --plain
sp agent explain --quiet
```

Use `--json` when another command will read the result. The result always has `target`, `mode`, and
`status`. It adds these fields when known:

- `rules`: `source` (`bundle` or `cache`) and `generation`
- `agent`: `id`, `displayName`, and `phase` (`idle`, `running`, or `needs_input`)
- `process`: `processID` and `startTimeMicroseconds`
- `ruleID`: the fallback rule that matched

Plain output is one tab-separated row: `space/tab/pane`, mode, status, agent ID, phase, process ID,
process start time in microseconds, rule source, rule generation, and rule ID. Missing values are `-`.
`--quiet` still runs the check but hides a successful result. The command also accepts `--socket`,
`--instance`, and `--no-color`.

`mode` is `native`, `fallback`, or `none`. `status` is one of:

- `resolved`
- `native_authority`
- `detection_disabled`
- `waiting`
- `no_foreground_process`
- `unrecognized_process`
- `screen_unavailable`
- `no_rule_match_or_settling`

Native hooks win when they identify the same process. Fallback detection first proves a declared
agent process in the pane's foreground process group by process ID and start time. It then applies
the bundled or cached rules to a bounded active-screen and raw-title capture.

Fallback state is temporary and read-only. It does not create action sessions, notifications,
transcript or child-agent state, or saved state. The command never returns terminal text, titles,
executable paths, or rule patterns.

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
printf '{"hook_event_name":"Notification","message":"Claude needs your attention"}' \
  | sp agent receive-agent-hook --agent claude
```

Installed hooks pass the parent process ID:

```bash
printf '{"hook_event_name":"PreToolUse","session_id":"session-1","cwd":"/tmp/project"}' \
  | sp agent receive-agent-hook --agent codex --pid 123
```

Root hook payloads should include the agent's absolute `cwd`. Supaterm uses it for the agent panel Workspace row, Git status, and forked session working directory. Child-agent directories do not replace the root workspace.

Use this when wiring an external agent hook system into Supaterm. This is lower-level than `install-hook` and `remove-hook`.

Pi integrations use this lower-level forwarding command from the Pi extension:

```bash
printf '{"hook_event_name":"session_start","session_id":"session-1","source":"pi-notify-supaterm"}' \
  | sp agent receive-agent-hook --agent pi --pid 123
```

## Output

`receive-agent-hook` forwards a payload and prints nothing.

`install-hook`, `remove-hook`, and `install-hooks` print nothing on success. `skills install` prints the installed path.

Failures go to stderr with a non-zero exit status. With no reachable Supaterm instance:

- every one of them prints `Error: No reachable Supaterm instance was found.`
- `sp agent` commands exit 64
- `sp skills` commands exit 1, and `--json` prints `{"success":false,"error":"..."}` on stdout instead
