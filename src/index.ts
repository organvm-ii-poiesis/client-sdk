/**
 * client-sdk: Client SDK for ORGAN II services.
 *
 * Provides typed WebSocket connections and event handling
 * for interacting with the Poiesis generative art platform.
 */

export { PoiesisClient } from "./client.js";
export { EventBus } from "./events.js";
export type { ClientConfig, ConnectionState } from "./client.js";
export type { EventHandler, EventPayload } from "./events.js";
