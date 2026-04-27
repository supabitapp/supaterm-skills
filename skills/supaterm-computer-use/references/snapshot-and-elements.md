# Snapshots And Elements

Capture a target window:

```bash
sp computer-use snapshot --pid 123 --window 456 --image-out /tmp/window.png --json
sp computer-use snapshot --pid 123 --window 456 --mode som --query save --json
sp computer-use snapshot --pid 123 --window 456 --javascript '(() => document.title)()' --json
sp computer-use zoom --pid 123 --window 456 --x 80 --y 120 --width 320 --height 180 --image-out /tmp/zoom.png --json
sp computer-use screenshot --window 456 --image-out /tmp/window.png --json
```

The snapshot result contains:

- `elements`: actionable accessibility elements with `elementIndex`, `role`, `title`, `value`, `description`, `identifier`, `help`, `frame`, `isEnabled`, `isFocused`, and `actions`.
- `screenshot`: optional screenshot metadata with rendered and original dimensions plus `scale`.
- `javascript`: optional inline browser JavaScript result when `--javascript` is passed.
- `frame`: window frame in global screen coordinates.

Use `elementIndex` values only with the same `pid` and `window` that produced the snapshot.
Use `--query` to reduce displayed elements without changing cached indices.
Use `--mode som`, `--mode ax`, or `--mode vision`; `som` is the default.
Use `zoom` when resized screenshots make text too small to read.
When `title` is empty, use `description` or `identifier` to identify controls.

If an action returns `snapshot_required`, run `snapshot` again before retrying.
