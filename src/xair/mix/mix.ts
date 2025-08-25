import { OSCClient } from '../../osc/client.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../osc-parameter.js';
import { levelParamaterConfig } from '../mapper/level.js';
import { createLinearParameterConfig } from '../mapper/linear.js';
import { onOffInvertedParameterConfig, onOffParameterConfig } from '../mapper/on-off.js';

export type Mix = {
  /**
   * Fetches the current mute status.
   * 
   * @returns Promise resolving to the mute state. Returns boolean (true=muted, false=unmuted) or raw OSC integer (0=unmuted, 1=muted).
   * 
   * @example
   * ```typescript
   * // Get as boolean
   * const isMuted = await mix.fetchIsMuted();
   * 
   * // Get as raw OSC value
   * const oscValue = await mix.fetchIsMuted();
   * ```
   */
  fetchIsMuted: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Updates the mute status.
   * 
   * @param muted - Mute state. Either a boolean (true=muted, false=unmuted) or a raw OSC integer (0=unmuted, 1=muted).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using boolean value
   * await mix.updateMuted(true);
   * 
   * // Using raw OSC value
   * await mix.updateMuted(1);
   * ```
   */
  updateMuted: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetches the current left-right assignment status.
   * 
   * @returns Promise resolving to the assignment state. Returns boolean (true=assigned, false=unassigned) or raw OSC integer (0=unassigned, 1=assigned).
   * 
   * @example
   * ```typescript
   * // Get as boolean
   * const isAssigned = await mix.fetchIsLeftRightAssignmentEnabled();
   * 
   * // Get as raw OSC value
   * const oscValue = await mix.fetchIsLeftRightAssignmentEnabled();
   * ```
   */
  fetchIsLeftRightAssignmentEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Updates the left-right assignment status.
   * 
   * @param enabled - Assignment state. Either a boolean (true=assigned, false=unassigned) or a raw OSC integer (0=unassigned, 1=assigned).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using boolean value
   * await mix.updateLeftRightAssignmentEnabled(true);
   * 
   * // Using raw OSC value
   * await mix.updateLeftRightAssignmentEnabled(1);
   * ```
   */
  updateLeftRightAssignmentEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetches the current fader level.
   * 
   * @returns Promise resolving to the fader level. Returns level in decibels (-∞ to +10dB) or raw OSC float (0.0-1.0).
   * 
   * @example
   * ```typescript
   * // Get level in dB
   * const level = await mix.fetchFader();
   * 
   * // Get as raw OSC value
   * const oscValue = await mix.fetchFader();
   * ```
   */
  fetchFader: AsyncGetter<Unit<'decibels', number>, 'float'>;

  /**
   * Updates the fader level.
   * 
   * @param level - Fader level. Either in decibels (-∞ to +10dB) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using level in dB
   * await mix.updateFader(-20);
   * 
   * // Using raw OSC value
   * await mix.updateFader(0.5);
   * ```
   */
  updateFader: AsyncSetter<Unit<'decibels', number>, 'float'>;

  /**
   * Fetches the current pan position.
   * 
   * @returns Promise resolving to the pan position. Returns percentage (-100% to +100%) or raw OSC float (0.0-1.0).
   * 
   * @example
   * ```typescript
   * // Get pan as percentage
   * const pan = await mix.fetchPan();
   * 
   * // Get as raw OSC value
   * const oscValue = await mix.fetchPan();
   * ```
   */
  fetchPan: AsyncGetter<Unit<'percent', number>, 'float'>;

  /**
   * Updates the pan position.
   * 
   * @param pan - Pan position. Either as percentage (-100% to +100%) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using percentage
   * await mix.updatePan(-50);
   * 
   * // Using raw OSC value
   * await mix.updatePan(0.25);
   * ```
   */
  updatePan: AsyncSetter<Unit<'percent', number>, 'float'>;
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
  const fader = oscParameterFactory.createOSCParameter<Unit<'decibels', number>, 'float'>(
    `${oscBaseAddress}/fader`,
    levelParamaterConfig,
  );
  const pan = oscParameterFactory.createOSCParameter<Unit<'percent', number>, 'float'>(
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
