import { OSCClient } from '../../../../osc/client.js';
import { createEntityFactory } from '../../../entity.js';
import { createLinearParameterConfig } from '../../../mapper/linear.js';
import { createLogarithmicMapper } from '../../../mapper/log.js';
import { onOffMapper } from '../../../mapper/on-off.js';
import { createDynamicsFilter, DynamicsFilter } from '../filter/filter.js';
import { DynamicsKeySource, dynamicsKeySourceMapper } from '../mapper/key-source.js';
import { GateMode, gateModeMapper } from './mapper/mode.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory } from '../../../osc-parameter.js';

export type ChannelGate = {
  /**
   * Sets the compressor's attack time.
   * @param attack - Attack time in milliseconds.
   * @returns A promise that resolves when the operation is complete.
   */
  updateAttack: AsyncSetter<'milliseconds', 'float', number>;
  /**
   * Gets the compressor's attack time.
   * @returns A promise that resolves to the attack time in milliseconds.
   */
  fetchAttack: AsyncGetter<'milliseconds', 'float', number>;

  getFilter: () => DynamicsFilter;

  updateHold: (time: number) => Promise<void>;
  fetchHold: () => Promise<number>;

  updateKeySource: (type: DynamicsKeySource) => Promise<void>;
  fetchKeySource: () => Promise<DynamicsKeySource>;

  updateMode: (mode: GateMode) => Promise<void>;
  fetchMode: () => Promise<GateMode>;

  updateEnabled: (enabled: boolean) => Promise<void>;
  fetchIsEnabled: () => Promise<boolean>;

  updateRange: AsyncSetter<'decibels', 'float', number>;
  fetchRange: AsyncGetter<'decibels', 'float', number>;

  updateRelease: (time: number) => Promise<void>;
  fetchRelease: () => Promise<number>;

  updateThreshold: AsyncSetter<'decibels', 'float', number>;
  fetchThreshold: AsyncGetter<'decibels', 'float', number>;
};

type ChannelGateDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelGate = (dependencies: ChannelGateDependencies): ChannelGate => {
  const { channel, oscClient } = dependencies;
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/gate`;
  const entityFactory = createEntityFactory(oscClient);
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const attack = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/attack`,
    createLinearParameterConfig<'milliseconds'>(0.0, 120.0),
  );
  const filter = createDynamicsFilter({ ...dependencies, dynamicsType: 'gate' });

  const hold = entityFactory.createEntity(
    `${oscBaseAddress}/hold`,
    createLogarithmicMapper(0.02, 2000),
  );

  const keySource = entityFactory.createEntity(`${oscBaseAddress}/keysrc`, dynamicsKeySourceMapper);
  const mode = entityFactory.createEntity(`${oscBaseAddress}/mode`, gateModeMapper);
  const enabled = entityFactory.createEntity(`${oscBaseAddress}/on`, onOffMapper);
  const range = oscParameterFactory.createOSCParameter(`${oscBaseAddress}/range`, createLinearParameterConfig<'decibels'>(3, 60));
  const release = entityFactory.createEntity(
    `${oscBaseAddress}/release`,
    createLogarithmicMapper(5, 4000),
  );
  const threshold = oscParameterFactory.createOSCParameter(`${oscBaseAddress}/thr`, createLinearParameterConfig<'decibels'>(-80, 0));

  return {
    fetchAttack: attack.fetch,
    updateAttack: attack.update,
    getFilter: () => filter,
    updateHold: hold.set,
    fetchHold: hold.get,
    updateKeySource: keySource.set,
    fetchKeySource: keySource.get,
    fetchMode: mode.get,
    updateMode: mode.set,
    updateEnabled: enabled.set,
    fetchIsEnabled: enabled.get,
    updateRange: range.update,
    fetchRange: range.fetch,
    updateRelease: release.set,
    fetchRelease: release.get,
    updateThreshold: threshold.update,
    fetchThreshold: threshold.fetch,
  };
};
