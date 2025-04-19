import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMessageQueue } from "./create-message-queue";

type TestPayload = { id: string };

let processed: TestPayload[] = [];

describe("Queue", () => {
  beforeEach(() => {
    processed = [];
  });

  it("processes a message and updates status to success", async () => {
    const queue = createMessageQueue<TestPayload>(async (msg) => {
      processed.push(msg.payload);
    });

    queue.enqueue("TEST", { id: "1" });

    await new Promise((res) => setTimeout(res, 1000));

    const q = queue.getQueue();
    expect(q).toHaveLength(1);
    expect(q[0].status).toBe("success");
    expect(processed[0].id).toBe("1");
  });

  it("processes multiple messages in the correct order", async () => {
    const queue = createMessageQueue<TestPayload>(async (msg) => {
      processed.push(msg.payload);
    });

    queue.enqueue("TEST", { id: "1" });
    queue.enqueue("TEST", { id: "2" });

    await new Promise((res) => setTimeout(res, 1500));

    expect(processed.length).toBe(2);
    expect(processed[0].id).toBe("1");
    expect(processed[1].id).toBe("2");
  });

  it("marks a message as error if processFn throws", async () => {
    const queue = createMessageQueue<TestPayload>(async (msg) => {
      if (msg.payload.id === "42") {
        throw new Error("Boom");
      }
      processed.push(msg);
    });

    queue.enqueue("TEST", { id: "1" });
    queue.enqueue("TEST", { id: "42" });

    await new Promise((res) => setTimeout(res, 1500));

    const q = queue.getQueue();
    expect(q.find((m) => m.payload.id === "42")?.status).toBe("error");
    expect(q.find((m) => m.payload.id === "1")?.status).toBe("success");
  });

  it("does not reprocess messages that are already success or error", async () => {
    const spy = vi.fn();
    const queue = createMessageQueue<TestPayload>(async (msg) => {
      spy();
      if (msg.payload.id === "1") throw new Error("fail");
    });

    queue.enqueue("TEST", { id: "1" });
    queue.enqueue("TEST", { id: "2" });

    await new Promise((res) => setTimeout(res, 1500));

    expect(spy).toHaveBeenCalledTimes(2);

    const q = queue.getQueue();
    expect(q.filter((m) => m.status === "error")).toHaveLength(1);
    expect(q.filter((m) => m.status === "success")).toHaveLength(1);
  });
});
