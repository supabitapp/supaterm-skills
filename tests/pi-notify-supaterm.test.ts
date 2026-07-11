import assert from "node:assert/strict";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import piNotifySupaterm, {
  registerPiNotifySupaterm,
  type PiStopReason,
  type PiNotifySupatermRuntime,
  type SupatermHookEvent,
} from "../extensions/pi-notify-supaterm/index.ts";

type Handler = (event: unknown, context: unknown) => Promise<void>;

function makePi(sessionName = "Review") {
  const handlers = new Map<string, Handler>();
  return {
    handlers,
    pi: {
      getSessionName: () => sessionName,
      on: (name: string, handler: Handler) => handlers.set(name, handler),
    },
  };
}

function makeRuntime(events: SupatermHookEvent[]): PiNotifySupatermRuntime {
  return {
    cwd: "/repo",
    now: () => 1000,
    notify: () => {},
    supaterm: {
      send: async (event) => events.push(event),
    },
  };
}

function context(sessionID: string) {
  return {
    model: { name: "Claude Sonnet (High)" },
    sessionManager: { getSessionId: () => sessionID },
  };
}

function assistant(stopReason: PiStopReason, text: string, errorMessage?: string) {
  return {
    content: [{ type: "text", text }],
    errorMessage,
    role: "assistant",
    stopReason,
  };
}

test("Supaterm receives one native lifecycle event per Pi callback", async () => {
  const events: SupatermHookEvent[] = [];
  const { handlers, pi } = makePi();
  registerPiNotifySupaterm(pi as never, makeRuntime(events));
  const firstSession = context("pi-session-1");
  const secondSession = context("pi-session-2");

  await handlers.get("session_start")?.({ reason: "startup" }, firstSession);
  await handlers.get("agent_start")?.({}, firstSession);
  await handlers.get("agent_end")?.(
    { messages: [assistant("stop", "Done.")] },
    firstSession
  );
  await handlers.get("session_shutdown")?.({ reason: "resume" }, firstSession);
  await handlers.get("session_start")?.({ reason: "resume" }, secondSession);

  assert.deepEqual(events, [
    {
      cwd: "/repo",
      hook_event_name: "session_start",
      model: "Claude Sonnet",
      reason: "startup",
      session_id: "pi-session-1",
      source: "pi-notify-supaterm",
      title: "Pi",
    },
    {
      cwd: "/repo",
      hook_event_name: "agent_start",
      model: "Claude Sonnet",
      session_id: "pi-session-1",
      source: "pi-notify-supaterm",
    },
    {
      cwd: "/repo",
      hook_event_name: "agent_end",
      message: "Done.",
      session_id: "pi-session-1",
      source: "pi-notify-supaterm",
      stop_reason: "stop",
    },
    {
      cwd: "/repo",
      hook_event_name: "session_shutdown",
      reason: "resume",
      session_id: "pi-session-1",
      source: "pi-notify-supaterm",
    },
    {
      cwd: "/repo",
      hook_event_name: "session_start",
      model: "Claude Sonnet",
      reason: "resume",
      session_id: "pi-session-2",
      source: "pi-notify-supaterm",
      title: "Pi",
    },
  ]);
});

test("Pi forwards native error and truncation outcomes", async () => {
  const events: SupatermHookEvent[] = [];
  const { handlers, pi } = makePi();
  registerPiNotifySupaterm(pi as never, makeRuntime(events));

  await handlers.get("agent_end")?.(
    { messages: [assistant("error", "Try again", "Provider failed")] },
    context("pi-session-1")
  );
  await handlers.get("agent_end")?.(
    { messages: [assistant("length", "Partial response")] },
    context("pi-session-1")
  );

  assert.deepEqual(events, [
    {
      cwd: "/repo",
      hook_event_name: "agent_end",
      message: "Provider failed",
      session_id: "pi-session-1",
      source: "pi-notify-supaterm",
      stop_reason: "error",
    },
    {
      cwd: "/repo",
      hook_event_name: "agent_end",
      message: "Partial response",
      session_id: "pi-session-1",
      source: "pi-notify-supaterm",
      stop_reason: "length",
    },
  ]);
});

test("non-Supaterm runs retain their terminal notification", async () => {
  const notifications: Array<[string, string]> = [];
  const { handlers, pi } = makePi("Review");
  registerPiNotifySupaterm(pi as never, {
    cwd: "/repo",
    now: () => 1000,
    notify: (title, body) => notifications.push([title, body]),
  });

  await handlers.get("agent_start")?.({}, {});
  await handlers.get("agent_end")?.(
    { messages: [assistant("stop", "Ready for review.")] },
    {}
  );

  assert.deepEqual(notifications, [
    ["Ready for review. · repo · Review", "Ready for review."],
  ]);
});

test("Pi forwards its native process ID to Supaterm", async () => {
  const directory = await mkdtemp(join(tmpdir(), "pi-notify-supaterm-"));
  const executablePath = join(directory, "sp");
  const argumentsPath = join(directory, "arguments");
  const previousCLIPath = process.env.SUPATERM_CLI_PATH;
  const previousArgumentsPath = process.env.SUPATERM_ARGUMENTS_PATH;

  try {
    await writeFile(
      executablePath,
      "#!/bin/sh\nprintf '%s\\n' \"$@\" > \"$SUPATERM_ARGUMENTS_PATH\"\ncat >/dev/null\n"
    );
    await chmod(executablePath, 0o755);
    process.env.SUPATERM_CLI_PATH = executablePath;
    process.env.SUPATERM_ARGUMENTS_PATH = argumentsPath;

    const { handlers, pi } = makePi();
    piNotifySupaterm(pi as never);
    await handlers.get("session_start")?.(
      { reason: "startup" },
      context("pi-session-1")
    );

    assert.deepEqual((await readFile(argumentsPath, "utf8")).trim().split("\n"), [
      "agent",
      "receive-agent-hook",
      "--agent",
      "pi",
      "--pid",
      String(process.pid),
    ]);
  } finally {
    if (previousCLIPath === undefined) {
      delete process.env.SUPATERM_CLI_PATH;
    } else {
      process.env.SUPATERM_CLI_PATH = previousCLIPath;
    }
    if (previousArgumentsPath === undefined) {
      delete process.env.SUPATERM_ARGUMENTS_PATH;
    } else {
      process.env.SUPATERM_ARGUMENTS_PATH = previousArgumentsPath;
    }
    await rm(directory, { force: true, recursive: true });
  }
});
