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
In ONOS, which component maintains **mastership** between switches and controller instances?
- [x] Zookeeper (distributed registry)
- [ ] DNS recursive resolver
- [ ] TCP congestion window
- [ ] Ethernet ARP cache

The course ONOS architecture uses Zookeeper for mastership; each switch has one master ONOS instance.
</quiz>

<quiz>
Automatic switch **mastership reassignment** after a controller failure is a mechanism for [[fault tolerance]].
---
Failover keeps control service available when one instance fails.
</quiz>

---

## SDN motivation and advantages

<quiz>
Which plane is responsible for **forwarding** packets based on installed rules?
- [x] Data plane
- [ ] Management plane only
- [ ] Application transport layer
- [ ] DNS resolution plane

The data plane executes forwarding; the control plane computes rules.
</quiz>

<quiz>
A key SDN advantage over fixed middleboxes is that network functions can run as [[controller applications]] with a shared global network view.
---
SDN moves middlebox logic into software on the NOS instead of dedicated physical appliances at fixed topology points.
</quiz>

<quiz>
Which are the three OpenFlow information sources that feed the NOS?
- [x] Event messages, flow statistics, and packet messages for unknown flows
- [ ] BGP UPDATE messages only
- [ ] TCP SYN cookies only
- [ ] DNS A-record lookups only

These three channels provide flow-level visibility to the controller.
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
In the course model, P4 primarily handles pipeline [[configuration]] while Classic OpenFlow handles rule [[population]] at runtime.
---
P4 defines parser and table structure; the control plane fills match-action entries.
</quiz>

<quiz>
ONOS stores the global network view using Titan (graph database) and [[Cassandra]] (distributed key-value store).
---
Apps interact with the view via the Blueprints graph API.
</quiz>

<quiz>
Compared with OpenFlow, P4 supports:
- [x] A programmable parser and match+action tables in series or parallel
- [ ] Only fixed parsers and strictly serial tables
- [ ] No match+action tables at all
- [ ] BGP as the only southbound protocol

P4 generalizes parsing and allows parallel table stages when dependencies permit.
</quiz>

<quiz>
In Pyretic SDX policies, the operator `>>` means [[sequential]] composition and `+` applies policies in [[parallel]].
---
With `+`, if neither policy matches, the packet is dropped.
</quiz>

<quiz>
An SDX gives each participating AS the illusion of its own [[virtual switch]] connecting to every other participant.
---
The SDX compiles all participant policies into rules on the shared physical fabric.
</quiz>

<quiz>
Which BGP limitation does SDX inbound traffic engineering directly address?
- [x] Routing decisions based only on destination prefix, not source IP/port
- [ ] Lack of any peering at IXPs
- [ ] Inability to advertise any routes globally
- [ ] Requirement to use OSPF inside every AS

SDX can match on source IP and port to control how traffic enters an AS.
</quiz>

<quiz>
Which SDN application domain includes **ElasticTree** and **Plug-n-Serve**?
- [x] Traffic engineering
- [ ] Physical layer modulation
- [ ] DNS caching only
- [ ] Ethernet frame padding

ElasticTree saves power by shutting links; Plug-n-Serve load-balances with wildcard rules.
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

## Module 8 exam questions

Canvas Module 8 quiz — SDN landscape, OpenFlow, controllers, ONOS, P4, and SDX. See the [full guide](sdn-2.md).

### SDN planes and network types

<quiz>
An OpenFlow switch can function as a router.
- [x] True
- [ ] False

OpenFlow flow rules can **forward, modify, or drop** traffic — one device can act as a **router**, firewall, load balancer, or traffic shaper depending on installed rules.
</quiz>

<quiz>
Determine which plane executes a network policy.
- [x] Data Plane
- [ ] Control Plane
- [ ] Management Plane
- [ ] All planes

Policy is **defined** in the management plane, **enforced** by the control plane (rules installed), and **executed** by the data plane (packets forwarded per those rules).
</quiz>

<quiz>
Determine which type of network can implement load balancing.
- [ ] Conventional Networks
- [ ] Software-Defined Networks
- [ ] Neither conventional nor software-defined networks
- [x] Both conventional and software defined networks

**Conventional** networks use dedicated load-balancer **middleboxes**. **SDN** implements load balancing as **controller applications** (e.g., Plug-n-Serve, SDX anycast steering).
</quiz>

<quiz>
Determine which type of network decouples the control and data planes.
- [ ] Conventional Networks
- [x] Software-Defined Networks
- [ ] Neither conventional nor software-defined networks
- [ ] Both conventional and software defined networks

**SDN** separates control logic from forwarding. **Conventional** networks tightly couple both inside each device.
</quiz>

<quiz>
Middleboxes can only be used in conventional networks.
- [ ] True
- [x] False

SDN moves middlebox functions (firewall, LB, IDS) into **controller applications** with a shared network view — not only physical appliances in conventional topologies.
</quiz>

<quiz>
Determine which of the following can be implemented as a network application in software-defined networking.
- [ ] Routing
- [ ] Security enforcement
- [ ] Quality of Service (QoS) enforcement
- [x] All of the above

The application layer implements **routing**, **security**, **QoS**, load balancing, virtualization, and more atop the NOS.
</quiz>

<quiz>
The networking operating system (NOS) is a part of the data plane.
- [ ] True
- [x] False

The **NOS** (e.g., ONOS, OpenDaylight) is the **control layer** — it maintains global state and programs switches via southbound APIs. Switches are the data plane.
</quiz>

<quiz>
The physical devices in an SDN network have embedded intelligence and control required to perform forwarding tasks.
- [ ] True
- [x] False

SDN infrastructure devices perform **simple forwarding** only — **no embedded control intelligence**; logic lives in the **NOS**.
</quiz>

### OpenFlow and southbound interfaces

<quiz>
When a packet arrives in an OpenFlow device and it does not match any of the rules in one of the tables, that packet is always dropped.
- [ ] True
- [x] False

A **table miss** can trigger other actions: **packet-in** to the controller, **GoTo** another table, **normal** legacy L2/L3 processing — not always drop.
</quiz>

<quiz>
The Southbound interfaces are the separating medium between the Network-control Applications and the Control plane functionality.
- [ ] True
- [x] False

**Southbound** separates **control plane ↔ data plane** (controller to switches). **Northbound** connects **network-control applications ↔ controller**.
</quiz>

<quiz>
OpenFlow enables the communication between the control plane and data plane through event-based messages, flow statistics and packet messages that are sent from forwarding devices to controller.
- [x] True
- [ ] False

The three OpenFlow information sources to the NOS: **event messages**, **flow statistics**, and **packet messages** (e.g., packet-in for unknown flows).
</quiz>

### Controller architecture and ONOS

<quiz>
One of the disadvantages of an SDN centralized controller architecture is that it can introduce a single point of failure and also scaling issues.
- [x] True
- [ ] False

A **single** controller is a **single point of failure** and may not scale to many data-plane elements — why production systems use **distributed** controllers.
</quiz>

<quiz>
A distributed controller can be a centralized cluster of nodes or a physically distributed set of elements.
- [x] True
- [ ] False

Distributed controllers scale via a **cluster** in one site or **geographically distributed** nodes (e.g., cluster per data center + WAN instances).
</quiz>

<quiz>
A distributed controller can only be used in large networks.
- [ ] True
- [x] False

Distributed controllers can scale to **small or large** networks — distribution also helps **high availability**, not only size.
</quiz>

<quiz>
ONOS is an example of a centralized controller platform.
- [ ] True
- [x] False

**ONOS** is a **distributed** SDN control platform — cluster of instances with a shared global network view and Zookeeper mastership.
</quiz>

<quiz>
In order to make forwarding and policy decisions in ONOS, applications get information from the view and then update these decisions back to the view.
- [x] True
- [ ] False

Apps read/write the **global network view** via the Blueprints API; **OF Managers** translate view changes into OpenFlow on switches.
</quiz>

<quiz>
In order to achieve fault tolerance, whenever there is a failure of an ONOS instance, a master is chosen randomly for each of the switches that were controlled by the failed instance.
- [ ] True
- [x] False

Failover uses **re-election** via **Zookeeper** — a new master is chosen from remaining ONOS instances that **already connect** to that switch, not randomly.
</quiz>

### P4 and SDX

<quiz>
The purpose of the creation of the P4 language was to offer programmability on the control plane.
- [ ] True
- [x] False

**P4** targets **data-plane** programmability — programmable parsers and match+action pipeline structure — not control-plane logic.
</quiz>

<quiz>
P4 acts as an interface between the switches and the controller, and its main goal is to allow the controller to define how the switches operate.
- [x] True
- [ ] False

**P4** lets the controller define **how** switches parse and process packets (pipeline structure). **OpenFlow** then **populates** runtime rules in those tables — configure (P4) plus populate (OpenFlow) together.
</quiz>

<quiz>
The P4 model allows the design of a common language to write packet processing programs that are independent of the underlying devices.
- [x] True
- [ ] False

**Target independence** — one P4 program compiles to different targets (software switch, FPGA, ASIC) via a **compiler**.
</quiz>

<quiz>
In an SDX architecture, each AS can define forwarding policies as if it is the only participant at the SDX, as well as having its own SDN applications for dropping, modifying or forwarding their traffic.
- [x] True
- [ ] False

Each AS gets a **virtual switch** with isolated policy; the SDX **compiles** all participant policies onto the shared physical fabric.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Plain-language guide](plain-language.md)
    - [Quick Study Guide](quick-study-guide.md)
    - [Lesson 8 full guide](sdn-2.md)
    - [Lesson 9 (Internet Security)](../lesson-09/security.md)
