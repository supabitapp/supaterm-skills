# Recording And Cursor

Cheap utilities:

```bash
sp computer-use screen-size --json
sp computer-use cursor position --json
sp computer-use cursor move --x 600 --y 420 --json
sp computer-use cursor state --json
sp computer-use cursor set --glide-ms 120 --dwell-ms 40 --idle-hide-ms 700 --json
```

Recording:

```bash
sp computer-use recording start --directory /tmp/cu-run --json
sp computer-use recording status --json
sp computer-use recording stop --json
sp computer-use recording replay --directory /tmp/cu-run --json
sp computer-use recording render --directory /tmp/cu-run --output /tmp/cu-run.mp4 --json
```

Recording captures action JSON and per-turn screenshots when available. Coordinate clicks also capture a click marker image.
