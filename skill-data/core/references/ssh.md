# SSH

`sp ssh` opens a focused tab beside the current tab and starts one interactive SSH session. The tab follows the current tab's group or root placement.

```bash
sp ssh user@example.com
sp ssh --name Production -p 2222 user@example.com
sp ssh -o ProxyJump=bastion.example.com user@example.com
sp ssh --instance work-mac user@example.com
```

Place Supaterm options such as `--name` and `--instance` before SSH options. The parser recognizes the current OpenSSH short options needed to find one destination; it does not implement the full OpenSSH grammar. Use `command ssh` for remote commands, tunnels, or any SSH process that should stay in the current pane.

The tab retries only when SSH exits with status 255. It waits 2, 4, 8, 16, then at most 30 seconds between attempts. Press `Control-C` to stop reconnecting. Any other exit returns the tab to a local login shell.

Supaterm finds `ssh` on `PATH`, sets `TERM` to `xterm-256color`, and asks SSH to send `COLORTERM`, `TERM_PROGRAM`, and `TERM_PROGRAM_VERSION`. It uses `SendEnv`, not `SetEnv`, so the user's SSH configuration keeps ownership of those values.
