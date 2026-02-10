# Client SDK

[![ORGAN-II: Poiesis](https://img.shields.io/badge/ORGAN--II-Poiesis-6a1b9a?style=flat-square)](https://github.com/organvm-ii-poiesis)
[![Status: Scaffolding](https://img.shields.io/badge/status-scaffolding-yellow?style=flat-square)](#roadmap)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](#license)

> **The consumer-facing client library for the Omni-Dromenon system — a lightweight, event-driven TypeScript SDK that connects audience devices, performer interfaces, and external applications to real-time generative performance infrastructure.**

---

## Table of Contents

- [Why a Client SDK for Art Systems](#why-a-client-sdk-for-art-systems)
- [What This Repository Is](#what-this-repository-is)
- [Conceptual Approach](#conceptual-approach)
- [Planned Architecture](#planned-architecture)
- [Planned API Surface](#planned-api-surface)
- [Theory Implemented from ORGAN-I](#theory-implemented-from-organ-i)
- [Relationship to the Omni-Dromenon Ecosystem](#relationship-to-the-omni-dromenon-ecosystem)
- [Related Work and Influences](#related-work-and-influences)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Why a Client SDK for Art Systems

Most generative art systems treat audience participation as an afterthought — a simple HTTP POST endpoint, a polling loop, a WebSocket connection left to each developer to implement from scratch. The result is that the most interesting artistic possibility — real-time feedback between audience and system — becomes the hardest engineering problem, and most projects simply don't attempt it.

Client SDK exists to invert that equation. By providing a dedicated, well-designed client library for the Omni-Dromenon performance engine, we make audience connectivity a first-class primitive rather than an integration headache. The SDK handles connection lifecycle, authentication, latency compensation, event subscription, and parameter control so that artists and developers can focus on what matters: the creative experience itself.

This is not merely a convenience wrapper. The design philosophy of the client library reflects a deeper conviction about what generative performance art requires: that the boundary between performer and audience is a design surface, not a technical constraint. When connecting to a live performance is as simple as importing a module and calling `connect()`, entirely new forms of participatory art become possible. Audience members can influence generative parameters in real time. Performers can receive crowd sentiment as an input signal. External applications — visualizers, sonification tools, archival systems — can subscribe to the event stream and build on top of the performance as it unfolds.

The Omni-Dromenon system, coordinated through the [metasystem-master](https://github.com/organvm-ii-poiesis/metasystem-master) monorepo and powered by [core-engine](https://github.com/organvm-ii-poiesis/core-engine), already handles the server-side complexity of real-time generative performance. Client SDK completes the picture by providing the consumer-facing interface that makes that infrastructure accessible to every device in the room — and beyond it.

---

## What This Repository Is

Client SDK is a **TypeScript/JavaScript client library** designed to serve as the primary consumer-facing interface for the Omni-Dromenon generative performance system. It provides:

- **Connection management** — WebSocket lifecycle with automatic reconnection, heartbeat, and graceful degradation
- **Event subscription** — typed, filterable event streams for performance state changes, parameter updates, and system signals
- **Parameter control** — authenticated write access for performers and vote-weighted influence for audience members
- **Role-based access** — distinct connection profiles for audience, performer, and observer roles
- **Latency compensation** — client-side prediction and server reconciliation for real-time responsiveness
- **Type safety** — full TypeScript type definitions derived from core-engine's shared type package

**Current status:** Scaffolding. The README you are reading IS the primary artifact at this stage. The repository will be populated with implementation code as the Omni-Dromenon core-engine reaches its own integration milestone. The architecture and API surface described below represent the planned design, informed by the system's theoretical foundations and the practical requirements of real-time participatory performance.

---

## Conceptual Approach

### Declarative Over Imperative

The SDK is designed around a declarative API philosophy. Rather than requiring developers to manually manage WebSocket frames, serialize parameters, or track connection state, the SDK exposes high-level abstractions that describe *what* the developer wants to happen, not *how* the protocol achieves it.

This is a deliberate design choice rooted in the observation that creative developers — the primary users of this SDK — think in terms of artistic outcomes ("subscribe to the rhythm parameter," "send an audience vote," "listen for scene transitions") rather than protocol mechanics ("open a WebSocket on port 8080," "serialize a JSON payload," "handle reconnection on close code 1006").

```typescript
// Imperative (what we avoid)
const ws = new WebSocket('ws://engine.local:8080');
ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', channel: 'params' }));
ws.onmessage = (e) => { /* parse, validate, dispatch manually */ };

// Declarative (what we provide)
const client = createOmniClient({ role: 'audience' });
client.params.subscribe('rhythm', (value) => updateVisualization(value));
```

### Event-Driven, Not Request-Response

Generative performance is inherently temporal. State changes continuously. The system emits events — parameter shifts, scene transitions, audience sentiment updates, performer gestures — and clients react to them. The SDK's architecture mirrors this reality: it is built around an event-driven model where clients subscribe to typed event streams rather than polling for state.

This means the SDK feels natural in reactive UI frameworks (React, Svelte, Vue) and integrates cleanly with observable patterns (RxJS, custom event emitters). It also means that the SDK can serve non-UI consumers — data loggers, archival systems, analytical dashboards — with the same subscription interface.

### Real-Time as Default

Every API in the SDK assumes real-time operation. There is no "batch mode" or "offline-first" design. When you subscribe to an event, you receive it as close to the moment of emission as the network allows. When you send a vote or parameter change, it is dispatched immediately with optimistic local application and server reconciliation.

This is an opinionated choice. Not every application needs sub-second latency. But for the primary use case — audience members participating in a live generative performance — real-time is not a nice-to-have, it is a hard requirement. The SDK is optimized for this case and provides escape hatches (buffering, debouncing, snapshot polling) for applications that need them.

---

## Planned Architecture

### Module Structure

```
client-sdk/
├── src/
│   ├── core/
│   │   ├── connection.ts        # WebSocket lifecycle management
│   │   ├── protocol.ts          # Frame encoding/decoding
│   │   ├── reconnect.ts         # Exponential backoff, jitter
│   │   └── heartbeat.ts         # Keep-alive and latency measurement
│   ├── channels/
│   │   ├── params.ts            # Parameter subscription and control
│   │   ├── events.ts            # Performance event stream
│   │   ├── votes.ts             # Audience vote submission
│   │   └── presence.ts          # Connection count, role distribution
│   ├── roles/
│   │   ├── audience.ts          # Audience-specific API surface
│   │   ├── performer.ts         # Performer-specific API surface
│   │   └── observer.ts          # Read-only observer API
│   ├── types/
│   │   ├── events.ts            # Event type definitions (from core-engine)
│   │   ├── params.ts            # Parameter type definitions
│   │   └── protocol.ts          # Wire protocol types
│   ├── utils/
│   │   ├── latency.ts           # Client-side latency compensation
│   │   ├── buffer.ts            # Event buffering for batch consumers
│   │   └── codec.ts             # MessagePack / JSON codec switching
│   └── index.ts                 # Public API entry point
├── tests/
│   ├── connection.test.ts
│   ├── params.test.ts
│   ├── votes.test.ts
│   └── integration/
│       └── full-session.test.ts
├── examples/
│   ├── audience-web/            # Browser audience client
│   ├── performer-dashboard/     # Performer control panel
│   └── data-logger/             # Headless event archiver
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

### Connection Lifecycle

The connection manager handles the full WebSocket lifecycle with emphasis on resilience in live performance environments where network conditions are unpredictable (venue Wi-Fi, cellular fallback, high-density device scenarios):

1. **Discovery** — resolve engine endpoint via mDNS (local) or registry URL (remote)
2. **Handshake** — authenticate with role token, negotiate protocol version and codec
3. **Subscription** — register channel subscriptions with the engine's topic router
4. **Steady state** — bidirectional event flow with heartbeat monitoring
5. **Reconnection** — exponential backoff with jitter on disconnection; resubscribe on reconnect
6. **Graceful shutdown** — unsubscribe, flush pending writes, close with appropriate status code

### Role Model

The SDK provides three distinct connection profiles, each exposing a different subset of the API:

| Role | Read Events | Write Params | Submit Votes | See Presence |
|------|-------------|--------------|--------------|--------------|
| **Audience** | Yes (filtered) | No | Yes | Count only |
| **Performer** | Yes (full) | Yes | No | Full roster |
| **Observer** | Yes (full) | No | No | Full roster |

Role selection happens at connection time and determines both the client-side API surface (TypeScript will not expose methods your role cannot use) and the server-side authorization scope.

---

## Planned API Surface

The following examples illustrate the planned SDK interface. These are design targets, not yet implemented.

### Creating a Client

```typescript
import { createOmniClient } from '@omni-dromenon/client-sdk';

// Audience client — minimal configuration
const audience = createOmniClient({
  role: 'audience',
  engine: 'ws://performance.local:8080',
});

// Performer client — authenticated
const performer = createOmniClient({
  role: 'performer',
  engine: 'ws://performance.local:8080',
  token: process.env.PERFORMER_TOKEN,
});

// Observer client — read-only, full event stream
const observer = createOmniClient({
  role: 'observer',
  engine: 'ws://performance.local:8080',
  token: process.env.OBSERVER_TOKEN,
});
```

### Subscribing to Parameters

```typescript
// Subscribe to a single parameter
audience.params.subscribe('rhythm.density', (value, meta) => {
  console.log(`Rhythm density: ${value} (changed by: ${meta.source})`);
});

// Subscribe to a parameter namespace
audience.params.subscribe('rhythm.*', (value, meta) => {
  console.log(`${meta.param}: ${value}`);
});

// Get current snapshot
const snapshot = await audience.params.snapshot();
console.log(snapshot.rhythm.density); // 0.73
```

### Submitting Audience Votes

```typescript
// Simple binary vote
await audience.votes.submit('scene-transition', { choice: 'yes' });

// Weighted continuous vote (e.g., slider input)
await audience.votes.submit('energy-level', {
  value: 0.85,
  weight: 1.0, // weight is server-assigned based on engagement history
});

// Vote with metadata for analytics
await audience.votes.submit('color-preference', {
  choice: 'warm',
  context: { scene: 'act-2', timestamp: Date.now() },
});
```

### Performer Parameter Control

```typescript
// Direct parameter set (performer only)
await performer.params.set('rhythm.density', 0.6);

// Transition parameter over time
await performer.params.transition('harmony.tension', {
  from: 0.3,
  to: 0.9,
  duration: 5000,   // 5 seconds
  curve: 'ease-in-out',
});

// Batch parameter update
await performer.params.batch([
  { param: 'rhythm.density', value: 0.8 },
  { param: 'harmony.tension', value: 0.5 },
  { param: 'visual.brightness', value: 0.7 },
]);
```

### Event Stream

```typescript
// Listen for scene transitions
audience.events.on('scene:transition', (event) => {
  console.log(`Transitioning to scene: ${event.scene.name}`);
  console.log(`Duration: ${event.transition.duration}ms`);
});

// Listen for all events (observer/data-logger use case)
observer.events.on('*', (event) => {
  appendToLog(event);
});

// Presence updates
performer.presence.on('count', (count) => {
  console.log(`Connected audience: ${count.audience}`);
  console.log(`Connected performers: ${count.performer}`);
});
```

### Connection Lifecycle Hooks

```typescript
audience.on('connected', () => console.log('Connected to engine'));
audience.on('disconnected', (reason) => console.log(`Disconnected: ${reason}`));
audience.on('reconnecting', (attempt) => console.log(`Reconnect attempt ${attempt}`));
audience.on('error', (err) => console.error('Client error:', err));

// Graceful shutdown
process.on('SIGINT', async () => {
  await audience.disconnect();
  process.exit(0);
});
```

---

## Theory Implemented from ORGAN-I

Client SDK is not merely an engineering artifact — it implements theoretical principles developed in [ORGAN-I (Theoria)](https://github.com/organvm-i-theoria), specifically from the [recursive-engine](https://github.com/organvm-i-theoria/recursive-engine) repository:

### Recursive Observation

The recursive-engine posits that observation is not passive reception but active participation in system dynamics. Client SDK implements this literally: every audience connection is an observer that, through the act of subscribing to events and submitting votes, modifies the system's state. The audience does not watch the performance — the audience *is part of* the performance's recursive feedback loop.

In practice, this means the SDK's event subscription model is designed to be bidirectional by default. Subscribing to a parameter does not merely read its value; the subscription itself is registered as a signal in the engine's audience topology, which can influence parameter evolution. The act of observation has side effects, by design.

### Emergent Complexity from Simple Primitives

The recursive-engine's core thesis is that complex, unpredictable behavior emerges from simple recursive rules. Client SDK reflects this in its API design: the SDK provides a small number of simple primitives (subscribe, vote, set, transition) that, when composed by many simultaneous clients, produce emergent collective behavior that no single client could predict or control.

A single audience vote is trivial. A thousand simultaneous votes create a gradient field that the engine interprets as collective intent, shaping generative parameters in ways that emerge from — but are not reducible to — individual actions. The SDK's simplicity is the mechanism through which collective complexity arises.

### Boundary as Interface

ORGAN-I's theoretical framework treats boundaries not as barriers but as productive interfaces where information transforms as it crosses from one domain to another. Client SDK *is* the boundary between human intent (audience gesture, performer decision) and system state (engine parameters, generative rules). The SDK's role is not merely to transport data across this boundary but to transform it appropriately: votes become weighted influence signals, parameter sets become transitions with temporal envelopes, subscriptions become observation nodes in the recursive topology.

---

## Relationship to the Omni-Dromenon Ecosystem

Client SDK operates within a larger ecosystem of repositories in ORGAN-II:

```
metasystem-master (monorepo, coordination)
  ├── core-engine (server-side generative engine)
  │     └── client-sdk (this repo — consumer-facing client library)
  ├── performance-sdk (UI components built ON TOP of client-sdk)
  ├── a-mavs-olevm (audiovisual performance system)
  └── audio-visual-modules (modular signal processing)
```

**[metasystem-master](https://github.com/organvm-ii-poiesis/metasystem-master)** is the flagship monorepo that coordinates all Omni-Dromenon subsystems. Client SDK is designed to be published as a standalone npm package (`@omni-dromenon/client-sdk`) but is developed in coordination with the monorepo's type definitions and protocol specifications.

**[core-engine](https://github.com/organvm-ii-poiesis/core-engine)** is the server-side counterpart. It manages generative state, processes audience input, routes events between performers and audience, and drives the parameter evolution algorithms. Client SDK communicates with core-engine over WebSocket using a shared binary protocol.

**performance-sdk** provides higher-level UI components (React, Svelte) that consume client-sdk internally. If client-sdk is the transport layer, performance-sdk is the presentation layer. Developers who want fine-grained control use client-sdk directly; developers who want drop-in audience participation UI use performance-sdk.

### Dependency Direction

Following the ORGAN system's invariant that dependencies flow I to II to III (no back-edges), client-sdk depends on:

- **ORGAN-I** type definitions and theoretical primitives (via recursive-engine's published types)
- **ORGAN-II** core-engine protocol specification (via shared types package)

Client SDK does NOT depend on ORGAN-III (Commerce) repositories. However, ORGAN-III products (e.g., SaaS platforms) may consume client-sdk as a dependency when building commercial audience participation features.

---

## Related Work and Influences

Client SDK's design is informed by several existing libraries and frameworks that have solved analogous problems in adjacent domains:

### Tone.js

[Tone.js](https://tonejs.github.io/) provides a high-level, musical API over the Web Audio API. Its design philosophy — making complex audio synthesis accessible through declarative, musically meaningful abstractions — directly influences client-sdk's approach to parameter control. Where Tone.js provides `Transport.start()` and `Synth.triggerAttackRelease()`, client-sdk provides `params.transition()` and `votes.submit()`. The principle is the same: domain-appropriate abstractions that hide protocol complexity.

### Three.js

[Three.js](https://threejs.org/) demonstrates how a well-designed client library can democratize access to powerful but complex underlying systems (WebGL). Client SDK aspires to a similar relationship with the Omni-Dromenon engine: the engine is powerful but protocol-level interaction is prohibitively complex for most creative developers. The SDK makes the engine accessible without sacrificing the expressiveness that advanced users need.

### Socket.IO Client

[Socket.IO](https://socket.io/docs/v4/client-api/) pioneered many of the patterns client-sdk adopts: automatic reconnection, room-based subscription, event-driven APIs, transport fallback. Client SDK diverges from Socket.IO in its emphasis on typed events (every event has a TypeScript definition), role-based access control (not all clients can emit all events), and domain-specific abstractions (votes, parameters, scenes rather than generic message passing).

### Ably / Pusher SDKs

Real-time messaging platforms like [Ably](https://ably.com/) and [Pusher](https://pusher.com/) provide channel-based subscription models with presence awareness. Client SDK borrows the channel abstraction (params, events, votes, presence are channels) and the presence model (knowing how many and what type of clients are connected). The key difference is that client-sdk is purpose-built for generative performance rather than generic real-time messaging, enabling domain-specific optimizations like latency-compensated parameter interpolation and vote aggregation.

### Phoenix Channels

Elixir's [Phoenix Channels](https://hexdocs.pm/phoenix/channels.html) and [LiveView](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html) demonstrate server-driven real-time UI at scale. While client-sdk operates at a lower level (it is a client library, not a full-stack framework), Phoenix's approach to topic-based pub/sub with server-authoritative state reconciliation directly influences client-sdk's protocol design. The engine is authoritative; the client predicts and reconciles.

---

## Roadmap

Client SDK follows the phased implementation plan defined in the [ORGAN system roadmap](https://github.com/organvm-ii-poiesis/metasystem-master):

### Phase 1 — Documentation and Design (Current)

- [x] Repository scaffolding and README (Silver Sprint)
- [ ] API design document with TypeScript interface definitions
- [ ] Protocol specification (wire format, frame types, error codes)
- [ ] Type package extraction from core-engine shared types

### Phase 2 — Core Implementation

- [ ] Connection manager with reconnection and heartbeat
- [ ] Protocol codec (JSON initial, MessagePack optimization later)
- [ ] Parameter subscription and snapshot APIs
- [ ] Vote submission with optimistic local application
- [ ] Role-based API surface restriction

### Phase 3 — Integration and Testing

- [ ] Integration tests against core-engine test server
- [ ] Example applications (audience web client, performer dashboard, data logger)
- [ ] Performance benchmarks (connection density, message throughput, latency)
- [ ] npm package publishing as `@omni-dromenon/client-sdk`

### Phase 4 — Advanced Features

- [ ] MessagePack binary codec for reduced bandwidth
- [ ] mDNS engine discovery for local-network performances
- [ ] Offline event buffering and replay
- [ ] React/Svelte hooks package (may migrate to performance-sdk)
- [ ] WebRTC data channel transport for ultra-low-latency scenarios

---

## Contributing

Client SDK is part of the ORGAN-II (Poiesis) ecosystem. Contributions are welcome once the repository moves beyond the scaffolding phase.

To contribute:

1. Read the [metasystem-master](https://github.com/organvm-ii-poiesis/metasystem-master) README to understand the broader system context
2. Check the roadmap above for current priorities
3. Open an issue to discuss your proposed change before submitting a pull request
4. Follow the TypeScript strict mode configuration and existing code style conventions
5. Include tests for any new functionality
6. Ensure all type definitions are accurate — the SDK's type safety is a core feature, not a nicety

### Development Setup (Planned)

```bash
git clone https://github.com/organvm-ii-poiesis/client-sdk.git
cd client-sdk
npm install
npm run build
npm test
```

---

## License

MIT License. See [LICENSE](LICENSE) for full text.

This project is part of the [ORGAN-II: Poiesis](https://github.com/organvm-ii-poiesis) organization, which coordinates the art and generative performance systems within the eight-organ creative-institutional framework.

---

## Author

**[@4444j99](https://github.com/4444j99)**

Client SDK is one component of the Omni-Dromenon generative performance system, itself one subsystem within ORGAN-II (Poiesis) — the art organ of an eight-organ creative-institutional architecture spanning theory, art, commerce, orchestration, public process, community, and distribution.

For the full system map, see [meta-organvm](https://github.com/meta-organvm).
