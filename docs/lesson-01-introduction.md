# Lesson 1: Introduction, History, and Internet Architecture

This section covers the fundamental design philosophies of modern networking.

---

## What are the advantages and disadvantages of a layered architecture?

**Advantages:**

- **Modularity** — Breaking complex networking tasks into discrete, manageable subsystems. Each layer has a well-defined interface and responsibility.
- **Independent evolution** — Layers can be updated or replaced without affecting other layers, as long as the interface contract is preserved.
- **Easier troubleshooting** — Problems can be isolated to a specific layer.
- **Interoperability** — Standards at each layer allow devices from different vendors to work together.
- **Scalability** — New technologies at the lower layers (e.g., 5G, fiber) can be introduced without rewriting applications.

**Disadvantages:**

- **Performance overhead** — Encapsulation/de-encapsulation at each layer adds processing cost and header bytes.
- **Redundancy** — Some functions are duplicated across layers (e.g., error checking at both the data link and transport layers).
- **Rigidity** — Strict layer boundaries can prevent cross-layer optimizations that could improve performance.
- **Information hiding** — Lower layers may hide information that higher layers could use to make better decisions.

---

## What are the differences and similarities between the OSI model and the five-layered Internet model?

| Feature | OSI Model | Internet (TCP/IP) Model |
|---------|-----------|------------------------|
| **Layers** | 7: Physical, Data Link, Network, Transport, Session, Presentation, Application | 5: Physical, Link, Network, Transport, Application |
| **Design Philosophy** | Prescriptive — the model was designed before the protocols | Descriptive — the model was built to describe already existing protocols |
| **Popular Protocols** | Often theoretical or legacy (e.g., X.25) | HTTP, TCP, UDP, IP, Ethernet, 802.11 |
| **Adoption** | Primarily a teaching/reference framework | The actual architecture of the Internet |

**Similarities:** Both use layering to manage complexity. Both have corresponding layers for physical transmission, data link framing, network routing, transport delivery, and application communication.

**Key difference:** The OSI model separates Session, Presentation, and Application into three distinct layers, while the Internet model combines all three into a single Application layer.

---

## Describe each layer of the OSI model

1. **Physical** — Transmits raw bits over a physical medium (copper, fiber, wireless).
2. **Data Link** — Provides node-to-node data transfer, framing, MAC addressing, and error detection.
3. **Network** — Handles logical addressing (IP) and routing of packets across networks.
4. **Transport** — Provides end-to-end communication between processes (TCP/UDP), including reliability and flow control.
5. **Session** — Manages sessions (dialogs) between applications, including establishment, maintenance, and teardown.
6. **Presentation** — Handles data translation, encryption, and compression between the application and network formats.
7. **Application** — Provides network services directly to end-user applications (HTTP, FTP, SMTP, DNS).

---

## Provide examples of popular protocols at each layer of the five-layered Internet model

| Layer | Protocols |
|-------|-----------|
| **Application** | HTTP, HTTPS, FTP, SMTP, DNS, SSH, DHCP, BGP |
| **Transport** | TCP, UDP |
| **Network** | IP (IPv4, IPv6), ICMP, ARP |
| **Link** | Ethernet (802.3), Wi-Fi (802.11), PPP |
| **Physical** | Copper (Cat5/6), Fiber optic, Radio (cellular, satellite) |

---

## What is encapsulation, and how is it used in a layered model?

Encapsulation is the process by which each layer adds its own header (and sometimes trailer) to the data received from the layer above before passing it down.

**Process at the sender:**

1. The **application layer** creates the message (e.g., an HTTP request).
2. The **transport layer** adds a TCP/UDP header → forms a **segment**.
3. The **network layer** adds an IP header → forms a **datagram** (packet).
4. The **link layer** adds a frame header and trailer → forms a **frame**.
5. The **physical layer** transmits the frame as raw bits.

**At the receiver**, the process reverses (**de-encapsulation**): each layer strips its header, passes the payload up, until the original application message is recovered.

---

## What are sockets?

A socket is the software interface between an application process and the transport layer. It acts as the API through which an application sends and receives messages to and from the network.

- A socket is identified by an IP address and a port number.
- It serves as the "door" between the application process and the transport-layer protocol (TCP or UDP).
- The application developer controls the application-layer side of the socket, while the OS controls the transport-layer side.

---

## What is the end-to-end (e2e) principle?

The end-to-end principle dictates that **application-specific intelligence and reliability mechanisms should reside at the communication endpoints (the hosts)**, leaving the network core simple and focused purely on data forwarding.

**Rationale:**

- Different applications need different trade-offs (e.g., video calls prioritize low latency; file transfers prioritize correctness).
- If the network tried to enforce one universal behavior, it would limit what applications can do.
- Keeping the core simple makes the Internet easier to evolve and scale.

The network core should provide a "best-effort" delivery service, while endpoints implement any additional guarantees they require (reliability, ordering, security, etc.).

---

## What are examples of violations of the e2e principle?

- **Network Address Translators (NATs)** — Actively rewrite packet headers (source IP and port) within the network, breaking the original end-to-end connectivity model. NATs were introduced to address IPv4 address scarcity.
- **Firewalls** — Inspect and block traffic within the network based on security policies, rather than leaving security decisions to the endpoints.
- **Proxies and Caches** — Intercept and respond to requests on behalf of the origin server, modifying the end-to-end communication path.
- **Deep Packet Inspection (DPI)** — Network middleboxes that examine packet payloads, violating the principle that the core should only forward data.

---

## What is the EvoArch model?

EvoArch is a quantitative evolutionary model developed by researchers to study **why protocol stacks evolve into an hourglass shape** and why the waist becomes ossified (difficult to replace).

The model represents the protocol stack as a **layered directed dependency graph**:

- Each protocol is a node; edges represent dependencies.
- A protocol at each layer selects underlying protocols it depends on for services.
- Protocols gain **evolutionary value** when many valuable higher-layer protocols and applications rely on them.
- Protocols **compete** within the same layer when they share enough products (dependents).
- Lower-value competitors are more likely to die out.

---

## Explain a round in the EvoArch model

The model evolves in **discrete rounds** consisting of:

1. **Birth** — New protocols are introduced at random layers.
2. **Dependency formation** — New protocols select underlying protocols to depend on.
3. **Value recomputation** — Evolutionary values are recalculated based on how many valuable higher-layer protocols depend on each protocol.
4. **Competition** — Protocols at the same layer with overlapping products compete; lower-value competitors may die.
5. **Cascading deaths** — If a protocol dies, its dependents may also die if they lose their only substrates.

After many rounds, the simulation shows the stack narrowing toward a small waist and expanding again — producing the hourglass shape.

---

## What are the ramifications of the hourglass shape of the Internet?

The Internet exhibits an hourglass architecture where the waist consists of a single core protocol (IPv4/IPv6). This guarantees that:

- A vast array of **physical layer technologies** below can interoperate.
- An endless variety of **applications** above can communicate.
- **Innovation at the edges** is easy — new apps and link-layer technologies can be added freely.
- **The core is ossified** — once a protocol like IP becomes the foundation for many services, replacing it becomes extremely difficult because it would require coordinated upgrades across the entire ecosystem.

!!! warning "IPv6 Adoption"
    The difficulty of replacing IPv4 with IPv6, despite IPv6's technical superiority, is a direct consequence of the hourglass ossification predicted by EvoArch.

---

## Repeaters, hubs, bridges, and routers operate on which layers?

| Device | Layer | Function |
|--------|-------|----------|
| **Repeater** | Layer 1 (Physical) | Amplifies/regenerates electrical signals to extend cable reach |
| **Hub** | Layer 1 (Physical) | Receives bits on one port and repeats them to all other ports |
| **Bridge / Switch** | Layer 2 (Data Link) | Reads frame headers, learns MAC addresses, forwards selectively |
| **Router** | Layer 3 (Network) | Understands IP addresses, routes packets between networks |

---

## What is a bridge, and how does it "learn"?

A bridge (or layer-2 switch) is a device that operates at the **data link layer**. Unlike a hub, it does not blindly broadcast frames to all ports. Instead, it **forwards frames selectively** based on MAC addresses.

**Learning process:**

1. When a frame arrives, the bridge examines the **source MAC address** and records which port it came from in a **forwarding table**.
2. When forwarding, the bridge looks up the **destination MAC address** in the table:
    - If found → forward to the specific port.
    - If not found → **flood** the frame out all ports except the incoming port.
3. Over time, the forwarding table becomes more complete, and forwarding becomes mostly selective rather than flooded.

This is called a **learning bridge** because it automatically discovers the network topology without manual configuration.

---

## What is a distributed algorithm?

A distributed algorithm is an algorithm that runs across multiple independent nodes (e.g., switches, routers) that coordinate by exchanging messages, without any single centralized controller. Each node makes local decisions based on information received from its neighbors, and the system as a whole converges to a global solution.

---

## Explain the Spanning Tree Algorithm

The Spanning Tree Algorithm (STA) is a distributed algorithm used by layer-2 bridges to create a **loop-free forwarding topology** across a network with redundant links.

**Problem it solves:** Layer-2 frames have no hop limit (unlike IP packets with TTL), so if loops exist, frames can circulate indefinitely and cause **broadcast storms**.

**How it works:**

1. **Root election** — Initially, every switch assumes it is the root. Each switch advertises its ID and distance to the root (initially 0) via Bridge Protocol Data Units (BPDUs).
2. **Information exchange** — When a switch receives a BPDU from a neighbor with a better (lower) root ID or a shorter path to the root, it updates its belief about who the root is and the best path to reach it.
3. **Convergence** — After several rounds of message exchange, all switches agree on:
    - A single **root bridge** (the one with the lowest ID).
    - Each switch's **root port** (the port with the shortest path to the root).
    - **Designated ports** on each LAN segment.
4. **Port states** — Ports not on the spanning tree are placed in a **blocking state**, logically disabling the redundant links while keeping them physically available for failover.

The result is a spanning tree rooted at the elected root bridge — every switch is reachable, but there are no cycles.

---

## What is the purpose of the Spanning Tree Algorithm?

The primary purpose is to **prevent layer-2 loops** (broadcast storms) while maintaining network connectivity. It logically disables redundant links to create a loop-free topology, while keeping those links available as backups in case of failure.
