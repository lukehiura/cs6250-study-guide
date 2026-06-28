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

Focused exam review for SDN systems. Start with the [Plain-language guide](plain-language.md), then [Lesson 8 full guide](sdn-2.md), and test with the [quiz](quiz.md).

---

## 1. Big picture

- Part 2 = SDN **landscape**, **OpenFlow** infrastructure, **controllers**, **ONOS**, **P4**, **SDX**
- Production = **logically centralized**, **physically distributed** control
- OpenFlow = dominant **southbound**; northbound = **no single standard**

!!! tip "Memory aid"
    **Configure with P4, populate with OpenFlow.**

---

## 2. SDN motivation revisit

| Traditional pain | SDN response |
|-----------------|--------------|
| Per-device vendor config | Centralized policy in NOS |
| Coupled control + forwarding | Separation via southbound API |
| ~10-year protocol rollouts | Software updates on controller |

### Three planes

| Plane | Function |
|-------|----------|
| **Management** | Monitor/configure control (SNMP, operators) |
| **Control** | Path computation, rule installation |
| **Data** | Packet/frame forwarding |

---

## 3. SDN advantages (vs conventional)

| Advantage | Detail |
|-----------|--------|
| **Shared abstractions** | Reusable control APIs and languages |
| **Consistent global view** | All apps see same network state |
| **Locality of function** | Middlebox logic not tied to one physical box |
| **Simpler integration** | Chain apps (LB + routing) in software |

Middleboxes → **controller applications**.

---

## 4. Three SDN landscape perspectives

| Perspective | Focus |
|-------------|-------|
| **(a) Plane-oriented** | Management / control / data |
| **(b) Layered architecture** | Stack of technologies + cross-cutting debug/test |
| **(c) System design** | Apps → NOS → switches with flow tables |

---

## 5. SDN landscape layers (high-yield)

| # | Layer | Key tech |
|---|-------|----------|
| 1 | Infrastructure | Open vSwitch, SwitchLight |
| 2 | Southbound | **OpenFlow**, OVSDB, ForCES, POF |
| 3 | Network virtualization | VxLAN, NVGRE, FlowVisor |
| 4 | NOS | ONOS, OpenDaylight, Beacon |
| 5 | Northbound | No standard; Floodlight, Trema APIs |
| 6 | Language-based virtualization | Pyretic, OpenVirteX |
| 7 | Network programming languages | Frenetic, Merlin, FML |
| 8 | Network applications | Hedera, FlowNAC, OpenQoS |

---

## 6. OpenFlow infrastructure

**Flow entry:** (a) match rule, (b) actions, (c) counters

**Lookup:** first table → match or miss

| Action | Effect |
|--------|--------|
| Forward to port | Normal forward |
| To controller | Packet-in |
| Drop | Discard |
| Normal pipeline | Legacy processing |
| Next table | Pipeline stage |

**Pipeline:** Table 0 → GoTo → … → execute action set

### Three OpenFlow information sources

1. **Event messages** (link/port changes)
2. **Flow statistics**
3. **Packet messages** (unknown new flow)

---

## 7. Controller core functions

Topology, statistics, notifications, device management, shortest-path forwarding, **security/priority** (high-priority rules win).

---

## 8. Centralized vs distributed

| | Centralized | Distributed |
|---|-------------|-------------|
| Examples | Beacon, Maestro, NOX-MT, Ryu | ONOS, OpenDaylight cluster |
| Pros | Simpler | Scale, fault tolerance |
| Cons | SPOF, scale limits | Weak consistency, coordination |
| Notes | Beacon: >12M flows/sec | Hybrid: cluster per DC + WAN nodes |

---

## 9. ONOS essentials

| Component | Role |
|-----------|------|
| **Global network view** | Shared topology/state |
| **Titan** | Graph DB |
| **Cassandra** | Key-value store |
| **Blueprints API** | Northbound to apps |
| **OF Managers** | Floodlight-based OpenFlow |
| **Zookeeper** | Mastership registry |

**Fault tolerance:** each switch → multiple ONOS instances, **one master**; on failure → **re-election** of master from remaining connections.

---

## 10. P4 essentials

**P4 vs OpenFlow:**

| | OpenFlow | P4 |
|---|----------|-----|
| Parser | Fixed | Programmable |
| Tables | Serial only | Series **or parallel** |
| Ops | Rules | **Configure** + **Populate** |

| Operation | Does |
|-----------|------|
| **Configure** | Parser, stages, header fields, table order |
| **Populate** | Add/delete table entries at runtime |

**Pipeline:** Input → Parser → Ingress MA → Buffer → Egress MA → Output

**P4 language:** legal header types, control-flow program, **TDG** (compiler-built; parallel if no dependency)

**L2/L3 TDG exam path:** Virtual routing ID → Routing (miss→L2, hit→L3) → Access control

---

## 11. SDN application domains (five)

| Domain | Examples |
|--------|----------|
| **Traffic engineering** | ElasticTree, Plug-n-Serve, Aster\*x, ALTO VPN |
| **Mobility & wireless** | OpenRadio, Odin, LVAPs |
| **Measurement & monitoring** | OpenSketch, OpenSample, PayLess |
| **Security & dependability** | DDoS detection, OF-RHM, CloudWatcher |
| **Data center networking** | LIME, FlowDiff |

---

## 12. SDX essentials

**BGP limitations SDX targets:**

1. Routing on **destination prefix only**
2. No direct **end-to-end path** control (only neighbor paths + prepending hacks)

**Architecture:** traditional IXP = L2 fabric + BGP route server; SDX = **virtual switch per AS** + policy compilation to physical fabric.

**Pyretic operators:**

| Op | Meaning |
|----|---------|
| `match(...)` | Filter |
| `>>` | Sequential |
| `+` | Parallel (no match → drop) |
| `fwd(X)` | Forward toward X |

**Example:** `(match(dstport=80) >> fwd(B)) + (match(dstport=443) >> fwd(C))`

**Wide-area SDX apps:** app-specific peering, inbound TE (src IP/port), anycast LB (rewrite dest IP), middlebox redirection

---

## 13. High-yield exam Q&A

### Three planes of functionality?

Management (configure/monitor), control (paths/rules), data (forward).

### Four SDN advantages over conventional?

Shared abstractions, consistent global view, flexible function placement, simpler app integration.

### Three landscape perspectives?

Plane-oriented, layered architecture, system design.

### OpenFlow flow entry parts?

Match rule, actions, counters.

### Three OpenFlow info sources to NOS?

Events, statistics, packet messages (new flow).

### Centralized controller drawback?

Single point of failure; scaling limits.

### Distributed controller properties?

Weak consistency, fault tolerance, scale-out.

### ONOS mastership tool?

**Zookeeper** (course material).

### P4 vs OpenFlow division?

P4 **configures** pipeline; OpenFlow **populates** rules. P4: programmable parser, parallel tables OK.

### P4 configure vs populate?

Configure = structure/protocol support; populate = add/delete table entries.

### What is a TDG?

Table Dependency Graph — compiler orders (or parallelizes) match+action tables from P4 control flow.

### Five SDN application domains?

Traffic engineering, mobility/wireless, measurement, security, data center networking.

### Two BGP limitations SDX addresses?

Destination-prefix-only routing; limited end-to-end path control.

### Pyretic `>>` vs `+`?

Sequential vs parallel; with `+`, no match → drop.

### SDX wide-area load balancing?

Anycast IP + rewrite destination IP at IXP (avoids DNS cache staleness).

### P4 three goals?

Reconfigurability, protocol independence, target independence.

---

## 14. Quick memory sheet

| Topic | Memory aid |
|-------|------------|
| Three planes | Manage → Control → Data |
| SDN advantage | Middlebox → controller app |
| Southbound king | OpenFlow |
| Northbound | No single standard yet |
| Flow entry | Match + action + counter |
| Pipeline entry | Table 0 |
| Multi-stage | GoTo next table |
| OpenFlow telemetry | Events + stats + packet-in |
| ONOS storage | Titan + Cassandra |
| ONOS failover | Zookeeper mastership + re-election |
| P4 vs OpenFlow | Programmable parser; parallel tables OK |
| Configure vs populate | Structure vs policy entries |
| TDG | Compiler table ordering |
| SDN app domains | TE, wireless, monitor, security, DC |
| SDX virtual switch | One per AS at IXP |
| Pyretic | >> then, + parallel, fwd(X) |
| SDX anycast LB | Rewrite dest IP at exchange |
| SDX | Fine policy at IXP, not BGP replacement |
