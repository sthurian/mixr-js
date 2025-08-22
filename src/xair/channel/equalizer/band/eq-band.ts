import { OSCClient } from '../../../../osc/client.js';
import { createEntityFactory } from '../../../entity.js';
import { createLinearParameterConfig } from '../../../mapper/linear.js';
import { createLogarithmicMapper } from '../../../mapper/log.js';
import { onOffMapper } from '../../../mapper/on-off.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory } from '../../../osc-parameter.js';
import { EqBandType, eqBandTypeMapper } from './mapper/eq-band-type.js';

export type ChannelEqualizerBand = {
  fetchIsEnabled: () => Promise<boolean>;
  updateEnabled: (enabled: boolean) => Promise<void>;
  updateFrequency: (frequency: number) => Promise<void>;
  fetchFrequency: () => Promise<number>;
  updateType: (type: EqBandType) => Promise<void>;
  fetchType: () => Promise<EqBandType>;
  updateGain: AsyncSetter<'decibels', 'float'>;
  fetchGain: AsyncGetter<'decibels', 'float'>;
  updateQ: (q: number) => Promise<void>;
  fetchQ: () => Promise<number>;
};

type ChannelEqualizerBandDependencies = {
  channel: number;
  band: number;
  oscClient: OSCClient;
};

export const createChannelEqualizerBand = (
  dependencies: ChannelEqualizerBandDependencies,
): ChannelEqualizerBand => {
  const { channel, band, oscClient } = dependencies;
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/eq/${band}`;
  const entityFactory = createEntityFactory(oscClient);
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const enabled = entityFactory.createEntity(`${oscBaseAddress}/on`, onOffMapper);
  const frequency = entityFactory.createEntity(
    `${oscBaseAddress}/f`,
    createLogarithmicMapper(20, 20000),
  );
  const gain = oscParameterFactory.createOSCParameter(`${oscBaseAddress}/g`, createLinearParameterConfig<'decibels'>(-15, 15));
  const q = entityFactory.createEntity(`${oscBaseAddress}/q`, createLogarithmicMapper(10, 0.3));
  const type = entityFactory.createEntity(`${oscBaseAddress}/type`, eqBandTypeMapper);

  return {
    fetchIsEnabled: enabled.get,
    updateEnabled: enabled.set,
    fetchFrequency: frequency.get,
    updateFrequency: frequency.set,
    fetchGain: gain.fetch,
    updateGain: gain.update,
    fetchQ: q.get,
    updateQ: q.set,
    fetchType: type.get,
    updateType: type.set,
  };
};
