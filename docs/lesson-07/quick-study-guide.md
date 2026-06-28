---
tags:
  - lesson-07
  - sdn
  - control-plane
  - openflow
  - quick-study
search:
  boost: 2
---

# Lesson 7: Quick Study Guide — SDN (Part 1)

Fast review for SDN fundamentals. If concepts feel new, start with the [Plain-language guide](plain-language.md). Full detail is in [Lesson 7](sdn-1.md). Practice with the [quiz](quiz.md).

---

## 1. Big picture

- **SDN** decouples **control plane** (routing/policy) from **data plane** (forwarding).
- A **logically centralized controller** computes rules; switches execute at line rate.
- Goal: simpler management, faster innovation, open programmability.

!!! tip "Memory aid"
    **Centralize decisions, distribute execution.**

---

## 2. Why SDN emerged

| Root cause | Detail |
|------------|--------|
| **Equipment diversity** | Routers, firewalls, NATs, load balancers, IDSs — many protocols and CLIs |
| **Proprietary gear** | Vendor-specific, closed software; inconsistent interfaces |
| **Operational pain** | Slow innovation, high cost, per-box configuration errors |

---

## 3. Historical phases (exam table)

| Phase | Period | Key idea | Lasting contribution |
|-------|--------|----------|------------------------|
| **Active networks** | mid-1990s – early 2000s | Programmable nodes; capsule vs programmable-router models | Data-plane programmability vision; virtualization; middlebox orchestration idea |
| **Control/data separation** | ~2001–2007 | Open interface + logical centralization (RCP, 4D) | Network-wide visibility; distributed state management |
| **OpenFlow + NOS** | ~2007–2010 | Standard southbound API on existing switches | Flow tables; network OS; deployable testbeds |

**Active networks failed because:** too ambitious (Java on routers), weak security/performance focus, no short-term killer app.

**OpenFlow rule:** match pattern + actions + counters + **priority** → highest match wins.

---

## 4. Control plane vs data plane

| Aspect | Control plane | Data plane |
|--------|---------------|------------|
| Functions | **Routing**, policy, table computation | **Forwarding** (L2/L3), drop, duplicate |
| Timescale | Seconds | Nanoseconds (often hardware) |
| SDN location | Controller + apps | SDN-controlled switches |

!!! warning "Exam point"
    **Routing = control plane.** **Forwarding = data plane.** (Video errata: audio once said routing is data plane — wrong.)

---

## 5. Why separate planes?

1. **Independent evolution** — hardware vs software upgrade cycles decouple
2. **High-level control software** — easier debug and verification
3. **Global network view** — consistent TE, ACL, security policy

**Application domains:** data centers (VM scale), routing (beyond BGP constraints), enterprise (DDoS drop points), research (slicing).

---

## 6. Traditional vs SDN coupling

| | Traditional | SDN |
|---|-------------|-----|
| Control location | Inside each router | Remote controller(s) |
| Forwarding table | Locally computed via distributed protocols | Controller computes, **pushes** rules |
| Network view | Per-router local view | Controller global view (logical) |

---

## 7. SDN architecture components

| Component | Plane | Job |
|-----------|-------|-----|
| **SDN-controlled switches** | Data | Execute flow rules |
| **SDN controller (NOS)** | Control | State, southbound/northbound APIs |
| **Network-control apps** | Application | Routing, ACL, LB, monitoring |

![SDN three-tier architecture](../images/sdn-architecture-components.png){ width="500" }

---

## 8. Four defining SDN features

1. **Flow-based forwarding** (multi-field match; OpenFlow ~11 fields historically)
2. **Control/data plane separation**
3. **Network control functions** (controller maintains state for apps)
4. **Programmable network** (apps implement policy)

---

## 9. Controller layers and APIs

| Layer (bottom → top) | Role | Example |
|----------------------|------|---------|
| **Communication** | Southbound to devices | OpenFlow |
| **State management** | Topology, hosts, flow tables | Internal datastore |
| **Application interface** | Northbound to apps | REST |

| API | Direction |
|-----|-----------|
| **Southbound** | Controller → switches |
| **Northbound** | Controller → applications |

Modern controllers (**OpenDaylight**, **ONOS**) are **distributed** internally despite logical centralization.

---

## 10. OpenDaylight essentials (optional)

- **MD-SAL** — model-driven abstraction between plugins and services
- **Config datastore** — intended config (CRUD via RESTCONF)
- **Operational datastore** — live network state (GET)
- Lab: Karaf + `odl-l2switch` + Mininet + DLUX at `:8181`

---

## 11. High-yield exam Q&A

### What spurred SDN?

Equipment diversity + proprietary interfaces → complexity, slow innovation, high cost.

### Three history phases?

Active networks → control/data separation → OpenFlow + NOS.

### Capsule vs programmable-router model?

Capsule = code **in-band** in packets; programmable router = code installed **out-of-band**.

### Why separate control and data?

Independent evolution, software-driven control, global policy view, easier debugging.

### Routing vs forwarding?

Routing **computes** tables (control); forwarding **uses** tables per packet (data).

### Traditional vs SDN?

Traditional = coupled per device; SDN = decoupled, controller pushes rules.

### Three SDN components?

Switches, controller, network-control applications.

### Four defining features?

Flow-based forwarding, plane separation, network control functions, programmable network.

### Three controller layers?

Southbound communication, state management, northbound app interface.

### Northbound vs southbound?

Southbound → devices; northbound → apps.

---

## 12. Quick memory sheet

| Topic | Memory aid |
|-------|------------|
| SDN motivation | Diverse boxes + vendor lock-in |
| History order | Active → Separate → OpenFlow |
| OpenFlow switch | Flow table: match, action, counter, priority |
| Routing vs forwarding | Compute vs execute |
| SDN coupling | Brain off-box, muscles on switch |
| Southbound | Down to switches (OpenFlow) |
| Northbound | Up to apps (REST) |
| 4th SDN feature | Programmable **apps**, not just one controller |
| ODL datastores | Config = intent; Operational = reality |
