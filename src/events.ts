/**
 * Events module for typed publish/subscribe event handling.
 *
 * Provides a type-safe event bus for distributing real-time
 * updates from ORGAN II services to client subscribers.
 */

/** Payload wrapper for all events. */
export interface EventPayload<T = unknown> {
  type: string;
  data: T;
  timestamp: number;
  source: string;
}

/** Handler function for events. */
export type EventHandler<T = unknown> = (payload: EventPayload<T>) => void;

/** Typed event bus for client-side event distribution. */
export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private history: EventPayload[] = [];
  private maxHistory: number;

  constructor(maxHistory = 100) {
    this.maxHistory = maxHistory;
  }

  /**
   * Subscribe to events of a specific type.
   * @param eventType - The event type to listen for.
   * @param handler - Callback invoked when the event fires.
   * @returns An unsubscribe function.
   */
  on<T>(eventType: string, handler: EventHandler<T>): () => void {
    const list = this.handlers.get(eventType) ?? [];
    list.push(handler as EventHandler);
    this.handlers.set(eventType, list);
    return () => {
      const current = this.handlers.get(eventType) ?? [];
      this.handlers.set(
        eventType,
        current.filter((h) => h !== handler)
      );
    };
  }

  /**
   * Emit an event to all subscribed handlers.
   * @param eventType - The event type.
   * @param data - The event data payload.
   * @param source - Identifier of the event source.
   * @returns Number of handlers invoked.
   */
  emit<T>(eventType: string, data: T, source = "system"): number {
    const payload: EventPayload<T> = {
      type: eventType,
      data,
      timestamp: Date.now(),
      source,
    };

    this.history.push(payload as EventPayload);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    const handlers = this.handlers.get(eventType) ?? [];
    for (const handler of handlers) {
      (handler as EventHandler<T>)(payload);
    }
    return handlers.length;
  }

  /** Get all events of a specific type from history. */
  getHistory(eventType?: string): EventPayload[] {
    if (eventType) {
      return this.history.filter((e) => e.type === eventType);
    }
    return [...this.history];
  }

  /** Remove all handlers for a specific event type, or all handlers. */
  clear(eventType?: string): void {
    if (eventType) {
      this.handlers.delete(eventType);
    } else {
      this.handlers.clear();
    }
  }

  /** Number of registered event types. */
  get registeredTypes(): number {
    return this.handlers.size;
  }
}
