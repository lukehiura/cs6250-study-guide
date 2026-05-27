---
quiz:
  auto_number: true
  shuffle_answers: true
  disable_after_submit: false
---

# Lesson 3: Interactive Quiz

Intradomain routing, link-state, distance-vector, and convergence issues. See the [Quick Study Guide](lesson-03-quick-study-guide.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## Forwarding & routing

<quiz>
**Forwarding** is best described as:
- [x] Data-plane: per-packet lookup and send on an output port
- [ ] Control-plane: computing shortest paths network-wide
- [ ] DNS resolution of hostnames
- [ ] TCP congestion control

Routing builds the table; forwarding uses it on every packet.
</quiz>

<quiz>
Which protocol family typically routes packets **inside** a single autonomous system?
- [x] IGP (e.g., OSPF, RIP)
- [ ] BGP only
- [ ] DNS
- [ ] HTTP

**BGP** is mainly **interdomain** (between ASes).
</quiz>

---

## Link-state & Dijkstra

<quiz>
In link-state routing, each router:
- [x] Floods link information and runs Dijkstra locally
- [ ] Only talks to immediate neighbors with hop counts
- [ ] Never knows link costs
- [ ] Uses BGP to pick internal paths

All routers in an area build the same topology database (LSDB).
</quiz>

<quiz>
Dijkstra’s algorithm maintains N′ as the set of nodes whose shortest paths from the source are [[confirmed]].
---
Each iteration adds the tentative node with minimum D(v) to N′ and relaxes its neighbors.
</quiz>

<quiz>
In the course link-state example with source **u**, the least cost from u to **x** is [[1]] (direct link).
---
u–x has cost 1; x is added to N′ in the first iteration.
</quiz>

<quiz>
In Dijkstra notation, **p(v)** stores the [[predecessor]] node on the current best path from the source to v.
---
Tracing predecessors from v back to u gives the full path; the first hop is the forwarding-table entry.
</quiz>

<quiz>
When OSPF receives a [[duplicate]] LSA (same sequence number as in the LSDB), it must acknowledge it immediately.
---
This behavior is useful for black-box measurement of processing delays (Shaikh & Greenberg paper).
</quiz>

<quiz>
**OSPF** uses hierarchical [[areas]] connected by a backbone and area border routers to limit LSA flooding scope.
---
Backbone is typically **area 0**; ABRs connect areas to the backbone.
</quiz>

---

## Link-state complexity

<quiz>
Naive Dijkstra (link-state SPF) has worst-case time complexity:
- [x] O(n²) in the number of nodes n
- [ ] O(n) 
- [ ] O(log n)
- [ ] O(1)

Each of ~n iterations may scan O(n) nodes: (n−1)+…+1 = n(n−1)/2 comparisons.
</quiz>

---

## Distance-vector

<quiz>
Distance-vector routing is described as iterative, asynchronous, and [[distributed]] — each node updates from neighbor vectors without a central map.
---
Unlike link-state flooding, DV nodes only know their neighbors' advertised costs.
</quiz>

<quiz>
The Bellman-Ford update at node x for destination y is:
- [x] $D_x(y) = \min_v \{ c(x,v) + D_v(y) \}$
- [ ] $D_x(y) = \max_v \{ c(x,v) + D_v(y) \}$
- [ ] $D_x(y) = c(x,y)$ only
- [ ] $D_x(y) = D_y(x)$ always

Try each neighbor as first hop; pick minimum total cost.
</quiz>

<quiz>
**RIP** uses which metric?
- [x] Hop count (max 15, 16 = infinity)
- [ ] Bandwidth only
- [ ] AS_PATH length
- [ ] No metric

RIP is a classic **distance-vector** IGP for smaller networks.
</quiz>

<quiz>
In the course 3-node DV example (x–y=2, y–z=1, x–z=7), after convergence $D_x(z)$ is:
- [x] 3 (via y)
- [ ] 7 (direct)
- [ ] 1
- [ ] 0

$D_x(z) = \min\{c(x,y)+D_y(z),\, c(x,z)+D_z(z)\} = \min\{2+1,\, 7+0\} = 3$.
</quiz>

---

## Count-to-infinity & poison reverse

<quiz>
Count-to-infinity most often occurs when:
- [x] A link fails or its cost increases significantly (bad news in DV)
- [ ] A new link is added with cost zero
- [ ] OSPF floods a new LSA
- [ ] DNS TTL expires

Routers may loop through each other with **stale** distance vectors.
</quiz>

<quiz>
In the course x–y–z example, when c(y,x) jumps to 60, at t0 router y may compute $D_y(x) = c(y,z) + D_z(x) = 1 + [[5]] = 6$ using z's **stale** advertisement.
---
Z had not heard about the failure yet; y incorrectly thinks it can reach x cheaply via z.
</quiz>

<quiz>
**Poison reverse** means: if your best route to X goes through neighbor Y, you advertise distance [[infinity]] to X when speaking to Y.
---
This blocks Y from thinking it can reach X through you when your path depends on Y.
</quiz>

---

## RIP & OSPF

<quiz>
**RIP** advertisements are sent over:
- [x] UDP port 520
- [ ] TCP port 179
- [ ] IP protocol 89
- [ ] ICMP only

RIP is an application-level process; **OSPF** uses IP proto 89; **BGP** uses TCP 179.
</quiz>

<quiz>
In OSPF, traffic between two non-backbone areas must pass through the [[backbone]] area (area 0).
---
ABRs connect each area to the backbone; inter-area routing is ABR → backbone → ABR.
</quiz>

---

## Hot potato & comparison

<quiz>
**Hot potato routing** selects an egress point by:
- [x] Lowest IGP cost to that egress (closest exit)
- [ ] Longest AS_PATH
- [ ] Highest BGP LOCAL_PREF from a peer
- [ ] Random choice among exits

Goal: hand traffic to another AS quickly and save internal resources.
</quiz>

<quiz>
Which pairing is correct?
- [x] OSPF → link-state; RIP → distance-vector
- [ ] OSPF → distance-vector; RIP → link-state
- [ ] Both are path-vector like BGP
- [ ] Both use only hop count with no topology

OSPF runs Dijkstra; RIP exchanges distance vectors.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Full Lesson 3 guide](lesson-03-intradomain-routing.md)
    - [Lesson 4 — Interdomain / BGP](lesson-04-interdomain-routing.md)
