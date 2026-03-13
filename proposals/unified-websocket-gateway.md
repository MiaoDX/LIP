# Unified WebSocket Notification Layer — Proposal

## Problem
- Slack/Discord/Telegram/Feishu all have WebSocket/push APIs
- But each platform has different APIs, auth, message formats
- Agents need to handle N different integrations

## Solution: WebSocket Gateway Abstraction Layer

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Agents (WLB, GSD, etc.)               │
│                         ↑↓ Unified API                      │
├─────────────────────────────────────────────────────────────┤
│              WebSocket Gateway (OpenClaw Extension)         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Slack  │  │ Feishu  │  │ Discord │  │Telegram │        │
│  │ Adapter │  │ Adapter │  │ Adapter │  │ Adapter │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       └─────────────┴─────────────┴─────────────┘            │
│                    Platform WebSocket APIs                   │
└─────────────────────────────────────────────────────────────┘
```

## Core Design

### 1. Unified Message Format
```json
{
  "version": "1.0",
  "id": "msg-uuid",
  "timestamp": "2026-03-12T23:07:00Z",
  "source": {
    "platform": "slack|feishu|discord|telegram",
    "channel": "channel-id",
    "sender": {
      "id": "user-id",
      "name": "username",
      "type": "human|bot"
    }
  },
  "content": {
    "type": "text|image|file|mention",
    "text": "message content",
    "mentions": ["@agent-id"]
  },
  "context": {
    "threadId": "thread-uuid",
    "replyTo": "parent-msg-id",
    "sessionKey": "agent-session"
  }
}
```

### 2. Platform Adapters
Each adapter handles:
- **Connection**: WebSocket connect, auth, heartbeat
- **Translation**: Native format ↔ Unified format
- **Events**: message, reaction, mention, join/leave
- **Actions**: send, reply, react, thread

### 3. Agent Interface
```javascript
// Agent subscribes to unified stream
const stream = gateway.subscribe({
  platforms: ['slack', 'feishu'],
  channels: ['#copycat', '#gg'],
  mentionsOnly: false
});

stream.on('message', (msg) => {
  // Handle unified message
  const reply = await agent.process(msg);
  
  // Send back via unified API
  gateway.send({
    platform: msg.source.platform,
    channel: msg.source.channel,
    content: reply,
    threadId: msg.context.threadId
  });
});
```

## Platform-Specific Notes

| Platform | WebSocket API | Auth | Notes |
|----------|---------------|------|-------|
| **Slack** | Socket Mode | Bot token + app token | Events API over WebSocket |
| **Feishu** | WebSocket connection | App ID + App Secret | Real-time events |
| **Discord** | Gateway | Bot token | Intents-based events |
| **Telegram** | Webhook or long-polling | Bot token | Webhook preferred for push |

## Advantages

1. **Write once, run everywhere** — Agents use one API
2. **Platform-agnostic** — Easy to add new platforms
3. **Consistent behavior** — Same message handling regardless of source
4. **Cross-platform threads** — Unified thread ID across platforms

## Open Questions & Proposed Solutions

### 1. Message Ordering
**Problem**: Messages may arrive out of order due to network latency or platform differences.

**Solution**:
- Include monotonic sequence numbers per channel
- Agent-side buffer with small delay (e.g., 100ms) for reordering
- Expose `deliveredAt` timestamp for client-side ordering

```json
{
  "context": {
    "sequence": 42,
    "deliveredAt": "2026-03-12T23:07:00.123Z"
  }
}
```

### 2. Rate Limiting
**Problem**: Each platform has different rate limits (Slack: 1 msg/sec, Discord: 5 msg/5s, etc.).

**Solution**:
- Per-platform token bucket in Gateway
- Unified `429` response with `Retry-After` header
- Agent-side exponential backoff

| Platform | Rate Limit | Burst |
|----------|------------|-------|
| Slack | 1 msg/sec | 10 |
| Discord | 5 msg/5s | 5 |
| Feishu | 20 msg/sec | 100 |
| Telegram | 30 msg/sec | 30 |

### 3. Offline Handling
**Problem**: Agents may be offline when messages arrive.

**Solution**:
- Gateway maintains per-agent queue (TTL: 24h)
- On reconnect, agent requests `since: last-seen-timestamp`
- Queue overflow: drop oldest, notify agent of gap

```javascript
// On reconnect
const missed = gateway.sync({
  agentId: 'gsd',
  since: '2026-03-12T22:00:00Z',
  maxMessages: 100
});
```

### 4. Identity Mapping
**Problem**: Same user across platforms has different IDs.

**Solution**:
- Optional identity linking via `identity.map` API
- Default: platform-specific IDs with `platform:user-id` format
- Linked: unified `identity:user-uuid` with platform aliases

```json
{
  "sender": {
    "id": "identity:u-12345",
    "aliases": {
      "slack": "U0AJN5URP7A",
      "feishu": "ou_xxx"
    }
  }
}
```

## Implementation Phases

| Phase | Scope | Timeline |
|-------|-------|----------|
| P0 | Slack + Feishu adapters, basic send/receive | 1-2 weeks |
| P1 | Message ordering, rate limiting | 2-3 weeks |
| P2 | Offline queue, identity mapping | 3-4 weeks |
| P3 | Discord + Telegram, documentation | 4-6 weeks |

## Next Steps

1. **Prototype**: Slack + Feishu adapters (P0)
2. **Test**: WLB↔GSD cross-platform conversation
3. **Measure**: Latency vs polling approach
4. **Document**: Adapter development guide

---
*Drafted by GSD, 2026-03-12*  
*Updated with WLB additions, 2026-03-13*
