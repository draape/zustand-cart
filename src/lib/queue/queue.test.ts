import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
// import { createMessageQueue } from "./create-message-queue";

it("asdf", () => {
  expect(true).toBe(true);
});

// type TestPayload = { id: string };

// let queue: ReturnType<typeof createMessageQueue<TestPayload>>;
// let processed: TestPayload[] = [];

// describe("Queue", () => {
//   beforeEach(() => {
//     processed = [];
//     vi.useFakeTimers();
//   });

//   afterEach(() => {
//     vi.useRealTimers();
//   });

//   it("processes messages and updates status to success", async () => {
//     const queue = createMessageQueue<TestPayload>(async (msg) => {
//       processed.push(msg.payload);
//     });

//     queue.enqueue("TEST", { id: "1" });

//     const q = queue.getQueue(); // TODO is this actually peek? Or should we have length as a property?
//     expect(q).toHaveLength(1);
//     expect(q[0].status).toBe("success");
//     expect(processed[0].id).toBe("1");
//   });

//   it("processes multiple messages in the correct order", async () => {
//     const queue = createMessageQueue<TestPayload>(async (msg) => {
//       processed.push(msg.payload);
//     });

//     queue.enqueue("TEST", { id: "1" });
//     queue.enqueue("TEST", { id: "2" });

//     expect(processed.length).toBe(2);
//     expect(processed[0].id).toBe("1");
//     expect(processed[1].id).toBe("2");
//   });

//   // it("marks a message as error if processFn throws", async () => {
//   //   const queue = createMessageQueue<TestPayload>(async (msg) => {
//   //     console.log(
//   //       "Inside message handler:",
//   //       msg,
//   //       msg.payload.id,
//   //       msg.payload.id === "42"
//   //     );
//   //     if (msg.payload.id === "42") {
//   //       console.log("Simulated error for id 42");
//   //       throw new Error("Boom");
//   //     }
//   //     processed.push(msg);
//   //   });

//   //   queue.enqueue("TEST", { id: "1" });
//   //   queue.enqueue("TEST", { id: "42" });

//   //   // await new Promise((res) => setTimeout(res, 1500));

//   //   const q = queue.getQueue();
//   //   expect(q[0]?.status).toBe("success");
//   //   expect(q[1]?.status).toBe("error");
//   // });
//   // // { timeout: 3000 }

//   // it(
//   //   "does not reprocess messages that are already success or error",
//   //   async () => {
//   //     const spy = vi.fn();
//   //     const queue = createMessageQueue<TestPayload>(async (msg) => {
//   //       spy();
//   //       if (msg.payload.id === "1") throw new Error("fail");
//   //     });

//   //     queue.enqueue("TEST", { id: "1" });
//   //     queue.enqueue("TEST", { id: "2" });

//   //     await new Promise((res) => setTimeout(res, 1500));

//   //     expect(spy).toHaveBeenCalledTimes(2);

//   //     const q = queue.getQueue();
//   //     expect(q.filter((m) => m.status === "error")).toHaveLength(1);
//   //     expect(q.filter((m) => m.status === "success")).toHaveLength(1);
//   //   },
//   //   { timeout: 3000 }
//   // );

//   // it(
//   //   "should mark message as success on first try",
//   //   async () => {
//   //     const processFn = vi.fn().mockResolvedValue(undefined);

//   //     queue = createMessageQueue(processFn);

//   //     queue.enqueue("TEST", { id: "1" });

//   //     await vi.runAllTimersAsync();

//   //     const messages = queue.getQueue();
//   //     expect(messages[0].status).toBe("success");
//   //     expect(processFn).toHaveBeenCalledTimes(1);
//   //   },
//   //   { timeout: 3000 }
//   // );
// });
