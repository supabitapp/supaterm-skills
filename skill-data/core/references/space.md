# Space commands

`sp space` creates, selects, renames, recolors, destroys, and navigates spaces.

## Create

`sp space new <name>` creates a space and its first tab without changing the current selection. `--focus` switches to it immediately. `--color` tints the new space's window chrome. Creation fails without leaving an empty space when the name is invalid or already used.

```bash
sp space new Work
sp space new --focus Build
sp space new --color green Work
```

## Focus

`sp space focus [space]` selects a space. Inside Supaterm, omitting the target uses the current space.

```bash
sp space focus
sp space focus 1
sp space focus <space-uuid>
```

## Rename

`sp space rename <name> [space]` renames a space.

```bash
sp space rename Work
sp space rename Logs 1
sp space rename Build <space-uuid>
```

## Color

`sp space color <color> [space]` tints a space's window chrome. Colors: neutral, red, orange, yellow, green, blue, pink, purple. Neutral removes the tint.

```bash
sp space color green
sp space color purple 1
sp space color neutral <space-uuid>
```

## Destroy

`sp space destroy -y [space]` destroys a space. Omit `-y` to confirm interactively.

```bash
sp space destroy -y
sp space destroy -y 1
sp space destroy -y <space-uuid>
```

## Navigate

Use navigation commands to move through spaces:

```bash
sp space next
sp space prev
sp space last
```

## Output

Mutating `space` commands support the standard output flags:

```bash
sp space new --json --focus Work
sp space focus --plain 1
sp space destroy -y --quiet 1
```
