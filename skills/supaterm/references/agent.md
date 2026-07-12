# Agent Commands

`sp agent` manages Supaterm's coding-agent hook bridge.

## Install Skill

Install Supaterm's bundled agent skill:

```bash
sp agent install-skill
```

The command installs `~/.agents/skills/supaterm` as a symlink to the skill bundled with the running Supaterm app. Existing Supaterm skill directories or stale symlinks are replaced.

## Install Hooks

Install Supaterm's managed hook bridge into an agent configuration:

```bash
sp agent install-hooks
sp agent install-hook claude
sp agent install-hook codex
```

Effects:

- `install-hooks` installs every supported Supaterm hook bridge
- `claude` installs Supaterm hooks into `~/.claude/settings.json`
- `codex` requires Codex 0.144.1 or newer, enables hooks, installs Supaterm hooks into `~/.codex/hooks.json`, and registers native trust through Codex app-server

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
printf '{"hook_event_name":"PreToolUse","session_id":"session-1"}' \
  | sp agent receive-agent-hook --agent codex --pid 123
```

Use this when wiring an external agent hook system into Supaterm. This is lower-level than `install-hook` and `remove-hook`.

Pi integrations use this lower-level forwarding command from the Pi extension:

```bash
printf '{"hook_event_name":"session_start","session_id":"session-1","source":"pi-notify-supaterm"}' \
  | sp agent receive-agent-hook --agent pi --pid 123
```

## Output

`receive-agent-hook` is a forwarding command. `install-skill`, `install-hook`, and `remove-hook` report failures through stderr and exit status.
