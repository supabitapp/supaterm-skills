#!/usr/bin/env python3
import argparse
import json
import os
import shlex
import subprocess
import sys
import tempfile
import time
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser(
        description="Launch a command or shell script in a new Supaterm tab."
    )
    parser.add_argument("--cwd", default=os.getcwd())
    parser.add_argument("--launch-cwd")
    parser.add_argument("--script-file")
    parser.add_argument("--script")
    parser.add_argument("--stdin", action="store_true")
    parser.add_argument("--focus", dest="focus", action="store_true", default=True)
    parser.add_argument("--no-focus", dest="focus", action="store_false")
    parser.add_argument("--keep-open", dest="keep_open", action="store_true", default=True)
    parser.add_argument("--no-keep-open", dest="keep_open", action="store_false")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("command", nargs=argparse.REMAINDER)
    return parser.parse_args()


def script_from_args(args):
    command = args.command
    if command and command[0] == "--":
        command = command[1:]
    sources = [
        bool(args.script_file),
        args.script is not None,
        args.stdin,
        bool(command),
    ]
    if sum(sources) != 1:
        raise SystemExit(
            "Provide exactly one of --script-file, --script, --stdin, or a command after --."
        )
    if args.script_file:
        script = Path(args.script_file).read_text()
    elif args.script is not None:
        script = args.script
    elif args.stdin:
        script = sys.stdin.read()
    else:
        script = shell_command(command)

    if not script:
        raise SystemExit("Launcher script must not be empty.")
    return script


def shell_command(command):
    return " ".join(shlex.quote(part) for part in command)


def write_temp_file(prefix, suffix, text, mode):
    handle = tempfile.NamedTemporaryFile(
        "w",
        delete=False,
        prefix=prefix,
        suffix=suffix,
        encoding="utf-8",
    )
    with handle:
        handle.write(text)
    os.chmod(handle.name, mode)
    return Path(handle.name)


def launcher_text(args, cwd, script):
    lines = [
        "#!/bin/zsh",
        f"cd {shlex.quote(str(cwd))} || exit 1",
    ]
    lines.append(script if script.endswith("\n") else script + "\n")
    lines.append("status=$?")
    if args.keep_open:
        lines.extend(
            [
                'printf "\\nCommand exited with status %s. Shell left open.\\n" "$status"',
                'exec "${SHELL:-/bin/zsh}" -l',
            ]
        )
    lines.append('exit "$status"')
    return "\n".join(lines) + "\n"


def capture_pane(tab):
    return subprocess.run(
        [
            "sp",
            "pane",
            "capture",
            "--scope",
            "scrollback",
            "--lines",
            "20",
            tab["paneID"],
        ],
        text=True,
        capture_output=True,
    )


def wait_for_pane(tab):
    time.sleep(3.0)
    capture_pane(tab)


def send_launcher(tab, launcher_path, send_text):
    wait_for_pane(tab)
    last_result = None
    for _ in range(20):
        result = subprocess.run(
            ["sp", "pane", "send", tab["paneID"], "-"],
            input=f"\x15{send_text}\n",
            text=True,
            capture_output=True,
        )
        if result.returncode == 0:
            return
        last_result = result
        time.sleep(0.25)

    sys.stderr.write(
        json.dumps(
            {
                "error": "failed to send launcher to pane",
                "tabID": tab.get("tabID"),
                "paneID": tab.get("paneID"),
                "launcherPath": str(launcher_path),
                "sendText": send_text,
                "stderr": last_result.stderr if last_result else "",
            },
            indent=2,
        )
        + "\n"
    )
    raise SystemExit(last_result.returncode if last_result else 1)


def resolved_directory(path, name):
    directory = Path(path).expanduser().resolve()
    if not directory.is_dir():
        raise SystemExit(f"{name} is not a directory: {directory}")
    return directory


def main():
    args = parse_args()
    cwd = resolved_directory(args.cwd, "--cwd")
    launch_cwd = resolved_directory(args.launch_cwd, "--launch-cwd") if args.launch_cwd else cwd
    script = script_from_args(args)
    launcher_path = write_temp_file(
        "supaterm-tab-launcher-",
        ".zsh",
        launcher_text(args, cwd, script),
        mode=0o700,
    )
    send_text = shlex.quote(str(launcher_path))

    tab_command = [
        "sp",
        "tab",
        "new",
        "--json",
        "--focus" if args.focus else "--no-focus",
        "--cwd",
        str(launch_cwd),
    ]

    output = {
        "cwd": str(cwd),
        "launchCwd": str(launch_cwd),
        "launcherPath": str(launcher_path),
        "tabCommand": tab_command,
        "sendText": send_text,
        "launcher": launcher_path.read_text(),
    }

    if args.dry_run:
        print(json.dumps(output, indent=2))
        return

    result = subprocess.run(tab_command, text=True, capture_output=True)
    if result.returncode != 0:
        sys.stderr.write(result.stderr)
        raise SystemExit(result.returncode)

    tab = json.loads(result.stdout)
    send_launcher(tab, launcher_path, send_text)
    tab.update({key: output[key] for key in ["cwd", "launchCwd", "launcherPath", "sendText"]})
    print(json.dumps(tab, indent=2))


if __name__ == "__main__":
    main()
