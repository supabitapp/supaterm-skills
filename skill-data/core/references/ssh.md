# SSH

Supaterm shell integration normally calls `sp ssh` to give remote shells a compatible terminal environment.

```bash
sp ssh -- user@example.com
sp ssh -- -p 2222 user@example.com
```

Pass ordinary `ssh` arguments after `--`. `sp ssh` finds `ssh` on `PATH`, sets `TERM` to `xterm-256color` by default, and asks OpenSSH to send `COLORTERM`, `TERM_PROGRAM`, and `TERM_PROGRAM_VERSION`.

Use `--term <value>` before `--` to choose another terminal type. Keep the default for direct use. Supaterm shell integration selects `xterm-ghostty` only after it confirms that the remote terminfo entry works.

The command uses `SendEnv`, not `SetEnv`. It does not override `SetEnv` entries in the user's SSH configuration.
