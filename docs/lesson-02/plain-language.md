# Lesson 2: Transport Layer — Plain-Language Guide

The simplest version of [Lesson 2](transport-application.md). Layer basics from [Lesson 1](../lesson-01/plain-language.md) help here. For exam detail, see the **[Quick Study Guide](quick-study-guide.md)** or the **[Quiz](quiz.md)**.

---

## Summary

**IP** (Internet Protocol) delivers **datagrams** to the right **computer** with **best-effort** delivery — it tries, but makes no promises. The **transport layer** delivers data to the right **app** on that computer using **port numbers**. **TCP** (Transmission Control Protocol) adds reliability and rate control; **UDP** (User Datagram Protocol) stays fast and simple.

---

## The one-sentence version

IP gets a datagram to the right computer; transport gets it to the right app — and TCP can make sure nothing is lost, out of order, or sent too fast.

---

## Where does this fit?

From [Lesson 1](../lesson-01/plain-language.md), the stack top to bottom is:

**Application → Transport → Network → Data Link → Physical**

Data unit names: **Message → Segment → Datagram → Frame → Bits**

| Layer | Job in plain words | This lesson |
|-------|-------------------|-------------|
| **Application** | What you use (browser, email) | HTTP, DNS — mentioned briefly |
| **Transport** | App to app on different hosts | **Main focus — TCP and UDP** |
| **Network (IP)** | Computer to computer | Best effort; transport builds on top |

**Memory trick:** **IP = house to house. Transport = app to app.**

---

## Why we need a transport layer

Imagine the post office (IP) delivers mail to your **house address**. It does **not** guarantee:

- The letter arrives
- Letters arrive in order
- They arrive on time
- You do not get duplicates

It just tries its best — **best effort**.

Your house might run a browser, Spotify, and email **all at once**. IP only knows the house address, not which app should get each letter.

The transport layer:

1. Adds **port numbers** so the right app gets the data
2. Optionally adds **reliability** and **speed control** (TCP)

**Key takeaways:**

- IP is **host-to-host**; transport is **process-to-process** (app to app).
- Transport wraps app data in a **segment** before IP wraps it in a **datagram**.

---

## Real-life example: loading a web page

You type a URL. Here is what happens in plain English:

1. Your request travels across campus, ISPs, maybe a CDN edge server
2. Your browser needs the page **correct**, **in order**, and **fast enough**
3. Browser opens a **TCP connection** to the web server (connect first, like a phone call)
4. Browser sends **HTTP GET**; server sends back HTML
5. Browser draws the page

**Web pages → TCP** (you need every byte, in order).

**Live video / gaming / VoIP → often UDP** (a tiny glitch beats waiting for a perfect frame).

**Key takeaways:**

- **HTTP** (web) runs on **TCP** for most page loads.
- Real-time apps often pick **UDP** when **delay** matters more than perfect delivery.

---

## UDP vs TCP — pick your delivery style

| | **UDP** | **TCP** |
|---|---------|---------|
| Connection | No handshake — just send | Handshake first ("hello, are you there?") |
| Reliability | Best effort — might lose data | Resends lost pieces, keeps order |
| Speed control | None | Yes — will not flood receiver or network |
| Header size | Tiny (8 bytes) | Bigger (20+ bytes) |
| Feels like | Postcard — fast, no tracking | Registered mail — slower, tracked |
| Good for | DNS, games, live streams | Web, email, file downloads |

![Popular applications and their transport protocols](../images/applications-transport-protocols.png){ width="700" }

The Internet basically gives you these two choices. Pick what your app cares about most: **perfect** or **fast**.

**Key takeaways:**

- **UDP** wins when you want **low delay** and can tolerate some loss.
- **TCP** wins when **correctness and order** matter (web, email, files).

---

## Multiplexing — many apps, one computer

Your laptop runs many apps. How does each segment find the right one?

| Term | Who | Job |
|------|-----|-----|
| **Multiplexing** | Sender | Gather data from many apps → add headers → send down |
| **Demultiplexing** | Receiver | Read headers → deliver to the correct app |

Each app opens a **socket** (a door) tied to a **port number**.

![Transport-layer multiplexing and demultiplexing across three hosts](../images/transport-multiplexing-demux.png){ width="700" }

### UDP: connectionless (2-tuple)

UDP identifies a socket with **2 things**:

**(destination IP, destination port)**

Same destination port = same socket, even from different senders. Reply just swaps source and destination ports.

### TCP: connection-oriented (4-tuple)

TCP needs **4 things** to identify one conversation:

**(source IP, source port, destination IP, destination port)**

Two people can both connect to `example.com:80` at the same time. The server needs all four numbers to tell them apart.

![TCP four-tuple demultiplexing at a web server](../images/tcp-four-tuple-demux.png){ width="700" }

**How a web server works:**

1. **Welcoming socket** listens on port 80 ("anyone home?")
2. Client sends **SYN** with its chosen source port
3. Server creates a **connection socket** just for that client
4. Data flows on that private connection socket

**Memory trick:** **UDP = 2-tuple. TCP = 4-tuple. Welcoming socket listens; connection socket serves one client.**

**Key takeaways:**

- **Multiplexing** combines many app streams at the sender; **demultiplexing** splits them at the receiver.
- **Persistent HTTP** = many requests on one TCP connection. **Non-persistent** = new connection per request (slow for busy servers).

---

## UDP — why "unreliable" is sometimes better

UDP sounds weak: no handshake, no automatic resend, no flow control, no congestion control.

That is exactly why some apps love it:

| UDP win | What it means |
|---------|---------------|
| No congestion control | Send now — TCP might wait because the network looks busy |
| No connection setup | No 3-message hello before first byte |
| Small header | Less overhead per segment |

**DNS** uses UDP for quick "what is the IP for this name?" questions.

**Email and web** use TCP because missing a byte is unacceptable.

**Key takeaways:**

- "Unreliable" does not mean broken — it means **the app chooses** what to do about loss.
- **DNS**, **SNMP**, and many games prefer UDP for speed.

---

## TCP connection setup — the three-way handshake

Before sending data, TCP agrees the connection exists and picks starting **sequence numbers**.

Like agreeing on "we are both on the call" before talking:

| Step | Who | What |
|------|-----|------|
| 1 | Client → Server | **SYN** — "I want to connect" (`SYN=1`) |
| 2 | Server → Client | **SYN-ACK** — "OK, I am in too" (`SYN=1`, acknowledges client) |
| 3 | Client → Server | **ACK** — "Great, let us go" (`SYN=0` on this step!) |

![TCP three-way handshake sequence diagram](../images/tcp-three-way-handshake.png){ width="650" }

**Memory trick:** **SYN → SYN-ACK → ACK**

**Exam gotcha:** Step 3 has **SYN=0**, not 1. Some videos get this wrong.

**Key takeaways:**

- The handshake syncs **sequence numbers** and allocates connection state on both sides.
- No application data is required in the first two steps (sometimes step 3 carries data).

---

## TCP connection teardown — saying goodbye properly

Closing is **4 steps** so nobody thinks the connection is still open:

| Step | What |
|------|------|
| 1 | Client sends **FIN** — "I am done sending" |
| 2 | Server sends **ACK** — "Got your FIN" |
| 3 | Server sends **FIN** — "I am done too" |
| 4 | Client sends **ACK** — "OK, closed" |

Client then waits in **TIME_WAIT** so a lost final ACK can be resent and old straggler segments do not confuse a new connection.

**Key takeaways:**

- Teardown is **FIN → ACK → FIN → ACK** (four steps, not three).
- **TIME_WAIT** prevents ambiguous close states.

---

## Reliable delivery — when segments get lost

The network can **lose**, **duplicate**, or **reorder** segments. TCP fixes that; UDP leaves it to the app.

### How TCP knows what is missing

1. Receiver sends **ACKs** (acknowledgments — "got bytes 1–1000")
2. Sender starts a **timer**
3. No ACK in time? **Retransmit**

This family of tricks is **ARQ** (Automatic Repeat Request).

### Three ARQ styles (simple → smart)

| Style | Idea | Problem |
|-------|------|---------|
| **Stop-and-wait** | Send one chunk → wait for ACK → send next | Simple but **slow** — wire sits idle while waiting |
| **Go-back-N** | Send many chunks ahead; receiver **throws away** out-of-order ones | One loss wastes a lot of re-sending |
| **Selective repeat / SACK** | Buffer out-of-order pieces; retransmit **only** what is missing | What **TCP actually uses** |

### Fast retransmit — do not wait for the timer

When segment **7** is lost but **8, 9, 10** arrive, the receiver keeps saying "still waiting for 7" — that is a **duplicate ACK**.

![Fast retransmit after three duplicate ACKs for segment 7](../images/tcp-fast-retransmit.png){ width="650" }

**Three duplicate ACKs** in a row → sender **retransmits immediately** (fast retransmit) instead of waiting for timeout.

**Memory trick:** **Timeout = slow "probably lost." 3 dup ACKs = fast "definitely lost."**

**Key takeaways:**

- **Pipelining** needs **sequence numbers** and buffers on sender and receiver.
- TCP uses **selective ACKing** (SACK), not go-back-N, for efficiency.

---

## Why not send as fast as possible?

You might think: "My link says 100 Mbps — I will blast a 1 GB file at full speed!"

Problems:

- You do not know the real path capacity (many hops, shared links)
- **Other people** share the same bottleneck
- The receiver might be slow (disk, busy CPU)
- Many senders at once can **clog routers**

Send rate must be **discovered and adjusted** — that is **transmission control**. TCP does this in one place so every app does not reinvent it badly.

**Key takeaways:**

- Rate control belongs in **TCP**, not in every UDP app separately.
- Unknown capacity + sharing + slow receivers = you cannot assume full link speed.

---

## Flow control — do not drown the receiver

**Flow control** protects the **receiver's buffer** (temporary holding area).

Think of a bucket with a hole at the bottom (the app reading data). If you pour water faster than it drains, the bucket overflows.

| Idea | Plain English |
|------|---------------|
| **RcvBuffer** | Size of the bucket |
| **rwnd** (receive window) | "I have this much empty space left" — advertised to sender |
| **Sender rule** | Do not have more un-ACKed data in flight than **rwnd** |

![Receive buffer, spare room, and receive window rwnd](../images/tcp-flow-control-buffer.png){ width="600" }

### Zero-window deadlock (and fix)

Receiver says **rwnd = 0** → sender stops. Receiver's app drains the buffer, but if receiver has nothing to send back, sender never learns space opened up.

**Fix:** sender sends tiny **probe** segments; receiver's ACK carries the new **rwnd**.

**Key takeaways:**

- **Flow control** protects the **receiver**, not the network.
- **rwnd** is advertised in every ACK so the sender knows spare buffer room.

---

## Flow control vs congestion control — two different brakes

| | **Flow control** | **Congestion control** |
|---|------------------|------------------------|
| Protects | **Receiver** (your bucket) | **Network** (shared roads) |
| Knob | **rwnd** | **cwnd** (congestion window) |
| Question | "How much can *this computer* swallow?" | "How much can the *path* handle?" |

**Effective send limit:** the **smaller** of rwnd and cwnd — $\min(\text{rwnd}, \text{cwnd})$.

**Memory trick:** **Flow = receiver. Congestion = network.**

**Key takeaways:**

- Never confuse **rwnd** (receiver buffer) with **cwnd** (network capacity).
- Both limit how much un-ACKed data can be in flight — for different reasons.

---

## Congestion control — do not clog the highway

Many senders share one bottleneck link of capacity **R**. If combined traffic exceeds **R**:

- Router queues grow → **delay** shoots up
- Buffers overflow → **drops** → retransmits → **more** congestion (traffic jam)

Senders do not know **R** ahead of time. TCP **probes** — gently speed up, back off when things look bad.

| Signal | Meaning |
|--------|---------|
| **Packet loss** | Buffers probably full — classic TCP signal |
| **Higher delay / RTT** | Queues building — noisier signal |

Two philosophies:

- **End-to-end** — hosts figure it out from loss and delay (classic TCP)
- **Network-assisted** — routers mark packets (**ECN**) before dropping

**Send rate** roughly ≈ **cwnd / RTT**.

**Key takeaways:**

- **Congestion control** goals: efficiency, fairness, low delay, fast convergence.
- **cwnd** limits un-ACKed data in flight for the **network**, like **rwnd** does for the receiver.

---

## AIMD — climb slowly, fall fast

TCP's classic pattern: **AIMD** (Additive Increase, Multiplicative Decrease) → a **sawtooth** graph over time.

| Phase | Rule |
|-------|------|
| **Additive increase** | Grow about **1 MSS** (max segment size) per **RTT** (round-trip time) while no loss |
| **Multiplicative decrease** | On loss, cut **cwnd** in half (or worse on timeout) |

![Congestion window sawtooth pattern over time](../images/tcp-cwnd-sawtooth.png){ width="600" }

### TCP Reno: two kinds of "bad"

| What happened | How bad | Typical reaction |
|---------------|---------|------------------|
| **3 duplicate ACKs** | Mild congestion | **Halve** cwnd, keep probing |
| **Timeout** | Severe — maybe many lost | Reset to tiny cwnd, **slow start** again |

**Memory trick:** **AIMD = +1 MSS per RTT up, ÷2 down on dup ACK; timeout hits harder.**

**Key takeaways:**

- **Probing** = ramp up until congestion, back off, try again.
- **Dup ACK** and **timeout** are treated as different severity levels in TCP Reno.

---

## Slow start — warm up the engine

Despite the name, slow start is **exponential** growth — double cwnd about every RTT:

```
1 segment → ACK → 2 → 4 → 8 → 16 …
```

A brand-new connection starts with **cwnd = 1**. Pure AIMD alone would take too long to find capacity.

**When it runs:**

- **New connection** — you do not know the path yet
- **After timeout** — do not blast the full window immediately

**Switch to AIMD** when cwnd reaches **ssthresh** (slow start threshold).

| Loss type | What happens to cwnd |
|-----------|----------------------|
| 3 dup ACKs | Halve (e.g. 100 → 50) |
| Timeout | Drop to **1 MSS**, restart slow start, update ssthresh |

**"Slow"** means starting with **one** segment — not slow growth.

**Key takeaways:**

- **Slow start** = exponential until **ssthresh**; then **AIMD** = linear probe.
- **Knee / cliff:** exponential climb to threshold (knee), then linear until loss (cliff).

---

## TCP fairness — sharing the road

**Goal:** if **k** TCP flows share one link of rate **R**, each should get about **R/k**.

| Situation | Fair? |
|-----------|-------|
| Same **RTT**, AIMD | **Yes** — converges toward equal share |
| Different **RTTs** | **No** — shorter RTT gets more ACKs per second → bigger cwnd |
| Many connections per app | **No** — fairness is **per connection**, not per app (11 browser tabs vs 1 flow) |

Rough bias: throughput ∝ **1 / (RTT × √loss rate)**

**Key takeaways:**

- AIMD tends toward **fairness** when RTTs match.
- Browsers opening many parallel TCP connections can get **unfair** aggregate bandwidth.

---

## TCP CUBIC — modern TCP for fast long pipes

**TCP CUBIC** is Linux's default (since kernel 2.6.18). Classic **TCP Reno** grows too slowly on **high bandwidth × long delay** paths ("long fat pipes").

**BDP** (bandwidth-delay product) = how many segments must be in flight to fill the pipe.

Example: 10 Gbps, 100 ms RTT → need ~100,000 segments in flight. Reno adds ~1 per RTT → hours to reach full speed.

![TCP CUBIC: W(t) cubic growth after loss at Wmax](../images/tcp-cubic-window-growth.png){ width="600" }

After loss at **W_max**:

1. Cut cwnd (**β = 0.2** in Linux — gentler than Reno's halve)
2. Grow with a **cubic curve** based on **time since last loss** — not per-ACK like Reno
3. **Below W_max:** grow aggressively (concave)
4. **Near W_max:** plateau — high utilization, small swings
5. **Above W_max:** probe higher — bandwidth may have increased

| | **TCP Reno** | **TCP CUBIC** |
|---|--------------|---------------|
| Growth | +1 MSS per **RTT** | Cubic function of **time since loss** |
| Cut on loss | Often halve (β=0.5) | β = **0.2** |
| Best on | Normal links | **High-speed, long-delay** links |
| RTT fairness | Short RTT wins | More fair at same bottleneck |

**Memory trick:** **CUBIC = cubic curve in time, plateau at old max, TCP-friendly on small pipes.**

**Key takeaways:**

- CUBIC uses **wall-clock time**, not RTT, for growth — better **RTT-fairness** on fat pipes.
- On short RTT links, CUBIC falls back to **TCP-friendly** Reno-like behavior.

---

## Throughput — the famous formula (intuition)

Mathis model (upper bound):

$$\text{Throughput} \lesssim \frac{1.22 \cdot MSS}{RTT \cdot \sqrt{p}}$$

Where **p** = loss probability.

| Bigger… | Effect |
|---------|--------|
| **RTT** | Slower throughput |
| **Loss (p)** | Slower throughput |
| **MSS** | Slightly higher throughput |

**Plain English:** longer trips and lossier networks → you cannot send as fast.

**Key takeaways:**

- This is an **upper bound**, not a guarantee.
- More loss or longer RTT → lower throughput (∝ **1/(RTT·√p)**).

---

## Optional extras (not usually on exams)

**DCTCP** — datacenter TCP that uses **ECN** marks and gentle window cuts to keep switch queues small.

**Jacobson (1988)** — explained **congestion collapse** on the 1980s Internet. Key ideas still used: **packet conservation** (ACKs clock sending) and **AIMD**.

---

## The whole lesson on one napkin

```
IP:           best effort, datagram, computer → computer
Transport:    segment, app → app (ports)

UDP:          fast postcard, 2-tuple (dest IP + dest port)
TCP:          registered mail, 4-tuple, handshake + teardown

Reliability:  ACKs + timeout; 3 dup ACKs = fast retransmit
Flow:         rwnd protects receiver bucket
Congestion:   cwnd protects shared network
Send limit:   min(rwnd, cwnd)

Slow start:   double cwnd per RTT until ssthresh
AIMD:         +1 MSS/RTT up, ÷2 on dup ACK, harder reset on timeout

Fairness:     OK if same RTT; short RTT wins; many tabs = unfair
CUBIC:        cubic growth in time, β=0.2, for fast long pipes
Throughput:   worse with higher RTT or loss (∝ 1/(RTT·√p))
```

---

## Where to go next

| You want… | Go here |
|-----------|---------|
| Full detail + diagrams | [Lesson 2 — full guide](transport-application.md) |
| Exam tables & Q&A | [Quick Study Guide](quick-study-guide.md) |
| Practice | [Lesson 2 Quiz](quiz.md) |
| Internet architecture basics | [Lesson 1 plain-language guide](../lesson-01/plain-language.md) |

---

**Bottom line:** Transport turns IP's best-effort delivery into **app-to-app** communication — and TCP adds the reliability and rate control that make the web, email, and file transfer work on a shared, unpredictable network.
