# XAir Client

![Coverage](https://img.shields.io/badge/coverage-95.94%25-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue)
![Node.js](https://img.shields.io/badge/Node.js-16+-green)
![License](https://img.shields.io/badge/license-MIT-blue)

A TypeScript/JavaScript client library for controlling Behringer X-Air digital mixers (XR12/XR16/XR18) over network using OSC protocol.

## Features

- **Network Discovery**: Automatically find mixers on your network
- **Complete Mixer Control**: Preamp, EQ, dynamics, sends, mix controls
- **Type Safety**: Full TypeScript support with model-specific constraints

## Installation

```bash
npm install xair-client
```

## Quick Start

```typescript
import { discoverMixers, connectToMixer } from 'xair-client';

// Discover mixers on the network
const mixers = await discoverMixers();
const mixer = await connectToMixer(mixers[0]);

// Get channel and controls
const channel = mixer.getChannel('CH01');
const preamp = channel.getPreAmp();

// Read current settings
const gain = await preamp.fetchGain();
const name = await channel.getConfig().fetchName();
console.log(`${name}: ${gain}dB`);

// Update settings
await preamp.setGain(-10);
await preamp.setPhantomPowerEnabled(true);
```

## Requirements

- Node.js 16+
- Network access to mixer on UDP port 10024

## License

MIT
