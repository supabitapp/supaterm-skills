import assert from "node:assert/strict";
import test from "node:test";
import {
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
      sessionID: "pi-surface-1",
    },
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
  const context = { model: { name: "Claude Sonnet (High)" } };

  await handlers.get("session_start")?.({}, context);
  await handlers.get("agent_start")?.({}, context);
  await handlers.get("agent_end")?.(
    { messages: [assistant("stop", "Done.")] },
    context
  );
  await handlers.get("session_shutdown")?.({}, context);

  assert.deepEqual(events, [
    {
      cwd: "/repo",
      hook_event_name: "session_start",
      model: "Claude Sonnet",
      session_id: "pi-surface-1",
      source: "pi-notify-supaterm",
      title: "Pi",
    },
    {
      cwd: "/repo",
      hook_event_name: "agent_start",
      model: "Claude Sonnet",
      session_id: "pi-surface-1",
      source: "pi-notify-supaterm",
    },
    {
      cwd: "/repo",
      hook_event_name: "agent_end",
      message: "Done.",
      session_id: "pi-surface-1",
      source: "pi-notify-supaterm",
      stop_reason: "stop",
    },
    {
      cwd: "/repo",
      hook_event_name: "session_shutdown",
      reason: "exit",
      session_id: "pi-surface-1",
      source: "pi-notify-supaterm",
    },
  ]);
});

test("Pi forwards native error and truncation outcomes", async () => {
  const events: SupatermHookEvent[] = [];
  const { handlers, pi } = makePi();
  registerPiNotifySupaterm(pi as never, makeRuntime(events));

  await handlers.get("agent_end")?.(
    { messages: [assistant("error", "Try again", "Provider failed")] },
    {}
  );
  await handlers.get("agent_end")?.(
    { messages: [assistant("length", "Partial response")] },
    {}
  );

  assert.deepEqual(events, [
    {
      cwd: "/repo",
      hook_event_name: "agent_end",
      message: "Provider failed",
      session_id: "pi-surface-1",
      source: "pi-notify-supaterm",
      stop_reason: "error",
    },
    {
      cwd: "/repo",
      hook_event_name: "agent_end",
      message: "Partial response",
      session_id: "pi-surface-1",
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
