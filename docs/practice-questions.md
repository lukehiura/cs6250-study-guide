# Practice Questions

Test your understanding with these questions. Try to answer before revealing the solution.

For interactive multiple-choice and fill-in-the-blank practice with progress tracking, see the **[Lesson 1 Interactive Quiz](lesson-01-quiz.md)**.

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
