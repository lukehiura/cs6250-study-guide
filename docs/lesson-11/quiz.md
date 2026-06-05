---
tags:
  - lesson-11
  - video-streaming-voip
  - quiz
search:
  boost: 1.5
quiz:
  auto_number: true
  shuffle_answers: true
  disable_after_submit: false
---

# Lesson 11: Interactive Quiz

Test your understanding of video streaming, DASH, and VoIP quality tradeoffs. New here? Start with the [Plain-language guide](plain-language.md). For condensed written review, see the [Quick Study Guide](quick-study-guide.md).

!!! info "Before you begin"
    <!-- mkdocs-quiz intro -->

---

## Media classes and constraints

<quiz>
Which application class is most delay-sensitive?
- [ ] Stored video streaming
- [ ] Live event streaming
- [x] Conversational voice/video
- [ ] Progressive download only

Conversational media has strict timing expectations for human turn-taking.
</quiz>

<quiz>
Stored video can often tolerate initial buffering because content is [[pre-recorded]].
---
The client can prefetch ahead of playout to absorb throughput variation.
</quiz>

<quiz>
A common tradeoff for live streaming is:
- [x] Accepting some delay to keep playback stable
- [ ] Requiring zero delay always
- [ ] Eliminating buffering entirely
- [ ] Using only retransmissions for every lost packet

Live systems balance liveness with continuity and scale.
</quiz>

---

## QoS metrics and jitter/loss handling

<quiz>
Which set contains the three core VoIP QoS metrics?
- [x] End-to-end delay, jitter, packet loss
- [ ] DNS TTL, BGP MED, queue length
- [ ] Throughput only, RTT only, loss only
- [ ] Segment size, MPD length, GOP duration

These three metrics most directly shape call quality.
</quiz>

<quiz>
Delay jitter mainly refers to:
- [ ] Average delay from source to destination
- [x] Variation in inter-packet arrival timing
- [ ] Packet bit errors in physical links
- [ ] DNS cache inconsistency

Jitter causes uneven playout timing and requires de-jitter buffering.
</quiz>

<quiz>
A playout buffer should usually:
- [x] Hold early packets and drop packets that arrive too late
- [ ] Retransmit every missing packet immediately
- [ ] Disable timestamps for media packets
- [ ] Increase jitter intentionally

Late packets can miss playout deadlines and are no longer useful.
</quiz>

<quiz>
Forward Error Correction (FEC) primarily trades higher [[bandwidth]] usage for fewer unrecoverable losses.
---
FEC adds redundancy so some losses are reconstructed without retransmission.
</quiz>

---

## DASH and delivery architecture

<quiz>
In DASH, the client selects bitrate:
- [ ] Once at session startup and never changes
- [x] Per segment/chunk based on observed conditions
- [ ] Only when DNS TTL expires
- [ ] Only after server-side RTSP negotiation

ABR logic adapts at segment boundaries as throughput/buffer state changes.
</quiz>

<quiz>
The DASH manifest file is typically called the [[MPD]].
---
MPD lists available representations, segment metadata, and URLs.
</quiz>

<quiz>
Why did HTTP/TCP become dominant for Internet video delivery?
- [x] Works well with CDN/web infrastructure and middleboxes
- [ ] Because UDP is forbidden on the Internet
- [ ] It always guarantees zero buffering
- [ ] It removes the need for adaptation algorithms

Deployability and ecosystem compatibility drove adoption.
</quiz>

---

<!-- mkdocs-quiz results -->

