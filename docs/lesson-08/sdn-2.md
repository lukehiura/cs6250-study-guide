---
tags:
  - lesson-08
  - sdn
---

# Lesson 8: SDN (Part 2)

!!! tip "Exam prep"
    New to the material? Start with the **[Plain-language guide](plain-language.md)**. Need a condensed review? See the **[Quick Study Guide](quick-study-guide.md)**. For interactive practice, try the **[Lesson 8 Quiz](quiz.md)**. Part 1: **[Lesson 7](sdn-1.md)**.

---

## Describe the three perspectives of the SDN landscape

1. **Plane-based perspective** — Views SDN through the lens of control plane and data plane separation. The control plane is logically centralized; the data plane consists of simple forwarding elements.

2. **SDN layers perspective** — Views SDN as a layered architecture: infrastructure layer (switches), control layer (controller/NOS), and application layer (network apps), connected by southbound and northbound interfaces.

3. **System design perspective** — Views SDN as a distributed system with challenges like consistency, fault tolerance, scalability, and security that must be addressed for production deployment.

---

## Describe the responsibility of each layer in the SDN layer perspective

**Infrastructure layer (Data plane):**

- Physical or virtual switches that perform packet forwarding.
- Execute flow rules installed by the controller.
- Report statistics and events to the controller.

**Control layer (Controller / Network OS):**

- Maintains global network state (topology, host locations, flow statistics).
- Translates high-level application policies into low-level flow rules.
- Manages communication with switches via southbound APIs.

**Application layer:**

- Network applications that implement specific functionality: routing, firewalling, load balancing, monitoring.
- Communicate with the controller via northbound APIs.
- Can be developed independently by operators, researchers, or third parties.

---

## Describe a pipeline of flow tables in OpenFlow

In OpenFlow, a switch can have **multiple flow tables** arranged in a **pipeline**:

1. A packet enters at **Table 0**.
2. The packet is matched against the flow entries in that table.
3. If a match is found, the associated actions are executed. One possible action is **GoTo Table N**, which sends the packet to another flow table for further processing.
4. The packet progresses through the pipeline, accumulating an **action set**.
5. When no more GoTo actions are specified, the accumulated action set is executed on the packet.

This pipeline allows **modular, multi-stage processing** — for example, Table 0 could handle ACL checks, Table 1 could handle routing, and Table 2 could handle QoS marking.

---

## What's the main purpose of southbound interfaces?

Southbound interfaces define the **communication protocol between the SDN controller and the network devices** (switches/routers). Their purpose is to:

- Allow the controller to **install, modify, and delete flow rules** in switch flow tables.
- Allow switches to **report events** (link up/down, packet-in) and **statistics** (flow counters, port stats) to the controller.
- Enable **device discovery** and configuration.

**OpenFlow** is the most prominent southbound interface protocol.

---

## What are three information sources provided by the OpenFlow protocol?

1. **Event-based messages** — Switches notify the controller of events such as link state changes (port up/down), packet arrivals that don't match any flow rule (packet-in), and flow entry expirations.

2. **Flow statistics** — The controller can query switches for per-flow, per-table, and per-port statistics including packet counts, byte counts, and flow durations.

3. **Packet payloads** — When a packet doesn't match any flow rule, the switch can send the packet (or a portion of it) to the controller for inspection and decision-making (packet-in message).

---

## What are the core functions of an SDN controller?

1. **Topology management** — Discover and maintain the network topology (switches, links, hosts).
2. **Statistics collection** — Gather and aggregate flow and port statistics from switches.
3. **Notification handling** — Process events from switches (link failures, packet-ins).
4. **Device management** — Configure and manage switch parameters.
5. **Shortest path computation** — Calculate optimal paths based on the network graph.
6. **Security mechanisms** — Enforce access control and isolation policies.

---

## What are the differences between centralized and distributed architectures of SDN controllers?

**Centralized controller:**

- A single controller instance manages the entire network.
- Simpler to implement and reason about.
- **Single point of failure** — if the controller goes down, the network loses its control plane.
- **Scalability bottleneck** — one controller may not handle very large networks.

**Distributed controller:**

- Multiple controller instances share the workload.
- Provides **fault tolerance** — if one instance fails, others take over.
- Better **scalability** — can handle larger networks by distributing the load.
- More complex — requires **consistency mechanisms** to keep the global network state synchronized across controller instances.

---

## When would a distributed controller be preferred to a centralized controller?

- **Large-scale networks** — When a single controller can't handle the volume of events and flow installations.
- **High availability requirements** — When controller downtime is unacceptable (e.g., production data center, WAN).
- **Geographically distributed networks** — When the latency between the controller and remote switches would be too high with a single centralized controller.
- **Multi-domain networks** — When different administrative domains each need their own controller but must coordinate.

---

## Describe the purpose of each component of ONOS (Open Networking Operating System)

ONOS is a **distributed SDN control platform** with the following components:

1. **Global Network View** — A shared, in-memory data structure that represents the current network state (topology, links, hosts, flows). All controller instances see the same view.

2. **Titan (distributed graph database)** — Provides persistent, fault-tolerant storage for the network state.

3. **Cassandra (distributed key-value store)** — Used for durable storage and replication of state across controller instances.

4. **Blueprints graph API** — Provides a standard graph abstraction for querying and modifying the network topology stored in Titan.

5. **Raft-based consensus** — Used for leader election and ensuring consistent state updates across the distributed controller cluster.

6. **Northbound API** — Provides a REST and Java API for applications to interact with the controller.

7. **Southbound API** — Interfaces with switches using OpenFlow and other protocols.

---

## How does ONOS achieve fault tolerance?

ONOS achieves fault tolerance through:

1. **Distributed architecture** — Multiple ONOS instances run simultaneously, sharing the workload.
2. **Data replication** — Network state is replicated across instances using Cassandra (eventual consistency) and Raft (strong consistency for critical state).
3. **Leader election** — Raft consensus ensures that for each switch, one controller instance is the designated leader. If the leader fails, a new leader is elected automatically.
4. **Mastership reassignment** — When an ONOS instance fails, its switches are automatically reassigned to surviving instances.

---

## What is P4?

**P4 (Programming Protocol-independent Packet Processors)** is a high-level programming language for specifying how packets are processed by the data plane of a programmable switch, router, or network interface card.

Unlike OpenFlow (which defines a fixed set of match fields), P4 allows the programmer to define:

- The packet header formats to parse.
- The match-action tables and their fields.
- The processing pipeline.

---

## What are the primary goals of P4?

1. **Protocol independence** — The switch's forwarding behavior is not tied to any specific protocol. The programmer defines which headers to recognize and how to process them.
2. **Target independence** — P4 programs can be compiled to run on different hardware targets (software switches, FPGAs, ASICs).
3. **Reconfigurability** — The forwarding behavior can be changed after deployment by loading a new P4 program, without replacing hardware.

---

## What are the two main operations of the P4 forwarding model?

1. **Configure** — Define the parser and the match-action pipeline. This specifies which headers the switch recognizes, which tables exist, and how packets flow through the processing stages. This happens at compile/load time.

2. **Populate** — Fill the match-action tables with specific rules at runtime. This is done by the control plane (SDN controller) and determines the actual forwarding behavior for specific traffic patterns.

---

## What are the applications of SDN? Provide examples of each application

1. **Traffic Engineering** — Use the global view to optimize traffic distribution across the network. *Example:* Google's B4 WAN uses SDN to achieve near-optimal link utilization between data centers.

2. **Security and Monitoring** — Dynamically insert firewall rules or redirect suspicious traffic for inspection. *Example:* Implementing dynamic access control lists that adapt to detected threats.

3. **Data Center Networking** — Manage virtual machine migration, load balancing, and multi-tenant isolation. *Example:* VMware NSX provides network virtualization using SDN.

4. **Wide-Area Traffic Delivery** — SDX (Software Defined IXPs) enable flexible peering policies. *Example:* Implementing application-specific peering at IXPs.

5. **Research and Experimentation** — Network slicing allows researchers to run experiments on production hardware. *Example:* GENI and campus deployments using OpenFlow for research traffic.

---

## Which BGP limitations can be addressed by using SDN?

1. **Limited expressiveness** — BGP can only route based on destination prefix. SDN enables routing based on any combination of header fields (source, port, protocol, etc.).
2. **Lack of fine-grained control** — BGP operates at the prefix granularity. SDN can define per-flow policies.
3. **Slow convergence** — BGP convergence can take minutes. SDN controllers can react to changes in seconds.
4. **Difficulty in implementing complex policies** — Multi-step BGP configurations (MED, communities, local-pref) are error-prone. SDN allows policies to be written as software programs.
5. **No traffic engineering** — BGP doesn't consider link utilization. SDN controllers can balance traffic across paths based on real-time measurements.

---

## What's the purpose of SDX?

An **SDX (Software Defined Exchange)** applies SDN principles to Internet Exchange Points (IXPs). Its purpose is to give IXP participants more **flexible, fine-grained control** over how they exchange traffic, going beyond BGP's destination-prefix-only routing.

SDX enables policies like:

- Route traffic based on application type (e.g., send video traffic via one peer, web traffic via another).
- Implement inbound traffic engineering.
- Apply security policies at the exchange point.

---

## Describe the SDX architecture

The SDX architecture consists of:

1. **SDX controller** — Runs on top of a standard SDN controller (e.g., Pyretic/Frenetic). Compiles participant policies into OpenFlow rules for the IXP switch fabric.

2. **Virtual switch abstraction** — Each participant sees a **virtual switch** connecting it to every other participant. Participants write policies against their virtual switch without knowing the physical topology.

3. **Policy compilation** — The SDX controller combines all participants' policies, resolves conflicts, and compiles them into a **single set of physical flow rules** installed on the IXP switches.

4. **Integration with BGP** — SDX works alongside BGP. BGP handles reachability, while SDX enables fine-grained forwarding policies on top of BGP routes.

---

## What are the applications of SDX in the domain of wide-area traffic delivery?

1. **Application-specific peering** — Route different types of traffic (video, web, VoIP) to different peers based on their service quality for that traffic type.

2. **Inbound traffic engineering** — Participants can control how traffic enters their network from the IXP, which is difficult with standard BGP.

3. **Wide-area server load balancing** — Redirect client requests to the nearest or least-loaded server cluster by programming forwarding rules at the IXP.

4. **Redirection through middleboxes** — Steer traffic through scrubbing centers, firewalls, or caches located at the IXP.
