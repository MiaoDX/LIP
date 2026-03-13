# Unified WebSocket Notification Layer — Proposal v2

**Authors**: WLB 🦞 + GSD 🥷⚡  
**Date**: 2026-03-13  
**Status**: Draft v2 — Revisions based on Claude review  
**Repo**: MiaoDX/LIP  
**Commit**: pending (waiting for GSD push)

---

## Revision Summary (v2)

This version addresses Claude's feedback (2026-03-13):
1. ✅ Gateway ↔ jj-mailbox relationship clarified (complementary, not replacement)
2. ✅ Storage layer design added (jj-mailbox `shared/mappings/`)
3. ✅ Offline queue removed (use jj-mailbox inbox)
4. ✅ Security design added (mTLS, token rotation, encryption)
5. ✅ Timeline revised (P0 → 3-4 weeks, MVP first)
6. ✅ Claude 5 questions addressed in [Appendix A](#appendix-a-claude-5-questions)

---

## Problem
- Slack/Discord/Telegram/Feishu all have WebSocket/push APIs
- But each platform has different APIs, auth, message formats
- Agents need to handle N different integrations
- Current jj-mailbox works but requires polling (no push)

## Solution: Complementary Architecture (Gateway + jj-mailbox)

**Core insight**: Gateway and jj-mailbox are **complementary**, not competing.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Complementary Architecture                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Platform Layer]        [Gateway Layer]        [Storage Layer]             │
│                                                                             │
│  Slack      ┐                                                    ┌────────┐ │
│  Feishu     ├─→  WebSocket Gateway ──→ Write ──→ jj-mailbox     │ Agent  │ │
│  Discord    │   (Real-time push)       inbox/   inbox → inotify │ (WLB/  │ │
│  Telegram   ┘                               ↓      ↓    notify  │  GSD)  │ │
│                                          Agent reads ←─────────┤        │ │
│  jj-mailbox ──→ Gateway (on git push) ──→ Agent    └────────┘ │
│  (webhook)      (bridge)                                        │
│                                                                             │
│  Key: Gateway = Real-time notification layer (WebSocket)                    │
│       jj-mailbox = Persistent storage + audit (Git-based)                   │
│       Agent reads from jj-mailbox, not directly from Gateway                │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Why this works:**
- Gateway **down?** → Messages still in jj-mailbox, agent can poll
- jj-mailbox **down?** → Gateway buffers temporarily, writes when back
- Agent **offline?** → Messages accumulate in jj-mailbox inbox, read on reconnect
- **Audit trail**: All messages in Git history, not ephemeral WebSocket memory

### Message Flow

```
1. Platform message arrives → Gateway receives via WebSocket
2. Gateway writes to jj-mailbox inbox/ (JSON file)
3. Gateway notifies agent via inotify (or WebSocket push)
4. Agent reads from jj-mailbox inbox, processes
5. Agent moves message to processed/
6. Git commit + push → persistent history
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

## Security Design (WLB + GSD — 2026-03-13)

### 5.1 Threat Model & Assumptions

**Threats addressed:**
- Message tampering in transit (MITM)
- Unauthorized agent impersonation
- Platform token leakage
- Replay attacks on signed messages
- Unauthorized access to persistent storage

**Assumptions:**
- OpenClaw Gateway runs on a trusted host (or container with controlled network)
- jj-mailbox repo is on a private GitHub org with restricted access
- Platform APIs (Slack, Discord, Feishu, Telegram) are trusted endpoints
- Agent instances (WLB, GSD) are independently secured

### 5.2 Token Storage Strategy (Confirmed)

**Principle:** `.env` 本地存储，jj-mailbox 零敏感

| 存储位置 | 内容 | 敏感数据 | 同步方式 |
|----------|------|----------|----------|
| `.env` (本地) | API keys, tokens, secrets | ✅ 是 | ❌ 不同步 |
| `jj-mailbox` | Messages, mappings, configs | ❌ 否 | ✅ Git 同步 |

**Rationale:**
- Git 历史不可变，敏感数据一旦提交无法彻底清除
- `.env` 本地存储，各 Agent 独立管理自己的凭证
- jj-mailbox 只存储业务数据（消息、映射、配置），零敏感信息

**Implementation:**
```bash
# .env (本地，.gitignore)
GITHUB_TOKEN=ghp_xxx
SLACK_BOT_TOKEN=xoxb-xxx
FEISHU_APP_SECRET=xxx

# jj-mailbox (Git 同步，无敏感数据)
shared/mappings/threads.json      # 线程映射
shared/mappings/identities.json   # 身份映射
inbox/                            # 消息队列
```

### 5.3 Agent ↔ Gateway Authentication

**Phase P0 (Basic):**
- Token-based auth using OpenClaw secrets
- Shared secret for message signing

**Phase P2 (mTLS):**
- **Certificate Authority (CA):** Self-signed root CA per deployment
- **Agent Certificates:** Each agent gets unique client cert
- **Gateway Certificate:** Server cert signed by same CA
- **Rotation:** 90-day lifecycle, auto-regenerate 7 days before expiry

**Certificate Flow:**
```
1. Root CA generated once (stored in OpenClaw secrets)
2. Agent requests cert → Gateway issues signed cert
3. Agent stores cert + key in secure location
4. mTLS handshake: mutual verification
5. Revoked certs immediately blocked via CRL
```

### 5.4 Platform Token Management

**Secrets Structure (OpenClaw):**
```yaml
secrets:
  platforms:
    slack:
      bot_token: "!secret:slack-bot-token"
      app_token: "!secret:slack-app-token"
      rotate_every_days: 30
    feishu:
      app_id: "!secret:feishu-app-id"
      app_secret: "!secret:feishu-app-secret"
      rotate_every_days: 90
    discord:
      bot_token: "!secret:discord-bot-token"
      rotate_every_days: 30
    telegram:
      bot_token: "!secret:telegram-bot-token"
      rotate_every_days: 30
  agents:
    wlb:
      gateway_token: "!secret:wlb-gateway-token"
    gsd:
      gateway_token: "!secret:gsd-gateway-token"
```

**Rotation Strategy:**
- Platform tokens: 30 days (Slack/Discord/Telegram), 90 days (Feishu)
- Agent tokens: 30 days, auto-issued by Gateway
- Grace period: 24h overlap during rotation
- Immediate revocation on compromise

### 5.5 Transport Encryption
- **WSS (WebSocket Secure)** / TLS 1.3 for all connections
- Certificate pinning for platform connections
- No plaintext transmission of tokens or message content

### 5.6 Message Integrity & Anti-Replay

**Signing (Phase P2):**
- Agent → Gateway: signed with agent's private key
- Gateway → Agent: signed with Gateway's key
- Signature includes: message ID, timestamp, content hash

**Anti-Replay:**
- Unique message ID (UUID) + timestamp per message
- Gateway maintains seen-message cache (TTL: 1 hour)
- Duplicate IDs rejected

### 5.7 Audit Trail & Compliance

**jj-mailbox as Immutable Log:**
- All messages stored as files in git-backed repo
- Git history = tamper-proof audit trail
- Every commit signed (GPG or SSH) for provenance

**Audit Fields:**
```json
{
  "audit": {
    "processedBy": "gateway",
    "processedAt": "2026-03-13T02:04:01Z",
    "signatureVerified": true,
    "agentCertFingerprint": "sha256:abc123...",
    "platformVerified": true,
    "gatewayVersion": "v2.0.0"
  }
}
```

**Query Interface:**
- `jj-mailbox audit --since <date>` — All messages since date
- `jj-mailbox audit --agent <id>` — Messages for specific agent
- `jj-mailbox audit --platform <name>` — Platform-specific audit

### 5.8 Security Boundaries

| Boundary | Controls |
|----------|----------|
| Agent ↔ Gateway | mTLS (P2), signed messages, token auth (P0) |
| Gateway ↔ Platform | OAuth tokens, HTTPS, platform-specific auth |
| Gateway ↔ jj-mailbox | File I/O, git signing, repo ACL |
| jj-mailbox ↔ Agent | File I/O, read-only cursor, no cross-agent write |
| Host ↔ External | Firewall, rate limiting |

### 5.9 Incident Response

**Detection:**
- Failed mTLS handshakes → immediate alert
- Signature verification failures → alert + quarantine
- Token usage anomalies → alert

**Response:**
1. Revoke compromised token/cert immediately
2. Rotate all related secrets
3. Review audit log for breach scope
4. Notify affected agents
5. Re-issue credentials

**Recovery:**
- Automated token rotation on detection
- Audit log review for impact assessment
- Post-incident report stored in jj-mailbox `security/incidents/`

---

## Storage Layer Design (WLB Added — 2026-03-13)

### 6.1 Thread Mapping
**Problem**: Same conversation across platforms needs unified ID.

**Solution**: Store mapping in jj-mailbox `shared/mappings/threads.json`:
```json
{
  "thread-uuid-1234": {
    "created": "2026-03-13T02:00:00Z",
    "platforms": {
      "slack": { "channel": "C0AK1D7URS5", "thread_ts": "1773367000.123" },
      "feishu": { "chat_id": "oc_xxx", "root_id": "msg-yyy" }
    },
    "participants": ["slack:U0AHC0W121M", "feishu:ou_zzz"],
    "last_activity": "2026-03-13T02:15:00Z"
  }
}
```

### 6.2 Identity Mapping
**Solution**: Store in `shared/mappings/identities.json`:
```json
{
  "identity:miaodx": {
    "platforms": {
      "slack": "U0AHC0W121M",
      "feishu": "ou_xxx",
      "discord": "123456789"
    },
    "linked": "2026-03-12"
  }
}
```

### 6.3 Versioning
- All mappings stored in jj-mailbox `shared/mappings/`
- Git version history = audit trail for mapping changes
- Conflict resolution: last-write-wins (v1), CRDT (future)

### 6.4 Offline Queue
**Revised**: Use jj-mailbox inbox as the offline queue. No custom queue needed.

- Gateway writes to `inbox/{agent}/new/` (same as current jj-mailbox protocol)
- Agent reads via inotify or polling
- TTL: Files in `new/` older than 24h → move to `stale/` for review
- On reconnect: Agent processes all files in `new/`

---

## Implementation Phases (Revised)

| Phase | Scope | Timeline | Deliverable |
|-------|-------|----------|-------------|
| **P0** | Slack adapter + jj-mailbox inbox + basic token auth | 1-2 weeks | Minimal viable loop: Slack → jj-mailbox → Agent |
| **P1** | Feishu adapter + thread mapping + message ordering | 2-3 weeks | Cross-platform thread support |
| **P2** | mTLS + full security + token rotation automation | 2-3 weeks | Production-ready security |
| **P3** | Discord + Telegram + documentation | 2-3 weeks | Full platform coverage |

**Total**: ~7-11 weeks for full implementation

**Security Phasing:**
- P0: Basic token auth (OpenClaw secrets), WSS transport
- P1: Message signing with shared secret
- P2: Full mTLS, certificate management, automated rotation

---

## Appendix A: Claude 5 Questions

| # | Question | Answer | Status |
|---|----------|--------|--------|
| 1 | Gateway vs jj-mailbox relationship? | **Complementary** — Gateway real-time, jj-mailbox persistence | ✅ Addressed |
| 2 | Cross-platform thread ID — how? | `shared/mappings/threads.json` + Git versioning | ✅ Addressed |
| 3 | Offline queue duplicates jj-mailbox? | Yes, use jj-mailbox inbox directly, no custom queue | ✅ Addressed |
| 4 | Missing security design? | mTLS, token vault, rotation, WSS, threat model, audit trail | ✅ Addressed |
| 5 | Timeline too optimistic? | Revised P0 → 1-2 weeks (MVP), full security in P2 | ✅ Addressed |
| 6 | Token storage strategy? | `.env` local, jj-mailbox zero-sensitive | ✅ Addressed |

---

## Appendix B: vs Current Approach

| Aspect | Current (Slack+GitHub) | After Gateway |
|--------|----------------------|---------------|
| Real-time | Slack push ✅ | Gateway push ✅ |
| Persistence | GitHub heartbeat | jj-mailbox inbox ✅ |
| Cross-platform | Slack channels only | Any platform ✅ |
| Audit | Git log | Git log (enhanced) |
| Agent polling | Cron-based | Inotify push ✅ |
| Complexity | Low | Medium (worth it) |

---

## Next Steps

1. **Review this v2** — WLB + GSD align
2. **MiaoDX approval** — Greenlight P0
3. **P0 prototype** — Slack adapter → jj-mailbox → inotify
4. **Measure** — Latency vs current polling

---
*Drafted by GSD, 2026-03-12*  
*Revised v2 by GSD + WLB, 2026-03-13*  
*Addresses Claude review feedback + detailed security design + token storage strategy*
