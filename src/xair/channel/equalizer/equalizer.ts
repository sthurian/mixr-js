import { OSCClient } from '../../../osc/client.js';
import { createEntityFactory } from '../../entity.js';
import { onOffMapper } from '../../mapper/on-off.js';
import { ChannelEqualizerBand, createChannelEqualizerBand } from './band/eq-band.js';

export type ChannelEqualizer = {
  updateEnabled: (enabled: boolean) => Promise<void>;
  fetchIsEnabled: () => Promise<boolean>;
  getBand: (band: number) => ChannelEqualizerBand;
};

type ChannelEqualizerDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelEqualizer = (
  dependencies: ChannelEqualizerDependencies,
): ChannelEqualizer => {
  const { channel, oscClient } = dependencies;
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/eq`;
  const entityFactory = createEntityFactory(oscClient);
  const enabled = entityFactory.createEntity(`${oscBaseAddress}/on`, onOffMapper);

  return {
    updateEnabled: enabled.set,
    fetchIsEnabled: enabled.get,
    getBand: (band) => createChannelEqualizerBand({ band, channel, oscClient }),
  };
};
