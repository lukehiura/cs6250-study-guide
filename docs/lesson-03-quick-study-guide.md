# Lesson 3: Quick Study Guide — Intradomain Routing

Condensed review for exams. Full detail: [Lesson 3 guide](lesson-03-intradomain-routing.md). Practice: [Lesson 3 Quiz](lesson-03-quiz.md). BGP: [Lesson 4](lesson-04-interdomain-routing.md).

---

## 1. Big picture

- **Transport** = end-to-end between apps; **IP/routing** = hop-by-hop path through routers.
- Traffic crosses **multiple ASes** (enterprise → ISP → CDN).
- **IGP** = inside one AS; **BGP** = between ASes.

---

## 2. Forwarding vs routing

| | Forwarding | Routing |
|---|------------|---------|
| Plane | Data | Control |
| Speed | Per packet | On topology change |
| Job | Lookup → output port | Compute/update forwarding table |

---

## 3. Link-state (OSPF)

1. Flood **LSAs** → shared topology (per **area**)
2. Graph: nodes = routers, edges = costs
3. **Dijkstra** from self to all destinations
4. FIB = **next hop** on shortest-path tree

**Notation:** u = source; **D(v)** = best cost u→v; **p(v)** = predecessor; **N′** = confirmed nodes; **c(u,v)** = link cost

**Dijkstra loop:** add min D(w) to N′; relax neighbors: D(v) = min(D(v), D(w)+c(w,v))

**Course example (source u):** u–x=1, u–v=2, u–w=5, x–y=1, y–z=2, … → D(z)=4 via x→y→z; next hop to z is **x**

**Complexity:** Each iteration scan nodes ∉ N′ → (n−1)+(n−2)+…+1 = **n(n−1)/2** → **O(n²)**; heap → O(n log n)

**OSPF:** LS Update → LSA process → LSDB → SPF → FIB; duplicate LSA → **immediate ack**

**OSPF delays (optional):** SPF ~ms (O(N²)); FIB update can be **slower** than SPF

**OSPF:** areas + backbone (0) + **ABRs**; IP proto 89; ECMP

---

## 4. Distance-vector (RIP)

**Properties:** iterative, **asynchronous**, **distributed**

**Bellman-Ford:** $D_x(y) = \min_v \{ c(x,v) + D_v(y) \}$ — try each neighbor as first hop

**3-node example (x,y,z):** links xy=2, yz=1, xz=7 → after exchange $D_x(z)=min(2+1,7)=3$ via **y**

**Converge:** no vector changes → wait until link event

**RIP:** hop metric, max 15 hops, UDP 520, poison reverse + split horizon

---

## 5. Count-to-infinity (x,y,z example)

Topology: c(xy)=4→**60**, c(yz)=1, c(xz)=50

**Good news (xy: 4→1):** y updates → z gets $D_z(x)=2$ in ~2 rounds

**Bad news (yx→60):** at t0, y uses **stale** $D_z(x)=5$ → $D_y(x)=1+5=6$; y↔z loop; costs 6,7,8… for **~44** rounds until z prefers direct (50)

**Poison reverse:** if route to x via y, advertise **∞** to y — fixes **2-node** loops only

## 6. RIP

Hop count; UDP **520**; **180 s** timeout; merge ads: if 1+hops(A) < current, update

Router D example: w via A (2 hops); after A’s ad, shorter path to z via A

## 7. OSPF processing

LS Update → LSDB → SPF (Dijkstra) → **FIB**; areas + backbone 0; LSA refresh **30 min**

T1–T7: process LSAs (T2), flood (T4), SPF (T5–6), FIB (T7)

## 8. Hot potato

Multiple BGP-equivalent egresses → pick **lowest IGP cost** egress (Dallas: SF=9 vs NY=10). IGP change can shift egress / BGP.

---

## 8b. Traffic engineering (optional)

**Measure** topology + traffic → **Model** what-if IGP weights (shortest paths, ECMP) → **Control** push new weights (LSA flood, SPF, FIB). Done rarely; brief transient on change.

---

## 9. LS vs DV cheat sheet

| | LS | DV |
|---|----|----|
| Map | Global (area) | Neighbors only |
| Algo | Dijkstra | Bellman-Ford |
| Protocol | OSPF | RIP |
| Pitfall | LSA flooding scale | Count-to-infinity |

---

## 10. High-yield exam Q&A

### Forwarding vs routing?

**Forwarding** = data plane table lookup per packet. **Routing** = control plane builds that table.

### Main idea of link-state?

Shared topology via LSAs; each router runs Dijkstra; install next hops.

### Main idea of distance-vector?

Each router knows costs to all destinations via **neighbor advertisements** only; Bellman-Ford updates.

### Count-to-infinity when?

Link **failure** or cost **increase** in DV — mutual stale routes.

### Poison reverse?

Advertise **∞** to the neighbor you use for that dest — break 2-node loops.

### OSPF vs RIP?

**OSPF** = link-state, Dijkstra, areas. **RIP** = distance-vector, hop count ≤ 15.

### Hot potato?

**Closest egress** (min IGP cost) when BGP exits tie.

---

## 11. One-page cheat sheet

```
IGP inside AS | BGP between ASes
Forwarding = fast lookup | Routing = compute table

Link-state: LSA flood → Dijkstra → next hop (OSPF, areas/ABR)
Distance-vector: neighbor vectors → Bellman-Ford (RIP)

Count-to-infinity: bad news slow in DV
Poison reverse: tell neighbor ∞ if route via them

Hot potato: min IGP cost to egress when BGP ties
```
