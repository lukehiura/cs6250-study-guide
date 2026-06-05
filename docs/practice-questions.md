---
tags:
  - practice
  - quiz
search:
  boost: 1.5
---

# Practice Questions

Test your understanding with these questions. Try to answer before revealing the solution.

For interactive practice, see the **[Lesson 1 Quiz](lesson-01/quiz.md)** and **[Lesson 2 Quiz](lesson-02/quiz.md)**. New to Lesson 1? Start with the **[Plain-language guide](lesson-01/plain-language.md)**.

---

## Lesson 1: Introduction, History, and Internet Architecture

### Q1: End-to-End Principle and Link-Layer Error Correction

Some data link layer protocols, such as 802.11 (Wi-Fi), implement basic error correction because the physical medium is easily prone to interference and noise (for example, a nearby running microwave). Is this a violation of the end-to-end principle?

??? success "Answer"
    **No.**

    Violations of the end-to-end principle typically refer to scenarios where it is not possible to implement a functionality entirely at the end hosts — such as NAT and firewalls, which alter or block traffic inside the network core.

    In this case, a lower-level protocol is implementing error checking to compensate for a noisy physical medium. This does not prevent end hosts from implementing their own end-to-end reliability. It is a performance optimization at the link layer, not a violation of the principle.

---

### Q2: Ramifications of the Hourglass Shape

Which of the following are ramifications of the "hourglass shape of the Internet"?

A. Many technologies not originally designed for the Internet have been modified to communicate over the Internet (such as Radio over IP).

B. It has been a difficult and slow process to transition to IPv6, despite the shortage of public IPv4 addresses.

C. Applications like BitTorrent leverage peer-to-peer networking instead of a more traditional client-server model for better performance.

??? success "Answer"
    **A and B are correct. C is not.**

    - **A is correct** — Modifying a technology to be compatible with IP (the narrow waist) greatly enhances market penetration and reduces extra development effort. The hourglass shape means everything converges on IP, so adapting to IP gives you access to the entire Internet ecosystem.

    - **B is correct** — A huge portion of Internet infrastructure depends on IPv4. The cost of transitioning is high because of the ossified narrow waist. This is a direct consequence of the hourglass architecture.

    - **C is not relevant** — The hourglass shape refers to Internet architecture in terms of *protocols available at the different layers*, not application-level design patterns like peer-to-peer vs. client-server.

---

### Q3: Spanning Tree Algorithm

Consider the following statements about the Spanning Tree Algorithm (STA). Which is correct?

A. The Spanning Tree Algorithm helps to manage data flow in networks to prevent overwhelming traffic, known as "broadcast storms."

B. In the Spanning Tree Algorithm, the root of the spanning tree is always positioned centrally to minimize the distance to all other network nodes.

C. When using the Spanning Tree Algorithm, data cannot be sent over a network link that the algorithm has deactivated or put into an inactive state.

??? success "Answer"
    **A is correct. B and C are incorrect.**

    - **A is correct** — That is the purpose of STA. Although broadcast storms can still occur from other causes (e.g., a bad network card), STA prevents broadcast storms that result from loops in the network topology.

    - **B is incorrect** — STA guarantees a unique spanning tree that all nodes agree on, but this is not necessarily the optimal tree. The root is the bridge with the **smallest ID**, not the most central one. Network administrators can configure bridge IDs if they want a specific root.

    - **C is incorrect** — Traffic can still physically reach a deactivated link, but that link is **not used to forward traffic**. The port is blocked for forwarding, not physically disconnected.

---

## Lesson 2: Transport Layer

### Q1: UDP vs TCP for live video

A new live-streaming app prioritizes low delay over recovering every lost frame. Should it use UDP or TCP?

??? success "Answer"
    **UDP (typically).**

    Lost frames may be skipped; retransmissions add delay. TCP's reliability and congestion control can increase latency. The app may implement limited recovery at the application layer if needed.

---

### Q2: Fast retransmit

A sender transmits TCP segments 1–10. Segment 7 is lost; segments 8, 9, and 10 arrive at the receiver. What happens?

??? success "Answer"
    The receiver cannot deliver 8–10 to the application until segment 7 arrives (in-order delivery). It sends **duplicate ACKs** for byte/segment 7. After **three duplicate ACKs**, the sender **fast-retransmits** segment 7 without waiting for a timeout.

---

### Q3: Flow control vs congestion control

Match each to what it protects: (a) receive window, (b) congestion window.

??? success "Answer"
    - **(a) Receive window (rwnd)** — **Flow control**; protects the **receiver's buffer**.
    - **(b) Congestion window (cwnd)** — **Congestion control**; protects the **network** from overload.

    Effective send rate is limited by $\min(\text{cwnd}, \text{rwnd})$.

---

### Q4: Duplicate ACK vs timeout

Which event usually indicates **milder** congestion, and what is the typical cwnd response?

??? success "Answer"
  **Three duplicate ACKs** indicate milder congestion; TCP often **halves** cwnd and continues in congestion avoidance.

  A **timeout** indicates severe congestion; cwnd is reduced much more aggressively (often resetting toward slow start).

---

### Q5: Why does CUBIC use time instead of RTT?

??? success "Answer"
    Classic Reno increases cwnd about **once per RTT**, so flows with **shorter RTTs** grow faster and get more bandwidth.

    CUBIC sets its target window from a **cubic function of elapsed time** since the last congestion event. Competing flows at the same bottleneck tend toward **similar windows** regardless of RTT (**RTT-fairness**). On short-RTT / small-BDP paths, CUBIC’s **TCP-friendly region** keeps behavior close to standard TCP.

---

### Q6: CUBIC concave vs convex

After a loss at $W_{\max}$, what do the concave and convex portions of the cubic curve represent?

??? success "Answer"
    - **Concave region** ($\text{cwnd} < W_{\max}$): window grows **toward** the last saturation point — fast when far below, slower as it approaches the plateau.
    - **Convex region** ($\text{cwnd} > W_{\max}$): **max probing** — available bandwidth may have increased; grow above the old $W_{\max}$ to find a new maximum.

    The **plateau near $W_{\max}$** keeps utilization high with small oscillations compared to algorithms that spike growth right at saturation.
