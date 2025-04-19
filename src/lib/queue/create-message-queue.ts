import { nanoid } from "nanoid";
import { ProcessFn } from "./types/process-fn";
import { QueueMessage } from "./types/queue-message";

export const createMessageQueue = <TPayload>(
  processFn: ProcessFn<TPayload>
) => {
  const queue: QueueMessage<TPayload>[] = [];
  let processing = false;

  const enqueue = (type: string, payload: TPayload) => {
    const message: QueueMessage<TPayload> = {
      id: nanoid(),
      type,
      payload,
      status: "pending",
    };
    queue.push(message);
    startProcessing();
  };

  const startProcessing = () => {
    if (processing) return;
    processing = true;
    processNext();
  };

  const processNext = async () => {
    const next = queue.find((a) => a.status === "pending");
    if (!next) {
      processing = false;
      return;
    }

    try {
      await processFn(next);
      next.status = "success";
      next.error = undefined;
    } catch (err) {
      next.status = "error";
      next.error = (err as Error).message;
    }

    setTimeout(processNext, 100);
  };

  const getQueue = () => queue;

  return {
    enqueue,
    getQueue,
  };
};
