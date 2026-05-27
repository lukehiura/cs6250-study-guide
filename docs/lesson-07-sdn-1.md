# Lesson 7: SDN (Part 1)

---

## What spurred the development of Software Defined Networking (SDN)?

Several limitations of traditional networking drove SDN development:

- **Complexity of management** — Traditional networks couple the control plane (routing decisions) with the data plane (packet forwarding) inside each device, making network-wide policy enforcement difficult.
- **Lack of programmability** — Network operators couldn't easily customize or automate routing behavior.
- **Slow innovation cycles** — Vendor-specific, closed implementations made it hard to experiment with new protocols.
- **Inconsistent policies** — Configuring each router independently led to misconfigurations and policy violations.
- **Research needs** — Researchers wanted a platform to experiment with new network architectures without replacing hardware.

---

## What are the three phases in the history of SDN?

1. **Active Networks** (mid-1990s)
2. **Control and Data Plane Separation** (early-mid 2000s)
3. **OpenFlow API and Network Operating Systems** (2008+)

---

## Summarize each phase in the history of SDN

### Phase 1: Active Networks (mid-1990s)

Proposed programmable network nodes where packets could carry programs to be executed at routers. Introduced the idea that the network should be programmable, not just configurable. Didn't gain practical traction but planted the conceptual seeds for SDN.

### Phase 2: Control and Data Plane Separation (early-mid 2000s)

Researchers proposed separating routing decisions (control plane) from packet forwarding (data plane). Projects like RCP (Routing Control Platform) and 4D architecture demonstrated that a logically centralized controller could compute routes for the entire network, pushing forwarding rules to routers. This simplified management and enabled network-wide optimization.

### Phase 3: OpenFlow and Network Operating Systems (2008+)

OpenFlow provided a standardized, open API for controllers to program the forwarding tables of switches. This made the separation practical and vendor-neutral. The network operating system (e.g., NOX) abstracted the switch hardware, allowing applications to program the network through a high-level API.

---

## What is the function of the control and data planes?

**Control plane:**

- Determines **how** packets should be forwarded (routing decisions).
- Runs routing protocols (OSPF, BGP), computes forwarding tables.
- Makes network-wide decisions about traffic engineering, policy enforcement.
- Operates at slower timescales (seconds to minutes).

**Data plane:**

- Performs the actual **forwarding** of packets based on the forwarding table.
- Operates at line rate (nanoseconds per packet).
- Handles packet lookup, switching, queuing, and scheduling.

---

## Why separate the control from the data plane?

1. **Independent evolution** — The data plane hardware can be optimized for speed, while the control plane software can be rapidly updated.
2. **Centralized management** — A logically centralized controller has a global network view, enabling better routing decisions and easier policy enforcement.
3. **Simpler debugging** — Separating logic from forwarding makes it easier to reason about and test network behavior.
4. **Programmability** — Network operators and researchers can write software to control the network without modifying hardware.
5. **Vendor independence** — Open APIs (like OpenFlow) allow the controller to work with switches from different vendors.

---

## Why did SDN lead to opportunities in various areas such as data centers, routing, enterprise networks, and research networks?

- **Data centers** — SDN enables dynamic, programmatic control over traffic flows between thousands of servers, supporting virtual machine migration, load balancing, and multi-tenant isolation.
- **Routing** — Centralized control allows network-wide traffic engineering and optimization that distributed protocols cannot easily achieve.
- **Enterprise networks** — SDN simplifies enforcement of access control policies, VLAN management, and network segmentation across large campuses.
- **Research networks** — SDN provides a platform to experiment with new protocols and architectures on real hardware without disrupting production traffic (e.g., using network slicing).

---

## What is the relationship between forwarding and routing?

**Routing** computes the paths that packets should take (control plane). **Forwarding** is the per-packet action of sending a packet out the correct port based on the forwarding table (data plane).

Routing **produces** the forwarding table; forwarding **consumes** it. Routing is a global, network-wide computation; forwarding is a local, per-router action.

---

## What is the difference between a traditional and SDN approach in terms of coupling of control and data plane?

**Traditional approach:**

- Control and data planes are **tightly coupled** within each router.
- Each router independently runs routing protocols and computes its own forwarding table.
- The control plane is **distributed** — no single entity has a complete network view.
- Difficult to enforce network-wide policies consistently.

**SDN approach:**

- Control and data planes are **decoupled**.
- A logically **centralized controller** computes forwarding rules and pushes them to switches.
- Switches are simple forwarding devices (data plane only).
- The controller has a **global network view**, enabling optimized, consistent decision-making.

---

## What are the main components of an SDN network and their responsibilities?

1. **SDN-controlled network elements (switches)** — Data plane devices that forward packets according to rules installed by the controller. They expose an API (e.g., OpenFlow) for the controller to program their flow tables.

2. **SDN controller (Network OS)** — The centralized software platform that maintains a global network view, computes forwarding rules, and pushes them to switches. It provides abstractions and APIs for applications.

3. **Network-control applications** — Software programs that run on top of the controller, implementing specific network functions: routing, load balancing, firewall policies, monitoring, etc.

---

## What are the four defining features of an SDN architecture?

1. **Flow-based forwarding** — Forwarding decisions are based on flow-level rules (matching on multiple header fields), not just destination IP.
2. **Separation of control and data planes** — The control logic is removed from the switches and placed in the controller.
3. **Network programmability** — The network is controlled by software applications running on the controller.
4. **Centralized control** — A logically centralized controller has a global view of the network and computes forwarding rules for all switches.

---

## What are the three layers of SDN controllers?

1. **Communication layer (Southbound interface)** — Communicates with network devices using protocols like OpenFlow. Handles discovery, configuration, and state collection from switches.

2. **Network-wide state management layer** — Maintains a global view of the network: topology, link states, flow statistics, host locations. Provides this information to applications via APIs.

3. **Application layer interface (Northbound interface)** — Provides APIs (typically REST APIs) for network applications to interact with the controller. Applications use this to read network state and install forwarding rules.
