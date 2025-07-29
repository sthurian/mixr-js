import { OSCClient } from '../../../../osc/client.js';
import { createLinearParameterConfig } from '../../../mapper/linear.js';
import { createLogarithmicParameterConfig } from '../../../mapper/log.js';
import { onOffParameterConfig } from '../../../mapper/on-off.js';
import {
  AsyncGetter,
  AsyncSetter,
  createOSCParameterFactory,
  Unit,
} from '../../../osc-parameter.js';
import { EqBandType, eqBandTypeParameterConfig } from './mapper/eq-band-type.js';

export type ChannelEqualizerBand = {
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
  updateFrequency: AsyncSetter<Unit<'hertz', number>, 'float'>;
  fetchFrequency: AsyncGetter<Unit<'hertz', number>, 'float'>;
  updateType: AsyncSetter<Unit<'type', EqBandType>, 'integer'>;
  fetchType: AsyncGetter<Unit<'type', EqBandType>, 'integer'>;
  updateGain: AsyncSetter<Unit<'decibels', number>, 'float'>;
  fetchGain: AsyncGetter<Unit<'decibels', number>, 'float'>;
  updateQ: AsyncSetter<Unit<'number', number>, 'float'>;
  fetchQ: AsyncGetter<Unit<'number', number>, 'float'>;
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
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );
  const frequency = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/f`,
    createLogarithmicParameterConfig<'hertz'>(20, 20000),
  );
  const gain = oscParameterFactory.createOSCParameter<Unit<'decibels', number>, 'float'>(
    `${oscBaseAddress}/g`,
    createLinearParameterConfig<'decibels'>(-15, 15),
  );
  const q = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/q`,
    createLogarithmicParameterConfig<'number'>(10, 0.3),
  );
  const type = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/type`,
    eqBandTypeParameterConfig,
  );

  return {
    fetchIsEnabled: enabled.fetch,
    updateEnabled: enabled.update,
    fetchFrequency: frequency.fetch,
    updateFrequency: frequency.update,
    fetchGain: gain.fetch,
    updateGain: gain.update,
    fetchQ: q.fetch,
    updateQ: q.update,
    fetchType: type.fetch,
    updateType: type.update,
  };
};
