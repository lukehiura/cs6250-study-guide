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

## SDN history and motivation

<quiz>
Which pair best describes why SDN emerged?
- [x] Diverse middleboxes with incompatible interfaces and proprietary vendor software
- [ ] Uniform open-source routers with identical CLIs everywhere
- [ ] Elimination of all routing protocols from the Internet
- [ ] Replacement of IP with ATM in enterprise networks

SDN targets operational complexity from heterogeneous, closed networking gear.
</quiz>

<quiz>
In the **active networks** era, the **capsule model** carried executable code [[in-band]] inside data packets.
---
The programmable-router model instead installed code out-of-band on nodes.
</quiz>

<quiz>
Which phase introduced a practical standard API for programming switch forwarding tables on existing hardware?
- [x] OpenFlow API and network operating systems (~2007–2010)
- [ ] Active networks (mid-1990s)
- [ ] Control and data plane separation only (~2001–2007)
- [ ] BGP policy engineering (1990s)

OpenFlow enabled deployable SDN testbeds with firmware upgrades on supported switches.
</quiz>

---

## SDN architecture features

<quiz>
**Flow-based forwarding** in SDN means forwarding rules can match on:
- [x] Multiple header fields across layers (not only destination IP)
- [ ] Only the destination IP address
- [ ] Only physical port numbers with no header matching
- [ ] Application payload contents only

OpenFlow historically allowed matching on many header fields.
</quiz>

<quiz>
Which is NOT one of the four defining SDN architecture features from the course?
- [ ] Flow-based forwarding
- [ ] Separation of control and data planes
- [x] Mandatory use of BGP on every SDN switch
- [ ] A programmable network controlled by applications

SDN switches execute controller-installed rules; BGP is not a defining SDN feature.
</quiz>

<quiz>
In SDN, **routing** belongs to the [[control]] plane, while per-packet **forwarding** belongs to the [[data]] plane.
---
This matches the forwarding vs routing distinction from routing lessons, now applied to SDN architecture.
</quiz>

---

## Module 7 exam questions

Canvas Module 7 quiz — SDN motivation, control/data separation, architecture, and interfaces. See the [full guide](sdn-1.md).

### SDN motivation and separation

<quiz>
A few of the main reasons that SDN arose are: a diversity of different network equipment (e.g., routers, switches, firewalls, etc.) using different protocols that made managing the network difficult, and second a lack of a central platform to control network equipment.
- [x] True
- [ ] False

Heterogeneous **middleboxes** with incompatible interfaces plus **proprietary** vendor software made centralized management hard — core SDN motivations.
</quiz>

<quiz>
With SDNs the control plane and data plane have independent evolution and development.
- [x] True
- [ ] False

**Independent evolution** is an explicit benefit of separation: forwarding ASICs optimize for speed while control software can change without hardware upgrades — and vice versa.
</quiz>

<quiz>
In the SDN approach, the SDN controller is physically located at each router that is present in a network.
- [ ] True
- [x] False

The controller is **logically centralized** — often on separate commodity servers, not embedded in every router.
</quiz>

<quiz>
By separating the control plane and the data plane, controlling the router's behavior became easier using higher order programs. For example, it is easier to update the router's state or control the path selection.
- [x] True
- [ ] False

Control runs as **high-level software** on a controller, making debugging, verification, automation, and path selection easier than per-box configuration.
</quiz>

<quiz>
In the SDN approach, ISPs or other third parties can take up the responsibility for computing and distributing the router's forwarding tables.
- [x] True
- [ ] False

Phase-2 SDN research (e.g., **RCP**) showed that a centralized platform — run by an ISP or third party — can hold network-wide routing state and **push** forwarding rules to devices.
</quiz>

<quiz>
Having the software implementations for SDNs controllers increasingly open and publicly available makes it hard to control, since any person could modify the software easily.
- [ ] True
- [x] False

Open controller platforms (**OpenDaylight**, **ONOS**) are presented as an **advantage** — faster innovation and programmability — not as a barrier to network control.
</quiz>

### SDN components and forwarding

<quiz>
In SDN networks, the SDN controller is responsible for the forwarding of traffic.
- [ ] True
- [x] False

**Switches** forward traffic at line rate on the **data plane**. The controller **computes and installs** rules; it does not forward packets itself.
</quiz>

<quiz>
The network-control applications are programs that manage the underlying network with the help of the SDN controller.
- [x] True
- [ ] False

Applications (routing, ACLs, load balancing, monitoring) sit **above** the controller and use its northbound APIs and global state.
</quiz>

<quiz>
In SDN networks forwarding rules of traffic still have to be based on IP destination and cannot be based on other metrics, packet header info etc.
- [ ] True
- [x] False

**Flow-based forwarding** matches on multiple header fields across layers — not only destination IP. OpenFlow historically supported many match fields.
</quiz>

<quiz>
SDN-controlled switches operate on the:
- [x] Data plane
- [ ] Control plane

SDN switches execute controller-installed **flow rules** at line rate — classic **data-plane** behavior.
</quiz>

### SDN interfaces and deployment

<quiz>
In an SDN Architecture, the northbound interface keeps track of information about the state of the hosts, links, switches and other controlled elements in the network, as well as copies of the flow tables of the switches.
- [ ] True
- [x] False

The controller's **network-wide state-management layer** maintains topology, hosts, links, and flow-table copies. The **northbound interface** is the API that **exposes** that state to applications — it does not store it.
</quiz>

<quiz>
In SDN networks, the southbound interface is responsible for the communication between SDN controller and the controlled devices.
- [x] True
- [ ] False

**Southbound** APIs (e.g., **OpenFlow**) carry rule installation, events, and statistics between the controller and switches/routers.
</quiz>

<quiz>
In SDN networks, the controller needs to be implemented over a centralized server.
- [ ] True
- [x] False

The controller is **logically** centralized but **physically** is often **distributed** across multiple servers (**OpenDaylight**, **ONOS**) for fault tolerance and scale.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Plain-language guide](plain-language.md)
    - [Quick Study Guide](quick-study-guide.md)
    - [Lesson 7 full guide](sdn-1.md)
    - [Lesson 8 (SDN Part 2)](../lesson-08/sdn-2.md)
