---
quiz:
  auto_number: true
  shuffle_answers: true
  disable_after_submit: false
---

# Lesson 1: Interactive Quiz

Test yourself on Internet architecture. Progress is saved in your browser. For written answers and explanations, see the [Quick Study Guide](lesson-01-quick-study-guide.md) or [Practice Questions](practice-questions.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## Architecture & history

<quiz>
The Internet's core design idea is to keep the network core simple and place application-specific logic at the [[endpoints]].
---
This is the **end-to-end principle**: reliability, ordering, and encryption are usually handled by end hosts, not routers in the middle.
</quiz>

<quiz>
How many layers does the five-layer **Internet model** have?
- [ ] 7
- [x] 5
- [ ] 4

The OSI model has 7 layers. The Internet model combines application, presentation, and session into one **application** layer.
</quiz>

<quiz>
Which pairing is correct for layer and packet name?
- [x] Transport → segment; Network → datagram
- [ ] Transport → datagram; Network → segment
- [ ] Transport → frame; Network → message

Memory aid: **Message → Segment → Datagram → Frame → Bits**
</quiz>

---

## Devices & encapsulation

<quiz>
Which device forwards traffic based on **IP addresses**?
- [ ] Hub
- [ ] Switch / bridge
- [x] Router
- [ ] Repeater

**Hub** = bits; **switch** = MAC; **router** = IP.
</quiz>

<quiz>
At the transport layer, the unit of data is called a [[segment]]. At the network layer, it is called a [[datagram]].
---
Each layer adds a header as data moves down the stack (**encapsulation**). The receiver strips headers (**de-encapsulation**).
</quiz>

---

## End-to-end principle

<quiz>
802.11 (Wi-Fi) link-layer error correction is a violation of the end-to-end principle.
- [ ] Yes
- [x] No

Link-layer error checking compensates for a noisy medium. It does not stop end hosts from implementing their own reliability. **NAT** and **firewalls** are classic violations.
</quiz>

<quiz>
Which are examples of **violations** of the end-to-end principle?
- [x] NAT
- [x] Firewalls
- [ ] TCP running on end hosts
- [x] Deep packet inspection (DPI)

Violations add control or intelligence **inside** the network instead of only at endpoints.
</quiz>

---

## Hourglass & EvoArch

<quiz>
Which of the following are ramifications of the **hourglass shape** of the Internet?
- [x] Technologies adapt to work over IP (e.g., Radio over IP)
- [x] Slow IPv6 adoption despite IPv4 address scarcity
- [ ] BitTorrent uses P2P instead of client-server

The hourglass is about **protocol layers**, not application design patterns like P2P.
</quiz>

<quiz>
The narrow "waist" of the Internet hourglass is primarily:
- [x] IP, TCP, and UDP
- [ ] Only HTTP and DNS
- [ ] Only Ethernet and Wi-Fi

Many applications above and many link technologies below interoperate through a small set of core protocols.
</quiz>

<quiz>
In EvoArch, a protocol's **evolutionary value** increases when:
- [x] More important protocols and applications depend on it
- [ ] It is the newest protocol at that layer
- [ ] It has the smallest header size

Protocols survive when many **products** (dependents above) rely on them—not only when they are technically superior.
</quiz>

---

## Bridges & Spanning Tree

<quiz>
A learning bridge builds its table by observing the [[source]] MAC address and the incoming port.
---
It **forwards** using the **destination** MAC. Memory aid: learn from **source**, forward to **destination**.
</quiz>

<quiz>
Why are Layer 2 loops dangerous?
- [x] Ethernet frames have no TTL, so frames can circulate forever
- [ ] IP packets cannot be routed in a loop
- [ ] Switches only support one port

Loops can cause **broadcast storms**, congestion, and unstable forwarding tables.
</quiz>

<quiz>
Which statement about the **Spanning Tree Algorithm** is correct?
- [x] STA prevents broadcast storms caused by Layer 2 loops
- [ ] The root bridge is always the most central bridge
- [ ] Data cannot physically reach a blocked link

The root has the **smallest bridge ID**. Blocked ports do not **forward**, but links still exist physically.
</quiz>

<quiz>
In the Spanning Tree Algorithm, the root bridge is selected by:
- [x] Smallest bridge ID
- [ ] Shortest physical cable length
- [ ] Highest port count

Each bridge then picks its shortest path to the root; ports that would create cycles are **blocked**.
</quiz>

---

## Sockets

<quiz>
A socket is the interface between the application and the transport layer, identified by an [[IP address]] and a [[port number]].
---
Memory aid: **Socket = door** between the app and TCP/UDP.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Full Lesson 1 guide](lesson-01-introduction.md)
    - [Quick study guide with written answers](lesson-01-quick-study-guide.md)
    - [More practice questions](practice-questions.md)
