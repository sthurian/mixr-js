import { createOSCClient } from '../osc/client.js';
import { createOSCSocket } from '../osc/socket.js';
import { MixerConnectionInformation } from './mixer-discoverer.js';
import { createMixer, Mixer } from './mixer.js';
import { createSocket } from 'node:dgram';
import { fromBuffer, toBuffer } from 'osc-min';
import { MixerModel } from './models.js';

export const connectToMixer = async <M extends MixerModel>(
  options: MixerConnectionInformation & { model: M },
): Promise<Mixer<M>> => {
  const { mixerPort = 10024, mixerAddress } = options;
  const oscSocket = await createOSCSocket({
    socket: createSocket({ type: 'udp4', reuseAddr: true }),
    fromBuffer,
    toBuffer,
  });
  const oscClient = createOSCClient({
    oscSocket,
    address: mixerAddress,
    port: mixerPort,
  });

  return createMixer<M>(oscClient);
};
