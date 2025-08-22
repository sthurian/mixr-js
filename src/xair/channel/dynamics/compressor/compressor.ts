import { createEntityFactory } from '../../../entity.js';
import { createLinearParameterConfig } from '../../../mapper/linear.js';
import { onOffMapper } from '../../../mapper/on-off.js';
import { CompressorDetectionMode, compressorDetectionModeMapper } from './mapper/detection-mode.js';
import { CompressorEnvelope, compressorEnvelopeMapper } from './mapper/envelope.js';
import { DynamicsKeySource, dynamicsKeySourceMapper } from '../mapper/key-source.js';
import { CompressorMode, compressorModeMapper } from './mapper/mode.js';
import { CompressorRatio, compressorRatioMapper } from './mapper/ratio.js';
import { DynamicsFilter, createDynamicsFilter } from '../filter/filter.js';
import { createLogarithmicMapper } from '../../../mapper/log.js';
import { OSCClient } from '../../../../osc/client.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory } from '../../../osc-parameter.js';

export type ChannelCompressor = {
  fetchIsAutoTimeEnabled: () => Promise<boolean>;
  updateAutoTimeEnabled: (enabled: boolean) => Promise<void>;
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

  updateDetectionMode: (mode: CompressorDetectionMode) => Promise<void>;
  fetchDetectionMode: () => Promise<CompressorDetectionMode>;

  updateEnvelope: (mode: CompressorEnvelope) => Promise<void>;
  fetchEnvelope: () => Promise<CompressorEnvelope>;

  getFilter: () => DynamicsFilter;

  updateHold: (time: number) => Promise<void>;
  fetchHold: () => Promise<number>;

  updateKeySource: (type: DynamicsKeySource) => Promise<void>;
  fetchKeySource: () => Promise<DynamicsKeySource>;

  updateKnee: AsyncSetter<'number', 'float', number>;
  fetchKnee: AsyncGetter<'number', 'float', number>;

  updateGain: AsyncSetter<'decibels', 'float', number>;
  fetchGain: AsyncGetter<'decibels', 'float', number>;

  updateMix: AsyncSetter<'percent', 'float', number>;
  fetchMix: AsyncGetter<'percent', 'float', number>;

  updateMode: (mode: CompressorMode) => Promise<void>;
  fetchMode: () => Promise<CompressorMode>;

  updateEnabled: (enabled: boolean) => Promise<void>;
  fetchIsEnabled: () => Promise<boolean>;

  updateRatio: (ratio: CompressorRatio) => Promise<void>;
  fetchRatio: () => Promise<CompressorRatio>;

  updateRelease: (time: number) => Promise<void>;
  fetchRelease: () => Promise<number>;

  updateThreshold: AsyncSetter<'decibels', 'float', number>;
  fetchThreshold: AsyncGetter<'decibels', 'float', number>;
};

type ChannelCompressorDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelCompressor = (
  dependencies: ChannelCompressorDependencies,
): ChannelCompressor => {
  const { channel, oscClient } = dependencies;
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/dyn`;
  const entityFactory = createEntityFactory(oscClient);
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const autotime = entityFactory.createEntity(`${oscBaseAddress}/auto`, onOffMapper);
  const attack = oscParameterFactory.createOSCParameter<'milliseconds', 'float', number>(
    `${oscBaseAddress}/attack`,
    createLinearParameterConfig(0.0, 120.0),
  );
  const detectionMode = entityFactory.createEntity(
    `${oscBaseAddress}/det`,
    compressorDetectionModeMapper,
  );
  const envelope = entityFactory.createEntity(`${oscBaseAddress}/env`, compressorEnvelopeMapper);
  const filter = createDynamicsFilter({ ...dependencies, dynamicsType: 'compressor' });

  const hold = entityFactory.createEntity(
    `${oscBaseAddress}/hold`,
    createLogarithmicMapper(0.02, 2000),
  );

  const keySource = entityFactory.createEntity(`${oscBaseAddress}/keysrc`, dynamicsKeySourceMapper);
  const knee = oscParameterFactory.createOSCParameter<'number', 'float', number>(
    `${oscBaseAddress}/knee`,
    createLinearParameterConfig(0, 5),
  );
  const gain = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/mgain`,
    createLinearParameterConfig<'decibels'>(0, 24),
  );
  const mix = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/mix`,
    createLinearParameterConfig<'percent'>(0, 100),
  );
  const mode = entityFactory.createEntity(`${oscBaseAddress}/mode`, compressorModeMapper);
  const enabled = entityFactory.createEntity(`${oscBaseAddress}/on`, onOffMapper);
  const ratio = entityFactory.createEntity(`${oscBaseAddress}/ratio`, compressorRatioMapper);
  const release = entityFactory.createEntity(
    `${oscBaseAddress}/release`,
    createLogarithmicMapper(5, 4000),
  );
  const threshold = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/thr`,
    createLinearParameterConfig<'decibels'>(-60, 0),
  );

  return {
    fetchIsAutoTimeEnabled: autotime.get,
    updateAutoTimeEnabled: autotime.set,
    fetchAttack: attack.fetch,
    updateAttack: attack.update,
    fetchDetectionMode: detectionMode.get,
    updateDetectionMode: detectionMode.set,
    fetchEnvelope: envelope.get,
    updateEnvelope: envelope.set,
    getFilter: () => filter,
    updateHold: hold.set,
    fetchHold: hold.get,
    updateKeySource: keySource.set,
    fetchKeySource: keySource.get,
    updateKnee: knee.update,
    fetchKnee: knee.fetch,
    updateGain: gain.update,
    fetchGain: gain.fetch,
    updateMix: mix.update,
    fetchMix: mix.fetch,
    fetchMode: mode.get,
    updateMode: mode.set,
    updateEnabled: enabled.set,
    fetchIsEnabled: enabled.get,
    updateRatio: ratio.set,
    fetchRatio: ratio.get,
    updateRelease: release.set,
    fetchRelease: release.get,
    updateThreshold: threshold.update,
    fetchThreshold: threshold.fetch,
  };
};
