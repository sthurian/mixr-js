import { createLinearParameterConfig } from '../../../mapper/linear.js';
import {
  CompressorDetectionMode,
  compressorDetectionModeParameterConfig,
} from './parameter/detection-mode.js';
import { CompressorEnvelope, compressorEnvelopeParameterConfig } from './parameter/envelope.js';
import { DynamicsKeySource, dynamicsKeySourceParameterConfig } from '../mapper/key-source.js';
import { CompressorMode, compressorModeParameterConfig } from './parameter/mode.js';
import { CompressorRatio, compressorRatioParameterConfig } from './parameter/ratio.js';
import { DynamicsFilter, createDynamicsFilter } from '../filter/filter.js';
import { OSCClient } from '../../../../osc/client.js';
import {
  AsyncGetter,
  AsyncSetter,
  createOSCParameterFactory,
  Unit,
} from '../../../osc-parameter.js';
import { createLogarithmicParameterConfig } from '../../../mapper/log.js';
import { onOffParameterConfig } from '../../../mapper/on-off.js';

export type ChannelCompressor = {
  fetchIsAutoTimeEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  updateAutoTimeEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
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

  updateDetectionMode: AsyncSetter<Unit<'detectionMode', CompressorDetectionMode>, 'integer'>;
  fetchDetectionMode: AsyncGetter<Unit<'detectionMode', CompressorDetectionMode>, 'integer'>;

  updateEnvelope: AsyncSetter<Unit<'envelope', CompressorEnvelope>, 'integer'>;
  fetchEnvelope: AsyncGetter<Unit<'envelope', CompressorEnvelope>, 'integer'>;

  getFilter: () => DynamicsFilter;

  updateHold: AsyncSetter<Unit<'milliseconds', number>, 'float'>;
  fetchHold: AsyncGetter<Unit<'milliseconds', number>, 'float'>;

  updateKeySource: AsyncSetter<Unit<'keySource', DynamicsKeySource>, 'integer'>;
  fetchKeySource: AsyncGetter<Unit<'keySource', DynamicsKeySource>, 'integer'>;

  updateKnee: AsyncSetter<Unit<'number', number>, 'float'>;
  fetchKnee: AsyncGetter<Unit<'number', number>, 'float'>;

  updateGain: AsyncSetter<Unit<'decibels', number>, 'float'>;
  fetchGain: AsyncGetter<Unit<'decibels', number>, 'float'>;

  updateMix: AsyncSetter<Unit<'percent', number>, 'float'>;
  fetchMix: AsyncGetter<Unit<'percent', number>, 'float'>;

  updateMode: AsyncSetter<Unit<'mode', CompressorMode>, 'integer'>;
  fetchMode: AsyncGetter<Unit<'mode', CompressorMode>, 'integer'>;

  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  updateRatio: AsyncSetter<Unit<'ratio', CompressorRatio>, 'integer'>;
  fetchRatio: AsyncGetter<Unit<'ratio', CompressorRatio>, 'integer'>;

  updateRelease: AsyncSetter<Unit<'milliseconds', number>, 'float'>;
  fetchRelease: AsyncGetter<Unit<'milliseconds', number>, 'float'>;

  updateThreshold: AsyncSetter<Unit<'decibels', number>, 'float'>;
  fetchThreshold: AsyncGetter<Unit<'decibels', number>, 'float'>;
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
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const autotime = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/auto`,
    onOffParameterConfig,
  );
  const attack = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/attack`,
    createLinearParameterConfig<'milliseconds'>(0.0, 120.0),
  );
  const detectionMode = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/det`,
    compressorDetectionModeParameterConfig,
  );
  const envelope = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/env`,
    compressorEnvelopeParameterConfig,
  );
  const filter = createDynamicsFilter({ ...dependencies, dynamicsType: 'compressor' });

  const hold = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/hold`,
    createLogarithmicParameterConfig<'milliseconds'>(0.02, 2000),
  );

  const keySource = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/keysrc`,
    dynamicsKeySourceParameterConfig,
  );
  const knee = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/knee`,
    createLinearParameterConfig<'number'>(0, 5),
  );
  const gain = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/mgain`,
    createLinearParameterConfig<'decibels'>(0, 24),
  );
  const mix = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/mix`,
    createLinearParameterConfig<'percent'>(0, 100),
  );
  const mode = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/mode`,
    compressorModeParameterConfig,
  );
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );
  const ratio = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/ratio`,
    compressorRatioParameterConfig,
  );
  const release = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/release`,
    createLogarithmicParameterConfig<'milliseconds'>(5, 4000),
  );
  const threshold = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/thr`,
    createLinearParameterConfig<'decibels'>(-60, 0),
  );

  return {
    fetchIsAutoTimeEnabled: autotime.fetch,
    updateAutoTimeEnabled: autotime.update,
    fetchAttack: attack.fetch,
    updateAttack: attack.update,
    fetchDetectionMode: detectionMode.fetch,
    updateDetectionMode: detectionMode.update,
    fetchEnvelope: envelope.fetch,
    updateEnvelope: envelope.update,
    getFilter: () => filter,
    updateHold: hold.update,
    fetchHold: hold.fetch,
    updateKeySource: keySource.update,
    fetchKeySource: keySource.fetch,
    updateKnee: knee.update,
    fetchKnee: knee.fetch,
    updateGain: gain.update,
    fetchGain: gain.fetch,
    updateMix: mix.update,
    fetchMix: mix.fetch,
    fetchMode: mode.fetch,
    updateMode: mode.update,
    updateEnabled: enabled.update,
    fetchIsEnabled: enabled.fetch,
    updateRatio: ratio.update,
    fetchRatio: ratio.fetch,
    updateRelease: release.update,
    fetchRelease: release.fetch,
    updateThreshold: threshold.update,
    fetchThreshold: threshold.fetch,
  };
};
