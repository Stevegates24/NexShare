<div align="center">

# ✦ NEXSHARE

**Instant peer-to-peer file transfer — no accounts, no servers, no installs.**

Share files between any devices on the same WiFi in seconds.  
Just open the page, share a 6-letter code, and drop your files.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Open%20App-9333EA?style=for-the-badge&logo=googlechrome&logoColor=white)](https://stevegates24.github.io/NexShare/)
[![License](https://img.shields.io/badge/License-MIT-A855F7?style=for-the-badge)](LICENSE)
[![No Backend](https://img.shields.io/badge/Backend-None-34D399?style=for-the-badge)](#)
[![WebRTC](https://img.shields.io/badge/Powered%20by-WebRTC-C084FC?style=for-the-badge)](#)

</div>

---

## What is NexShare?

NexShare is a **single HTML file** that turns any browser into a local file-sharing terminal. It uses WebRTC (via PeerJS) to create **direct device-to-device connections** — your files never touch an external server.

Think of it like AirDrop or Quick Share, but for any device with a browser.

---

## Features

- **📡 Room-based discovery** — one device creates a room, others join with a 6-letter code
- **📷 QR code joining** — scan with a phone camera to auto-join instantly
- **👤 Custom device identity** — set your name and pick an emoji avatar, saved across sessions
- **⚡ Fast transfers** — 256 KB chunks with WebRTC DataChannels, saturates local network bandwidth
- **✅ Accept / Decline** — incoming files always prompt before downloading
- **📊 Live transfer progress** — real-time speed, percentage, and per-file status
- **🌐 Works everywhere** — Chrome, Firefox, Safari, Edge; desktop and mobile
- **🔒 Fully private** — file data never leaves your local network
- **📦 Zero install** — one `.html` file, no dependencies to install, no backend, no accounts

---

## How It Works

```
Device A                  PeerJS Signal Server             Device B
   |                            |                              |
   |── creates room "XK9P2M" ──▶|                              |
   |                            |◀── joins room "XK9P2M" ──────|
   |                            |                              |
   |◀══════════ WebRTC handshake (ICE / STUN) ════════════════▶|
   |                                                           |
   |◀══════════════ Direct P2P connection ════════════════════▶|
   |                                                           |
   |══════════════ File chunks (256KB each) ══════════════════▶|
```

1. **Signaling** — PeerJS's free public server is used only to exchange connection metadata (IP/port). No file data passes through it.
2. **Transfer** — Once connected, files stream directly between browsers as binary chunks over WebRTC DataChannels.
3. **Speed** — On a typical home/office WiFi, expect **10–80+ MB/s** depending on router and device hardware.

---

## Getting Started

### Option 1 — Use the hosted version

Open [stevegates24.github.io/NexShare](https://stevegates24.github.io/NexShare/) on both devices. Done.

### Option 2 — Self-host (recommended for private use)

```bash
# Clone the repo
git clone https://github.com/stevegates24/NexShare.git
cd NexShare

# Open directly in browser — no server needed
open nexshare.html

# Or serve locally (optional, for LAN access from other devices)
python3 -m http.server 8080
# Then open http://<your-ip>:8080/nexshare.html on other devices
```

> **Note:** For local serving, both devices must be on the same network and able to reach your machine's IP address.

---

## Usage

### Sending a file

1. Open `nexshare.html` on **Device A** — a 6-letter room code appears (e.g. `XK9P2M`)
2. On **Device B**, open the same page and either:
   - Type the code into the 6 boxes → tap **Join Room**
   - Or scan the QR code on Device A → auto-joins instantly
3. Both devices see each other in the room
4. **Tap a device card** to select who you're sending to
5. **Drop files** onto the drop zone, or tap **Choose Files**
6. The receiver sees an **Accept / Decline** prompt
7. On accept, the file transfers and auto-downloads

### Multiple devices

Up to any number of devices can join the same room. The host device acts as a relay for room membership announcements; actual file transfers are always direct P2P between sender and receiver.

---

## Customising Your Device

- Tap the **avatar circle** in the lobby to pick an emoji avatar
- Tap the **name field** and type your device name
- Both are saved to `localStorage` and remembered on your next visit

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | Vanilla HTML + CSS + JS (single file, no framework) |
| P2P | [PeerJS](https://peerjs.com/) (WebRTC DataChannels) |
| Signaling | PeerJS public cloud (metadata only) |
| STUN | Google STUN + Twilio STUN |
| QR | [qrcode.js](https://github.com/davidshimjs/qrcodejs) |
| Fonts | Google Fonts (Syne + DM Sans) |
| Storage | `localStorage` (name + avatar only) |

---

## Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome / Edge | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Safari | ✅ (macOS 14+) | ✅ (iOS 15+) |
| Samsung Internet | — | ✅ |

---

## Privacy & Security

- **No file data leaves your network.** The PeerJS signaling server only sees connection metadata (peer IDs), never file contents.
- **No accounts, no tracking, no analytics.**
- All transfers are **encrypted in transit** by WebRTC's built-in DTLS encryption.
- Files are only received after the user **explicitly taps Accept**.
- NexShare works entirely offline once both devices are connected (signaling only needed during initial handshake).

> For maximum privacy, self-host the file and point it at your own PeerJS server instance.

---

## Self-hosted PeerJS Server (optional)

If you want zero reliance on PeerJS's public infrastructure:

```bash
# Install PeerJS server
npm install -g peer

# Run on your local machine
peerjs --port 9000

# Then update the PCFG in nexshare.html:
const PCFG = {
  host: '192.168.1.x',  // your machine's LAN IP
  port: 9000,
  path: '/',
  config: { iceServers: [...] }
};
```

This makes NexShare **fully self-contained on your LAN** with no internet dependency at all.

---

## File Structure

```
NexShare/
└── nexshare.html     # The entire app — open this in any browser
```

That's it. One file.

---

## Limitations

- Both devices need **internet access** for the initial WebRTC handshake (STUN/signaling). File data itself is local.
- WebRTC is **not supported** in some older browsers or WebViews.
- Transfer speed depends on your **router and hardware** — not NexShare.
- Very large files (10 GB+) may strain browser memory on low-end devices since chunks are assembled in RAM before download.

---

## Contributing

Pull requests are welcome. For major changes, open an issue first.

```bash
git checkout -b feature/your-feature
# make your changes to nexshare.html
git commit -m "feat: your feature"
git push origin feature/your-feature
```

---

## License

MIT — do whatever you want with it.

---

<div align="center">

Made with ☕ and WebRTC &nbsp;·&nbsp; No cloud was harmed in the making of this app

</div>
