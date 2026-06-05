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

- **SDN (Software Defined Networking)** decouples control and forwarding.
- A logically centralized controller computes network policy and installs rules.
- Switches primarily execute fast forwarding actions.
- SDN improved network programmability, consistency, and innovation speed.

!!! tip "Memory aid"
    **Centralize decisions, distribute execution.**

---

## 2. Why SDN emerged

| Traditional pain point | SDN response |
|------------------------|--------------|
| Box-by-box management complexity | Centralized policy logic |
| Limited programmability | Controller APIs + apps |
| Slow vendor-driven evolution | Open interfaces (e.g., OpenFlow) |
| Inconsistent network policy | Global state and coordinated control |

---

## 3. Historical phases

| Phase | Period | Contribution |
|------|--------|--------------|
| **Active Networks** | mid-1990s | Programmable-network vision |
| **Control/data separation research** | early-mid 2000s | Logical centralization ideas (RCP, 4D) |
| **OpenFlow + NOS** | 2008+ | Practical standard API and controller platforms |

---

## 4. Control plane vs data plane

| Aspect | Control plane | Data plane |
|-------|---------------|------------|
| Function | Routing/policy decisions | Packet forwarding |
| Timescale | Slower | Per-packet line rate |
| Typical software location | Controller/NOS | Switch hardware pipeline |

!!! warning "Exam point"
    Do not conflate **routing** (control plane) with **forwarding** (data plane).

---

## 5. SDN architecture building blocks

| Component | Responsibility |
|----------|----------------|
| **SDN switches** | Match packets and apply installed flow rules |
| **Controller / NOS** | Maintain global network view; push rules |
| **Control applications** | Implement policies (TE, ACL, monitoring, load balancing) |

---

## 6. Defining features of SDN

1. Flow-based forwarding
2. Separation of control and data planes
3. Network programmability through software
4. Logically centralized control

---

## 7. Controller layering and interfaces

| Layer | Core role |
|------|-----------|
| **Southbound communication layer** | Device communication, rule installation, event handling |
| **State management layer** | Topology, host/flow/link state abstraction |
| **Northbound application layer** | API to applications for policy and intent |

---

## 8. Application domains

- **Data centers:** VM mobility, traffic engineering, tenant isolation
- **Enterprise:** consistent ACL and segmentation policy
- **Research networks:** rapid experimentation
- **Routing optimization:** network-wide traffic decisions

---

## 9. High-yield exam Q&A

### What spurred SDN development?

Operational complexity, closed vendor control, weak programmability, and inconsistent network-wide policy in traditional distributed control.

### Three SDN history phases?

Active Networks, separation research (RCP/4D), and OpenFlow + controller/NOS era.

### Why separate control and data planes?

Independent evolution, global policy view, easier debugging, and software-driven automation.

### Relationship between routing and forwarding?

Routing computes tables/policies (control); forwarding uses those rules packet-by-packet (data).

### Traditional vs SDN coupling difference?

Traditional devices integrate control + forwarding locally; SDN externalizes control to a controller.

### Three main SDN components?

Network elements, controller/NOS, and network-control applications.

### Four defining SDN features?

Flow-based forwarding, decoupling, programmability, logical centralization.

### Northbound vs southbound in one line?

Northbound serves apps; southbound programs devices.

---

## 10. Quick memory sheet

| Topic | Memory aid |
|------|-------------|
| SDN core idea | Separate brain from forwarding muscle |
| Routing vs forwarding | Compute vs execute |
| OpenFlow impact | Standard control-to-switch API |
| SDN layers | Infrastructure, control, application |
| Southbound | Controller down to switches |
| Northbound | Controller up to apps |
| Logical centralization | One policy view, many devices |
