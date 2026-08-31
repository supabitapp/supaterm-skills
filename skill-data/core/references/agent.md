# Agent Commands

`sp agent` manages Supaterm's coding-agent integration.

## Reload Detection Rules

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

Install Supaterm's managed hooks for every supported agent:

```bash
sp agent install-hooks
```

Effects:

- `install-hooks` checks every supported agent, reports every failure, and fails when no supported agent is available
- Claude installs Supaterm hooks into `~/.claude/settings.json`
- Codex requires Codex 0.144.1 or newer, enables hooks, installs `~/.codex/hooks.json`, and registers native trust through Codex app-server
- Pi installs the Supaterm package through Pi

The running app does the writing. These commands need a reachable Supaterm instance and change nothing without one.
Codex installs a marked command with the bundled `sp` executable's absolute path. The command does
not use runtime `HOME`, `PATH`, or `SUPATERM_CLI_PATH`. Supaterm recognizes the prior
environment-based command and marked commands with stale paths for install, repair, and removal.

## Remove Hooks

Remove Supaterm-managed hooks from every supported agent configuration:

```bash
sp agent remove-hooks
```

`remove-hooks` reports every failure and succeeds when an integration is absent or unavailable.
Removing Codex hooks strips them from `~/.codex/hooks.json` and removes their trust through Codex
app-server.

## Forward Hook Events

`sp agent receive-agent-hook --agent <agent>` reads one hook payload from stdin and sends eligible events to Supaterm.

```bash
printf '{"hook_event_name":"SessionStart","session_id":"session-1","cwd":"/tmp/project"}' \
  | sp agent receive-agent-hook --agent claude
```

Installed hooks pass the parent process ID:

```bash
printf '{"hook_event_name":"SessionStart","session_id":"session-1","cwd":"/tmp/project","transcript_path":"/tmp/session-1.jsonl","source":"startup"}' \
  | sp agent receive-agent-hook --agent codex --pid 123
```

For Claude and Codex, Supaterm uses root `SessionStart` events. It ignores every other hook
event. Claude session starts should include an absolute `cwd`. A Codex session start is eligible only
when `agent_id` is absent, `session_id`, `cwd`, and `transcript_path` are nonempty, and it has
source `startup`, `resume`, `clear`, or `compact`.

Eligible Codex starts do not use inherited pane or socket targeting. Unless the caller passes
`--socket` or `--instance`, the CLI removes stale managed socket nodes and polls every remaining
managed app socket for live Codex pane candidates. Candidate order is a direct nonshared process
match, the same-ID owner for `compact`, an exact session-title token, one ownerless workspace match,
then one remaining workspace match. Both workspace steps require a single cwd match across all live
candidates; any second pane with that cwd blocks them. The final workspace case delivers only when
the pane owns the incoming session. It cannot replace another session. Other routes fail closed.
Delivery uses the pane's detected process identity instead of the shared Codex app-server PID. Other
hook traffic keeps ambient context.

New panes clear inherited `CODEX_THREAD_ID`. A mismatched inherited ID rejects a nonshared nested
session. A shared host ignores inherited state. Replacing another owned session needs a direct
nonshared process match or exact title; a shared host requires the title. A shared-host `clear` or
session-switch `resume` without title proof fails closed. A same-ID `compact` keeps its owner.
Supaterm checks that `transcript_path` is nonempty and never opens the transcript.

The accepted `cwd` supplies the agent panel Workspace row, Git status, and forked session working
directory.

An agent-panel fork starts the account login shell in a new pane and enters the agent's native fork command visibly. The pane returns to that same shell when the forked agent exits.

Use this when wiring an external agent hook system into Supaterm. This is lower-level than aggregate hook management.

Pi integrations use this lower-level forwarding command from the Pi extension:

```bash
printf '{"hook_event_name":"session_start","session_id":"session-1","source":"pi-notify-supaterm"}' \
  | sp agent receive-agent-hook --agent pi --pid 123
```

## Output

`receive-agent-hook` prints nothing after delivery or a fail-closed Codex session-start rejection.

`install-hooks` and `remove-hooks` print nothing on success. `reload-rules` prints detection details.
`skills install` prints the installed path.

Failures go to stderr with a non-zero exit status. With no reachable Supaterm instance, management,
reload, skill, and ordinary hook traffic follow these rules:

- each prints `Error: No reachable Supaterm instance was found.`
- `sp agent` commands exit 64
- `sp skills` commands exit 1, and `--json` prints `{"success":false,"error":"..."}` on stdout instead

A durable Codex root session start with no unique candidate exits without output or delivery.
