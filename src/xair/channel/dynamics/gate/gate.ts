import { OSCClient } from '../../../../osc/client.js';
import { createLinearParameterConfig } from '../../../mapper/linear.js';
import { createDynamicsFilter, DynamicsFilter } from '../filter/filter.js';
import { DynamicsKeySource, dynamicsKeySourceParameterConfig } from '../mapper/key-source.js';
import { GateMode, gateModeParameterConfig } from './mapper/mode.js';
import {
  AsyncGetter,
  AsyncSetter,
  createOSCParameterFactory,
  Unit,
} from '../../../osc-parameter.js';
import { createLogarithmicParameterConfig } from '../../../mapper/log.js';
import { onOffParameterConfig } from '../../../mapper/on-off.js';

export type ChannelGate = {
  /**
   * Sets the compressor's attack time.
   * @param attack - Attack time in milliseconds.
   * @returns A promise that resolves when the operation is complete.
   */
  updateAttack: AsyncSetter<Unit<'milliseconds', number>, 'float'>;
  /**
   * Gets the compressor's attack time.
   * @returns A promise that resolves to the attack time in milliseconds.
   */
  fetchAttack: AsyncGetter<Unit<'milliseconds', number>, 'float'>;

  getFilter: () => DynamicsFilter;

  updateHold: AsyncSetter<Unit<'milliseconds', number>, 'float'>;
  fetchHold: AsyncGetter<Unit<'milliseconds', number>, 'float'>;

  updateKeySource: AsyncSetter<Unit<'keySource', DynamicsKeySource>, 'integer'>;
  fetchKeySource: AsyncGetter<Unit<'keySource', DynamicsKeySource>, 'integer'>;

  updateMode: AsyncSetter<Unit<'mode', GateMode>, 'integer'>;
  fetchMode: AsyncGetter<Unit<'mode', GateMode>, 'integer'>;

  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  updateRange: AsyncSetter<Unit<'decibels', number>, 'float'>;
  fetchRange: AsyncGetter<Unit<'decibels', number>, 'float'>;

  updateRelease: AsyncSetter<Unit<'milliseconds', number>, 'float'>;
  fetchRelease: AsyncGetter<Unit<'milliseconds', number>, 'float'>;

  updateThreshold: AsyncSetter<Unit<'decibels', number>, 'float'>;
  fetchThreshold: AsyncGetter<Unit<'decibels', number>, 'float'>;
};

type ChannelGateDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelGate = (dependencies: ChannelGateDependencies): ChannelGate => {
  const { channel, oscClient } = dependencies;
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/gate`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const attack = oscParameterFactory.createOSCParameter<Unit<'milliseconds', number>, 'float'>(
    `${oscBaseAddress}/attack`,
    createLinearParameterConfig<'milliseconds'>(0.0, 120.0),
  );
  const filter = createDynamicsFilter({ ...dependencies, dynamicsType: 'gate' });

  const hold = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/hold`,
    createLogarithmicParameterConfig<'milliseconds'>(0.02, 2000),
  );

  const keySource = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/keysrc`,
    dynamicsKeySourceParameterConfig,
  );
  const mode = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/mode`,
    gateModeParameterConfig,
  );
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );
  const range = oscParameterFactory.createOSCParameter<Unit<'decibels', number>, 'float'>(
    `${oscBaseAddress}/range`,
    createLinearParameterConfig<'decibels'>(3, 60),
  );
  const release = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/release`,
    createLogarithmicParameterConfig<'milliseconds'>(5, 4000),
  );
  const threshold = oscParameterFactory.createOSCParameter<Unit<'decibels', number>, 'float'>(
    `${oscBaseAddress}/thr`,
    createLinearParameterConfig<'decibels'>(-80, 0),
  );

  return {
    fetchAttack: attack.fetch,
    updateAttack: attack.update,
    getFilter: () => filter,
    updateHold: hold.update,
    fetchHold: hold.fetch,
    updateKeySource: keySource.update,
    fetchKeySource: keySource.fetch,
    fetchMode: mode.fetch,
    updateMode: mode.update,
    updateEnabled: enabled.update,
    fetchIsEnabled: enabled.fetch,
    updateRange: range.update,
    fetchRange: range.fetch,
    updateRelease: release.update,
    fetchRelease: release.fetch,
    updateThreshold: threshold.update,
    fetchThreshold: threshold.fetch,
  };
};
