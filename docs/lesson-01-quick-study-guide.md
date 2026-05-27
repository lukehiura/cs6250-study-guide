# Lesson 1: Quick Study Guide — Internet Architecture

A condensed review for exams. For full explanations, diagrams, and official Q&A, see the [full Lesson 1 guide](lesson-01-introduction.md). For interactive practice, try the **[Lesson 1 Quiz](lesson-01-quiz.md)**.

---

## 1. Big picture

The Internet works because it uses **packet switching**, **layering**, **open architecture**, and the **end-to-end principle**.

The main design idea is: keep the network core simple, and let endpoints handle application-specific logic like reliability, ordering, encryption, and session behavior.

---

## 2. Internet history milestones

| Milestone | Why it matters |
|----------|----------------|
| Licklider's "Galactic Network" | Early vision of globally connected computers |
| Packet switching | Data split into packets instead of reserving one circuit |
| ARPANET | Early packet-switched network experiment |
| NCP | Early ARPANET host-to-host protocol |
| Email | One of the first major network applications |
| TCP/IP | Enabled independent networks to interconnect |
| DNS | Scalable naming system for translating names to IP addresses |
| World Wide Web | Made the Internet broadly useful to the public |

!!! tip "Memory aid"
    **Packet switching + TCP/IP + DNS + Web = modern Internet growth.**

---

## 3. Layered Internet model

| Layer | Main job | Unit of data | Examples |
|-------|----------|--------------|----------|
| Application | Supports network apps | Message | HTTP, SMTP, FTP, DNS, SSH |
| Transport | Process-to-process communication | Segment | TCP, UDP |
| Network | Host-to-host delivery across networks | Datagram | IP, ICMP |
| Data Link | Node-to-node delivery on one link | Frame | Ethernet, Wi-Fi, PPP |
| Physical | Sends raw bits | Bits | Copper, fiber, radio |

Key idea: each layer provides a service to the layer above and uses the layer below.

---

## 4. OSI model vs Internet model

| OSI Model | Internet Model |
|-----------|----------------|
| 7 layers | 5 layers |
| More theoretical/reference model | Describes actual Internet architecture |
| Separates application, presentation, session | Combines all three into application layer |
| Physical, Data Link, Network, Transport, Session, Presentation, Application | Physical, Link, Network, Transport, Application |

!!! warning "Exam point"
    The Internet model collapses **Application + Presentation + Session** into one broader **Application layer**.

---

## 5. Encapsulation

When data moves down the stack, each layer adds a header.

| Step | Result |
|------|--------|
| Application creates message | `M` |
| Transport adds header | `[HT \| M]` = **segment** |
| Network adds header | `[HN \| HT \| M]` = **datagram** |
| Link adds header | `[HL \| HN \| HT \| M]` = **frame** |
| Physical | Sends **bits** |

At the receiver, each layer removes its header. That reverse process is **de-encapsulation**.

---

## 6. Intermediate devices

| Device | Layer | Looks at | What it does |
|--------|-------|----------|--------------|
| Repeater | Layer 1 | Bits/signals | Regenerates signal |
| Hub | Layer 1 | Bits/signals | Repeats bits to all ports |
| Switch / Bridge | Layer 2 | MAC addresses | Forwards frames |
| Router | Layer 3 | IP addresses | Forwards packets/datagrams |

!!! tip "Memory aid"
    **Switches use MAC addresses; routers use IP addresses.**

---

## 7. Sockets

A **socket** is the interface between an application and the transport layer.

It is usually identified by: **IP address + port number**

Example: a browser uses a socket to send HTTP data through TCP or UDP.

!!! tip "Memory aid"
    **Socket = door between app and transport layer.**

---

## 8. End-to-end principle

The end-to-end principle says the network core should stay simple, while endpoints handle complex functions.

| Application need | Where handled |
|------------------|---------------|
| Reliable file transfer | End hosts, usually TCP/application |
| Low-delay video call | Application chooses tradeoff |
| Security/encryption | Usually endpoints/application layer |

Why it matters: new apps can be created without changing routers in the core.

---

## 9. Violations of end-to-end principle

| Violation | Why it violates e2e |
|-----------|---------------------|
| Firewall | Middlebox blocks/allows traffic |
| NAT | Rewrites IP addresses and ports |
| Proxy/cache | Responds on behalf of another server |
| Deep packet inspection | Middlebox examines packet payloads |

NAT exists mainly because of IPv4 address scarcity. It lets many private devices share one public IP, but makes direct inbound communication harder.

---

## 10. Hourglass architecture

The Internet has an hourglass shape:

- **Top (wide):** many applications
- **Middle (narrow):** IP, TCP, UDP
- **Bottom (wide):** many link/physical technologies

Why this matters: many apps and technologies interoperate through a small common waist.

Downside: core protocols become hard to replace — **ossification**. Example: slow IPv6 adoption.

---

## 11. EvoArch model

EvoArch explains why protocol stacks evolve into an hourglass shape.

| Term | Meaning |
|------|---------|
| Protocol node | A protocol in the stack |
| Substrates | Protocols below that it depends on |
| Products | Protocols/apps above that depend on it |
| Evolutionary value | Higher when more important things depend on it |
| Competition | Same-layer protocols compete if they serve similar products |

Main takeaway: protocols survive because many other things depend on them, not only because they are technically superior.

---

## 12. Learning bridges

A learning bridge builds a forwarding table automatically.

It learns from: **source MAC address + incoming port**

It forwards based on: **destination MAC address**

| Destination known? | Action |
|--------------------|--------|
| Yes | Forward only to correct port |
| No | Flood out all ports except incoming port |

!!! tip "Memory aid"
    **Learn from source, forward to destination.**

---

## 13. Spanning Tree Algorithm

Layer 2 loops are dangerous because Ethernet frames have **no TTL** (unlike IP).

| Problem | Meaning |
|---------|---------|
| Broadcast storm | Frames circulate forever |
| Congestion | Links get overloaded |
| Table instability | MAC addresses appear to move ports |

Spanning Tree keeps physical redundancy but blocks some ports logically.

1. Smallest bridge ID becomes root.
2. Each bridge chooses shortest path to root.
3. Ties broken by smaller sender ID.
4. Ports that create loops are blocked.

!!! tip "Memory aid"
    **Keep redundancy physically, use only a tree logically.**

---

## 14. Clean-slate redesign

Clean-slate design asks what we would build if we started over today.

| Goal | Reason |
|------|--------|
| Security | Original Internet lacked strong anti-spoofing |
| Resilience | Better failure/attack handling |
| Manageability | Easier control of large networks |
| Quality of service | Different apps need different performance |
| Accountability | Trace actions to responsible entities |

| Design | Main idea |
|--------|-----------|
| 4D Architecture | Separate data, discovery, dissemination, and decision planes |
| AIP | Accountable Internet Protocol using `AD:EID` addresses |

---

## High-yield exam questions

Be able to answer these clearly:

1. What are the advantages and disadvantages of layering?
2. How does encapsulation work?
3. What is the difference between OSI and the Internet model?
4. What does each Internet layer do?
5. What is a socket?
6. What is the end-to-end principle?
7. Why do NAT and firewalls violate end-to-end design?
8. Why does the Internet have an hourglass shape?
9. Why are IPv4, TCP, and UDP hard to replace?
10. How does a learning bridge build its forwarding table?
11. Why are Layer 2 loops dangerous?
12. How does the Spanning Tree Algorithm prevent loops?

---

## High-yield questions with answers

### 1. What are the advantages and disadvantages of layering?

Layering makes networks easier to design, update, debug, and scale. Each layer has a clear job and provides services to the layer above it.

**Advantages:** modularity, interoperability, easier troubleshooting, independent evolution, and scalability.

**Disadvantages:** extra overhead, duplicated functions across layers, strict boundaries that can block optimization, and hidden information between layers.

### 2. How does encapsulation work?

Encapsulation means each layer adds its own header as data moves down the stack.

- Application creates a **message**.
- Transport adds a header → **segment**.
- Network adds a header → **datagram**.
- Link adds a header → **frame**.
- Physical sends the frame as **bits**.

At the receiver, each layer removes its header (**de-encapsulation**).

### 3. What is the difference between the OSI model and the Internet model?

The OSI model has **7 layers**: physical, data link, network, transport, session, presentation, application.

The Internet model has **5 layers**: physical, link, network, transport, application.

The main difference: the Internet model combines OSI's **session, presentation, and application** into one application layer.

### 4. What does each Internet layer do?

- **Application:** user-facing apps (HTTP, DNS, SMTP)
- **Transport:** process-to-process communication (TCP, UDP)
- **Network:** host-to-host delivery (IP)
- **Data Link:** node-to-node on one link (Ethernet, Wi-Fi)
- **Physical:** raw bits (copper, fiber, radio)

### 5. What is a socket?

A socket is the software interface between an application and the transport layer, usually identified by **IP address + port number**. Apps use sockets to send/receive data through TCP or UDP.

### 6. What is the end-to-end principle?

The network core should stay simple; complex application-specific functions happen at the **endpoints** (reliability, ordering, encryption, application logic).

### 7. Why do NAT and firewalls violate the end-to-end principle?

**NAT** rewrites IP addresses and ports — the middle becomes an active participant.

**Firewalls** inspect and block/allow traffic — control moves inside the network instead of at endpoints.

### 8. Why does the Internet have an hourglass shape?

Many applications at the top, many link technologies at the bottom, and a narrow waist of **IP, TCP, and UDP** in the middle. Everything interoperates through those core protocols.

### 9. Why are IPv4, TCP, and UDP hard to replace?

Many systems depend on them (apps, OSes, routers, firewalls, ISPs). This **ossification** makes the core stable but hard to change.

### 10. How does a learning bridge build its forwarding table?

It watches incoming frames and records **source MAC address + incoming port**. Example: frame from Host A on port 1 → Host A is on port 1. It forwards using the **destination MAC**.

### 11. Why are Layer 2 loops dangerous?

Layer 2 frames have no TTL. Loops cause **broadcast storms**, congestion, duplicate frames, and unstable forwarding tables.

### 12. How does the Spanning Tree Algorithm prevent loops?

It keeps physical links but **blocks** some forwarding ports. Elect a root (smallest ID), each bridge picks shortest path to root, block ports that would create cycles → loop-free tree over redundant physical topology.

---

## Quick memory sheet

| Topic | Memory aid |
|-------|------------|
| Layer order | **Application → Transport → Network → Link → Physical** |
| Data names | **Message → Segment → Datagram → Frame → Bits** |
| Devices | **Hub = bits, Switch = MAC, Router = IP** |
| Architecture | **Smart edges, simple core** |
| Hourglass | **Many apps, few core protocols, many link technologies** |
| Spanning Tree | **Smallest root, shortest path, block loops** |
