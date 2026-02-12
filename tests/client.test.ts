import { describe, it, expect } from "vitest";
import { PoiesisClient } from "../src/client.js";

describe("PoiesisClient", () => {
  it("should start in disconnected state", () => {
    const client = new PoiesisClient({ endpoint: "ws://localhost:8080" });
    expect(client.connectionState).toBe("disconnected");
  });

  it("should connect successfully", async () => {
    const client = new PoiesisClient({ endpoint: "ws://localhost:8080" });
    await client.connect();
    expect(client.connectionState).toBe("connected");
  });

  it("should send requests when connected", async () => {
    const client = new PoiesisClient({ endpoint: "ws://localhost:8080" });
    await client.connect();
    const response = await client.request("getStatus");
    expect(response).toBeDefined();
  });

  it("should reject requests when disconnected", async () => {
    const client = new PoiesisClient({ endpoint: "ws://localhost:8080" });
    await expect(client.request("getStatus")).rejects.toThrow("Cannot send request");
  });

  it("should disconnect cleanly", async () => {
    const client = new PoiesisClient({ endpoint: "ws://localhost:8080" });
    await client.connect();
    await client.disconnect();
    expect(client.connectionState).toBe("disconnected");
  });
});
