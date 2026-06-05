---
tags:
  - lesson-08
  - sdn
  - openflow
  - onos
  - p4
  - sdx
  - plain-language
search:
  boost: 2
---

# Lesson 8: SDN (Part 2) — Plain-Language Guide

This is the simplified version of [Lesson 8](sdn-2.md). For compressed exam prep, use the **[Quick Study Guide](quick-study-guide.md)** and then the **[Quiz](quiz.md)**.

!!! tip "Exam prep"
    Follow this path: **[Full guide](sdn-2.md)** -> **[Quick Study Guide](quick-study-guide.md)** -> **[Quiz](quiz.md)**. If Part 1 feels fuzzy, review [Lesson 7](../lesson-07/sdn-1.md).

---

## Summary

Part 2 moves from "what SDN is" to "how SDN is built in practice." It covers OpenFlow pipelines, controller design choices, ONOS fault tolerance, P4 programmability, and SDX at exchange points.

The key idea is that SDN is not just an API. It is a full system with architecture tradeoffs: performance, consistency, and reliability.

---

## The one-sentence version

SDN Part 2 is about turning centralized control ideas into real systems that can scale, survive failures, and support flexible packet processing.

---

## Three ways to view SDN

| Perspective | What it emphasizes |
|------------|--------------------|
| **Plane-based** | Control plane vs data plane separation |
| **Layer-based** | Infrastructure, control, and application layers |
| **System design** | Scalability, consistency, fault tolerance, security |

---

## OpenFlow pipeline in plain words

A switch can have multiple flow tables:

1. packet enters Table 0
2. it matches rule(s)
3. action can forward, modify, or jump to another table
4. action set is applied

This supports staged logic, like ACL first, then routing, then QoS marking.

**Jargon:** A **flow table** stores match-action entries used by the switch data plane.

---

## Southbound data the controller gets

OpenFlow gives the controller:

- event messages (link changes, packet-in)
- statistics (per-flow, per-port counters)
- packet payload snippets for unmatched traffic

This is how the controller keeps an updated view.

---

## Controller architecture: centralized vs distributed

| Model | Strength | Risk |
|------|----------|------|
| **Centralized** | Simpler control logic | Single-point bottleneck/failure |
| **Distributed** | Scale and fault tolerance | More coordination complexity |

**Key point:** "Logically centralized" does not mean physically one machine.

---

## ONOS in plain language

**ONOS (Open Networking Operating System)** is a distributed SDN controller platform.

It uses:

- replicated state and distributed storage
- consensus (for coordination/leadership)
- mastership reassignment when a controller node fails

Net effect: the control platform can continue after node failures.

---

## P4: programmable data plane

**P4 (Programming Protocol-independent Packet Processors)** is a language for defining packet parsing and match-action pipelines.

Three core goals:

1. protocol independence
2. target independence
3. reconfigurability

Two operations:

- **configure** pipeline structure
- **populate** tables at runtime

---

## SDX: SDN at exchange points

An **SDX (Software Defined Exchange)** applies SDN ideas to Internet Exchange Points (IXPs).

It enables:

- application-specific peering
- inbound traffic engineering
- policy control beyond destination-prefix-only BGP behavior

SDX works with BGP, not as a full replacement.

---

## High-yield plain-language Q&A

### Why use multiple OpenFlow tables instead of one huge table?

Multi-stage processing keeps policy modular and easier to reason about.

### When is distributed control preferred?

Large networks, high availability needs, and geographically spread deployments.

### What is P4's main value over fixed-function forwarding?

It lets operators define new parsing and processing logic without replacing hardware.

### Why does SDX matter?

It offers finer policy control at peering points where classic BGP is limited.

---

## The whole lesson on one napkin

```
Part 2 = practical SDN systems

OpenFlow: packet goes through table pipeline
Controller gets events + stats + packet-in data

Centralized controller: simpler
Distributed controller: scalable + fault tolerant

ONOS: distributed control platform with replicated state

P4: program parser + match/action pipeline
  Configure (structure) + Populate (rules)

SDX: SDN policies at IXPs, complements BGP
```

---

## Where to go next

| You want... | Go here |
|-------------|---------|
| Full Part 2 details | [Lesson 8 full guide](sdn-2.md) |
| Exam compression | [Quick Study Guide](quick-study-guide.md) |
| Practice questions | [Lesson 8 Quiz](quiz.md) |
| Part 1 SDN foundations | [Lesson 7](../lesson-07/sdn-1.md) |
| Internet security and attacks | [Lesson 9](../lesson-09/security.md) |
