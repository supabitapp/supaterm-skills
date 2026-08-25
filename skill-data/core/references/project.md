# Project commands

Projects are app-wide catalog items. A Project has a unique name, optional root directory, color, pin state, and order. Tabs may belong to one Project from any Space or window.

All Project commands except `icon` need a reachable Supaterm app.

## List

```bash
sp project list
sp project list --json
```

The result includes each Project's ID, name, optional root, color, and pin state in pinned-first catalog order. There is no separate `show` command.

## Add

```bash
sp project add Build
sp project add Build --root "$PWD" --color blue
sp project add Deploy --root ~/code/deploy --pin
```

Names are trimmed, non-empty, and unique without regard to case. A root must resolve to an absolute directory path and must not duplicate another Project's root. A missing path stays stored; an existing non-directory path fails. Omit `--root` for a rootless Project and `--color` for neutral.

A Tab created for a Project uses an explicit `--cwd` first. Otherwise it starts in the stored root when that directory exists, then uses the normal cwd fallback.

## Target Projects

A Project target may be:

- a `j:` short ref from `sp ls` or `sp project list`
- a full UUID
- an exact case-insensitive Project name

Names are unique app-wide. Typed refs never fall back to names.

## Pin and reorder

```bash
sp project pin Build
sp project unpin j:5a52445e
sp project reorder Build --index 1
```

Pin and unpin are idempotent. A changed Project moves to the end of its destination lane. Reorder uses a one-based index within the current pinned or regular lane. Project pinning and order do not change Tab pin state or membership.

The sidebar remains the metadata editing surface after creation. There are no `show` or `update` commands.

## Remove

```bash
sp project remove Build
sp project remove j:5a52445e --yes
```

Removing an empty Project deletes its metadata at once. Removing a non-empty Project asks for confirmation unless `-y` or `--yes` is present. Confirmation closes every assigned Tab across all Spaces and windows, terminates its panes, then removes the Project. It never deletes files under the root.

## Resolve an icon offline

```bash
sp project icon
sp project icon ~/code/project
sp project icon --plain
sp project icon --json
```

`sp project icon` is a local filesystem command and needs no running app. Its optional path is always a directory, not a Project target, and defaults to the current directory.

The resolver first reads icon links from common HTML and root route files. It follows local web manifests, prefers SVG icons, then selects the largest declared square image. If no declaration resolves, it checks common favicon, public, app, source, asset, and editor icon paths.

An icon must stay inside the Project root and use AVIF, GIF, ICO, JPEG, PNG, SVG, or WebP. A symlink outside the root does not resolve.

Human and plain output print the absolute icon path. JSON returns `{"path":"..."}`. When no icon exists, human output says so, plain output is empty, and JSON returns `{"path":null}`.
