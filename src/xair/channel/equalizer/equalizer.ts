import { OSCClient } from '../../../osc/client.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../../osc-parameter.js';
import { ChannelEqualizerBand, createChannelEqualizerBand } from './band/eq-band.js';

export type ChannelEqualizer = {
  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
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
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );

  return {
    updateEnabled: enabled.update,
    fetchIsEnabled: enabled.fetch,
    getBand: (band) => createChannelEqualizerBand({ band, channel, oscClient }),
  };
};
