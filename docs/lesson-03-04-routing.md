# Lessons 3 & 4: Intradomain and Interdomain Routing

---

## What is the difference between forwarding and routing?

**Forwarding** is the **local, router-specific** action of transferring a packet from an input link to the appropriate output link. It uses the forwarding table and happens in the **data plane** at nanosecond-to-microsecond timescales.

**Routing** is the **global, network-wide** process of determining the end-to-end path a packet should take. Routing algorithms compute the forwarding tables and operate in the **control plane** at second-to-minute timescales.

| Aspect | Forwarding | Routing |
|--------|-----------|---------|
| **Scope** | Local (single router) | Global (network-wide) |
| **Plane** | Data plane | Control plane |
| **Timescale** | Per-packet (fast) | Periodic/event-driven (slow) |
| **Action** | Table lookup + output | Compute the table |

---

## What is the main idea behind a link-state routing algorithm?

In link-state routing, **every router has complete knowledge of the network topology and all link costs**. Each router:

1. Discovers its neighbors and measures link costs.
2. **Broadcasts** this information (link-state advertisements) to **all** routers in the network.
3. After collecting all link-state information, independently computes the shortest path to every destination using **Dijkstra's algorithm**.

The key insight is that each router has the same global view and computes routes independently, yet all reach the same result.

---

## What is an example of a link-state routing algorithm?

**Dijkstra's algorithm** is the canonical link-state algorithm. It computes the shortest-cost path from one source node to all other nodes in the graph.

**Protocols that use link-state:** OSPF (Open Shortest Path First) and IS-IS.

---

## Walk through an example of the link-state routing algorithm

Given a graph with nodes {A, B, C, D, E} and link costs:

1. **Initialize:** Set the source node's cost to 0, all others to ∞. Mark all nodes as unvisited.
2. **Visit the source:** Update neighbors' costs: for each neighbor, if (current_cost + link_cost < neighbor_cost), update.
3. **Select the unvisited node with the smallest cost.** Mark it as visited.
4. **Repeat:** Update that node's unvisited neighbors.
5. **Continue** until all nodes are visited.

At each step, the algorithm maintains a set of nodes whose shortest paths are known, and a set of tentative costs for the rest. The predecessor information yields the shortest-path tree.

---

## What is the computational complexity of the link-state routing algorithm?

Dijkstra's algorithm has complexity **O(n²)** with a simple array, or **O(n log n)** using a priority queue (min-heap), where n is the number of nodes. Each router must run this computation independently.

Additionally, the flooding of link-state advertisements has **O(nE)** message complexity, where E is the number of edges.

---

## What is the main idea behind the distance vector routing algorithm?

In distance vector (DV) routing, **nodes only communicate with their direct neighbors**. Each node maintains a vector of estimated costs to every destination. Periodically (or upon change), nodes share their distance vectors with neighbors, who update their own tables using the **Bellman-Ford equation**:

$$d_x(y) = \min_v \{ c(x,v) + d_v(y) \}$$

Where $d_x(y)$ is the estimated cost from x to y, $c(x,v)$ is the cost of the link from x to neighbor v, and $d_v(y)$ is neighbor v's reported cost to y.

Key difference from link-state: nodes have **no global view** — they only know their neighbors' distance vectors.

---

## Walk through an example of the distance vector algorithm

Consider three nodes A, B, C in a triangle with link costs: A-B = 1, B-C = 2, A-C = 5.

1. **Initial:** Each node knows only its direct link costs. A's DV: {A:0, B:1, C:5}. B's DV: {A:1, B:0, C:2}. C's DV: {A:5, B:2, C:0}.
2. **Exchange:** A receives B's DV. A recalculates: cost to C via B = 1 + 2 = 3 < 5. A updates: {A:0, B:1, C:3}.
3. **Converge:** After all nodes exchange and update, the algorithm converges to the shortest paths.

---

## When does the count-to-infinity problem occur in the distance vector algorithm?

The count-to-infinity problem occurs when a **link cost increases or a link fails**, and nodes keep routing through each other in a loop, slowly incrementing the cost.

**Example:** If A reaches C through B (cost 3), and the B-C link fails, B may try to route to C through A (thinking A can reach C for cost 3). A then routes through B, B through A, each incrementing the cost by the A-B link cost each round. The cost "counts to infinity" one step at a time.

This is a consequence of nodes relying on **stale information** from neighbors and the lack of global topology knowledge.

---

## How does poison reverse solve the count-to-infinity problem?

With **poison reverse**, if a node routes to a destination through a particular neighbor, it advertises an **infinite cost** for that destination back to that neighbor.

**Example:** If A routes to C via B, then A tells B that its distance to C is ∞. This prevents B from trying to route to C through A, breaking the routing loop.

!!! warning "Limitation"
    Poison reverse only solves the count-to-infinity problem for loops involving **two nodes**. Loops involving three or more nodes can still occur.

---

## What is the Routing Information Protocol (RIP)?

RIP is a **distance vector** intradomain routing protocol:

- Uses **hop count** as the cost metric (max 15 hops; 16 = ∞).
- Exchanges routing tables every **30 seconds**.
- Uses **split horizon with poison reverse** to mitigate loops.
- Suitable for small to medium networks due to the 15-hop limit.
- Operates over UDP, port 520.

---

## What is the Open Shortest Path First (OSPF) protocol?

OSPF is a **link-state** intradomain routing protocol:

- Uses Dijkstra's algorithm to compute shortest paths.
- Supports **hierarchical routing** with areas (reduces LSA flooding).
- Supports **multiple cost metrics** (bandwidth, delay, etc.).
- Provides **fast convergence** — changes propagate quickly via flooding.
- Supports **authentication** of routing messages.
- Supports **equal-cost multi-path (ECMP)** routing.
- Operates directly over IP (protocol number 89).

---

## How does a router process advertisements?

When a router receives a routing advertisement:

1. **Link-state (OSPF):** The router checks if the LSA is new. If so, it updates its link-state database, re-floods the LSA to neighbors, and reruns Dijkstra's algorithm to recompute the forwarding table.
2. **Distance vector (RIP):** The router compares the advertised costs with its current table. If a better path is found (lower cost via the advertising neighbor), it updates its table and propagates the change to its own neighbors.

---

## What is hot potato routing?

Hot potato routing is a strategy where an AS attempts to **hand off traffic to the next AS as quickly as possible** to minimize the traffic's transit cost within its own network infrastructure.

When multiple egress points (exit routers) exist to reach a destination, the router selects the **closest egress point** (lowest intradomain cost), regardless of the interdomain path quality beyond that point.

**Trade-off:** Optimizes the sending AS's internal costs but may result in suboptimal end-to-end paths for the traffic.

---

## Describe the relationships between ISPs, IXPs, and CDNs

- **ISPs (Internet Service Providers)** provide Internet connectivity. They are organized in tiers: Tier-1 (global backbone, peer with all other Tier-1s), Tier-2 (regional, buy transit from Tier-1), and Tier-3/Access ISPs (connect end users).
- **IXPs (Internet Exchange Points)** are physical locations where multiple networks interconnect and exchange traffic directly, avoiding transit costs. They reduce latency and improve performance.
- **CDNs (Content Delivery Networks)** distribute content across geographically dispersed servers. They connect to ISPs and IXPs to place content close to users.

These three form the modern Internet ecosystem: ISPs carry traffic, IXPs enable efficient peering, and CDNs optimize content delivery.

---

## What is an AS?

An **Autonomous System (AS)** is a large network or group of networks under a single administrative domain that presents a unified routing policy to the Internet. Each AS is identified by a unique **AS Number (ASN)**.

Examples: A large ISP, a university network, or a major corporation's network.

---

## What kind of relationship does an AS have with other parties?

1. **Provider-Customer** — The customer pays the provider for transit (access to the rest of the Internet). Traffic flows: provider carries customer's traffic to/from the Internet.
2. **Peer-to-Peer** — Two ASes agree to exchange traffic between their respective customers for free (settlement-free peering). Neither pays the other.
3. **Sibling** — Two ASes owned by the same organization that freely exchange all traffic.

**Export rules based on relationships:**

- Routes learned from **customers** → advertise to everyone (profitable).
- Routes learned from **peers/providers** → advertise only to customers (not profitable to carry transit traffic for free).

---

## What is BGP?

**BGP (Border Gateway Protocol)** is the de facto **interdomain routing protocol** of the Internet. It enables ASes to exchange reachability information and apply routing policies.

- BGP is a **path-vector protocol** — routes include the full AS path, which helps detect and prevent loops.
- BGP uses **TCP** (port 179) for reliable message exchange between peers.
- BGP supports **policy-based routing** — ASes can filter and prioritize routes based on business relationships.

---

## How does an AS determine what rules to import/export?

ASes use BGP policies driven by **business relationships**:

**Import (route selection):**

1. Prefer routes learned from **customers** (revenue-generating).
2. Then routes from **peers** (free, but limited).
3. Last, routes from **providers** (costly transit).

**Export (route advertisement):**

- Routes from customers → advertise to **everyone** (customers, peers, providers).
- Routes from peers → advertise only to **customers**.
- Routes from providers → advertise only to **customers**.

This follows the principle: **an AS only wants to carry transit traffic if it gets paid for it.**

---

## What were the original design goals of BGP? What was considered later?

**Original goals:**

- **Scalability** — Handle the growing number of ASes and prefixes.
- **Policy expressiveness** — Allow ASes to implement business-driven routing decisions.
- **Cooperation under competing interests** — Enable routing between independently operated networks.

**Later considerations:**

- **Security** — BGP was not originally designed with authentication, leading to vulnerabilities like prefix hijacking. RPKI and BGPsec were developed later.
- **Convergence speed** — Improving the time it takes for routing changes to propagate.

---

## What are the basics of BGP?

- **BGP sessions:** Two BGP routers (peers) establish a TCP connection and exchange routing information.
- **UPDATE messages:** Announce new routes or withdraw previously announced routes.
- **Route attributes:** Each route carries attributes like AS_PATH, NEXT_HOP, LOCAL_PREF, MED (Multi-Exit Discriminator).
- **Decision process:** BGP uses a sequential decision process to select the best route from multiple candidates.

---

## What is the difference between iBGP and eBGP?

| Feature | eBGP | iBGP |
|---------|------|------|
| **Between** | Routers in **different** ASes | Routers in the **same** AS |
| **Purpose** | Exchange routes between ASes | Distribute external routes within an AS |
| **AS_PATH** | Prepends the AS number | Does not modify AS_PATH |
| **Next-hop** | Typically changes | Typically preserved (unchanged) |
| **Full mesh** | Not required | Required (or use route reflectors) |

---

## What is the difference between iBGP and IGP-like protocols (RIP or OSPF)?

| Feature | iBGP | IGP (RIP/OSPF) |
|---------|------|-----------------|
| **Purpose** | Distribute externally learned BGP routes within the AS | Compute intradomain shortest paths |
| **Scope** | Carries interdomain routing info | Carries intradomain routing info |
| **Metrics** | Policy-based (LOCAL_PREF, AS_PATH, etc.) | Cost/hop-based metrics |
| **Convergence** | Slower (relies on IGP for internal reachability) | Faster |

They serve complementary roles: IGP handles internal routing; iBGP distributes external routes learned via eBGP.

---

## How does a router use the BGP decision process to choose which routes to import?

The BGP decision process is a **sequential tiebreaking** procedure:

1. **Highest LOCAL_PREF** — Prefer routes with the highest local preference (set by local policy).
2. **Shortest AS_PATH** — Prefer routes traversing fewer ASes.
3. **Lowest origin type** — IGP < EGP < Incomplete.
4. **Lowest MED** — Multi-Exit Discriminator (if from the same neighboring AS).
5. **eBGP over iBGP** — Prefer externally learned routes.
6. **Lowest IGP cost to NEXT_HOP** — Hot potato routing.
7. **Lowest router ID** — Final tiebreaker.

---

## What are the 2 main challenges with BGP? Why?

1. **Misconfigurations** — BGP configuration is complex and manual. Small errors can cause widespread routing problems (e.g., accidentally announcing someone else's prefixes, route leaks). There's no built-in mechanism to verify the correctness of announcements.

2. **Security / Lack of authentication** — BGP was designed without strong security. Any AS can announce any prefix, leading to **prefix hijacking** attacks. Solutions like RPKI (Resource Public Key Infrastructure) are being deployed but adoption is gradual.

---

## What is an IXP?

An **Internet Exchange Point (IXP)** is a physical infrastructure where multiple networks (ISPs, CDNs, content providers) interconnect to exchange traffic directly via peering, rather than through transit providers.

---

## What are four reasons for IXPs' increased popularity?

1. **Cost savings** — Peering is cheaper than paying transit providers.
2. **Performance** — Direct interconnection reduces latency and packet loss.
3. **Keeps local traffic local** — Traffic between nearby networks doesn't need to traverse distant backbone links.
4. **Expanded services** — Modern IXPs offer route servers, DDoS mitigation, DNS hosting, and other value-added services.

---

## Which services do IXPs provide?

- **Public peering** — Shared switching fabric for traffic exchange.
- **Private peering** — Dedicated cross-connects between specific members.
- **Route servers** — Simplify peering by centralizing BGP session management.
- **DDoS mitigation** — Blackholing and scrubbing services.
- **DNS root server hosting** — Hosting instances of root DNS servers.
- **Time synchronization (NTP)** services.

---

## How does a route server work?

A route server at an IXP acts as a **centralized BGP session broker**:

1. Instead of establishing bilateral BGP sessions with every other member (O(n²) sessions), each member peers with the **route server** (O(n) sessions).
2. The route server collects routes from all members and redistributes them according to each member's peering policies.
3. The route server does **not** forward data traffic — it only handles BGP control plane messages. Data still flows directly between members through the IXP switching fabric.
