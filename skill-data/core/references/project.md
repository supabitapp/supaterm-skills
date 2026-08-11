# Project commands

Project commands read the local filesystem and need no running Supaterm app.

## Resolve an icon

```bash
sp project icon
sp project icon ~/code/project
sp project icon --plain
sp project icon --json
```

The optional path is the project root. It defaults to the current directory.

The resolver checks these paths in order:

1. `favicon.svg`, `favicon.ico`, and `favicon.png`
2. The same favicon names under `public/`
3. Favicons and icons under `app/`, `src/`, and `src/app/`
4. `assets/icon.*`, `assets/logo.*`, then `.idea/icon.svg`
5. Icon links in common HTML and root route files

An icon must stay inside the project root and use AVIF, GIF, ICO, JPEG, PNG, SVG, or WebP. A symlink outside the root does not resolve.

Human and plain output print the absolute icon path. JSON output returns `{"path":"..."}`. When no icon exists, human output says so, plain output is empty, and JSON returns `{"path":null}`.
