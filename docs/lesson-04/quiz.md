---
quiz:
  auto_number: true
  shuffle_answers: true
  disable_after_submit: false
---

# Lesson 4: Interactive Quiz

Interdomain routing, BGP policy, business relationships, and IXPs. New to the material? Start with the [Plain-language guide](plain-language.md). See the [Quick Study Guide](quick-study-guide.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## IGP vs BGP & autonomous systems

<quiz>
Which protocol family is primarily used for routing **between** autonomous systems on the Internet?
- [ ] OSPF
- [ ] RIP
- [x] BGP
- [ ] ARP

**IGP** protocols (OSPF, RIP) route **inside** one AS; **BGP** is the default **interdomain** protocol.
</quiz>

<quiz>
An **Autonomous System (AS)** is best defined as:
- [x] Routers and links under a single administrative authority with one routing policy
- [ ] Any home Wi-Fi network without an ASN
- [ ] Only Tier-1 ISP backbones
- [ ] A DNS zone file

Each AS has a unique **ASN** and runs **IGP** internally, **BGP** at borders.
</quiz>

<quiz>
At Internet scale, BGP exchanges reachability for [[prefixes]] (blocks of IP addresses), not individual hosts.
---
Destinations are advertised as CIDR prefixes (e.g., `203.0.113.0/24`).
</quiz>

---

## Business relationships

<quiz>
In a **customer–provider (transit)** relationship:
- [x] The customer pays the provider to reach the rest of the Internet in both directions
- [ ] Neither party pays; both share full routing tables freely
- [ ] Only outbound traffic is carried by the provider
- [ ] The provider learns routes only from peers, not customers

Transit is a **paid** relationship; the provider advertises reachability **both ways**.
</quiz>

<quiz>
In a typical **peering** agreement between two ASes:
- [x] Neither usually pays the other; routes shared are limited (often own customers only)
- [ ] The smaller AS always pays the larger AS per gigabyte
- [ ] Each peer must advertise routes learned from its providers to the other peer
- [ ] Peering always replaces the need for any transit provider

Advertising provider/peer routes to a peer would make you **free transit** — not allowed.
</quiz>

<quiz>
A common provider billing method that ignores the top 5% of bandwidth samples is the [[95th]] percentile model.
---
Providers sample utilization periodically; charge based on the 95th highest reading to ignore brief spikes.
</quiz>

---

## Import & export policy

<quiz>
An AS learns a route from a **customer**. Per standard export policy, it should advertise that route to:
- [x] Customers, peers, and providers (everyone)
- [ ] Customers only
- [ ] No one — customer routes stay private
- [ ] Peers only

Carrying customer traffic generates **revenue** — advertise widely.
</quiz>

<quiz>
An AS learns a route from a **peer** or **provider**. It should typically export that route to:
- [ ] Everyone including other peers and providers
- [x] Its own customers only
- [ ] No one
- [ ] Tier-1 ISPs only

Exporting peer/provider routes upward would provide **free transit** for non-paying networks.
</quiz>

<quiz>
When multiple neighbors advertise a route to the same destination, import preference is:
- [x] Customer routes > peer routes > provider routes
- [ ] Provider routes > peer routes > customer routes
- [ ] Shortest AS-PATH only — business relationships do not matter
- [ ] Random among equal-length paths

Interdomain routing reflects **policy and economics**, not just shortest path.
</quiz>

---

## BGP protocol basics

<quiz>
BGP sessions between peers run over:
- [x] TCP (reliable, semi-permanent connection)
- [ ] UDP only
- [ ] ICMP echo requests
- [ ] Raw Ethernet frames with no transport layer

BGP uses **TCP port 179** for session establishment and message exchange.
</quiz>

<quiz>
Which BGP message type informs a peer that a previously announced route is no longer available?
- [ ] OPEN
- [ ] KEEPALIVE
- [x] UPDATE (withdrawal)
- [ ] ACK

**UPDATE** messages can **announce** new/changed routes or **withdraw** unavailable ones.
</quiz>

<quiz>
The BGP attribute that lists AS numbers traversed and helps prevent routing loops is [[AS-PATH]] (or AS_PATH).
---
Each AS prepends its ASN as a route is exported; loops are detected if your own ASN appears in the path.
</quiz>

<quiz>
For external destinations, the BGP [[NEXT-HOP]] attribute typically identifies the border router interface toward the destination.
---
Internal routers forward to the border router; **IGP** finds the path across the AS to that next-hop.
</quiz>

---

## eBGP vs iBGP

<quiz>
**eBGP** sessions are established between:
- [x] Border routers in different autonomous systems
- [ ] All routers inside one AS only
- [ ] DNS servers and web caches
- [ ] End hosts and their default gateway

**eBGP** learns routes from **outside** neighbors.
</quiz>

<quiz>
**iBGP** inside an AS is primarily used to:
- [x] Disseminate externally learned routes to all internal BGP-speaking routers
- [ ] Replace OSPF for computing shortest internal paths
- [ ] Assign IP addresses to end hosts
- [ ] Encrypt packets at the network layer

**iBGP** distributes reachability; **IGP** still computes internal paths to the BGP next-hop.
</quiz>

<quiz>
A common iBGP scaling pattern within a large AS is a [[full mesh]] of sessions among BGP routers.
---
Each eBGP-speaking router typically maintains iBGP with every other BGP router in the AS (unless route reflectors are used — beyond core course scope).
</quiz>

---

## BGP path selection

<quiz>
In the BGP decision process, the **first** attribute compared (highest wins) is:
- [x] LOCAL_PREF (Local Preference)
- [ ] MED
- [ ] Router ID
- [ ] TCP port number

**LocalPref** is set by the **local AS** and controls **outbound** exit preference.
</quiz>

<quiz>
**LOCAL_PREF** is controlled by the [[local]] AS and influences which exit point is preferred for outbound traffic.
---
Higher LocalPref = more preferred. Typical ranges encode customer > peer > provider.
</quiz>

<quiz>
**MED (Multi-Exit Discriminator)** is primarily used to:
- [x] Suggest which interconnection point a neighbor prefers for inbound traffic into its AS
- [ ] Encrypt BGP sessions
- [ ] Replace AS-PATH for loop detection
- [ ] Set TCP window size on BGP peers

MED is a **suggestion** from the **neighbor** — the receiving AS may honor or ignore it.
</quiz>

<quiz>
When comparing MED values, they are only meaningful among routes from the [[same]] neighboring AS.
---
MED is not compared across different neighbors — only among multiple paths from one peer.
</quiz>

<quiz>
Step 6 of the BGP decision process (lowest IGP cost to NEXT-HOP) implements:
- [x] Hot potato routing — pick the closest egress border router
- [ ] Longest AS-PATH selection
- [ ] DNS load balancing
- [ ] TCP slow start

See [Lesson 3 hot potato](../lesson-03/intradomain-routing.md#hot-potato-routing) for the intradomain side.
</quiz>

<quiz>
In the standard BGP decision order, which comes **before** lowest MED?
- [x] Shortest AS-PATH
- [ ] Lowest router ID
- [ ] Lowest IGP cost to border
- [ ] eBGP over iBGP

Order: LocalPref → AS-PATH → origin type → MED → eBGP>iBGP → IGP cost → router ID.
</quiz>

---

## BGP challenges

<quiz>
A major operational risk with BGP misconfiguration is that:
- [x] Errors can propagate globally and cause instability far beyond one AS
- [ ] Only the misconfigured router is affected; neighbors ignore bad routes automatically
- [ ] BGP always authenticates every prefix announcement cryptographically by default
- [ ] Misconfigs are limited to the data plane and never affect routing tables

BGP was **not** designed with strong security; bad announcements can spread widely.
</quiz>

<quiz>
**Flap damping** is used to:
- [x] Suppress routes that change frequently (announce/withdraw churn)
- [ ] Increase BGP table size for redundancy
- [ ] Replace iBGP with OSPF
- [ ] Encrypt UPDATE messages

Damping trades **reachability** for **stability** when prefixes flap excessively.
</quiz>

---

## IXPs & route servers

<quiz>
An **Internet Exchange Point (IXP)** is:
- [x] Physical switching infrastructure where multiple ASes interconnect and exchange traffic locally
- [ ] A cloud CDN caching service only
- [ ] The BGP protocol itself
- [ ] A government agency that assigns IP addresses

~500 IXPs worldwide; participants peer via shared or private interconnects.
</quiz>

<quiz>
Without a route server, bilateral peering among N IXP participants requires how many BGP sessions in the worst case?
- [x] O(n²) — on the order of N(N−1)/2 pairwise sessions
- [ ] O(1) — one session total
- [ ] O(log n) — tree-shaped peering
- [ ] O(n) — one session per participant only

Full mesh bilateral peering does **not** scale — route servers reduce this to **O(n)** sessions.
</quiz>

<quiz>
A route server at an IXP handles:
- [x] Control plane (BGP route collection and redistribution with filters)
- [ ] All data-plane traffic between every participant (traffic must flow through the RS)
- [ ] DNS resolution for participant domains
- [ ] TCP congestion control for peering links

**Data traffic** flows **directly** between participants on the IXP fabric, not through the RS.
</quiz>

<quiz>
Which filter type on a route server checks whether member X is allowed to advertise prefix P?
- [x] Import filter
- [ ] Export filter only
- [ ] TCP checksum filter
- [ ] Spanning tree filter

**Import** filters validate what enters the master RIB; **export** filters control what each member receives.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Plain-language guide](plain-language.md)
    - [Full Lesson 4 guide](interdomain-routing.md)
    - [Quick Study Guide](quick-study-guide.md)
    - [Lesson 3 — Intradomain routing](../lesson-03/intradomain-routing.md)
