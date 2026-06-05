---
tags:
  - lesson-08
  - sdn
  - openflow
  - onos
  - p4
  - sdx
  - quiz
search:
  boost: 1.5
quiz:
  auto_number: true
  shuffle_answers: true
  disable_after_submit: false
---

# Lesson 8: Interactive Quiz

OpenFlow pipelines, controller architectures, ONOS, P4, and SDX. Study with the [Plain-language guide](plain-language.md), [Quick Study Guide](quick-study-guide.md), and [full guide](sdn-2.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## SDN architecture perspectives

<quiz>
The **layer-based perspective** of SDN emphasizes:
- [x] Infrastructure layer, control layer, and application layer interactions
- [ ] Only physical cable layout and optics
- [ ] TCP congestion algorithms only
- [ ] DNS hierarchy design

Layer perspective explains responsibilities across SDN stack layers.
</quiz>

<quiz>
The **system design perspective** primarily focuses on concerns like [[consistency]], scalability, and fault tolerance.
---
Production SDN controllers are distributed systems, not just APIs.
</quiz>

---

## OpenFlow and southbound behavior

<quiz>
In an OpenFlow switch pipeline, packet processing usually starts at:
- [x] Table 0
- [ ] The final table only
- [ ] A random table chosen by source MAC
- [ ] The controller's northbound API

Table 0 is the standard entry point for packet matching.
</quiz>

<quiz>
Which action enables multi-stage OpenFlow processing?
- [ ] ARP reply
- [x] GoTo table action
- [ ] TCP retransmit action
- [ ] DNS recursion action

GoTo moves processing to another table in the pipeline.
</quiz>

<quiz>
Which is an OpenFlow information source for the controller?
- [x] Flow and port statistics
- [ ] Browser cookie cache
- [ ] Local filesystem inode table
- [ ] Process scheduler quantum logs

OpenFlow provides counters and event telemetry for control decisions.
</quiz>

---

## Controller architecture and ONOS

<quiz>
A key benefit of distributed SDN controllers over a single controller is:
- [x] Higher fault tolerance and better scalability
- [ ] Removal of all state synchronization requirements
- [ ] No need for network topology knowledge
- [ ] Guaranteed zero latency to every switch

Distribution helps resilience but introduces consistency coordination.
</quiz>

<quiz>
In ONOS-style systems, consensus mechanisms such as Raft support:
- [x] Leadership coordination and consistent critical updates
- [ ] Packet payload encryption in transit only
- [ ] BGP route aggregation only
- [ ] Ethernet frame padding

Consensus helps avoid conflicting control decisions across nodes.
</quiz>

<quiz>
Automatic switch **mastership reassignment** after a controller failure is a mechanism for [[fault tolerance]].
---
Failover keeps control service available when one instance fails.
</quiz>

---

## P4 and SDX

<quiz>
What is a primary distinction of P4 compared with fixed-function OpenFlow matching?
- [x] P4 can define parser behavior and match-action pipeline structure
- [ ] P4 removes all need for control plane software
- [ ] P4 only works on one ASIC vendor
- [ ] P4 replaces BGP globally

P4 expands data-plane programmability beyond fixed match sets.
</quiz>

<quiz>
P4's **populate** phase refers to:
- [x] Installing runtime table entries into an already configured pipeline
- [ ] Writing physical transceiver firmware
- [ ] Building DNS records for hosts
- [ ] Compiling Linux kernel modules

Configure defines structure; populate fills entries dynamically.
</quiz>

<quiz>
An SDX primarily extends IXP behavior by enabling:
- [x] Fine-grained policy and traffic steering beyond destination-prefix-only routing
- [ ] Removal of all peering policies
- [ ] Replacement of all BGP functions
- [ ] Mandatory centralization of the whole Internet

SDX complements BGP with policy-aware control at exchange points.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Plain-language guide](plain-language.md)
    - [Quick Study Guide](quick-study-guide.md)
    - [Lesson 8 full guide](sdn-2.md)
    - [Lesson 9 (Internet Security)](../lesson-09/security.md)
