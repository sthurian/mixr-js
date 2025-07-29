import { OSCClient } from '../osc/client.js';
import { Channel, createChannel } from './channel/channel.js';
import { MixerModel, MixerModelMap } from './models.js';

export type Mixer<M extends MixerModel> = {
  getChannel(channel: MixerModelMap[M]): Channel;
  closeConnection(): Promise<void>;
};

export const createMixer = <M extends MixerModel>(oscClient: OSCClient): Mixer<M> => {
  return {
    getChannel: (channel: MixerModelMap[M]): Channel => {
      // Here TypeScript enforces allowed channel strings for the model M
      const channelNumber = parseInt(channel.replace('CH', ''), 10);
      return createChannel({
        channel: channelNumber,
        oscClient,
      });
    },
    closeConnection: () => {
      return oscClient.close();
    },
  };
};
