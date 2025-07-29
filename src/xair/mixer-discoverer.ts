import { oscArgumentListSchema } from '../osc/osc-schemas.js';
import { OscSocket } from '../osc/socket.js';
import { Clock } from './clock.js';
import { isMixerModel, MixerModel } from './models.js';

type DiscoveryOptions = {
  timeout?: number;
  broadcastAddress?: string;
};

export type MixerConnectionInformation<M extends MixerModel = MixerModel> = {
  mixerPort?: number;
  mixerAddress: string;
  model: M;
};

type MixerDiscoverer = {
  discover: (options?: DiscoveryOptions) => Promise<MixerConnectionInformation[]>;
};

type MixerDiscovererDependencies = {
  socket: OscSocket;
  clock: Clock;
};

export const createMixerDiscoverer = (
  dependencies: MixerDiscovererDependencies,
): MixerDiscoverer => {
  const { socket, clock } = dependencies;
  return {
    discover: (options) => {
      const { timeout = 5000, broadcastAddress = '255.255.255.255' } = options || {};
      return new Promise((resolve, reject) => {
        const BROADCAST_PORT = 10024;
        const DISCOVERY_MESSAGE = '/xinfo';

        const discovered: MixerConnectionInformation[] = [];

        socket.on('/xinfo', (message, rinfo) => {
          const existing = discovered.find((d) => d.mixerAddress === rinfo.address);
          if (!existing) {
            const parsedResult = oscArgumentListSchema.safeParse(message.args);
            if (!parsedResult.success) {
              throw parsedResult.error;
            }
            const args = parsedResult.data.map((argument) => {
              return argument.value;
            });
            const model = `${args[2]}`;
            if (isMixerModel(model)) {
              discovered.push({
                mixerAddress: rinfo.address,
                mixerPort: rinfo.port,
                model,
              });
            }
          }
        });

        socket.setBroadcast(true);
        socket
          .send(
            {
              address: DISCOVERY_MESSAGE,
              args: [],
            },
            BROADCAST_PORT,
            broadcastAddress,
          )
          .then(() => {
            socket.setBroadcast(false);
            clock.setTimeout(() => {
              socket.close();
              resolve(discovered);
            }, timeout);
          })
          .catch((err) => {
            socket.close();
            reject(err);
          });
      });
    },
  };
};
