import { nanoid } from "nanoid";
import { ProcessFn } from "./types/process-fn";
import { QueueMessage } from "./types/queue-message";
import polly from "polly-js";

// The queue does not remove messages after processing.
// This allows us to keep a history of messages and their statuses.
export const createMessageQueue = <TPayload>(
  processFn: ProcessFn<TPayload>
) => {
  const queue: QueueMessage<TPayload>[] = [];
  let isProcessing = false;

  const enqueue = (type: string, payload: TPayload) => {
    console.debug("Enqueuing message:", type, payload);
    const message: QueueMessage<TPayload> = {
      id: nanoid(),
      type,
      payload,
      status: "pending",
    };
    queue.push(message);
    console.debug("Current queue length:", queue.length);
    processQueue();
  };

  const processQueue = () => {
    console.debug("Processing queue:", isProcessing);
    if (isProcessing) return;
    console.log("Processing queue...");
    isProcessing = true;
    processNext();
  };

  const processNext = async () => {
    const next = queue.find((a) => a.status === "pending");
    if (!next) {
      console.log("No more messages to process.");
      isProcessing = false;
      return;
    }

    try {
      // polly()
      //   .waitAndRetry(3)
      //   .executeForPromise(() => processFn(next));

      await processFn(next);

      next.status = "success";
      next.error = undefined;
    } catch (err) {
      console.error("Error processing message:", next.id, err);
      next.status = "error";
      next.error = (err as Error).message;
    }

    console.log("Done processing:", next);

    await processNext();

    // setTimeout(processNext, 100);
  };

  const getQueue = () => queue;

  const onIdle = () =>
    new Promise<void>((resolve) => {
      const check = () => {
        if (!queue.some((m) => m.status === "pending")) resolve();
        else setTimeout(check, 10);
      };
      check();
    });

  return {
    enqueue,
    getQueue,
    onIdle,
  };
};
