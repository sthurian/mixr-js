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
   * Updates the gate attack time.
   *
   * @param attack - Attack time. Either in milliseconds (0.0-120.0ms) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using time in milliseconds
   * await gate.updateAttack(25.0);
   *
   * // Using raw OSC value
   * await gate.updateAttack(0.2);
   * ```
   */
  updateAttack: AsyncSetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Fetches the current gate attack time.
   *
   * @returns Promise resolving to the attack time. Returns time in milliseconds (0.0-120.0ms) or raw OSC float (0.0-1.0).
   *
   * @example
   * ```typescript
   * // Get attack time in ms
   * const attack = await gate.fetchAttack();
   *
   * // Get as raw OSC value
   * const oscValue = await gate.fetchAttack();
   * ```
   */
  fetchAttack: AsyncGetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Gets the gate's filter interface for controlling filter settings.
   *
   * @returns The dynamics filter interface.
   *
   * @example
   * ```typescript
   * const filter = gate.getFilter();
   * await filter.updateEnabled(true);
   * await filter.updateFrequency(1000);
   * ```
   */
  getFilter: () => DynamicsFilter;

  /**
   * Updates the gate hold time.
   *
   * @param hold - Hold time. Either in milliseconds (0.02-2000ms) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using time in milliseconds
   * await gate.updateHold(50);
   *
   * // Using raw OSC value
   * await gate.updateHold(0.3);
   * ```
   */
  updateHold: AsyncSetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Fetches the current gate hold time.
   *
   * @returns Promise resolving to the hold time. Returns time in milliseconds (0.02-2000ms) or raw OSC float (0.0-1.0).
   *
   * @example
   * ```typescript
   * // Get hold time in ms
   * const hold = await gate.fetchHold();
   *
   * // Get as raw OSC value
   * const oscValue = await gate.fetchHold();
   * ```
   */
  fetchHold: AsyncGetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Updates the gate key source for sidechain detection.
   *
   * @param keySource - Key source. Either a string literal ('SELF', 'CH01'-'CH16', 'BUS01'-'BUS06') or a raw OSC integer (0-22).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using key source literal
   * await gate.updateKeySource('CH02');
   *
   * // Using raw OSC value
   * await gate.updateKeySource(2);
   * ```
   */
  updateKeySource: AsyncSetter<Unit<'keySource', DynamicsKeySource>, 'integer'>;

  /**
   * Fetches the current gate key source for sidechain detection.
   *
   * @returns Promise resolving to the key source. Returns string literal ('SELF', 'CH01'-'CH16', 'BUS01'-'BUS06') or raw OSC integer (0-22).
   *
   * @example
   * ```typescript
   * // Get as key source literal
   * const keySource = await gate.fetchKeySource();
   *
   * // Get as raw OSC value
   * const oscValue = await gate.fetchKeySource();
   * ```
   */
  fetchKeySource: AsyncGetter<Unit<'keySource', DynamicsKeySource>, 'integer'>;

  /**
   * Updates the gate operating mode.
   *
   * @param mode - Gate mode. Either a string literal ('EXP2', 'EXP3', 'EXP4', 'GATE', 'DUCK') or a raw OSC integer (0-4).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using mode literal
   * await gate.updateMode('GATE');
   *
   * // Using raw OSC value
   * await gate.updateMode(3);
   * ```
   */
  updateMode: AsyncSetter<Unit<'mode', GateMode>, 'integer'>;

  /**
   * Fetches the current gate operating mode.
   *
   * @returns Promise resolving to the gate mode. Returns string literal ('EXP2', 'EXP3', 'EXP4', 'GATE', 'DUCK') or raw OSC integer (0-4).
   *
   * @example
   * ```typescript
   * // Get as mode literal
   * const mode = await gate.fetchMode();
   *
   * // Get as raw OSC value
   * const oscValue = await gate.fetchMode();
   * ```
   */
  fetchMode: AsyncGetter<Unit<'mode', GateMode>, 'integer'>;

  /**
   * Updates the gate enable/disable status.
   *
   * @param enabled - Gate state. Either a boolean (true=enabled, false=disabled) or a raw OSC integer (0=disabled, 1=enabled).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using boolean value
   * await gate.updateEnabled(true);
   *
   * // Using raw OSC value
   * await gate.updateEnabled(1);
   * ```
   */
  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetches the current gate enable/disable status.
   *
   * @returns Promise resolving to the gate state. Returns boolean (true=enabled, false=disabled) or raw OSC integer (0=disabled, 1=enabled).
   *
   * @example
   * ```typescript
   * // Get as boolean
   * const isEnabled = await gate.fetchIsEnabled();
   *
   * // Get as raw OSC value
   * const oscValue = await gate.fetchIsEnabled();
   * ```
   */
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Updates the gate range (amount of gain reduction).
   *
   * @param range - Range in decibels (3-60dB) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using range in dB
   * await gate.updateRange(20);
   *
   * // Using raw OSC value
   * await gate.updateRange(0.3);
   * ```
   */
  updateRange: AsyncSetter<Unit<'decibels', number>, 'float'>;

  /**
   * Fetches the current gate range (amount of gain reduction).
   *
   * @returns Promise resolving to the range. Returns range in decibels (3-60dB) or raw OSC float (0.0-1.0).
   *
   * @example
   * ```typescript
   * // Get range in dB
   * const range = await gate.fetchRange();
   *
   * // Get as raw OSC value
   * const oscValue = await gate.fetchRange();
   * ```
   */
  fetchRange: AsyncGetter<Unit<'decibels', number>, 'float'>;

  /**
   * Updates the gate release time.
   *
   * @param release - Release time. Either in milliseconds (5-4000ms) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using time in milliseconds
   * await gate.updateRelease(100);
   *
   * // Using raw OSC value
   * await gate.updateRelease(0.4);
   * ```
   */
  updateRelease: AsyncSetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Fetches the current gate release time.
   *
   * @returns Promise resolving to the release time. Returns time in milliseconds (5-4000ms) or raw OSC float (0.0-1.0).
   *
   * @example
   * ```typescript
   * // Get release time in ms
   * const release = await gate.fetchRelease();
   *
   * // Get as raw OSC value
   * const oscValue = await gate.fetchRelease();
   * ```
   */
  fetchRelease: AsyncGetter<Unit<'milliseconds', number>, 'float'>;

  /**
   * Updates the gate threshold level.
   *
   * @param threshold - Threshold level. Either in decibels (-80 to 0dB) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using threshold in dB
   * await gate.updateThreshold(-40);
   *
   * // Using raw OSC value
   * await gate.updateThreshold(0.5);
   * ```
   */
  updateThreshold: AsyncSetter<Unit<'decibels', number>, 'float'>;

  /**
   * Fetches the current gate threshold level.
   *
   * @returns Promise resolving to the threshold level. Returns threshold in decibels (-80 to 0dB) or raw OSC float (0.0-1.0).
   *
   * @example
   * ```typescript
   * // Get threshold in dB
   * const threshold = await gate.fetchThreshold();
   *
   * // Get as raw OSC value
   * const oscValue = await gate.fetchThreshold();
   * ```
   */
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
