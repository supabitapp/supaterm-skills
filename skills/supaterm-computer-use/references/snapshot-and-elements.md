# Snapshots And Elements

Capture a target window:

```bash
sp computer-use snapshot --pid 123 --window 456 --image-out /tmp/window.png --json
```

The snapshot result contains:

- `elements`: accessibility elements with `elementIndex`, `role`, `title`, `value`, `description`, `identifier`, `help`, `frame`, `isEnabled`, and `isFocused`.
- `screenshot`: optional screenshot metadata when a screenshot can be captured.
- `frame`: window frame in global screen coordinates.

Use `elementIndex` values only with the same `pid` and `window` that produced the snapshot.
When `title` is empty, use `description` or `identifier` to identify controls.

If an action returns `snapshot_required`, run `snapshot` again before retrying.
