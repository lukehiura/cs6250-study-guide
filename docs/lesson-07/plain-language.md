---
tags:
  - lesson-07
  - sdn
  - control-plane
  - openflow
  - plain-language
search:
  boost: 2
---

# Lesson 7: SDN (Part 1) — Plain-Language Guide

This is the easy-to-digest version of [Lesson 7](sdn-1.md). For exam-focused compression, use the **[Quick Study Guide](quick-study-guide.md)** and then the **[Quiz](quiz.md)**.

!!! tip "Exam prep"
    Use this sequence: **[Full guide](sdn-1.md)** -> **[Quick Study Guide](quick-study-guide.md)** -> **[Quiz](quiz.md)**. Router design context is in [Lesson 6](../lesson-06/router-design-2.md).

---

## Summary

**Software Defined Networking (SDN)** separates a network's brain from its muscles. The **control plane** (decision logic) moves to a central controller, while switches mostly do fast forwarding in the **data plane**.

This makes networks easier to program, debug, and manage at scale. Instead of configuring each router one by one, operators can apply policy from one logical control point.

---

## The one-sentence version

SDN turns networking from "configure every box separately" into "write software once and push consistent rules to many switches."

---

## Why SDN happened

Traditional networking had pain points:

- control and forwarding tightly coupled in each device
- vendor-specific features and slow innovation
- difficult network-wide policy consistency
- error-prone per-device manual configuration

SDN addressed these by separating roles and exposing programmable interfaces.

---

## Control plane vs data plane (plain version)

| Plane | Job | Speed |
|------|-----|-------|
| **Control plane** | Computes paths and policies | Slower timescale |
| **Data plane** | Forwards packets using installed rules | Per-packet line rate |

**Routing** belongs to the control plane.  
**Forwarding** belongs to the data plane.

This is the same distinction from routing lessons, now made explicit in architecture.

---

## The 3-part SDN story

### 1) Active Networks (1990s)

Early idea: make the network programmable. Too early for broad deployment, but conceptually important.

### 2) Control/Data separation (2000s)

Research showed benefits of logically centralized route computation.

### 3) OpenFlow + Network OS (2008+)

A practical control API emerged, and controllers became "network operating systems."

---

## SDN architecture components

| Component | Plain-language role |
|----------|---------------------|
| **Switches / network elements** | Execute forwarding rules |
| **SDN controller (NOS)** | Keeps global view, computes and installs rules |
| **Network apps** | Implement routing, load balancing, ACL/security policies |

**Jargon:** A **Network Operating System (NOS)** is controller software that abstracts devices and exposes APIs to apps.

---

## Four defining SDN features

1. **Flow-based forwarding** (rules can match multiple fields)
2. **Control/data separation**
3. **Programmability via software**
4. **Logically centralized control**

---

## Northbound and southbound in one table

| Interface | Connects | Purpose |
|-----------|----------|---------|
| **Southbound** | Controller <-> switches | Install rules, collect events/stats |
| **Northbound** | Controller <-> apps | Let apps read state and express policy |

**Memory trick:** Southbound talks **down** to devices; northbound talks **up** to apps.

---

## Why this matters in practice

- Data centers: easier traffic engineering at scale
- Enterprises: consistent security policy across sites
- Research networks: faster experimentation without replacing hardware

---

## High-yield plain-language Q&A

### Why separate control from data?

To make control logic easier to update and keep forwarding hardware focused on speed.

### Is SDN always one physical controller?

No. It is often **logically** centralized, but can be physically distributed for reliability.

### What changed most with OpenFlow-era SDN?

A standard way for controllers to program switch forwarding state.

---

## The whole lesson on one napkin

```
Traditional model: each router = control + forwarding together
SDN model: controller computes policy, switches execute rules

Benefits: programmability, consistency, simpler management

Core pieces:
  apps <-> controller (northbound)
  controller <-> switches (southbound)

Control plane = routing/policy decisions
Data plane = per-packet forwarding
```

---

## Where to go next

| You want... | Go here |
|-------------|---------|
| Full explanation of Part 1 | [Lesson 7 full guide](sdn-1.md) |
| Exam-first summary | [Quick Study Guide](quick-study-guide.md) |
| Practice questions | [Lesson 7 Quiz](quiz.md) |
| SDN Part 2 (OpenFlow pipeline, ONOS, P4, SDX) | [Lesson 8](../lesson-08/sdn-2.md) |
