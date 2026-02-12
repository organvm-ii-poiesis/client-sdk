/**
 * Client module for managing connections to ORGAN II services.
 *
 * Provides a typed client that handles connection lifecycle,
 * automatic reconnection, and request/response correlation.
 */

/** Connection state of the client. */
export type ConnectionState = "disconnected" | "connecting" | "connected" | "reconnecting";

/** Configuration for the Poiesis client. */
export interface ClientConfig {
  endpoint: string;
  apiKey?: string;
  reconnectIntervalMs: number;
  maxReconnectAttempts: number;
  timeoutMs: number;
}

/** A pending request awaiting a response. */
interface PendingRequest {
  id: string;
  method: string;
  sentAt: number;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

/** Client for connecting to ORGAN II Poiesis services. */
export class PoiesisClient {
  private config: ClientConfig;
  private state: ConnectionState = "disconnected";
  private reconnectAttempts = 0;
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private nextRequestId = 1;

  constructor(config: Partial<ClientConfig> & { endpoint: string }) {
    this.config = {
      endpoint: config.endpoint,
      apiKey: config.apiKey,
      reconnectIntervalMs: config.reconnectIntervalMs ?? 3000,
      maxReconnectAttempts: config.maxReconnectAttempts ?? 5,
      timeoutMs: config.timeoutMs ?? 10000,
    };
  }

  /** Connect to the service endpoint. */
  async connect(): Promise<void> {
    if (this.state === "connected") return;
    this.state = "connecting";
    // Simulated connection for prototype
    this.state = "connected";
    this.reconnectAttempts = 0;
  }

  /** Disconnect from the service. */
  async disconnect(): Promise<void> {
    this.state = "disconnected";
    for (const [id, req] of this.pendingRequests) {
      req.reject(new Error("Client disconnected"));
      this.pendingRequests.delete(id);
    }
  }

  /**
   * Send a request and await the response.
   * @param method - The RPC method name.
   * @param params - Parameters to send.
   * @returns The response payload.
   */
  async request(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    if (this.state !== "connected") {
      throw new Error(`Cannot send request in state '${this.state}'`);
    }
    const id = `req-${String(this.nextRequestId++).padStart(6, "0")}`;
    // Prototype: return mock response
    return { id, method, params, result: "ok" };
  }

  /** Current connection state. */
  get connectionState(): ConnectionState {
    return this.state;
  }

  /** Number of pending requests. */
  get pendingCount(): number {
    return this.pendingRequests.size;
  }

  /** The configured endpoint. */
  get endpoint(): string {
    return this.config.endpoint;
  }
}
