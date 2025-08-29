# Mixr.js

[![npm](https://img.shields.io/npm/v/mixr-js)](https://www.npmjs.com/package/mixr-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Type%20Safe-blue.svg)](https://www.typescriptlang.org/)
[![Test Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg)](https://github.com/sthurian/mixr-js)

A comprehensive TypeScript/JavaScript client library for controlling **digital mixing consoles** over network. Currently supports Behringer X-Air series (XR12, XR16, XR18) via OSC protocol, with extensible architecture designed for future mixer support across different protocols.

> **Why "Mixr.js"?** The name reflects the broader vision of a type-safe, modern mixing console control library. While currently focused on X-Air mixers, the architecture is designed to support multiple mixer brands and models.

## ✨ Features

### 🎛️ Complete Channel Control

- **Channel Configuration**: Name, color, input source routing
- **Preamp**: Gain, phantom power, low-cut filter, polarity invert
- **4-Band Parametric EQ**: Frequency, gain, Q, band type control
- **Dynamics**: Gate and compressor with full parameter control
- **Mix Controls**: Fader, pan, mute, LR assignment
- **Sends**: Aux bus and FX sends with level and tap control
- **Automix**: Weight and group assignment
- **Insert Effects**: FX slot assignment

### 🎚️ Main LR Bus Control

- **Mix Controls**: Master fader, mute, pan control
- **Configuration**: Name and color assignment
- **6-Band Parametric EQ**: Full frequency control with mode selection (PEQ/GEQ/TEQ)
- **Dynamics**: Professional compressor processing
- **Insert Effects**: FX slot assignment and processing
- **Audio Processing**: Complete signal path control for main outputs

### 🚌 Auxiliary Bus Control (Bus 1-6)

- **Mix Controls**: Bus level, mute control
- **Configuration**: Bus name and color assignment
- **6-Band Parametric EQ**: Complete frequency shaping per bus
- **Dynamics**: Full compressor processing per bus
- **Group Assignments**: DCA and mute group integration
- **Insert Effects**: Per-bus insert processing

### 🔄 Dual API Design

- **Raw Protocol Values**: Direct control using underlying protocol values for power users
- **Audio Engineer Units**: Decibels, Hertz, percentages for intuitive control
- **Automatic Conversion**: Seamless translation between raw and engineer-friendly values

### 🛡️ Type Safety

- **Branded Types**: Prevent unit confusion with compile-time safety
- **Model-Specific Channels**: TypeScript enforces valid channels per mixer model
- **Comprehensive Validation**: Runtime parameter validation with clear error messages

### 🔍 Network Discovery

- **Auto-Discovery**: Find mixers on your network automatically
- **Manual Connection**: Direct IP connection support
- **Connection Management**: Automatic connection handling with cleanup

## 📦 Installation

```bash
npm install mixr-js
```

## 🚀 Quick Start

### Discover and Connect to Mixers

```typescript
import { discoverMixers, connectToMixer } from 'mixr-js';

// Auto-discover mixers on the network
const mixers = await discoverMixers({ timeout: 5000 });
console.log('Found mixers:', mixers);

// Connect to the first discovered XR18 mixer
const mixer = await connectToMixer({
  ...mixers[0],
  model: 'XR18', // Specify your mixer model for type safety
});

// Always close connection when done
await mixer.closeConnection();
```

### Basic Channel Control

```typescript
// Get a channel (TypeScript ensures valid channel names per model)
const channel = mixer.getChannel('CH01');

// Configure channel
await channel.getConfig().updateName('Lead Vocal');
await channel.getConfig().updateColor('Red', 'color');

// Preamp control - dual API in action
await channel.getPreAmp().updateGain(24, 'decibels'); // Audio engineer units
await channel.getPreAmp().updateGain(0.5); // Raw protocol value

// Enable phantom power and configure low-cut
await channel.getPreAmp().updatePhantomPowerEnabled(true, 'flag');
await channel.getPreAmp().updateLowCutFrequency(100, 'hertz');

// Mix controls
await channel.getMix().updateFader(-6, 'decibels');
await channel.getMix().updatePan(25, 'percent');
await channel.getMix().updateMuted(false, 'flag');
```

### EQ Control

```typescript
const eq = channel.getEqualizer();

// Enable EQ
await eq.updateEnabled(true, 'flag');

// Configure high-mid band (band 3)
const highMid = eq.getBand(3);
await highMid.updateFrequency(3000, 'hertz');
await highMid.updateGain(2.5, 'decibels');
await highMid.updateQ(1.4, 'number');
await highMid.updateType('PEQ', 'type');
```

### Dynamics Processing

```typescript
const compressor = channel.getCompressor();

// Configure compressor
await compressor.updateEnabled(true, 'flag');
await compressor.updateThreshold(-12, 'decibels');
await compressor.updateRatio('4', 'ratio');
await compressor.updateAttack(10, 'milliseconds');
await compressor.updateRelease(100, 'milliseconds');
await compressor.updateGain(3, 'decibels'); // Makeup gain

// Gate configuration
const gate = channel.getGate();
await gate.updateEnabled(true, 'flag');
await gate.updateThreshold(-35, 'decibels');
await gate.updateRange(40, 'decibels');
```

### Sends and Routing

```typescript
// Aux send to Bus 1
const bus1Send = channel.getSendBus('Bus1');
await bus1Send.updateLevel(-10, 'decibels');
await bus1Send.updateTap('POST', 'tap');

// FX send
const fx1Send = channel.getSendFx('FX1');
await fx1Send.updateLevel(-15, 'decibels');
await fx1Send.updateTap('PRE', 'tap');

// DCA and Mute group assignment
await channel.getDCAGroup().updateEnabled(1);
await channel.getMuteGroup().updateEnabled(2);
```

### Main LR Bus Control

```typescript
// Access the main LR bus
const mainLR = mixer.getMainLR();

// Mix controls
await mainLR.getMix().updateFader(-2, 'decibels');
await mainLR.getMix().updateMuted(false, 'flag');
await mainLR.getMix().updatePan(0, 'percent'); // Center pan

// Configuration
await mainLR.getConfig().updateName('Main Mix');
await mainLR.getConfig().updateColor('White', 'color');

// 6-band EQ with mode control
const lrEQ = mainLR.getEqualizer();
await lrEQ.updateEnabled(true, 'flag');
await lrEQ.updateMode('PEQ', 'mode'); // PEQ, GEQ, or TEQ

// Configure EQ bands (1-6)
const midBand = lrEQ.getBand(3);
await midBand.updateFrequency(1000, 'hertz');
await midBand.updateGain(1.5, 'decibels');
await midBand.updateQ(2.0, 'number');

// Compressor with insert support
const lrCompressor = mainLR.getCompressor();
await lrCompressor.updateEnabled(true, 'flag');
await lrCompressor.updateThreshold(-6, 'decibels');
await lrCompressor.updateRatio('3', 'ratio');

// Insert effects support
const lrInsert = mainLR.getInsert();
await lrInsert.updateEnabled(true, 'flag');
await lrInsert.updateFxSlot('FX1', 'slot');
```

### Auxiliary Bus Control

```typescript
// Access an auxiliary bus (Bus 1-6)
const bus1 = mixer.getBus('Bus1');

// Mix controls
await bus1.getMix().updateFader(-8, 'decibels');
await bus1.getMix().updateMuted(false, 'flag');

// Configuration
await bus1.getConfig().updateName('Monitor 1');
await bus1.getConfig().updateColor('Blue', 'color');

// 6-band EQ control
const busEQ = bus1.getEqualizer();
await busEQ.updateEnabled(true, 'flag');
await busEQ.updateMode('PEQ', 'mode'); // PEQ, GEQ, TEQ, VEQ, LCut, LShv, HShv, HCut

// Configure EQ bands for monitor mix
const lowBand = busEQ.getBand(1);
await lowBand.updateFrequency(80, 'hertz');
await lowBand.updateGain(-2, 'decibels');
await lowBand.updateType('HPF', 'type');

const midBand = busEQ.getBand(3);
await midBand.updateFrequency(2500, 'hertz');
await midBand.updateGain(1, 'decibels');
await midBand.updateQ(1.5, 'number');

// Compressor for bus dynamics
const busCompressor = bus1.getCompressor();
await busCompressor.updateEnabled(true, 'flag');
await busCompressor.updateThreshold(-12, 'decibels');
await busCompressor.updateRatio('2', 'ratio');

// Group assignments
await bus1.getDCAGroup().updateEnabled(3);
await bus1.getMuteGroup().updateEnabled(1);

// Insert effects
const busInsert = bus1.getInsert();
await busInsert.updateEnabled(true, 'flag');
await busInsert.updateFxSlot('FX2A', 'slot');
```

### Reading Current Values

```typescript
// Read channel values with automatic unit conversion
const currentGain = await channel.getPreAmp().fetchGain('decibels');
const currentFreq = await eq.getBand(1).fetchFrequency('hertz');
const isMuted = await channel.getMix().fetchIsMuted('flag');

// Read main LR values
const mainLR = mixer.getMainLR();
const masterLevel = await mainLR.getMix().fetchFader('decibels');
const eqMode = await mainLR.getEqualizer().fetchMode('mode');
const compressorRatio = await mainLR.getCompressor().fetchRatio('ratio');

console.log(`Channel gain: ${currentGain}dB`);
console.log(`Low band frequency: ${currentFreq}Hz`);
console.log(`Channel muted: ${isMuted}`);
console.log(`Master level: ${masterLevel}dB`);
console.log(`Main EQ mode: ${eqMode}`);
console.log(`Main compressor ratio: ${compressorRatio}:1`);
```

## 📚 API Reference

### Mixer Models

| Model  | Channels  | Description                     |
| ------ | --------- | ------------------------------- |
| `XR12` | CH01-CH10 | Behringer X-Air XR12 (12-input) |
| `XR16` | CH01-CH14 | Behringer X-Air XR16 (16-input) |
| `XR18` | CH01-CH16 | Behringer X-Air XR18 (18-input) |

_Future versions will support additional mixer brands and models._

> **Note**: This library has been extensively tested with real hardware on an XR18 mixer. XR12 and XR16 support is implemented based on protocol documentation and should work correctly, but has not been verified with physical hardware.

### Channel Features

#### Configuration (`channel.getConfig()`)

- `updateName(name)` / `fetchName()` - Channel name
- `updateColor(color)` / `fetchColor()` - Color assignment
- `updateAnalogSource(source)` / `fetchAnalogSource()` - Analog input routing
- `updateUsbReturnSource(source)` / `fetchUsbReturnSource()` - USB return source

#### Preamp (`channel.getPreAmp()`)

- `updateGain(gain, 'decibels')` / `fetchGain()` - Input gain (-12dB to +60dB)
- `updatePhantomPowerEnabled(enabled)` / `fetchIsPhantomPowerEnabled()` - 48V phantom power
- `updateLowCutFrequency(freq, 'hertz')` / `fetchLowCutFrequency()` - High-pass filter (20Hz-400Hz)
- `updateLowCutEnabled(enabled)` / `fetchIsLowCutEnabled()` - High-pass filter on/off
- `updatePolarityInverted(inverted)` / `fetchIsPolarityInverted()` - Phase invert
- `updateUSBTrim(trim, 'decibels')` / `fetchUSBTrim()` - USB return trim (-18dB to +18dB)
- `updateUSBReturnEnabled(enabled)` / `fetchIsUSBReturnEnabled()` - USB return on/off

#### 4-Band EQ (`channel.getEqualizer()`)

- `updateEnabled(enabled)` / `fetchIsEnabled()` - EQ on/off
- `getBand(1-4)` - Access individual EQ bands
  - `updateFrequency(freq, 'hertz')` / `fetchFrequency()` - Center frequency
  - `updateGain(gain, 'decibels')` / `fetchGain()` - Gain adjustment (-15dB to +15dB)
  - `updateQ(q, 'number')` / `fetchQ()` - Q factor (0.3 to 10)
  - `updateType(type)` / `fetchType()` - Band type (LCut, LShv, PEQ, HShv, HCut)

#### Dynamics (`channel.getCompressor()`, `channel.getGate()`)

- **Compressor**: Threshold, ratio, attack, release, knee, makeup gain, mix
- **Gate**: Threshold, range, attack, hold, release, key source
- **Shared**: Enable/disable, key source, side-chain filter

#### Mix (`channel.getMix()`)

- `updateFader(level, 'decibels')` / `fetchFader()` - Channel fader (-∞ to +10dB)
- `updatePan(pan, 'percent')` / `fetchPan()` - Pan position (-100% to +100%)
- `updateMuted(muted)` / `fetchIsMuted()` - Channel mute
- `updateLeftRightAssignmentEnabled(enabled)` / `fetchIsLeftRightAssignmentEnabled()` - LR assignment

#### Sends

- `getSendBus('Bus1'-'Bus6')` - Aux bus sends
- `getSendFx('FX1'-'FX4')` - Effects sends
- Level, tap point (PRE/POST), and group enable control

#### Groups and Routing

- `getDCAGroup()` / `getMuteGroup()` - DCA and mute group assignments
  - `updateEnabled(groupNumber)` - Assign to group
  - `updateDisabled(groupNumber)` - Remove from group
  - `isEnabled(groupNumber)` - Check group assignment
- `getInsert()` - Insert effect slot assignment
  - `updateEnabled(enabled)` / `fetchIsEnabled()` - Insert on/off
  - `updateFxSlot(slot)` / `fetchFxSlot()` - FX slot assignment
- `getAutomix()` - Automix group and weight

### Main LR Bus Features

#### Configuration (`mixer.getMainLR().getConfig()`)

- `updateName(name)` / `fetchName()` - Main LR name
- `updateColor(color)` / `fetchColor()` - Color assignment

#### Mix (`mixer.getMainLR().getMix()`)

- `updateFader(level, 'decibels')` / `fetchFader()` - Main fader (-∞ to +10dB)
- `updateMuted(muted)` / `fetchIsMuted()` - Main LR mute
- `updatePan(pan, 'percent')` / `fetchPan()` - Pan position (-100% to +100%)

#### 6-Band EQ (`mixer.getMainLR().getEqualizer()`)

- `updateEnabled(enabled)` / `fetchIsEnabled()` - EQ on/off
- `updateMode(mode)` / `fetchMode()` - EQ mode (PEQ, GEQ, TEQ)
- `getBand(1-6)` - Access individual EQ bands
  - Full parametric control (frequency, gain, Q, type)
  - Same interface as channel EQ bands

#### Compressor (`mixer.getMainLR().getCompressor()`)

- Full dynamics control (threshold, ratio, attack, release, etc.)

#### Insert Effects (`mixer.getMainLR().getInsert()`)

The main LR bus supports insert effects with simplified slot assignments:

```javascript
const insert = mixer.getMainLR().getInsert();

// Get current insert enabled state
const isEnabled = await insert.fetchIsEnabled('flag');

// Enable/disable insert
await insert.updateEnabled(true, 'flag');

// Get current FX slot assignment
const currentSlot = await insert.fetchFxSlot('slot');

// Set FX slot assignment
await insert.updateFxSlot('FX2', 'slot');
```

**Available FX Slots:**

- `'OFF'` - Insert disabled
- `'FX1'` - FX1 slot
- `'FX2'` - FX2 slot
- `'FX3'` - FX3 slot
- `'FX4'` - FX4 slot

_Note: MainLR insert uses simplified slot names ('FX1', 'FX2', etc.) unlike channel inserts which use A/B variants ('Fx1A', 'Fx1B', etc.)_

### Auxiliary Bus Features (Bus 1-6)

#### Configuration (`mixer.getBus('Bus1').getConfig()`)

- `updateName(name)` / `fetchName()` - Bus name
- `updateColor(color)` / `fetchColor()` - Color assignment

#### Mix (`mixer.getBus('Bus1').getMix()`)

- `updateFader(level, 'decibels')` / `fetchFader()` - Bus fader (-∞ to +10dB)
- `updateMuted(muted)` / `fetchIsMuted()` - Bus mute

#### 6-Band EQ (`mixer.getBus('Bus1').getEqualizer()`)

- `updateEnabled(enabled)` / `fetchIsEnabled()` - EQ on/off
- `updateMode(mode)` / `fetchMode()` - EQ mode (LCut, LShv, PEQ, VEQ, HShv, HCut)
- `getBand(1-6)` - Access individual EQ bands
  - `updateFrequency(freq, 'hertz')` / `fetchFrequency()` - Center frequency
  - `updateGain(gain, 'decibels')` / `fetchGain()` - Gain adjustment (-15dB to +15dB)
  - `updateQ(q, 'number')` / `fetchQ()` - Q factor (0.3 to 10)
  - `updateType(type)` / `fetchType()` - Band type (LCut, LShv, PEQ, HShv, HCut)

#### Compressor (`mixer.getBus('Bus1').getCompressor()`)

- Full dynamics control (threshold, ratio, attack, release, etc.)
- Same interface as channel compressor

#### Groups and Routing

- `getDCAGroup()` / `getMuteGroup()` - DCA and mute group assignments
  - `updateEnabled(groupNumber)` - Assign to group
  - `updateDisabled(groupNumber)` - Remove from group
  - `isEnabled(groupNumber)` - Check group assignment
- `getInsert()` - Insert effect slot assignment
  - `updateEnabled(enabled)` / `fetchIsEnabled()` - Insert on/off
  - `updateFxSlot(slot)` / `fetchFxSlot()` - FX slot assignment

## 🏗️ Architecture Highlights

### Type System

The library uses a sophisticated branded type system to prevent unit confusion:

```typescript
// Compile-time prevention of unit errors
await channel.getPreAmp().updateGain(24, 'decibels'); // ✅ Correct
await channel.getPreAmp().updateGain(24, 'hertz'); // ❌ TypeScript error

// Raw protocol values bypass unit system for power users
await channel.getPreAmp().updateGain(0.5); // ✅ Raw protocol value
```

### Model-Specific Type Safety

```typescript
const xr12 = await connectToMixer({ model: 'XR12', ...connection });
const xr18 = await connectToMixer({ model: 'XR18', ...connection });

xr12.getChannel('CH11'); // ❌ TypeScript error - XR12 only has CH01-CH10
xr18.getChannel('CH15'); // ✅ Valid - XR18 supports CH01-CH16
```

### Dual API Design

Every parameter supports both raw protocol values and audio engineer units:

```typescript
// Audio engineer approach - intuitive units
await channel.getEqualizer().getBand(1).updateFrequency(1000, 'hertz');
await channel.getMix().updateFader(-6, 'decibels');

// Power user approach - direct protocol control
await channel.getEqualizer().getBand(1).updateFrequency(0.3);
await channel.getMix().updateFader(0.75);
```

## 🧪 Testing

The library includes comprehensive test coverage (100%) with 315 tests:

```bash
npm test                    # Run all tests
npm run test:coverage       # Run tests with coverage report
npm run test:coverage:html  # Generate HTML coverage report
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

## 📋 Current Status & Limitations

This library currently implements comprehensive **channel-level control**, **main LR bus control**, and **auxiliary bus control**. Some mixer-wide features are not yet implemented:

- Effects rack control (FX1-FX4)
- System-level actions (snapshots, global mute)
- Advanced routing matrix

### Recent Updates

**Auxiliary Bus Implementation (Latest)**: Complete auxiliary bus control (Bus 1-6) including:

- Mix controls (fader, mute)
- Configuration (name, color)
- 6-band parametric EQ with full frequency control
- Compressor dynamics processing
- DCA and mute group assignments
- Insert effects routing

**Main LR Bus Implementation**: Complete main output control including:

- Mix controls (fader, mute, pan)
- 6-band parametric EQ with mode selection
- Professional compressor with insert effects
- Configuration (name, color)

See [TODO.md](./TODO.md) for a complete list of planned features.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:

- Bug fixes
- New feature implementations
- Documentation improvements
- Test coverage expansion

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Behringer** for creating the X-Air mixer series
- **Open Sound Control Community** for the OSC specification

---

**Note**: This library is not officially affiliated with Behringer. X-Air and associated trademarks are property of their respective owners.
