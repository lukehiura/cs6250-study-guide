---
tags:
  - lesson-08
  - sdn
  - openflow
  - onos
  - p4
  - sdx
  - quick-study
search:
  boost: 2
---

# Lesson 8: Quick Study Guide — SDN (Part 2)

Focused exam review for SDN implementation and systems details. Start with the [Plain-language guide](plain-language.md) if needed, then use [Lesson 8 full guide](sdn-2.md), and test with the [quiz](quiz.md).

---

## 1. Big picture

- Part 2 focuses on SDN system mechanics: OpenFlow pipeline, controller internals, distributed control, ONOS, P4, and SDX.
- Central tradeoff: controller simplicity vs distributed scalability and fault tolerance.
- OpenFlow is the key southbound protocol abstraction in this lesson's architecture.
- P4 extends programmability into the data plane itself.

!!! tip "Memory aid"
    **Pipeline, control state, and programmability** are the three SDN Part 2 pillars.

---

## 2. SDN landscape perspectives

| Perspective | Core question |
|------------|---------------|
| **Plane-based** | How are control and data roles separated? |
| **Layer-based** | How do infrastructure, control, and apps interact? |
| **System design** | How does the controller scale and stay correct/fault tolerant? |

---

## 3. OpenFlow multi-table pipeline

| Stage | Purpose |
|------|---------|
| Table 0 entry | Initial classification |
| GoTo action | Hand packet to next table |
| Action set accumulation | Compose final packet operations |
| Final execution | Apply forwarding/modify actions |

OpenFlow message information classes:

- events (packet-in, link changes, flow expiry)
- statistics (flow/table/port counters)
- packet payload snippets

---

## 4. Controller functions

| Function | Why it matters |
|----------|----------------|
| Topology discovery | Needed for path computation |
| Stats aggregation | Inputs to TE and monitoring |
| Notification/event handling | React to link/flow changes |
| Rule management | Install/update/delete flow entries |
| Security policy handling | Enforce access/segmentation |

---

## 5. Centralized vs distributed controllers

| Architecture | Benefits | Risks/Costs |
|-------------|----------|-------------|
| **Centralized** | Simpler implementation and reasoning | SPOF risk, scaling bottlenecks |
| **Distributed** | Better resilience and scale | Consistency and coordination complexity |

!!! warning "Exam point"
    "Logically centralized" does **not** require one physical controller node.

---

## 6. ONOS essentials

| ONOS element | Role |
|-------------|------|
| Global network view | Shared state abstraction |
| Distributed storage/replication | Durable, shared control data |
| Consensus (e.g., Raft) | Leader election and consistent updates |
| Mastership reassignment | Controller failover for switches |

---

## 7. P4 essentials

**P4 goals:**

1. Protocol independence
2. Target independence
3. Reconfigurability

**P4 model operations:**

- **Configure:** define parser + match-action pipeline
- **Populate:** fill tables at runtime from control plane

---

## 8. SDN and SDX applications

| Domain | Example |
|-------|---------|
| Traffic engineering | WAN optimization (e.g., B4-like use cases) |
| Security/monitoring | Dynamic rule insertion and traffic steering |
| Data centers | VM mobility, multi-tenant isolation |
| IXPs via SDX | Application-aware peering and inbound TE |

---

## 9. High-yield exam Q&A

### Why use an OpenFlow table pipeline?

To support modular, staged packet processing instead of one monolithic rule stage.

### Three OpenFlow information sources?

Event messages, flow/port/table statistics, and packet payload from packet-in events.

### Centralized vs distributed control key difference?

Distributed designs improve scale/availability but require stronger state coordination.

### When prefer distributed controller deployment?

Large, latency-sensitive, or high-availability production networks.

### ONOS fault tolerance mechanism in short?

Replicated distributed state, consensus, and automatic failover/mastership reassignment.

### What is P4?

A language for specifying packet parsing and match-action data-plane behavior.

### P4 configure vs populate?

Configure defines pipeline structure; populate installs runtime entries.

### What SDN limitation of BGP does SDX address?

Fine-grained policy control beyond destination-prefix-only decisions.

---

## 10. Quick memory sheet

| Topic | Memory aid |
|------|-------------|
| SDN perspectives | Plane, layer, system |
| OpenFlow pipeline | Match -> optional GoTo -> final action set |
| Southbound data | Events + stats + packet-in payload |
| Distributed control | Scale + resilience, but consistency cost |
| ONOS | Shared view + replicated state + failover |
| P4 goals | Protocol-, target-independent, reconfigurable |
| P4 operations | Configure structure, populate entries |
| SDX | SDN policy at IXP, complements BGP |
