import { createSocket } from 'node:dgram';
import { createMixerDiscoverer } from './xair/mixer-discoverer.js';
import { createClock } from './xair/clock.js';
import { createOSCSocket } from './osc/socket.js';
import { fromBuffer, toBuffer } from 'osc-min';
import { connectToMixer } from './xair/client.js';

const mixerDiscoverer = createMixerDiscoverer({
  socket: await createOSCSocket({
    fromBuffer,
    toBuffer,
    socket: createSocket({ type: 'udp4', reuseAddr: true }),
  }),
  clock: createClock(setTimeout),
});
const discoverMixers = mixerDiscoverer.discover;

export { discoverMixers, connectToMixer };
