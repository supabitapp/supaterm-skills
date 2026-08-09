# Project commands

`sp project` adds and manages folder-backed Projects inside Spaces. Every Project command accepts `--in <space>`; without it, the command uses the ambient Space.

Every Space has a Home Project mapped to the current home directory. Home can move between pinned and regular lanes, reorder, collapse, and expand, but it cannot be located or removed.

## Add

`sp project add <path>` adds an existing, reachable directory. Supaterm resolves Finder aliases and symlinks and stores the canonical absolute path. Adding the same physical folder again succeeds and returns the existing Project.

```bash
sp project add .
sp project add ~/Code/supaterm
sp project add ~/Code/supaterm --in 2
sp project add ~/Code/supaterm --in <space-uuid> --json
```

The same folder can be a Project in different Spaces. Nested Projects are allowed.

## Target Projects

A Project target is one of:

- its UUID
- its canonical absolute path
- its exact rendered label from `sp ls`

Labels use the folder basename and the shortest parent suffix needed to stay unique in one Space. Use the UUID for durable automation. A bare basename that is not the exact rendered label does not resolve.

When a target is omitted, Supaterm uses the selected Tab's Project, then Home.

```bash
sp project pin
sp project collapse supaterm
sp project expand work/supaterm --in 2
sp project reveal <project-uuid>
```

## Pin And Collapse

```bash
sp project pin supaterm
sp project unpin supaterm
sp project collapse supaterm
sp project expand supaterm
```

Pin state is shared across windows. Collapse state belongs to the invoking window and Space. Collapsing hides every Tab in the Project without changing membership or Tab order.

## Move

`sp project move [project] --index <index>` reorders a Project within its current pinned or regular lane. The index is 1-based.

```bash
sp project move --index 1
sp project move supaterm --index 2
sp project move <project-uuid> --index 1 --in 2
```

## Locate

`sp project locate <path> [project]` replaces an unavailable Project's path while preserving its identity, order, pin state, collapse state, and Tabs.

```bash
sp project locate ~/Code/supaterm
sp project locate ~/Code/supaterm <project-uuid>
sp project locate ~/Code/supaterm old-parent/supaterm --in 2
```

Locating to Home or another Project's folder fails without changing the target.

## Reveal

`sp project reveal [project]` reveals the Project directory in Finder.

```bash
sp project reveal
sp project reveal supaterm
sp project reveal <project-uuid> --in 2
```

## Remove

`sp project remove [project]` removes the Project from its Space and never deletes the directory. Removing an empty Project is immediate. Removing a nonempty Project reports its affected Tab, window, and running-process counts, then asks for confirmation. If those counts change before removal, Supaterm shows the updated warning again.

```bash
sp project remove supaterm
sp project remove <project-uuid>
sp project remove supaterm --in 2
```

Removing a Project closes all of its Tabs and terminal sessions across windows.

## Output

Project mutations support the standard output flags:

```bash
sp project add . --json
sp project pin supaterm --plain
sp project collapse supaterm --quiet
```
