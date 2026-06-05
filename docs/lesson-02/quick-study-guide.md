---
tags:
  - lesson-02
  - tcp
  - transport
  - quick-study
search:
  boost: 2
---

# Lesson 2: Quick Study Guide — Transport Layer

Condensed review for exams. New to the material? Start with the **[Plain-language guide](plain-language.md)**. For full explanations, diagrams, and official Q&A, see the [full Lesson 2 guide](transport-application.md). For interactive practice, try the **[Lesson 2 Quiz](quiz.md)**.

---

## 1. Big picture

IP delivers **datagrams** **host-to-host** with **best effort** only. Transport delivers **segments** **process-to-process** using **ports**. **TCP** adds reliability, flow control, and congestion control; **UDP** stays minimal.

| Layer | Scope | Guarantee |
|-------|-------|-----------|
| **IP (network)** | Host-to-host | Best effort only |
| **Transport** | Process-to-process (ports) | UDP minimal / TCP reliable + rate control |

**Memory aid:** IP gets datagrams *near* the host; transport gets bytes to the *right app*.

!!! warning "Exam point"
    Use **segment** at the transport layer and **datagram** at the network layer — not "packet" when the layer matters.

---

## 2. UDP vs TCP

| | UDP | TCP |
|---|-----|-----|
| Connection | No | Yes (3-way handshake) |
| Reliability | No | Yes (ARQ, seq, ACK, retransmit) |
| Order | No | In-order byte stream |
| Flow / congestion control | No | Yes |
| Header | 8 B (4 fields × 16 bits) | 20+ B |
| When to use | Low latency, loss-tolerant (VoIP, DNS, games) | Correctness matters (web, email, files) |

**UDP header:** source port, dest port, length, checksum (+ app data in checksum per RFC 768).

**UDP wins when:** no congestion control delay, no handshake delay.

**Apps:** SMTP/HTTP/FTP → TCP; DNS/SNMP/RIP → usually UDP; streaming/VoIP → either.

---

## 3. Multiplexing / demultiplexing

| Term | Meaning |
|------|---------|
| **Multiplexing** | Sender: many sockets → segments with headers |
| **Demultiplexing** | Receiver: read ports → correct socket |

| Protocol | Socket ID |
|----------|-----------|
| **UDP** | (dest IP, dest port) — 2-tuple |
| **TCP** | (src IP, src port, dest IP, dest port) — 4-tuple |

**TCP server:** **welcoming socket** (listen) + **connection socket** per client.

**Why ports?** IP alone cannot distinguish Facebook vs Spotify on the same laptop.

**HTTP:** persistent = one socket for many requests; non-persistent = new connection per request (slow on busy servers).

**Exam example:** Hosts A and C both use source port 26145 to server B:80 — still OK because **source IP** differs (4-tuple unique).

---

## 4. TCP handshake & teardown

**Setup (3-way):** SYN → SYN-ACK → ACK

| Step | SYN bit | Notes |
|------|---------|-------|
| 1 Client | 1 | `seq=client_isn` |
| 2 Server | 1 | `ack=client_isn+1`, `seq=server_isn` |
| 3 Client | **0** | `ack=server_isn+1` (video errata: SYN=0 on ACK) |

- Sync sequence numbers; allocate buffers/state

**Teardown (4-way):** FIN → ACK → FIN → ACK (+ TIME_WAIT)

- Controlled close so one side doesn't think the connection is still open

---

## 5. Reliable transmission

| Concept | One-liner |
|---------|-----------|
| **ARQ** | ACKs + timeout → retransmit if no ACK |
| **Stop-and-wait** | One segment at a time — simple, slow |
| **Go-back-N** | Pipeline N; cumulative ACK; **discard** out-of-order; retransmit from gap |
| **Selective ACK / SACK** | Buffer out-of-order; retransmit **only** lost segments |
| **Dup ACK** | Receiver still missing earlier byte — repeats same ACK |
| **Fast retransmit** | **3 dup ACKs** → retransmit now (don’t wait for timeout) |

**Why seq numbers + buffers?** Pipelining needs to track what’s in flight (sender) and out-of-order arrivals (receiver).

---

## 6. Transmission control & flow control

**Why control rate?** Unknown link capacity, sharing, slow receiver app.

**Where?** TCP transport layer (not each UDP app).

### Flow control (receiver)

| Formula | Meaning |
|---------|---------|
| `LastByteRcvd - LastByteRead ≤ RcvBuffer` | Don’t overflow buffer |
| `rwnd = RcvBuffer - (LastByteRcvd - LastByteRead)` | Spare room advertised to sender |
| `LastByteSent - LastByteAcked ≤ rwnd` | Sender cap on unACKed bytes |

**rwnd = 0 deadlock:** receiver full, sender stops; receiver drains but sends nothing → sender stuck.

**Fix:** sender sends **1-byte probes**; ACK carries new rwnd.

### vs congestion control

| | Flow | Congestion |
|---|------|------------|
| Protects | Receiver | Network |
| Knob | **rwnd** | **cwnd** |

**Send limit:** $\min(\text{cwnd}, \text{rwnd})$

!!! warning "Exam point"
    **Flow control = receiver (rwnd). Congestion control = network (cwnd).** Never swap them.

---

## 7. Congestion control & AIMD

**Why:** Many senders share bottleneck **R** — combined rate must not exceed capacity.

**Goals:** efficiency, fairness (equal share at bottleneck), low delay, fast convergence.

| Style | TCP? |
|-------|------|
| End-to-end (infer loss/delay) | Classic TCP |
| Network-assisted (ECN, etc.) | Also used today |

**cwnd:** max unACKed bytes in flight; probe with ACKs; adapt up/down.

**Limit:** `LastByteSent - LastByteAcked ≤ min(cwnd, rwnd)`

### AIMD

| Phase | Rule |
|-------|------|
| **Additive increase** | +~1 MSS per RTT (increment per ACK: MSS×MSS/cwnd) |
| **Multiplicative decrease** | On loss, cwnd → cwnd/2 (min 1) |

**Sawtooth:** probe up until loss, cut back, repeat.

### TCP Reno reactions

| Signal | Reaction |
|--------|----------|
| **3 dup ACKs** | Mild → **halve** cwnd |
| **Timeout** | Severe → reset to small cwnd / slow start |

**Probing** = intentionally increase until congestion, then back off and try again.

---

## 8. Slow start & AIMD

**Why slow start?** Cold start at cwnd=1 — AIMD alone ramps too slowly. Slow start **doubles cwnd per RTT** until **ssthresh**.

| When | Trigger |
|------|---------|
| New connection | Unknown capacity |
| After timeout | Don’t blast full window; reopen with slow start |

**Mechanics:** 1 pkt → ACK → cwnd=2 → 2 pkts → 4 pkts … exponential.

| Phase | Growth | Stop when |
|-------|--------|-----------|
| **Slow start** | Exponential | cwnd ≥ **ssthresh** or loss |
| **AIMD** | +1 MSS/RTT | Loss |

| Loss type | cwnd |
|-----------|------|
| 3 dup ACKs | Halve (100→50) |
| Timeout | Reset to **1 MSS**, new **ssthresh** / CongestionThreshold |

**“Slow”** = starts at 1 packet, not slow growth rate.

**Knee / cliff:** slow start to threshold (knee), then AIMD until loss (cliff).

---

## 9. TCP CUBIC (from Ha/Rhee/Xu paper)

### Problem

**BDP** = bandwidth × RTT. Reno grows ~**1 MSS/RTT** → on 10 Gbps / 100 ms paths, reaching full BDP can take **hours**; short flows under-utilize the link.

### BIC-TCP → CUBIC

| | BIC-TCP | CUBIC |
|---|---------|-------|
| Growth | Binary search between $W_{min}$ and $W_{max}$ | Single **cubic** function of time |
| Strength | Stable near saturation | Simpler; same stability idea |
| Weakness | Slow if capacity jumps far above old max | — |

### CUBIC mechanics

1. **Loss** at $W_{max}$ → multiply decrease (**β = 0.2**)
2. Grow $W(t) = C(t-K)^3 + W_{max}$ where $t$ = time since last congestion event
3. **Concave** (below $W_{max}$): grow fast toward last saturation
4. **Plateau** near $W_{max}$: stable, high utilization
5. **Convex** (above $W_{max}$): max-probe for new bandwidth
6. **TCP-friendly region**: if cwnd < Reno would use → behave like **standard TCP** (short RTT / small BDP)
7. **Fast convergence**: if new $W_{max}$ < old → shrink target faster (help new flows)

### Why RTT-fair?

Reno: +1 MSS per **RTT** → short RTT wins.  
CUBIC: growth keyed to **real time** between losses → competing flows at same bottleneck reach similar cwnd.

**Linux default** since kernel **2.6.18**.

---


## 10. TCP throughput (Mathis model)

AIMD sawtooth: cwnd +1 MSS/RTT until max **W**, then halve on loss.

**Assumption:** ~**1/p** packets delivered per loss event.

$$\text{Throughput} \lesssim \frac{1.22 \cdot MSS}{RTT \cdot \sqrt{p}}$$

Higher **RTT** or **p** → lower throughput. Upper bound in practice.

**Optional — DCTCP:** ECN + α = fraction marked → $cwnd \times (1 - \alpha/2)$; low queues in DCs.

---

## 11. TCP fairness

**Goal:** k flows on link R → each ≈ **R/k**.

**Same RTT + AIMD:** sawtooth in (throughput₁, throughput₂) space → converges to **equal share** at full utilization (points A→B→C→D).

**Not fair when:**

| Issue | Effect |
|-------|--------|
| **Different RTTs** | Shorter RTT → more ACKs/sec → larger cwnd |
| **Many parallel connections** | Fairness per connection, not per app (11 tabs vs 1 flow) |

**Throughput bias:** $\propto 1/(\text{RTT} \cdot \sqrt{p})$

---

## 12. High-yield exam Q&A

### Why not use IP alone?

IP is best effort — no guaranteed delivery, order, or app demux. Transport adds process delivery and (with TCP) reliability and rate control.

### Web page: TCP or UDP?

**TCP** — HTML must be complete and in order.

### What are duplicate ACKs?

Receiver keeps ACKing the **next expected byte** when later segments arrive out of order. Three dup ACKs imply loss, not delay → **fast retransmit**.

### Dup ACK vs timeout?

Dup ACK = **mild** → halve cwnd. Timeout = **severe** → much larger cut / restart.

### Stop-and-Wait vs Go-Back-N vs Selective Repeat?

| Protocol | Window | On loss |
|----------|--------|---------|
| Stop-and-Wait | 1 | Retransmit one frame |
| Go-Back-N | N | Retransmit lost + all after |
| Selective Repeat | N | Retransmit only lost (SACK) |

### Network-assisted vs end-to-end congestion control?

- **Network-assisted:** routers signal congestion (e.g., ECN)
- **End-to-end (TCP):** infer from loss and delay — no router help required

### Flow control vs congestion control?

| | Flow | Congestion |
|---|------|------------|
| Protects | Receiver buffer | Shared network |
| Knob | **rwnd** | **cwnd** |
| Send limit | Both — use **min(rwnd, cwnd)** |

### UDP 2-tuple vs TCP 4-tuple?

- **UDP:** (dest IP, dest port)
- **TCP:** (src IP, src port, dest IP, dest port) — welcoming socket + connection socket per client

### Slow start vs AIMD?

- **Slow start:** exponential cwnd growth until **ssthresh** (new connection, after timeout)
- **AIMD:** +1 MSS/RTT up, ÷2 on dup ACK; timeout → reset to 1 MSS + slow start

### What is TCP CUBIC?

Cubic growth in **time since loss** (not RTT); β=**0.2**; plateau near **W_max**; TCP-friendly on short RTT / small BDP; Linux default.

---

## Quick memory sheet

| Topic | Memory aid |
|-------|------------|
| Layer scope | **IP = host-to-host; transport = app-to-app (ports)** |
| Data units | **Message → Segment → Datagram → Frame → Bits** |
| UDP vs TCP | **UDP = postcard; TCP = registered mail** |
| Socket IDs | **UDP = 2-tuple; TCP = 4-tuple** |
| Handshake | **SYN → SYN-ACK → ACK (step 3: SYN=0)** |
| Fast retransmit | **3 dup ACKs → retransmit now** |
| Flow vs congestion | **rwnd = receiver; cwnd = network; send ≤ min both** |
| AIMD | **Climb +1 MSS/RTT, fall ÷2 on dup ACK** |
| Slow start | **Double per RTT until ssthresh, then AIMD** |
| Reno loss | **Dup ACK = halve; timeout = reset hard** |
| CUBIC | **W(t)=C(t-K)³+Wmax, β=0.2, time not RTT** |
| Throughput | **∝ 1/(RTT·√p)** |
| Fairness | **Same RTT fair; short RTT wins; per connection not per app** |
