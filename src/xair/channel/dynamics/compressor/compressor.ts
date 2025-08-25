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
  /**
   * Fetch the current auto time enabled state
   * @param unit - Optional unit parameter. If 'flag' is provided, returns boolean value
   * @returns Promise that resolves to either raw OSC integer (0/1) or boolean
   * @example
   * // Get raw OSC value (0 = disabled, 1 = enabled)
   * const rawEnabled = await compressor.fetchIsAutoTimeEnabled();
   *
   * // Get boolean value
   * const isEnabled = await compressor.fetchIsAutoTimeEnabled('flag');
   */
  fetchIsAutoTimeEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Update the auto time enabled state
   * @param value - The enabled state: raw OSC integer (0/1) or boolean
   * @param unit - Optional unit parameter. If 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = disabled, 1 = enabled)
   * await compressor.updateAutoTimeEnabled(1);
   *
   * // Set using boolean
   * await compressor.updateAutoTimeEnabled(true, 'flag');
   */
  updateAutoTimeEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Update the attack time
   * @param value - The attack time: raw OSC float (0.0-1.0) or time in milliseconds (0.0-120.0ms)
   * @param unit - Optional unit parameter. If 'milliseconds' is provided, value should be in ms
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await compressor.updateAttack(0.3);
   *
   * // Set using milliseconds (0.0 to 120.0ms)
   * await compressor.updateAttack(10, 'milliseconds');
   */
  updateAttack: AsyncSetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Fetch the current attack time
   * @param unit - Optional unit parameter. If 'milliseconds' is provided, returns time in ms
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or time in milliseconds (0.0-120.0ms)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawAttack = await compressor.fetchAttack();
   *
   * // Get attack time in milliseconds (0.0 to 120.0ms)
   * const attackMs = await compressor.fetchAttack('milliseconds');
   */
  fetchAttack: AsyncGetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Update the detection mode
   * @param value - The detection mode: raw OSC integer (0/1) or mode string ('PEAK', 'RMS')
   * @param unit - Optional unit parameter. If 'detectionMode' is provided, value should be mode string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = 'PEAK', 1 = 'RMS')
   * await compressor.updateDetectionMode(0);
   *
   * // Set using mode string
   * await compressor.updateDetectionMode('PEAK', 'detectionMode');
   */
  updateDetectionMode: AsyncSetter<Unit<'detectionMode', CompressorDetectionMode>, 'integer'>;

  /**
   * Fetch the current detection mode
   * @param unit - Optional unit parameter. If 'detectionMode' is provided, returns mode string
   * @returns Promise that resolves to either raw OSC integer (0/1) or mode string ('PEAK', 'RMS')
   * @example
   * // Get raw OSC value (0 = 'PEAK', 1 = 'RMS')
   * const rawMode = await compressor.fetchDetectionMode();
   *
   * // Get mode string ('PEAK' or 'RMS')
   * const mode = await compressor.fetchDetectionMode('detectionMode');
   */
  fetchDetectionMode: AsyncGetter<Unit<'detectionMode', CompressorDetectionMode>, 'integer'>;

  /**
   * Update the envelope setting
   * @param value - The envelope: raw OSC integer (0/1) or envelope string ('LIN', 'LOG')
   * @param unit - Optional unit parameter. If 'envelope' is provided, value should be envelope string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = 'LIN', 1 = 'LOG')
   * await compressor.updateEnvelope(0);
   *
   * // Set using envelope string
   * await compressor.updateEnvelope('LIN', 'envelope');
   */
  updateEnvelope: AsyncSetter<Unit<'envelope', CompressorEnvelope>, 'integer'>;

  /**
   * Fetch the current envelope setting
   * @param unit - Optional unit parameter. If 'envelope' is provided, returns envelope string
   * @returns Promise that resolves to either raw OSC integer (0/1) or envelope string ('LIN', 'LOG')
   * @example
   * // Get raw OSC value (0 = 'LIN', 1 = 'LOG')
   * const rawEnvelope = await compressor.fetchEnvelope();
   *
   * // Get envelope string ('LIN' or 'LOG')
   * const envelope = await compressor.fetchEnvelope('envelope');
   */
  fetchEnvelope: AsyncGetter<Unit<'envelope', CompressorEnvelope>, 'integer'>;

  /**
   * Get access to the compressor's sidechain filter
   * @returns DynamicsFilter object for configuring the sidechain filter
   */
  getFilter: () => DynamicsFilter;

  /**
   * Update the hold time
   * @param value - The hold time: raw OSC float (0.0-1.0) or time in milliseconds (0.02-2000ms)
   * @param unit - Optional unit parameter. If 'milliseconds' is provided, value should be in ms
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await compressor.updateHold(0.1);
   *
   * // Set using milliseconds (0.02 to 2000ms)
   * await compressor.updateHold(50, 'milliseconds');
   */
  updateHold: AsyncSetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Fetch the current hold time
   * @param unit - Optional unit parameter. If 'milliseconds' is provided, returns time in ms
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or time in milliseconds (0.02-2000ms)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawHold = await compressor.fetchHold();
   *
   * // Get hold time in milliseconds (0.02 to 2000ms)
   * const holdMs = await compressor.fetchHold('milliseconds');
   */
  fetchHold: AsyncGetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Update the key source for sidechain
   * @param value - The key source: raw OSC integer or source string
   * @param unit - Optional unit parameter. If 'keySource' is provided, value should be source string
   * @returns Promise that resolves when the update is complete
   */
  updateKeySource: AsyncSetter<Unit<'keySource', DynamicsKeySource>, 'integer'>;

  /**
   * Fetch the current key source
   * @param unit - Optional unit parameter. If 'keySource' is provided, returns source string
   * @returns Promise that resolves to either raw OSC integer or source string
   */
  fetchKeySource: AsyncGetter<Unit<'keySource', DynamicsKeySource>, 'integer'>;

  /**
   * Update the knee setting
   * @param value - The knee value: raw OSC float (0.0-1.0) or knee value (0-5)
   * @param unit - Optional unit parameter. If 'number' is provided, value should be knee number
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await compressor.updateKnee(0.5);
   *
   * // Set using knee value (0 to 5)
   * await compressor.updateKnee(3, 'number');
   */
  updateKnee: AsyncSetter<Unit<'number', number>, 'float'>;

  /**
   * Fetch the current knee setting
   * @param unit - Optional unit parameter. If 'number' is provided, returns knee value
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or knee value (0-5)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawKnee = await compressor.fetchKnee();
   *
   * // Get knee value (0 to 5)
   * const knee = await compressor.fetchKnee('number');
   */
  fetchKnee: AsyncGetter<Unit<'number', number>, 'float'>;

  /**
   * Update the makeup gain
   * @param value - The gain value: raw OSC float (0.0-1.0) or level in dB (0-24dB)
   * @param unit - Optional unit parameter. If 'decibels' is provided, value should be in dB
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await compressor.updateGain(0.7);
   *
   * // Set using decibels (0 to 24dB)
   * await compressor.updateGain(12, 'decibels');
   */
  updateGain: AsyncSetter<Unit<'decibels', number>, 'float'>;

  /**
   * Fetch the current makeup gain
   * @param unit - Optional unit parameter. If 'decibels' is provided, returns level in dB
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or level in dB (0-24dB)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawGain = await compressor.fetchGain();
   *
   * // Get gain level in dB (0 to 24dB)
   * const gainDb = await compressor.fetchGain('decibels');
   */
  fetchGain: AsyncGetter<Unit<'decibels', number>, 'float'>;

  /**
   * Update the wet/dry mix
   * @param value - The mix value: raw OSC float (0.0-1.0) or percentage
   * @param unit - Optional unit parameter. If 'percent' is provided, value should be percentage
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await compressor.updateMix(0.8);
   *
   * // Set using percentage (0-100%)
   * await compressor.updateMix(80, 'percent');
   */
  updateMix: AsyncSetter<Unit<'percent', number>, 'float'>;

  /**
   * Fetch the current wet/dry mix
   * @param unit - Optional unit parameter. If 'percent' is provided, returns percentage
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or percentage
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawMix = await compressor.fetchMix();
   *
   * // Get mix percentage
   * const mixPercent = await compressor.fetchMix('percent');
   */
  fetchMix: AsyncGetter<Unit<'percent', number>, 'float'>;

  /**
   * Update the compressor mode
   * @param value - The mode: raw OSC integer (0/1) or mode string ('COMP', 'EXP')
   * @param unit - Optional unit parameter. If 'mode' is provided, value should be mode string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = 'COMP', 1 = 'EXP')
   * await compressor.updateMode(0);
   *
   * // Set using mode string
   * await compressor.updateMode('COMP', 'mode');
   */
  updateMode: AsyncSetter<Unit<'mode', CompressorMode>, 'integer'>;

  /**
   * Fetch the current compressor mode
   * @param unit - Optional unit parameter. If 'mode' is provided, returns mode string
   * @returns Promise that resolves to either raw OSC integer (0/1) or mode string ('COMP', 'EXP')
   * @example
   * // Get raw OSC value (0 = 'COMP', 1 = 'EXP')
   * const rawMode = await compressor.fetchMode();
   *
   * // Get mode string ('COMP' or 'EXP')
   * const mode = await compressor.fetchMode('mode');
   */
  fetchMode: AsyncGetter<Unit<'mode', CompressorMode>, 'integer'>;

  /**
   * Update the compressor enabled state
   * @param value - The enabled state: raw OSC integer (0/1) or boolean
   * @param unit - Optional unit parameter. If 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = disabled, 1 = enabled)
   * await compressor.updateEnabled(1);
   *
   * // Set using boolean
   * await compressor.updateEnabled(true, 'flag');
   */
  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetch the current compressor enabled state
   * @param unit - Optional unit parameter. If 'flag' is provided, returns boolean value
   * @returns Promise that resolves to either raw OSC integer (0/1) or boolean
   * @example
   * // Get raw OSC value (0 = disabled, 1 = enabled)
   * const rawEnabled = await compressor.fetchIsEnabled();
   *
   * // Get boolean value
   * const isEnabled = await compressor.fetchIsEnabled('flag');
   */
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Update the compression ratio
   * @param value - The ratio: raw OSC integer (0-11) or ratio string ('1.1', '1.3', '1.5', '2.0', '2.5', '3.0', '4.0', '5.0', '7.0', '10', '20', '100')
   * @param unit - Optional unit parameter. If 'ratio' is provided, value should be ratio string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = '1.1', 3 = '2.0', 11 = '100')
   * await compressor.updateRatio(3);
   *
   * // Set using ratio string
   * await compressor.updateRatio('2.0', 'ratio');
   */
  updateRatio: AsyncSetter<Unit<'ratio', CompressorRatio>, 'integer'>;

  /**
   * Fetch the current compression ratio
   * @param unit - Optional unit parameter. If 'ratio' is provided, returns ratio string
   * @returns Promise that resolves to either raw OSC integer (0-11) or ratio string ('1.1', '1.3', '1.5', '2.0', '2.5', '3.0', '4.0', '5.0', '7.0', '10', '20', '100')
   * @example
   * // Get raw OSC value (0-11)
   * const rawRatio = await compressor.fetchRatio();
   *
   * // Get ratio string ('1.1', '2.0', '100', etc.)
   * const ratio = await compressor.fetchRatio('ratio');
   */
  fetchRatio: AsyncGetter<Unit<'ratio', CompressorRatio>, 'integer'>;

  /**
   * Update the release time
   * @param value - The release time: raw OSC float (0.0-1.0) or time in milliseconds (5-4000ms)
   * @param unit - Optional unit parameter. If 'milliseconds' is provided, value should be in ms
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await compressor.updateRelease(0.4);
   *
   * // Set using milliseconds (5 to 4000ms)
   * await compressor.updateRelease(200, 'milliseconds');
   */
  updateRelease: AsyncSetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Fetch the current release time
   * @param unit - Optional unit parameter. If 'milliseconds' is provided, returns time in ms
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or time in milliseconds (5-4000ms)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawRelease = await compressor.fetchRelease();
   *
   * // Get release time in milliseconds (5 to 4000ms)
   * const releaseMs = await compressor.fetchRelease('milliseconds');
   */
  fetchRelease: AsyncGetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Update the threshold level
   * @param value - The threshold: raw OSC float (0.0-1.0) or level in dB (-60 to 0dB)
   * @param unit - Optional unit parameter. If 'decibels' is provided, value should be in dB
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await compressor.updateThreshold(0.6);
   *
   * // Set using decibels (-60 to 0dB)
   * await compressor.updateThreshold(-12, 'decibels');
   */
  updateThreshold: AsyncSetter<Unit<'decibels', number>, 'float'>;

  /**
   * Fetch the current threshold level
   * @param unit - Optional unit parameter. If 'decibels' is provided, returns level in dB
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or level in dB (-60 to 0dB)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawThreshold = await compressor.fetchThreshold();
   *
   * // Get threshold level in dB (-60 to 0dB)
   * const thresholdDb = await compressor.fetchThreshold('decibels');
   */
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
