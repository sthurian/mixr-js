# X-Air OSC Implementation TODO

This document outlines the missing OSC parameters that need to be implemented based on the complete [Behringer X-Air OSC specification](https://behringer.world/wiki/doku.php?id=x-air_osc).

## Implementation Status Summary

### ✅ Currently Implemented
- **Channel features**: Basic config (name, color, input source), preamp (gain, phantom, low-cut, polarity), 4-band EQ, compressor/gate dynamics, sends (FX/bus), mix controls, automix, DCA/mute groups
- **Dual API**: Raw OSC values + audio engineer units (dB, Hz, etc.)
- **Type safety**: Branded types with comprehensive unit conversion
- **Test coverage**: 95.94% coverage across 222 tests

### ❌ Major Missing Categories
- System-level controls (actions, preferences, monitoring)
- Main LR bus controls  
- Aux/Bus processing and routing
- Effects rack and routing
- Advanced channel features
- MIDI integration
- Network configuration

---

## 1. System Actions (`/-action/`)

### Critical Actions
- [ ] `/-action/clearsolo` - Clear all solo assignments
- [ ] `/-action/initall` - Initialize all parameters to default
- [ ] `/-action/mute` - Global mute
- [ ] `/-action/safesolo` - Safe solo mode
- [ ] `/-action/setrtamode` - RTA mode control
- [ ] `/-action/snapshot` - Snapshot loading/saving
- [ ] `/-action/undo` - Undo last action
- [ ] `/-action/redo` - Redo last undone action

### File Management
- [ ] `/-action/load` - Load show file
- [ ] `/-action/save` - Save show file  
- [ ] `/-action/new` - Create new show

---

## 2. System Preferences (`/-prefs/`)

### Network Configuration
- [ ] `/-prefs/ip` - IP address configuration
- [ ] `/-prefs/netmask` - Network mask
- [ ] `/-prefs/gateway` - Gateway address

### MIDI Settings  
- [ ] `/-prefs/midi/enable` - MIDI enable/disable
- [ ] `/-prefs/midi/channel` - MIDI channel
- [ ] `/-prefs/midi/prog-change` - Program change handling

### Audio Configuration
- [ ] `/-prefs/clocksource` - Clock source selection
- [ ] `/-prefs/fadermode` - Fader mode (absolute/relative)

### RTA Settings
- [ ] `/-prefs/rta/source` - RTA input source
- [ ] `/-prefs/rta/mode` - RTA display mode
- [ ] `/-prefs/rta/det` - RTA detection mode

---

## 3. Main LR Bus (`/lr/`)

### Basic Controls ⭐ HIGH PRIORITY
- [ ] `/lr/mix/fader` - Main LR fader level
- [ ] `/lr/mix/on` - Main LR mute
- [ ] `/lr/dyn/*` - Main LR dynamics (compressor)
- [ ] `/lr/eq/*` - Main LR 6-band EQ
- [ ] `/lr/config/name` - Main LR name
- [ ] `/lr/config/color` - Main LR color

### Advanced LR Features
- [ ] `/lr/config/chlink` - Channel link settings
- [ ] `/lr/config/amixenable` - Automix enable for LR
- [ ] `/lr/config/amixlock` - Automix lock

---

## 4. Auxiliary Buses (`/bus/01-06/`)

### Bus Processing ⭐ HIGH PRIORITY
- [ ] `/bus/xx/mix/fader` - Bus fader level
- [ ] `/bus/xx/mix/on` - Bus mute
- [ ] `/bus/xx/dyn/*` - Bus dynamics processing
- [ ] `/bus/xx/eq/*` - Bus 6-band EQ
- [ ] `/bus/xx/config/name` - Bus name
- [ ] `/bus/xx/config/color` - Bus color

### Bus Routing
- [ ] `/bus/xx/mix/lr` - Bus to LR assignment
- [ ] `/bus/xx/grp/*` - Bus group assignments

---

## 5. Effects Rack (`/fx/1-4/`)

### Effect Control ⭐ HIGH PRIORITY  
- [ ] `/fx/x/type` - Effect type selection
- [ ] `/fx/x/par/*` - Effect parameters (varies by type)
- [ ] `/fx/x/source/l` - Left input source
- [ ] `/fx/x/source/r` - Right input source

### Effect Types to Support
- [ ] Hall, Plate, Room reverbs
- [ ] Vintage, Chorus, Flanger modulations  
- [ ] Delay variations (stereo, cross, etc.)
- [ ] Dual pitch shifters
- [ ] Distortion/overdrive effects

---

## 6. FX Send Buses (`/fxsend/1-4/`)

### Send Controls
- [ ] `/fxsend/x/mix/fader` - FX send level
- [ ] `/fxsend/x/mix/on` - FX send mute  
- [ ] `/fxsend/x/config/name` - FX send name
- [ ] `/fxsend/x/config/color` - FX send color

---

## 7. Return Channels (`/rtn/1-4/`)

### Return Processing
- [ ] `/rtn/x/mix/fader` - Return level
- [ ] `/rtn/x/mix/on` - Return mute
- [ ] `/rtn/x/mix/pan` - Return pan
- [ ] `/rtn/x/eq/*` - Return 4-band EQ
- [ ] `/rtn/x/config/name` - Return name
- [ ] `/rtn/x/config/color` - Return color

---

## 8. Enhanced Channel Features

### Graphics EQ (`/ch/xx/geq/`)
- [ ] `/ch/xx/geq/1-31` - 31-band graphic EQ
- [ ] `/ch/xx/geq/mode` - GEQ mode (pre/post)

### Advanced Routing  
- [ ] `/ch/xx/grp/*` - Additional group assignments
- [ ] `/ch/xx/config/chlink` - Channel linking
- [ ] `/ch/xx/solo` - Channel solo

### Preamp Enhancements
- [ ] `/ch/xx/preamp/trim` - Input trim (separate from gain)
- [ ] `/headamp/xx/invert` - Hardware input invert (if different from preamp/invert)

---

## 9. DCA Groups (`/dca/1-8/`)

### DCA Controls ⭐ HIGH PRIORITY
- [ ] `/dca/x/fader` - DCA fader level  
- [ ] `/dca/x/on` - DCA mute
- [ ] `/dca/x/config/name` - DCA name
- [ ] `/dca/x/config/color` - DCA color

---

## 10. Mute Groups (`/mtx/1-6/`)

### Mute Group Management
- [ ] `/mtx/x/on` - Mute group activation
- [ ] `/mtx/x/config/name` - Mute group name
- [ ] `/mtx/x/config/color` - Mute group color

---

## 11. Routing Matrix (`/routing/`)

### Input/Output Routing
- [ ] `/routing/in/*` - Input routing configuration
- [ ] `/routing/out/*` - Output routing configuration  
- [ ] `/routing/aux/*` - Auxiliary routing

---

## 12. Monitor/Headphone Section

### Monitor Controls
- [ ] Monitor source selection
- [ ] Monitor level control
- [ ] Headphone routing and level
- [ ] Talkback functionality

---

## 13. Recording/USB Features

### USB Routing Enhancements
- [ ] Advanced USB routing matrix
- [ ] USB recording controls
- [ ] Playback integration

---

## Implementation Priority

### 🔴 Phase 1 - Core Mixer Functions (High Impact)
1. Main LR bus controls (`/lr/mix/*`, `/lr/eq/*`, `/lr/dyn/*`)
2. Auxiliary bus processing (`/bus/xx/mix/*`, `/bus/xx/eq/*`)  
3. DCA group controls (`/dca/x/*`)
4. System actions (`/-action/clearsolo`, `/-action/mute`, etc.)

### 🟡 Phase 2 - Effects & Routing (Medium Impact)
1. Effects rack (`/fx/x/*`)
2. FX send buses (`/fxsend/x/*`)
3. Return channels (`/rtn/x/*`)
4. Enhanced channel features (solo, graphics EQ)

### 🟢 Phase 3 - Advanced Features (Lower Priority)
1. System preferences (`/-prefs/*`)
2. MIDI integration
3. Advanced routing matrix
4. Monitoring/headphone controls

---

## Notes for Implementation

### API Design Consistency
- Follow existing dual-API pattern (raw OSC + audio engineer units)
- Maintain branded type system for parameter safety
- Use same factory pattern for OSC parameter creation
- Ensure comprehensive test coverage for new features

### Architecture Considerations  
- Consider creating separate modules for major sections (LR, buses, effects)
- Bus/LR controls should share common interfaces where possible
- Effects should support dynamic parameter sets based on effect type
- Routing matrix may need specialized data structures

### Breaking Changes
- Adding mixer-level controls will require expanding the `Mixer` interface
- Consider versioning strategy for major API additions
- Document migration path for existing users

This TODO represents approximately 200+ additional OSC parameters across system, routing, and processing domains that would significantly expand the library's capabilities.
