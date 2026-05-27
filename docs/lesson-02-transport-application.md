# Lesson 2: Transport and Application Layers

The transport layer provides logical communication between application processes running on different hosts.

---

## Transport and Network Layers Overview

The transport layer and the network layer work together, but they solve different problems. The transport layer supports communication between applications running on end hosts. The network layer moves packets across the Internet from one host to another.

### Transport Layer

The transport layer is responsible for end-to-end communication between applications running on different hosts. The two main transport-layer protocols are TCP (Transmission Control Protocol) and UDP (User Datagram Protocol).

**TCP** provides a richer service to applications. It offers a connection-oriented service, meaning that the two endpoints establish a connection before exchanging data. TCP also provides reliable delivery, so lost data can be retransmitted. It supports flow control, which prevents the sender from overwhelming the receiver, and congestion control, which slows the sender when the network appears congested.

**UDP** provides a simpler service. It is connectionless and offers best-effort delivery. UDP does not provide built-in reliability, flow control, or congestion control. This makes UDP lightweight, but it also means that applications using UDP must handle any needed reliability or timing requirements themselves.

At the transport layer, the packet of information is called a **segment**.

### Network Layer

The network layer is responsible for moving packets from one host to another across the Internet. At this layer, the packet of information is called a **datagram**.

A source host passes a transport-layer segment, along with the destination address, down to the network layer. The network layer adds its own header and creates a datagram. It is then responsible for moving that datagram across routers and networks toward the destination host.

The most important protocol at this layer is the **Internet Protocol (IP)**. IP is often described as the glue that holds the Internet together because all Internet hosts and routers use IP to send and forward datagrams.

IP defines the structure of the datagram and the addressing information used by hosts and routers. However, IP by itself does not decide the full path in advance. Routing protocols help determine the routes that datagrams can take between sources and destinations.

### Takeaway

The transport layer provides end-to-end communication services to applications, while the network layer provides host-to-host packet delivery across the Internet.

---

## Application, Presentation, and Session Layers Overview

In the OSI reference model, the top three layers are the application layer, presentation layer, and session layer. In the five-layer Internet protocol stack, these three layers are usually combined into one broader application layer.

### Application Layer

The application layer supports network applications and application-level protocols. This is the layer closest to the user-facing software, such as web browsers, email clients, file transfer tools, and domain-name lookup services.

Common application-layer protocols include:

- **HTTP** — Used for web communication.
- **SMTP** — Used for sending email.
- **FTP** — Used for transferring files between hosts.
- **DNS** — Used to translate domain names into IP addresses.

The services at this layer depend on the application. For example, a web browser and an email client use the network differently and rely on different application-layer protocols.

At the application layer, the packet of information is usually called a **message**.

### Presentation Layer

The presentation layer is responsible for how data is represented and formatted before it is delivered to the application. It can handle tasks such as data formatting, encoding, compression, and translation between data representations.

For example, the presentation layer may help format a video stream or translate data between different byte orders, such as big endian and little endian formats.

In the Internet protocol stack, these functions are usually handled inside the application or by application-level libraries.

### Session Layer

The session layer manages communication sessions between application processes. It helps organize related streams of communication that belong to the same interaction.

For example, in a teleconference application, the session layer concept helps explain how the system keeps related audio and video streams tied together as part of the same call.

In the Internet protocol stack, session management is usually handled by the application itself or by protocols and libraries used by the application.

### Takeaway

In the OSI model, application, presentation, and session are separate layers. In the Internet protocol stack, these functions are typically grouped into the application layer and handled by applications or application-level protocols.

---

## What does the transport layer provide?

The transport layer provides **logical communication between application processes** on different hosts. It extends the network layer's host-to-host delivery to **process-to-process** delivery by using port numbers. Key services include:

- Multiplexing and demultiplexing
- (TCP) Reliable, in-order delivery
- (TCP) Flow control and congestion control
- (UDP) Lightweight, best-effort delivery

---

## What is a packet for the transport layer called?

A transport-layer packet is called a **segment**. Specifically:

- **TCP segment** — for TCP
- **UDP datagram** — for UDP (sometimes also called a segment)

---

## What are the two main protocols within the transport layer?

1. **TCP (Transmission Control Protocol)** — Connection-oriented, reliable, in-order delivery with flow and congestion control.
2. **UDP (User Datagram Protocol)** — Connectionless, unreliable, best-effort delivery with minimal overhead.

---

## What is multiplexing, and why is it necessary?

**Multiplexing** occurs at the sender: the transport layer gathers data from multiple application sockets, encapsulates each chunk with a transport header (containing port numbers), and passes the resulting segments to the network layer.

**Demultiplexing** occurs at the receiver: the transport layer examines the header fields to determine which socket to deliver the segment to.

Multiplexing is necessary because a single host may have many applications communicating simultaneously, and the transport layer must route incoming segments to the correct application process.

---

## Describe the two types of multiplexing/demultiplexing

**UDP demultiplexing** uses a **2-tuple**: (Destination IP, Destination Port). All segments with the same destination IP and port are delivered to the same socket, regardless of the source.

**TCP demultiplexing** uses a **4-tuple**: (Source IP, Source Port, Destination IP, Destination Port). Each unique 4-tuple identifies a distinct TCP connection and socket. This is why a web server can handle many simultaneous connections on port 80 — each client connection has a unique source IP/port combination.

---

## What are the differences between UDP and TCP?

| Feature | UDP | TCP |
|---------|-----|-----|
| **Connection** | Connectionless | Connection-oriented (3-way handshake) |
| **Reliability** | No guarantees | Reliable, in-order delivery |
| **Flow Control** | None | Yes (receiver window) |
| **Congestion Control** | None | Yes (AIMD, slow start) |
| **Header Size** | 8 bytes | 20+ bytes |
| **Ordering** | No guarantee | Guaranteed in-order |
| **Speed** | Lower latency | Higher latency due to overhead |

---

## When would an application layer protocol choose UDP over TCP?

Applications choose UDP when:

- **Low latency** is more important than reliability (e.g., real-time gaming, live video/audio streaming, VoIP).
- **Small overhead** is desired (UDP header is only 8 bytes vs. TCP's 20+).
- The application can tolerate some packet loss but not retransmission delays.
- The application implements its own reliability mechanism at the application layer.
- **DNS queries** — simple request/response, lower overhead than establishing a TCP connection.

---

## Explain the TCP Three-way Handshake

The three-way handshake establishes a TCP connection:

1. **SYN** — The client sends a segment with the SYN flag set and an initial sequence number (client_isn).
2. **SYN-ACK** — The server responds with SYN and ACK flags set, its own initial sequence number (server_isn), and acknowledges the client's ISN (ACK = client_isn + 1).
3. **ACK** — The client acknowledges the server's ISN (ACK = server_isn + 1). This segment can carry data.

After the handshake, both sides have agreed on initial sequence numbers and the connection is established.

---

## Explain the TCP connection tear down

TCP connection termination uses a **4-step process** (FIN handshake):

1. **FIN** — The initiating side sends a segment with the FIN flag set.
2. **ACK** — The other side acknowledges the FIN.
3. **FIN** — The other side sends its own FIN when it's ready to close.
4. **ACK** — The initiator acknowledges the second FIN.

After the final ACK, the connection enters a **TIME_WAIT** state (typically 2× MSL) to ensure any delayed segments are handled before the connection is fully closed.

---

## What is Automatic Repeat Request (ARQ)?

ARQ is a group of error-control protocols that ensure reliable data delivery over unreliable channels. The sender retransmits data that was lost or corrupted based on feedback (ACKs or timeouts) from the receiver. The three main ARQ variants are Stop-and-Wait, Go-Back-N, and Selective Repeat.

---

## What is Stop and Wait ARQ?

The simplest ARQ protocol: the sender transmits **one frame** and then **waits** for an acknowledgment (ACK) before sending the next frame.

- If the ACK is not received within a timeout period, the sender retransmits.
- **Pro:** Simple to implement.
- **Con:** Extremely inefficient — the channel is idle while waiting for the ACK, especially on high-latency links. Utilization = frame_transmission_time / (frame_transmission_time + RTT).

---

## What is Go-Back-N?

Go-Back-N enables **pipelining**: the sender can transmit up to **N** frames without waiting for individual ACKs (N is the window size).

- The receiver uses **cumulative ACKs** — it only acknowledges the last in-order frame received.
- If a frame is lost, the receiver **discards all subsequent out-of-order frames**.
- The sender must **retransmit the lost frame and all subsequent frames** after it, even if some were received correctly.
- **Pro:** Better utilization than Stop-and-Wait.
- **Con:** Wastes bandwidth by retransmitting correctly received frames.

---

## What is Selective ACKing?

Selective ACK (SACK) optimizes retransmission by allowing the receiver to **acknowledge individual out-of-order segments** rather than just cumulative ACKs.

- The sender only retransmits the **specific segments that were actually lost**.
- The receiver buffers out-of-order segments and reports which segments it has received.
- **Pro:** Much more efficient than Go-Back-N — avoids retransmitting correctly received data.
- **Con:** More complex to implement; requires buffering at the receiver.

---

## What is fast retransmit?

Fast retransmit is a TCP optimization that triggers retransmission **before the timeout expires**. When the sender receives **3 duplicate ACKs** for the same segment, it infers that the next segment was lost and retransmits it immediately without waiting for the retransmission timer.

This significantly reduces recovery time compared to waiting for a full timeout.

---

## What is transmission control, and why do we need to control it?

Transmission control refers to mechanisms that regulate the rate at which a sender transmits data. It is needed to prevent:

- **Buffer overflow at the receiver** (flow control)
- **Congestion in the network** (congestion control)

Without transmission control, senders could overwhelm receivers or saturate network links, leading to massive packet loss and degraded performance for all users.

---

## What is flow control, and why do we need it?

Flow control is a mechanism to **protect the receiving host's buffer from overflowing**. The receiver advertises a **receive window (rwnd)** indicating how much buffer space is available. The sender limits its transmission so that unacknowledged data never exceeds rwnd.

This ensures the sender doesn't transmit data faster than the receiver can process it.

---

## What is congestion control?

Congestion control is a mechanism to **protect the network core from becoming congested**. When too many sources send too much data too fast, routers' buffers overflow, causing packet drops, increased delays, and retransmissions — which further worsen congestion.

TCP uses congestion control to dynamically adjust the sending rate based on perceived network conditions.

---

## What are the goals of congestion control?

1. **Efficiency** — Utilize available bandwidth as fully as possible.
2. **Fairness** — Distribute bandwidth equitably among competing flows.
3. **Stability** — Avoid oscillations and congestion collapse (where the network carries little useful traffic despite being fully loaded).
4. **Responsiveness** — React quickly to changes in available bandwidth.

---

## What is network-assisted congestion control?

In network-assisted congestion control, **routers provide explicit feedback** to senders about the network's congestion state. Examples include:

- **Explicit Congestion Notification (ECN)** — Routers mark packets to signal congestion before dropping them.
- ATM's ABR (Available Bit Rate) service, where switches inform sources of the available rate.

---

## What is end-to-end congestion control?

In end-to-end congestion control, the **network provides no explicit feedback**. Instead, the sender infers congestion from observed behavior:

- Packet loss (timeout or duplicate ACKs)
- Increased round-trip time

TCP uses end-to-end congestion control — the network core does not assist; endpoints detect and respond to congestion on their own.

---

## How does a host infer congestion?

A TCP sender infers congestion through two signals:

1. **Packet loss** — Detected via timeout or reception of 3 duplicate ACKs. Loss implies a router's buffer overflowed.
2. **Increased delay** — Rising RTT suggests queues are building up at routers (used by some TCP variants like TCP Vegas).

---

## How does a TCP sender limit the sending rate?

TCP maintains a **congestion window (cwnd)** that limits how much unacknowledged data can be in flight. The effective window is:

$$\text{effective\_window} = \min(\text{cwnd}, \text{rwnd})$$

The sender ensures that the amount of unacknowledged data never exceeds this effective window. By adjusting cwnd, TCP controls the sending rate: rate ≈ cwnd / RTT.

---

## Explain Additive Increase/Multiplicative Decrease (AIMD) in the context of TCP

AIMD is the core algorithm TCP uses to probe for available bandwidth:

- **Additive Increase** — For every RTT without loss, increase cwnd by 1 MSS (Maximum Segment Size). This linearly probes for more bandwidth.
- **Multiplicative Decrease** — Upon detecting loss (e.g., 3 duplicate ACKs), cut cwnd in half. This aggressive reduction quickly alleviates congestion.

The asymmetry (additive increase, multiplicative decrease) ensures convergence to fairness: if two flows share a bottleneck, AIMD drives both toward an equal share of bandwidth over time.

---

## What is slow start in TCP?

Slow start is TCP's mechanism for rapidly discovering available bandwidth at the beginning of a connection (or after a timeout):

1. cwnd starts at 1 MSS.
2. For every ACK received, cwnd increases by 1 MSS → **exponential growth** (cwnd doubles every RTT).
3. Growth continues until:
    - cwnd reaches the **slow start threshold (ssthresh)** → switches to congestion avoidance (AIMD).
    - A loss event occurs → ssthresh is set to cwnd/2, and cwnd resets.

Despite its name, slow start grows the window exponentially — it's "slow" only relative to immediately sending at full rate.

---

## Is TCP fair in the case where connections have the same RTT?

**Yes.** When two TCP connections share the same bottleneck link and have the same RTT, AIMD ensures convergence to an **equal share** of bandwidth. Both connections increase their windows at the same rate and cut them by the same proportion on loss, so they converge to the fairness line (equal bandwidth allocation).

---

## Is TCP fair in the case where two connections have different RTTs?

**No.** TCP is biased toward connections with **shorter RTTs**. A connection with a lower RTT completes more AIMD cycles per unit time, so it opens its congestion window faster and captures a **disproportionately larger share** of the bandwidth.

This is a well-known fairness issue: $\text{throughput} \approx \frac{C}{\text{RTT} \cdot \sqrt{p}}$, where $p$ is the loss probability. Lower RTT → higher throughput.

---

## Explain how TCP CUBIC works

TCP CUBIC is a congestion control algorithm designed to be **more efficient on high-bandwidth, high-latency networks** than standard AIMD:

1. After a loss event, CUBIC records the window size at which loss occurred ($W_{max}$) and reduces cwnd.
2. The window growth follows a **cubic function** of time since the last loss event, centered around $W_{max}$.
3. **Far from $W_{max}$**: the window grows aggressively (concave phase, quickly approaching $W_{max}$).
4. **Near $W_{max}$**: growth slows (plateau phase, cautiously probing).
5. **Above $W_{max}$**: growth accelerates again (convex phase, probing for new capacity).

CUBIC's key advantage is that its growth is a function of **elapsed time**, not RTT, making it **RTT-fair** — connections with different RTTs grow at similar rates.

---

## Explain TCP throughput calculation

TCP throughput can be approximated by:

$$\text{Throughput} \approx \frac{C \cdot \text{MSS}}{\text{RTT} \cdot \sqrt{p}}$$

Where:

- $C$ is a constant (typically $\sqrt{3/2}$ for the standard model)
- $\text{MSS}$ is the Maximum Segment Size
- $\text{RTT}$ is the Round Trip Time
- $p$ is the packet loss probability

This shows that throughput is inversely proportional to both RTT and the square root of loss rate. Higher loss or higher RTT → lower throughput.
