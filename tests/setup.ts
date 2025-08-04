import { vi } from "vitest";

// in‑memory storage mock
const memory: Record<string, string> = {};
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: (k: string) => memory[k] ?? null,
    setItem: (k: string, v: string) => {
      memory[k] = v;
    },
    removeItem: (k: string) => {
      delete memory[k];
    },
    clear: () => {
      for (const k in memory) delete memory[k];
    },
  },
  writable: false,
});

vi.useFakeTimers();
