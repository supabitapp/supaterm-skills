---
name: coding-agents
description: Launch supported coding agents in Supaterm tabs or panes and deliver multiline prompts safely. Use when starting Codex or another supported coding agent in Supaterm, choosing between a tab and split pane, sending a follow-up prompt, or verifying an agent launch.
---

# Coding agents

Use a new tab for an independent task and a split pane for work beside an existing terminal. Keep repository setup and task policy outside the launch command.

## Initial prompt

Read a multiline prompt from a file into one shell argument, then pass that argument directly to the agent executable. The initial prompt travels through process arguments instead of terminal input.

```bash
prompt_file=/tmp/task-prompt.md
workspace="$PWD"
prompt="$(cat "$prompt_file")"

sp tab new \
  --json \
  --cwd "$workspace" \
  -- codex -- "$prompt"
```

The first `--` ends `sp` options. The second ends Codex options so prompt text such as `resume`, `review`, or a leading dash remains a prompt. Use the equivalent end-of-options form with another supported `<agent>` executable. New tabs and panes leave focus unchanged by default. Use `--focus` when the new terminal should become active.

## Split pane

Target a tab or pane with `--in` and retain the returned `paneID` for follow-up commands:

```bash
prompt="$(cat "$prompt_file")"
agent_executable="<agent>"

sp pane split right \
  --json \
  --in "$target" \
  --cwd "$workspace" \
  -- "$agent_executable" -- "$prompt"
```

## Follow-up prompt

Submit follow-up text through paste-aware transport:

```bash
sp pane send --submit "$pane_id" - < "$prompt_file"
```

`--submit` pastes the complete prompt, preserves embedded newlines, then presses Enter separately. This avoids interactive paste-burst handling that can turn Enter into another newline.

Do not use `--newline`, typed bracketed-paste escape sequences, or timing sleeps to submit a prompt.

## Verify

Capture the agent pane after launch or submission:

```bash
sp pane capture --scope scrollback --lines 160 "$pane_id"
```

Use the JSON `paneID` from `sp tab new` or `sp pane split`; do not rediscover the pane by title.
