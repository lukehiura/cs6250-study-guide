---
quiz:
  auto_number: True
  shuffle_answers: True
  disable_after_submit: False
tags:
  - lesson-02
  - tcp
  - transport
  - quiz
search:
  boost: 1.5
---

# Lesson 2: Interactive Quiz

Transport layer, TCP, UDP, and congestion control. New to the material? Start with the [Plain-language guide](plain-language.md). Written review: [Quick Study Guide](quick-study-guide.md). Full detail: [Lesson 2 guide](transport-application.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## Transport basics

<quiz>
IP provides [[best-effort]] delivery between hosts; it does not guarantee reliable or in-order delivery.
---
The **transport layer** adds process-to-process delivery and optional reliability (TCP).
</quiz>

<quiz>
At the transport layer, a TCP packet is called a [[segment]].
---
UDP also wraps data in segments/datagrams; at the network layer the unit is a **datagram**.
</quiz>

<quiz>
Which transport protocol is connection-oriented and provides reliable, in-order delivery?
- [ ] UDP
- [x] TCP
- [ ] IP
- [ ] HTTP

HTTP runs **on top of** TCP for typical web transfers.
</quiz>

---

## UDP vs TCP & multiplexing

<quiz>
An application should choose **UDP** when:
- [x] Low latency matters more than guaranteed delivery
- [ ] Every byte must arrive in order without loss
- [ ] The app wants built-in congestion control
- [ ] A three-way handshake is required first

Examples: VoIP, live streaming, DNS (simple request/response).
</quiz>

<quiz>
TCP demultiplexing uses a [[4-tuple]]: source IP, source port, destination IP, and destination port.
---
UDP demultiplexing typically uses only the **destination IP and port** (2-tuple).
</quiz>

<quiz>
On a TCP server, the socket that waits for new client connection requests is called the [[welcoming]] (listening) socket.
---
After the handshake, the server uses a separate **connection socket** per client, identified by the 4-tuple.
</quiz>

<quiz>
UDP delivers an incoming segment to a socket based primarily on the:
- [x] Destination port (and destination IP)
- [ ] Source port only
- [ ] Source IP only
- [ ] TCP sequence number

All segments with the same dest IP and dest port go to the same UDP socket, regardless of source.
</quiz>

---

## Connection management

<quiz>
The correct order for TCP connection setup is:
- [x] SYN → SYN-ACK → ACK
- [ ] SYN → ACK → SYN-ACK
- [ ] ACK → SYN → SYN-ACK
- [ ] FIN → ACK → SYN

The handshake synchronizes **initial sequence numbers** and allocates connection state.
</quiz>

<quiz>
In the third step of the TCP three-way handshake, the client's ACK segment has SYN set to:
- [ ] 1
- [x] 0
- [ ] Either 0 or 1

Course errata: some videos wrongly show SYN=1 on the final ACK; the correct value is **0**.
</quiz>

<quiz>
The UDP header is [[64]] bits and includes source port, destination port, length, and checksum.
---
UDP has no connection setup, congestion control, or reliability — only basic error checking via checksum.
</quiz>

<quiz>
TCP connection teardown typically involves:
- [ ] Two messages only
- [x] A four-step FIN/ACK exchange
- [ ] Immediate reset with no handshake
- [ ] Only the client sending FIN

Each side must agree it is done sending; **TIME_WAIT** may follow the final ACK.
</quiz>

---

## Reliable transmission

<quiz>
In **Go-back-N**, when packet 7 is lost but packets 8–10 arrive, the receiver:
- [x] Discards 8, 9, 10 and keeps ACKing before 7
- [ ] Buffers 8–10 and delivers them immediately
- [ ] Sends NACK for each lost packet
- [ ] Closes the connection

Go-back-N uses cumulative ACKs and drops out-of-order segments.
</quiz>

<quiz>
**Fast retransmit** is triggered when the sender receives:
- [ ] One duplicate ACK
- [ ] Two duplicate ACKs
- [x] Three duplicate ACKs
- [ ] A SYN segment

Dup ACKs mean the receiver is still waiting for a missing in-order segment.
</quiz>

<quiz>
Automatic Repeat Request (ARQ) means the sender [[retransmits]] data when loss is inferred (timeout or dup ACKs).
---
TCP implements ARQ in the transport layer so apps get a reliable byte stream.
</quiz>

---

## Flow & congestion control

<quiz>
The receive window is defined as rwnd = RcvBuffer minus the amount of data [[buffered]] but not yet read by the application.
---
Formally: rwnd = RcvBuffer - (LastByteRcvd - LastByteRead).
</quiz>

<quiz>
If the receiver advertises rwnd = 0 and has no data to send, TCP avoids deadlock by having the sender transmit:
- [x] 1-byte probe segments until rwnd increases
- [ ] Nothing until the receiver closes the connection
- [ ] A new SYN segment
- [ ] UDP packets instead

Probes elicit ACKs that carry the updated rwnd when buffer space frees up.
</quiz>

<quiz>
**Flow control** protects the [[receiver]] by limiting data based on the receive window (rwnd).
---
**Congestion control** protects the **network** using the congestion window (cwnd).
</quiz>

<quiz>
The maximum amount of unacknowledged data TCP should send is limited by:
- [x] min(cwnd, rwnd)
- [ ] cwnd + rwnd
- [ ] rwnd only
- [ ] cwnd only

Both receiver capacity and network conditions matter.
</quiz>

<quiz>
Which congestion signal is usually treated as **more severe**?
- [ ] Three duplicate ACKs
- [x] Timeout
- [ ] A single ACK
- [ ] A SYN-ACK

Timeout often causes a much larger cwnd reduction than dup-ACK loss recovery.
</quiz>

---

## Slow start, AIMD, CUBIC

<quiz>
In TCP **additive increase**, the congestion window grows by approximately:
- [x] 1 MSS per RTT (incremented per ACK in practice)
- [ ] 1 MSS per second wall-clock time only
- [ ] Doubling every RTT
- [ ] Halving every RTT

Doubling every RTT is **slow start**; halving is **multiplicative decrease**.
</quiz>

<quiz>
During TCP **slow start**, the congestion window typically:
- [x] Grows exponentially (roughly doubles each RTT)
- [ ] Grows by 1 MSS per RTT only
- [ ] Stays fixed at 1 segment
- [ ] Is always equal to rwnd

After reaching **ssthresh**, TCP switches to linear **congestion avoidance**.
</quiz>

<quiz>
TCP switches from slow start to AIMD when cwnd reaches the:
- [x] Slow start threshold (ssthresh)
- [ ] Receive window (rwnd)
- [ ] Maximum segment size (MSS)
- [ ] IP TTL value

Below ssthresh: exponential growth. At/above: additive increase (+1 MSS per RTT).
</quiz>

<quiz>
Why is the phase called "slow" start despite exponential growth?
- [x] It begins by sending only one packet, not a large window
- [ ] It increases slower than AIMD
- [ ] It only runs on low-speed links
- [ ] It disables acknowledgments

The name contrasts with immediately sending a large window at connection open.
</quiz>

<quiz>
AIMD stands for:
- [x] Additive Increase, Multiplicative Decrease
- [ ] Automatic Increase, Manual Decrease
- [ ] Additive Increase, Manual Delay
- [ ] Adaptive Increase, Multiplicative Delay

Probe bandwidth slowly up; cut aggressively on congestion.
</quiz>

<quiz>
TCP **CUBIC** differs from classic Reno mainly because congestion window growth is based on:
- [ ] Only the receive window
- [ ] A fixed 1 MSS per ACK always
- [x] A cubic function of time since the last loss
- [ ] UDP-style best effort

Growth is keyed to a **congestion epoch** (real time), not RTT — improving RTT-fairness on high-BDP paths.
</quiz>

<quiz>
In Linux CUBIC, the multiplicative decrease factor β after a loss is typically:
- [ ] 0.5 (halve the window)
- [x] 0.2
- [ ] 1.0 (no decrease)
- [ ] 0.8

Reno often uses $\beta \approx 0.5$; CUBIC uses a smaller decrease ($\beta = 0.2$ in the paper/Linux).
</quiz>

<quiz>
When cwnd is **below** the last loss point $W_{\max}$, CUBIC is in the:
- [x] Concave region (aggressive growth toward $W_{\max}$)
- [ ] Convex max-probing region
- [ ] TCP-friendly region only
- [ ] Slow start phase

Above $W_{\max}$ it enters the **convex** region to probe for new capacity.
</quiz>

<quiz>
When two TCP flows share a bottleneck and have the **same RTT**, AIMD tends to converge to:
- [x] Roughly equal bandwidth shares
- [ ] The flow with the larger MSS always winning
- [ ] No fairness at all
- [ ] UDP taking all bandwidth

With **different RTTs**, shorter RTT flows often get more bandwidth (classic TCP bias).
</quiz>

<quiz>
TCP may be unfair when one application opens many [[parallel]] TCP connections to the same bottleneck while others use only one.
---
Fairness is often per **connection** (≈ R/k connections), not per application — more connections can mean more aggregate bandwidth.
</quiz>

<quiz>
TCP CUBIC uses window growth based on [[time]] elapsed since the last loss event, improving RTT-fairness vs ACK-clocked Reno.
---
Reno grows ~1 MSS per RTT; CUBIC’s cubic curve is a function of real time between losses.
</quiz>

---

## TCP throughput

<quiz>
In the AIMD sawtooth model, if loss probability is **p**, throughput scales roughly as:
- [x] $1/\sqrt{p}$
- [ ] $1/p$
- [ ] $\sqrt{p}$
- [ ] Independent of $p$

More loss → lower throughput; the Mathis bound is $\text{Throughput} \lesssim 1.22 \cdot MSS / (RTT \cdot \sqrt{p})$.
</quiz>

<quiz>
In the simplified throughput model, the network delivers about [[1/p]] packets between loss events.
---
Each sawtooth cycle ends with a loss; area under cwnd $\times$ this assumption yields $W \propto 1/\sqrt{p}$.
</quiz>

<quiz>
Holding MSS and loss rate fixed, **doubling RTT** tends to:
- [x] Halve throughput (in the Mathis model)
- [ ] Double throughput
- [ ] Have no effect on throughput
- [ ] Quadruple throughput

Throughput $\propto 1/RTT$ in the standard bound.
</quiz>

<quiz>
**DCTCP** (optional / datacenter) differs from classic TCP mainly by:
- [x] Using ECN marking fraction (α) for proportional window reduction
- [ ] Eliminating congestion control entirely
- [ ] Using only UDP in data centers
- [ ] Replacing IP with a new layer

Low α → gentle cut; high α → near halving — keeps switch queues small for short RPCs.
</quiz>

---

<!-- mkdocs-quiz results -->

---

!!! tip "Keep studying"
    - [Full Lesson 2 guide](transport-application.md)
    - [Lesson 1 — Internet architecture](../lesson-01/introduction.md)
