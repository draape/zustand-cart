import { MessageStatus } from "./message-status";

export type QueueMessage<TPayload> = {
  id: string;
  type: string;
  payload: TPayload;
  status: MessageStatus;
  error?: string;
};
