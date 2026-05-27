# Lesson 6: Router Design and Algorithms (Part 2)

---

## Why is packet classification needed?

Simple forwarding uses only the destination IP address (longest prefix match). However, modern routers need to handle packets differently based on **multiple header fields** — source IP, destination IP, source port, destination port, and protocol. This is required for:

- **Firewalls** — Block or allow traffic based on rules.
- **Quality of Service (QoS)** — Prioritize certain traffic classes.
- **Traffic engineering** — Route traffic along specific paths.
- **Network Address Translation (NAT)** — Map internal to external addresses.

Packet classification matches each packet against a **set of rules** defined on multiple fields simultaneously.

---

## What are three established variants of packet classification?

1. **Firewalls** — Match packets against access control lists (ACLs) to permit or deny traffic.
2. **Resource Reservations (QoS)** — Classify packets to assign them to specific service classes with guaranteed bandwidth or priority.
3. **Routing based on Traffic Type** — Different forwarding paths for different types of traffic (e.g., VoIP vs. web browsing).

---

## What are the simple solutions to the packet classification problem?

1. **Linear search** — Check each rule sequentially. Simple but O(N) per packet — too slow for large rule sets.
2. **Caching** — Cache the results of recent classifications. Works well if traffic has locality, but the cache can be large and cache misses are expensive.
3. **Passing labels** — MPLS-style: classify once at the network edge and attach a label; interior routers forward based on labels without re-classifying. Efficient but requires edge classification and label management.

---

## How does fast searching using set-pruning tries work?

Set-pruning tries build a **trie on one field** (e.g., destination IP) and at each leaf, store a **separate trie on a second field** (e.g., source IP) containing only the rules relevant to that destination prefix.

The lookup walks the first trie to find the matching destination prefix, then walks the second trie at that leaf to match the source field. This narrows the search space at each step.

---

## What's the main problem with set pruning tries?

**Memory explosion.** A rule may need to be **replicated across many leaves** in the first trie. If a rule has a wildcard in the first field (e.g., destination = `*`), it must be copied to every leaf node. This can cause the total storage to grow to **O(N × W)** or worse, where N is the number of rules and W is the number of leaves.

---

## What is the difference between the pruning approach and the backtracking approach for packet classification with a trie?

**Set-pruning approach:**

- **Pre-computes** which rules are relevant at each trie node by copying rules down to leaves.
- **Fast lookup** — no need to revisit nodes.
- **High memory cost** — rules are duplicated.

**Backtracking approach:**

- Does **not** duplicate rules. Each rule is stored once at its natural position in the trie.
- During lookup, if no match is found at a leaf, the algorithm **backtracks** to ancestor nodes and searches their associated tries.
- **Lower memory** — but **slower lookup** due to backtracking.

---

## What's the benefit of a grid of tries approach?

The **grid of tries** approach combines the benefits of both pruning and backtracking:

- It builds a trie on one dimension and links nodes to tries on the second dimension.
- Instead of replicating rules or backtracking blindly, it adds **switch pointers** that jump directly to the right node in the second trie when backtracking is needed.
- **Benefit:** Achieves fast lookup (avoids full backtracking) without the memory explosion of set-pruning tries.
- Lookup requires at most **2W memory accesses** (where W is the trie width), compared to potentially many more with backtracking.

---

## Describe the "Take the Ticket" algorithm

The Take the Ticket algorithm is used for **scheduling access to a shared output port** in a switch/router:

1. Each input port that has a packet for a specific output port takes a "ticket" (a number).
2. The output port serves input ports **in ticket order** (FIFO among contending inputs).
3. When a ticket's number is called, that input port sends its packet through the fabric.

This is analogous to a deli counter: customers take a number and are served in order. It provides **fair, ordered access** to the output port but can suffer from head-of-line blocking.

---

## What is the head-of-line (HOL) problem?

Head-of-line blocking occurs when the **packet at the front of an input queue** is destined for a busy output port, and it **blocks all packets behind it** — even if those subsequent packets are destined for idle output ports.

This reduces the maximum achievable throughput of the switch. With FIFO input queuing and uniform random traffic, HOL blocking limits throughput to approximately **58.6%** (2 − √2) of the switch capacity.

---

## How is the head-of-line problem avoided using the knockout scheme?

The knockout scheme uses a **crossbar** with **output buffers**:

- Each output port has a concentrator that can accept packets from up to **k** input ports simultaneously (where k < N).
- The assumption is that it's rare for more than k inputs to send to the same output in one cycle.
- If more than k inputs contend, **excess packets are dropped** ("knocked out").
- For practical traffic patterns, a small k (e.g., 8) captures most packets with very low loss probability.

This avoids HOL blocking because packets are not queued at inputs — they go directly to output buffers.

---

## How is the head-of-line problem avoided using parallel iterative matching?

**Parallel Iterative Matching (PIM)** avoids HOL blocking by using **Virtual Output Queues (VOQs)** at each input. Instead of a single FIFO queue, each input maintains a separate queue for each output port.

The matching algorithm runs in rounds:

1. **Request** — Each input sends a request to every output for which it has a queued packet.
2. **Grant** — Each output selects one request (randomly) and grants it.
3. **Accept** — Each input that received multiple grants accepts one (randomly).

Multiple rounds refine the matching. This achieves high throughput because a blocked packet to one output doesn't prevent other packets at the same input from being matched to different outputs.

---

## Describe FIFO with tail drop

**FIFO (First-In, First-Out)** is the simplest queuing discipline:

- Packets are transmitted in the order they arrive.
- **Tail drop:** When the buffer is full, newly arriving packets are **dropped** (the "tail" of the queue is dropped).

This is simple but has drawbacks:

- **No differentiation** between traffic classes.
- Can lead to **global synchronization** — multiple TCP flows simultaneously detect loss and back off, then ramp up together, causing oscillations.

---

## What are the reasons for making scheduling decisions more complex than FIFO?

1. **Fairness** — FIFO doesn't prevent a single aggressive flow from consuming all bandwidth.
2. **QoS guarantees** — Different applications need different service levels (latency, bandwidth, jitter).
3. **Isolation** — Misbehaving flows shouldn't degrade service for well-behaved flows.
4. **Bandwidth allocation** — Administrators may want to allocate specific bandwidth shares to different traffic classes.
5. **Avoiding global synchronization** — More sophisticated drop policies (like RED) can prevent the synchronized loss patterns that FIFO with tail drop causes.

---

## Describe Bit-by-bit Round Robin scheduling

Bit-by-bit Round Robin (also called **Fair Queuing**) is an idealized scheduling algorithm:

- The scheduler imagines sending **one bit** from each active flow in a round-robin fashion.
- This ensures each flow gets an exactly equal share of the link bandwidth.
- In practice, packets can't be split into individual bits, so the scheduler computes a **virtual finish time** for each packet — the time at which the last bit of the packet would depart in the bit-by-bit system.
- Packets are transmitted in order of their virtual finish times.

---

## Bit-by-bit Round Robin provides fairness; what's the problem with this method?

The main problem is **computational complexity**: computing the virtual finish time for each packet requires tracking the state of all active flows and simulating the bit-by-bit round-robin system. This is expensive and difficult to implement at line rate.

Additionally, it's an **idealization** — since real packets are atomic units, you can't actually interleave bits from different packets. The finish-time computation approximation can lead to small fairness deviations.

---

## Describe Deficit Round Robin (DRR)

Deficit Round Robin is a practical, efficient fair-queuing algorithm:

1. Each flow has a **queue** and a **deficit counter** (initialized to 0).
2. A fixed **quantum** (Q) is assigned to each flow per round.
3. In each round, each flow's deficit counter is incremented by Q.
4. The flow can send packets as long as the packet size ≤ deficit counter.
5. After sending a packet, the deficit counter is decremented by the packet size.
6. If the next packet is too large, the remaining deficit **carries over** to the next round.
7. If the queue is empty, the deficit counter resets to 0.

**Advantages:**

- **O(1) per packet** — No complex finish-time computations.
- Provides **long-term fairness** even with variable packet sizes.
- Simple to implement in hardware.

---

## What is token bucket shaping?

A token bucket is a traffic shaping mechanism:

- A "bucket" holds **tokens** that accumulate at a constant rate **r** (tokens/second).
- The bucket has a maximum capacity **b** (burst size).
- To transmit a packet, the sender must remove tokens equal to the packet size from the bucket.
- If enough tokens are available → packet is sent immediately.
- If not enough tokens → packet must wait until tokens accumulate.

**Effect:** The long-term average rate is limited to **r**, but bursts of up to **b** bytes can be sent instantaneously. The token bucket smooths traffic while allowing controlled bursting.

---

## In traffic scheduling, what is the difference between policing and shaping?

**Shaping** buffers excess traffic and releases it later when the rate permits. Traffic is delayed but not dropped — the output is smooth and conforms to the rate limit.

**Policing** drops or marks excess traffic that exceeds the rate limit without buffering. Non-conforming packets are immediately discarded or marked for potential dropping downstream.

| Aspect | Shaping | Policing |
|--------|---------|----------|
| **Action on excess** | Buffer/delay | Drop/mark |
| **Buffering** | Required | Not required |
| **Output pattern** | Smooth | Bursty (within limits) |
| **Use case** | Outbound traffic at network edge | Enforcing SLAs, inbound rate limits |

---

## How is a leaky bucket used for traffic policing and shaping?

The **leaky bucket** is a traffic control mechanism:

- Packets enter the bucket (buffer) at variable rates.
- The bucket "leaks" (transmits) packets at a **fixed, constant rate**.
- If the bucket is full, incoming packets are **dropped** (policing) or the sender is forced to wait (shaping).

**For policing:** The bucket has finite capacity. Packets arriving when the bucket is full are dropped. This enforces a strict maximum rate.

**For shaping:** The bucket buffers packets and releases them at the fixed rate, smoothing out bursts. The output is a steady stream regardless of input burstiness.

**Difference from token bucket:** The leaky bucket enforces a strict constant rate (no bursting), while the token bucket allows bursts up to the bucket capacity.
