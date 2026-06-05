---
tags:
  - lesson-07
  - sdn
  - control-plane
  - openflow
  - quiz
search:
  boost: 1.5
quiz:
  auto_number: true
  shuffle_answers: true
  disable_after_submit: false
---

# Lesson 7: Interactive Quiz

SDN history, architecture, and control/data-plane separation. Review the [Plain-language guide](plain-language.md), [Quick Study Guide](quick-study-guide.md), and [full guide](sdn-1.md) as needed.

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## SDN motivation and history

<quiz>
A major motivation for SDN was:
- [x] Reducing per-device configuration complexity through centralized control logic
- [ ] Replacing all packet forwarding hardware with software only
- [ ] Removing the need for routing decisions
- [ ] Eliminating all network failures

SDN addresses operational complexity by centralizing decision logic.
</quiz>

<quiz>
The three historical phases commonly discussed for SDN include [[active networks]], control/data plane separation research, and the OpenFlow/NOS era.
---
Active Networks introduced programmability ideas before production SDN matured.
</quiz>

---

## Control plane vs data plane

<quiz>
Which task belongs to the **data plane**?
- [x] Per-packet forwarding based on installed rules
- [ ] Global route computation across all devices
- [ ] Long-term policy planning with network-wide abstractions
- [ ] Controller application development

The data plane executes forwarding at line rate.
</quiz>

<quiz>
Which statement about SDN coupling is true?
- [x] SDN decouples control from forwarding and centralizes control logically
- [ ] SDN tightly couples control and forwarding in each switch
- [ ] SDN removes the forwarding table concept
- [ ] SDN requires every switch to run BGP independently

Traditional networks are tightly coupled; SDN decouples roles.
</quiz>

<quiz>
Routing and forwarding relationship: routing [[computes]] forwarding state, while forwarding consumes it.
---
This control/data split is foundational across Lessons 3, 4, and 7.
</quiz>

---

## SDN architecture and interfaces

<quiz>
In SDN architecture, a controller's **southbound interface** primarily connects to:
- [x] Network devices (switches/routers)
- [ ] End-user browser applications
- [ ] DNS recursive resolvers only
- [ ] External grading systems

Southbound protocols carry commands/events between controller and devices.
</quiz>

<quiz>
Which is a defining feature of SDN?
- [x] Flow-based forwarding with programmable control
- [ ] Mandatory single physical controller
- [ ] No use of forwarding tables
- [ ] Eliminating all distributed systems concerns

SDN is logically centralized, but physical deployment can be distributed.
</quiz>

<quiz>
The interface from controller to network apps is called the [[northbound]] interface.
---
Northbound APIs expose network state and policy controls to applications.
</quiz>

---

## SDN components and responsibilities

<quiz>
Which component usually maintains a global network view in SDN?
- [x] Controller / Network Operating System
- [ ] Individual host NIC
- [ ] Output queue in a single switch
- [ ] DNS authoritative server

The controller/NOS aggregates topology and flow state for applications.
</quiz>

<quiz>
Network-control applications in SDN commonly implement:
- [x] Routing policy, security policy, and traffic engineering logic
- [ ] Physical layer signal modulation only
- [ ] IP fragmentation in NIC hardware only
- [ ] Packet serialization algorithms for Ethernet standards

Applications run above the controller and express policy intent.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Plain-language guide](plain-language.md)
    - [Quick Study Guide](quick-study-guide.md)
    - [Lesson 7 full guide](sdn-1.md)
    - [Lesson 8 (SDN Part 2)](../lesson-08/sdn-2.md)
