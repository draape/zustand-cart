import { QueueMessage } from "./queue-message";

export type ProcessFn<TPayload> = (
  action: QueueMessage<TPayload>
) => Promise<void>;
