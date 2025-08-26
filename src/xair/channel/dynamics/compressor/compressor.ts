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
import { createOSCParameterFactory } from '../../../osc-parameter.js';
import { createLogarithmicParameterConfig } from '../../../mapper/log.js';
import { onOffParameterConfig } from '../../../mapper/on-off.js';

export type ChannelCompressor = {
  /**
   * Fetch the current auto time enabled state as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = disabled, 1 = enabled)
   */
  fetchIsAutoTimeEnabled(): Promise<number>;

  /**
   * Fetch the current auto time enabled state as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   */
  fetchIsAutoTimeEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the auto time enabled state using raw OSC value
   * @param value - The enabled state as raw OSC integer (0 = disabled, 1 = enabled)
   * @returns Promise that resolves when the update is complete
   */
  updateAutoTimeEnabled(value: number): Promise<void>;

  /**
   * Update the auto time enabled state using boolean
   * @param value - The enabled state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   */
  updateAutoTimeEnabled(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Update the attack time using raw OSC value
   * @param value - The attack time as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   */
  updateAttack(value: number): Promise<void>;

  /**
   * Update the attack time using milliseconds
   * @param value - The attack time in milliseconds (0.0-120.0ms)
   * @param unit - Must be 'milliseconds' when using millisecond values
   * @returns Promise that resolves when the update is complete
   */
  updateAttack(value: number, unit: 'milliseconds'): Promise<void>;

  /**
   * Fetch the current attack time as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   */
  fetchAttack(): Promise<number>;

  /**
   * Fetch the current attack time in milliseconds
   * @param unit - Must be 'milliseconds' to get time in ms
   * @returns Promise that resolves to time in milliseconds (0.0-120.0ms)
   */
  fetchAttack(unit: 'milliseconds'): Promise<number>;

  /**
   * Update the detection mode using raw OSC value
   * @param value - The detection mode as raw OSC integer (0 = 'PEAK', 1 = 'RMS')
   * @returns Promise that resolves when the update is complete
   */
  updateDetectionMode(value: number): Promise<void>;

  /**
   * Update the detection mode using mode string
   * @param value - The detection mode as mode string ('PEAK', 'RMS')
   * @param unit - Must be 'detectionMode' when using mode string
   * @returns Promise that resolves when the update is complete
   */
  updateDetectionMode(value: CompressorDetectionMode, unit: 'detectionMode'): Promise<void>;

  /**
   * Fetch the current detection mode as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = 'PEAK', 1 = 'RMS')
   */
  fetchDetectionMode(): Promise<number>;

  /**
   * Fetch the current detection mode as mode string
   * @param unit - Must be 'detectionMode' to get mode string
   * @returns Promise that resolves to mode string ('PEAK', 'RMS')
   */
  fetchDetectionMode(unit: 'detectionMode'): Promise<CompressorDetectionMode>;

  /**
   * Update the envelope setting using raw OSC value
   * @param value - The envelope as raw OSC integer (0 = 'LIN', 1 = 'LOG')
   * @returns Promise that resolves when the update is complete
   */
  updateEnvelope(value: number): Promise<void>;

  /**
   * Update the envelope setting using envelope string
   * @param value - The envelope as envelope string ('LIN', 'LOG')
   * @param unit - Must be 'envelope' when using envelope string
   * @returns Promise that resolves when the update is complete
   */
  updateEnvelope(value: CompressorEnvelope, unit: 'envelope'): Promise<void>;

  /**
   * Fetch the current envelope setting as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = 'LIN', 1 = 'LOG')
   */
  fetchEnvelope(): Promise<number>;

  /**
   * Fetch the current envelope setting as envelope string
   * @param unit - Must be 'envelope' to get envelope string
   * @returns Promise that resolves to envelope string ('LIN', 'LOG')
   */
  fetchEnvelope(unit: 'envelope'): Promise<CompressorEnvelope>;

  /**
   * Get access to the compressor's sidechain filter
   * @returns DynamicsFilter object for configuring the sidechain filter
   */
  getFilter: () => DynamicsFilter;

  /**
   * Update the hold time using raw OSC value
   * @param value - The hold time as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   */
  updateHold(value: number): Promise<void>;

  /**
   * Update the hold time using milliseconds
   * @param value - The hold time in milliseconds (0.02-2000ms)
   * @param unit - Must be 'milliseconds' when using millisecond values
   * @returns Promise that resolves when the update is complete
   */
  updateHold(value: number, unit: 'milliseconds'): Promise<void>;

  /**
   * Fetch the current hold time as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   */
  fetchHold(): Promise<number>;

  /**
   * Fetch the current hold time in milliseconds
   * @param unit - Must be 'milliseconds' to get time in ms
   * @returns Promise that resolves to time in milliseconds (0.02-2000ms)
   */
  fetchHold(unit: 'milliseconds'): Promise<number>;

  /**
   * Update the key source for sidechain using raw OSC value
   * @param value - The key source as raw OSC integer
   * @returns Promise that resolves when the update is complete
   */
  updateKeySource(value: number): Promise<void>;

  /**
   * Update the key source for sidechain using source string
   * @param value - The key source as source string
   * @param unit - Must be 'keySource' when using source string
   * @returns Promise that resolves when the update is complete
   */
  updateKeySource(value: DynamicsKeySource, unit: 'keySource'): Promise<void>;

  /**
   * Fetch the current key source as raw OSC value
   * @returns Promise that resolves to raw OSC integer
   */
  fetchKeySource(): Promise<number>;

  /**
   * Fetch the current key source as source string
   * @param unit - Must be 'keySource' to get source string
   * @returns Promise that resolves to source string
   */
  fetchKeySource(unit: 'keySource'): Promise<DynamicsKeySource>;

  /**
   * Update the knee setting using raw OSC value
   * @param value - The knee value as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   */
  updateKnee(value: number): Promise<void>;

  /**
   * Update the knee setting using knee number
   * @param value - The knee value (0-5)
   * @param unit - Must be 'number' when using knee number
   * @returns Promise that resolves when the update is complete
   */
  updateKnee(value: number, unit: 'number'): Promise<void>;

  /**
   * Fetch the current knee setting as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   */
  fetchKnee(): Promise<number>;

  /**
   * Fetch the current knee setting as knee number
   * @param unit - Must be 'number' to get knee value
   * @returns Promise that resolves to knee value (0-5)
   */
  fetchKnee(unit: 'number'): Promise<number>;

  /**
   * Update the makeup gain using raw OSC value
   * @param value - The gain value as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   */
  updateGain(value: number): Promise<void>;

  /**
   * Update the makeup gain using decibels
   * @param value - The gain level in dB (0-24dB)
   * @param unit - Must be 'decibels' when using dB values
   * @returns Promise that resolves when the update is complete
   */
  updateGain(value: number, unit: 'decibels'): Promise<void>;

  /**
   * Fetch the current makeup gain as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   */
  fetchGain(): Promise<number>;

  /**
   * Fetch the current makeup gain in decibels
   * @param unit - Must be 'decibels' to get level in dB
   * @returns Promise that resolves to level in dB (0-24dB)
   */
  fetchGain(unit: 'decibels'): Promise<number>;

  /**
   * Update the wet/dry mix using raw OSC value
   * @param value - The mix value as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   */
  updateMix(value: number): Promise<void>;

  /**
   * Update the wet/dry mix using percentage
   * @param value - The mix value as percentage (0-100%)
   * @param unit - Must be 'percent' when using percentage values
   * @returns Promise that resolves when the update is complete
   */
  updateMix(value: number, unit: 'percent'): Promise<void>;

  /**
   * Fetch the current wet/dry mix as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   */
  fetchMix(): Promise<number>;

  /**
   * Fetch the current wet/dry mix as percentage
   * @param unit - Must be 'percent' to get percentage
   * @returns Promise that resolves to percentage (0-100%)
   */
  fetchMix(unit: 'percent'): Promise<number>;

  /**
   * Update the compressor mode using raw OSC value
   * @param value - The mode as raw OSC integer (0 = 'COMP', 1 = 'EXP')
   * @returns Promise that resolves when the update is complete
   */
  updateMode(value: number): Promise<void>;

  /**
   * Update the compressor mode using mode string
   * @param value - The mode as mode string ('COMP', 'EXP')
   * @param unit - Must be 'mode' when using mode string
   * @returns Promise that resolves when the update is complete
   */
  updateMode(value: CompressorMode, unit: 'mode'): Promise<void>;

  /**
   * Fetch the current compressor mode as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = 'COMP', 1 = 'EXP')
   */
  fetchMode(): Promise<number>;

  /**
   * Fetch the current compressor mode as mode string
   * @param unit - Must be 'mode' to get mode string
   * @returns Promise that resolves to mode string ('COMP', 'EXP')
   */
  fetchMode(unit: 'mode'): Promise<CompressorMode>;

  /**
   * Update the compressor enabled state using raw OSC value
   * @param value - The enabled state as raw OSC integer (0 = disabled, 1 = enabled)
   * @returns Promise that resolves when the update is complete
   */
  updateEnabled(value: number): Promise<void>;

  /**
   * Update the compressor enabled state using boolean
   * @param value - The enabled state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   */
  updateEnabled(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Fetch the current compressor enabled state as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = disabled, 1 = enabled)
   */
  fetchIsEnabled(): Promise<number>;

  /**
   * Fetch the current compressor enabled state as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   */
  fetchIsEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the compression ratio using raw OSC value
   * @param value - The ratio as raw OSC integer (0-11)
   * @returns Promise that resolves when the update is complete
   */
  updateRatio(value: number): Promise<void>;

  /**
   * Update the compression ratio using ratio string
   * @param value - The ratio as ratio string ('1.1', '1.3', '1.5', '2.0', '2.5', '3.0', '4.0', '5.0', '7.0', '10', '20', '100')
   * @param unit - Must be 'ratio' when using ratio string
   * @returns Promise that resolves when the update is complete
   */
  updateRatio(value: CompressorRatio, unit: 'ratio'): Promise<void>;

  /**
   * Fetch the current compression ratio as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-11)
   */
  fetchRatio(): Promise<number>;

  /**
   * Fetch the current compression ratio as ratio string
   * @param unit - Must be 'ratio' to get ratio string
   * @returns Promise that resolves to ratio string ('1.1', '1.3', '1.5', '2.0', '2.5', '3.0', '4.0', '5.0', '7.0', '10', '20', '100')
   */
  fetchRatio(unit: 'ratio'): Promise<CompressorRatio>;

  /**
   * Update the release time using raw OSC value
   * @param value - The release time as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   */
  updateRelease(value: number): Promise<void>;

  /**
   * Update the release time using milliseconds
   * @param value - The release time in milliseconds (5-4000ms)
   * @param unit - Must be 'milliseconds' when using millisecond values
   * @returns Promise that resolves when the update is complete
   */
  updateRelease(value: number, unit: 'milliseconds'): Promise<void>;

  /**
   * Fetch the current release time as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   */
  fetchRelease(): Promise<number>;

  /**
   * Fetch the current release time in milliseconds
   * @param unit - Must be 'milliseconds' to get time in ms
   * @returns Promise that resolves to time in milliseconds (5-4000ms)
   */
  fetchRelease(unit: 'milliseconds'): Promise<number>;

  /**
   * Update the threshold level using raw OSC value
   * @param value - The threshold as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   */
  updateThreshold(value: number): Promise<void>;

  /**
   * Update the threshold level using decibels
   * @param value - The threshold level in dB (-60 to 0dB)
   * @param unit - Must be 'decibels' when using dB values
   * @returns Promise that resolves when the update is complete
   */
  updateThreshold(value: number, unit: 'decibels'): Promise<void>;

  /**
   * Fetch the current threshold level as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   */
  fetchThreshold(): Promise<number>;

  /**
   * Fetch the current threshold level in decibels
   * @param unit - Must be 'decibels' to get level in dB
   * @returns Promise that resolves to level in dB (-60 to 0dB)
   */
  fetchThreshold(unit: 'decibels'): Promise<number>;
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
