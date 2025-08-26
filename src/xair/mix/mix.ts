import { OSCClient } from '../../osc/client.js';
import { createOSCParameterFactory } from '../osc-parameter.js';
import { levelParamaterConfig } from '../mapper/level.js';
import { createLinearParameterConfig } from '../mapper/linear.js';
import { onOffInvertedParameterConfig, onOffParameterConfig } from '../mapper/on-off.js';

export type Mix = {
  /**
   * Fetch the current mute status as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = unmuted, 1 = muted)
   * @example
   * // Get raw OSC value
   * const rawMuted = await mix.fetchIsMuted();
   */
  fetchIsMuted(): Promise<number>;

  /**
   * Fetch the current mute status as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isMuted = await mix.fetchIsMuted('flag');
   */
  fetchIsMuted(unit: 'flag'): Promise<boolean>;

  /**
   * Update the mute status using raw OSC value
   * @param value - The mute state as raw OSC integer (0 = unmuted, 1 = muted)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await mix.updateMuted(1);
   */
  updateMuted(value: number): Promise<void>;

  /**
   * Update the mute status using boolean
   * @param value - The mute state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await mix.updateMuted(true, 'flag');
   */
  updateMuted(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Fetch the current left-right assignment enabled state as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = disabled, 1 = enabled)
   * @example
   * // Get raw OSC value
   * const rawAssignment = await mix.fetchIsLeftRightAssignmentEnabled();
   */
  fetchIsLeftRightAssignmentEnabled(): Promise<number>;

  /**
   * Fetch the current left-right assignment enabled state as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isAssigned = await mix.fetchIsLeftRightAssignmentEnabled('flag');
   */
  fetchIsLeftRightAssignmentEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the left-right assignment enabled state using raw OSC value
   * @param value - The assignment state as raw OSC integer (0 = disabled, 1 = enabled)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await mix.updateLeftRightAssignmentEnabled(1);
   */
  updateLeftRightAssignmentEnabled(value: number): Promise<void>;

  /**
   * Update the left-right assignment enabled state using boolean
   * @param value - The assignment state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await mix.updateLeftRightAssignmentEnabled(true, 'flag');
   */
  updateLeftRightAssignmentEnabled(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Fetch the current fader level as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawLevel = await mix.fetchFader();
   */
  fetchFader(): Promise<number>;

  /**
   * Fetch the current fader level in decibels
   * @param unit - Must be 'decibels' to get level in dB
   * @returns Promise that resolves to level in dB (-∞ to +10dB)
   * @example
   * // Get level in decibels
   * const levelDb = await mix.fetchFader('decibels');
   */
  fetchFader(unit: 'decibels'): Promise<number>;

  /**
   * Update the fader level using raw OSC value
   * @param value - The level as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await mix.updateFader(0.75);
   */
  updateFader(value: number): Promise<void>;

  /**
   * Update the fader level using decibels
   * @param value - The level in dB (-∞ to +10dB)
   * @param unit - Must be 'decibels' when using dB values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using level in dB
   * await mix.updateFader(-10, 'decibels');
   */
  updateFader(value: number, unit: 'decibels'): Promise<void>;

  /**
   * Fetch the current pan position as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawPan = await mix.fetchPan();
   */
  fetchPan(): Promise<number>;

  /**
   * Fetch the current pan position as percentage
   * @param unit - Must be 'percent' to get position as percentage
   * @returns Promise that resolves to position as percentage (-100% to +100%)
   * @example
   * // Get position as percentage
   * const panPercent = await mix.fetchPan('percent');
   */
  fetchPan(unit: 'percent'): Promise<number>;

  /**
   * Update the pan position using raw OSC value
   * @param value - The position as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.25 = 50% left)
   * await mix.updatePan(0.25);
   */
  updatePan(value: number): Promise<void>;

  /**
   * Update the pan position using percentage
   * @param value - The position as percentage (-100% to +100%)
   * @param unit - Must be 'percent' when using percentage values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using percentage (negative = left, positive = right)
   * await mix.updatePan(-50, 'percent');
   */
  updatePan(value: number, unit: 'percent'): Promise<void>;
};

type MixDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createMix = (dependencies: MixDependencies): Mix => {
  const { oscBasePath, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/mix`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const on = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffInvertedParameterConfig,
  );
  const lrAssignment = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/lr`,
    onOffParameterConfig,
  );
  const fader = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/fader`,
    levelParamaterConfig,
  );
  const pan = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/pan`,
    createLinearParameterConfig<'percent'>(-100, 100),
  );
  return {
    updateMuted: on.update,
    fetchIsMuted: on.fetch,
    updateLeftRightAssignmentEnabled: lrAssignment.update,
    fetchIsLeftRightAssignmentEnabled: lrAssignment.fetch,
    updateFader: fader.update,
    fetchFader: fader.fetch,
    fetchPan: pan.fetch,
    updatePan: pan.update,
  };
};
