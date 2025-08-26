import { OSCClient } from '../../../../osc/client.js';
import { createLinearParameterConfig } from '../../../mapper/linear.js';
import { createDynamicsFilter, DynamicsFilter } from '../filter/filter.js';
import { DynamicsKeySource, dynamicsKeySourceParameterConfig } from '../mapper/key-source.js';
import { GateMode, gateModeParameterConfig } from './mapper/mode.js';
import { createOSCParameterFactory } from '../../../osc-parameter.js';
import { createLogarithmicParameterConfig } from '../../../mapper/log.js';
import { onOffParameterConfig } from '../../../mapper/on-off.js';

export type ChannelGate = {
  /**
   * Update the gate attack time using raw OSC value
   * @param value - The attack time as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await gate.updateAttack(0.2);
   */
  updateAttack(value: number): Promise<void>;

  /**
   * Update the gate attack time using milliseconds
   * @param value - The attack time in milliseconds (0.0-120.0ms)
   * @param unit - Must be 'milliseconds' when using millisecond values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using time in milliseconds
   * await gate.updateAttack(25.0, 'milliseconds');
   */
  updateAttack(value: number, unit: 'milliseconds'): Promise<void>;

  /**
   * Fetch the current gate attack time as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawAttack = await gate.fetchAttack();
   */
  fetchAttack(): Promise<number>;

  /**
   * Fetch the current gate attack time in milliseconds
   * @param unit - Must be 'milliseconds' to get time in ms
   * @returns Promise that resolves to time in milliseconds (0.0-120.0ms)
   * @example
   * // Get attack time in ms
   * const attackMs = await gate.fetchAttack('milliseconds');
   */
  fetchAttack(unit: 'milliseconds'): Promise<number>;

  /**
   * Get access to the gate's sidechain filter
   * @returns DynamicsFilter object for configuring the sidechain filter
   * @example
   * // Get filter and configure it
   * const filter = gate.getFilter();
   * await filter.updateEnabled(true, 'flag');
   * await filter.updateFrequency(1000, 'hertz');
   */
  getFilter: () => DynamicsFilter;

  /**
   * Update the gate hold time using raw OSC value
   * @param value - The hold time as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await gate.updateHold(0.3);
   */
  updateHold(value: number): Promise<void>;

  /**
   * Update the gate hold time using milliseconds
   * @param value - The hold time in milliseconds (0.02-2000ms)
   * @param unit - Must be 'milliseconds' when using millisecond values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using time in milliseconds
   * await gate.updateHold(50, 'milliseconds');
   */
  updateHold(value: number, unit: 'milliseconds'): Promise<void>;

  /**
   * Fetch the current gate hold time as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawHold = await gate.fetchHold();
   */
  fetchHold(): Promise<number>;

  /**
   * Fetch the current gate hold time in milliseconds
   * @param unit - Must be 'milliseconds' to get time in ms
   * @returns Promise that resolves to time in milliseconds (0.02-2000ms)
   * @example
   * // Get hold time in ms
   * const holdMs = await gate.fetchHold('milliseconds');
   */
  fetchHold(unit: 'milliseconds'): Promise<number>;

  /**
   * Update the gate key source for sidechain using raw OSC value
   * @param value - The key source as raw OSC integer (0-22)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await gate.updateKeySource(2);
   */
  updateKeySource(value: number): Promise<void>;

  /**
   * Update the gate key source for sidechain using source string
   * @param value - The key source string ('SELF', 'CH01'-'CH16', 'BUS01'-'BUS06')
   * @param unit - Must be 'keySource' when using source string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using key source string
   * await gate.updateKeySource('CH02', 'keySource');
   */
  updateKeySource(value: DynamicsKeySource, unit: 'keySource'): Promise<void>;

  /**
   * Fetch the current gate key source as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-22)
   * @example
   * // Get raw OSC value
   * const rawKeySource = await gate.fetchKeySource();
   */
  fetchKeySource(): Promise<number>;

  /**
   * Fetch the current gate key source as source string
   * @param unit - Must be 'keySource' to get source string
   * @returns Promise that resolves to source string ('SELF', 'CH01'-'CH16', 'BUS01'-'BUS06')
   * @example
   * // Get key source string
   * const keySourceStr = await gate.fetchKeySource('keySource');
   */
  fetchKeySource(unit: 'keySource'): Promise<DynamicsKeySource>;

  /**
   * Update the gate operating mode using raw OSC value
   * @param value - The mode as raw OSC integer (0-4)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await gate.updateMode(3);
   */
  updateMode(value: number): Promise<void>;

  /**
   * Update the gate operating mode using mode string
   * @param value - The mode string ('EXP2', 'EXP3', 'EXP4', 'GATE', 'DUCK')
   * @param unit - Must be 'mode' when using mode string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using mode string
   * await gate.updateMode('GATE', 'mode');
   */
  updateMode(value: GateMode, unit: 'mode'): Promise<void>;

  /**
   * Fetch the current gate operating mode as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-4)
   * @example
   * // Get raw OSC value
   * const rawMode = await gate.fetchMode();
   */
  fetchMode(): Promise<number>;

  /**
   * Fetch the current gate operating mode as mode string
   * @param unit - Must be 'mode' to get mode string
   * @returns Promise that resolves to mode string ('EXP2', 'EXP3', 'EXP4', 'GATE', 'DUCK')
   * @example
   * // Get mode string
   * const modeStr = await gate.fetchMode('mode');
   */
  fetchMode(unit: 'mode'): Promise<GateMode>;

  /**
   * Update the gate enabled state using raw OSC value
   * @param value - The enabled state as raw OSC integer (0 = disabled, 1 = enabled)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await gate.updateEnabled(1);
   */
  updateEnabled(value: number): Promise<void>;

  /**
   * Update the gate enabled state using boolean
   * @param value - The enabled state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await gate.updateEnabled(true, 'flag');
   */
  updateEnabled(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Fetch the current gate enabled state as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = disabled, 1 = enabled)
   * @example
   * // Get raw OSC value
   * const rawEnabled = await gate.fetchIsEnabled();
   */
  fetchIsEnabled(): Promise<number>;

  /**
   * Fetch the current gate enabled state as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isEnabled = await gate.fetchIsEnabled('flag');
   */
  fetchIsEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the gate range using raw OSC value
   * @param value - The range as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await gate.updateRange(0.3);
   */
  updateRange(value: number): Promise<void>;

  /**
   * Update the gate range using decibels
   * @param value - The range in decibels (3-60dB)
   * @param unit - Must be 'decibels' when using dB values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using decibels
   * await gate.updateRange(20, 'decibels');
   */
  updateRange(value: number, unit: 'decibels'): Promise<void>;

  /**
   * Fetch the current gate range as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawRange = await gate.fetchRange();
   */
  fetchRange(): Promise<number>;

  /**
   * Fetch the current gate range in decibels
   * @param unit - Must be 'decibels' to get level in dB
   * @returns Promise that resolves to level in dB (3-60dB)
   * @example
   * // Get range in dB
   * const rangeDb = await gate.fetchRange('decibels');
   */
  fetchRange(unit: 'decibels'): Promise<number>;

  /**
   * Update the gate release time using raw OSC value
   * @param value - The release time as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await gate.updateRelease(0.4);
   */
  updateRelease(value: number): Promise<void>;

  /**
   * Update the gate release time using milliseconds
   * @param value - The release time in milliseconds (5-4000ms)
   * @param unit - Must be 'milliseconds' when using millisecond values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using time in milliseconds
   * await gate.updateRelease(100, 'milliseconds');
   */
  updateRelease(value: number, unit: 'milliseconds'): Promise<void>;

  /**
   * Fetch the current gate release time as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawRelease = await gate.fetchRelease();
   */
  fetchRelease(): Promise<number>;

  /**
   * Fetch the current gate release time in milliseconds
   * @param unit - Must be 'milliseconds' to get time in ms
   * @returns Promise that resolves to time in milliseconds (5-4000ms)
   * @example
   * // Get release time in ms
   * const releaseMs = await gate.fetchRelease('milliseconds');
   */
  fetchRelease(unit: 'milliseconds'): Promise<number>;

  /**
   * Update the gate threshold level using raw OSC value
   * @param value - The threshold as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await gate.updateThreshold(0.5);
   */
  updateThreshold(value: number): Promise<void>;

  /**
   * Update the gate threshold level using decibels
   * @param value - The threshold level in dB (-80 to 0dB)
   * @param unit - Must be 'decibels' when using dB values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using decibels
   * await gate.updateThreshold(-40, 'decibels');
   */
  updateThreshold(value: number, unit: 'decibels'): Promise<void>;

  /**
   * Fetch the current gate threshold level as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawThreshold = await gate.fetchThreshold();
   */
  fetchThreshold(): Promise<number>;

  /**
   * Fetch the current gate threshold level in decibels
   * @param unit - Must be 'decibels' to get level in dB
   * @returns Promise that resolves to level in dB (-80 to 0dB)
   * @example
   * // Get threshold in dB
   * const thresholdDb = await gate.fetchThreshold('decibels');
   */
  fetchThreshold(unit: 'decibels'): Promise<number>;
};

type ChannelGateDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelGate = (dependencies: ChannelGateDependencies): ChannelGate => {
  const { channel, oscClient } = dependencies;
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/gate`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const attack = oscParameterFactory.createOSCParameter(
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
  const range = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/range`,
    createLinearParameterConfig<'decibels'>(3, 60),
  );
  const release = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/release`,
    createLogarithmicParameterConfig<'milliseconds'>(5, 4000),
  );
  const threshold = oscParameterFactory.createOSCParameter(
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
