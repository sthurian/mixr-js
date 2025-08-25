import { OSCClient } from '../../../osc/client.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../../osc-parameter.js';
import { levelParamaterConfig } from '../../mapper/level.js';
import { ChannelFxSendLabel, mapChannelFxSendLabelToNumber } from './mapper/fx-send.js';
import { FxSendTap, fxSendTapParameterConfig } from './mapper/fx-tap.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';

export type ChannelFxSend = {
  /**
   * Fetches the current FX send group enable/disable status.
   *
   * @returns Promise resolving to the group enable state. Returns boolean (true=enabled, false=disabled) or raw OSC integer (0=disabled, 1=enabled).
   *
   * @example
   * ```typescript
   * // Get as boolean
   * const isEnabled = await fxSend.fetchIsGroupEnabled();
   *
   * // Get as raw OSC value
   * const oscValue = await fxSend.fetchIsGroupEnabled();
   * ```
   */
  fetchIsGroupEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Updates the FX send group enable/disable status.
   *
   * @param enabled - Group enable state. Either a boolean (true=enabled, false=disabled) or a raw OSC integer (0=disabled, 1=enabled).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using boolean value
   * await fxSend.updateGroupEnabled(true);
   *
   * // Using raw OSC value
   * await fxSend.updateGroupEnabled(1);
   * ```
   */
  updateGroupEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetches the current FX send level.
   *
   * @returns Promise resolving to the send level. Returns level in decibels (-∞ to +10dB) or raw OSC float (0.0-1.0).
   *
   * @example
   * ```typescript
   * // Get level in dB
   * const level = await fxSend.fetchLevel();
   *
   * // Get as raw OSC value
   * const oscValue = await fxSend.fetchLevel();
   * ```
   */
  fetchLevel: AsyncGetter<Unit<'decibels', number>, 'float'>;

  /**
   * Updates the FX send level.
   *
   * @param level - Send level. Either in decibels (-∞ to +10dB) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using level in dB
   * await fxSend.updateLevel(-20);
   *
   * // Using raw OSC value
   * await fxSend.updateLevel(0.5);
   * ```
   */
  updateLevel: AsyncSetter<Unit<'decibels', number>, 'float'>;

  /**
   * Fetches the current FX send tap point.
   *
   * @returns Promise resolving to the tap point. Returns string literal ('IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST') or raw OSC integer (0-4).
   *
   * @example
   * ```typescript
   * // Get as tap point literal
   * const tap = await fxSend.fetchTap();
   *
   * // Get as raw OSC value
   * const oscValue = await fxSend.fetchTap();
   * ```
   */
  fetchTap: AsyncGetter<Unit<'tap', FxSendTap>, 'integer'>;

  /**
   * Updates the FX send tap point.
   *
   * @param tap - Tap point. Either a string literal ('IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST') or a raw OSC integer (0-4).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using tap point literal
   * await fxSend.updateTap('PRE');
   *
   * // Using raw OSC value
   * await fxSend.updateTap(3);
   * ```
   */
  updateTap: AsyncSetter<Unit<'tap', FxSendTap>, 'integer'>;
};

type ChannelFxSendDependencies = {
  channel: number;
  fx: ChannelFxSendLabel;
  oscClient: OSCClient;
};

export const createChannelFxSend = (dependencies: ChannelFxSendDependencies): ChannelFxSend => {
  const { channel, oscClient, fx } = dependencies;
  const busNumber = mapChannelFxSendLabelToNumber(fx);
  const oscBasePath = `/ch/${channel.toString().padStart(2, '0')}/mix/${busNumber.toString().padStart(2, '0')}`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const grpEnabled = oscParameterFactory.createOSCParameter(
    `${oscBasePath}/grpon`,
    onOffParameterConfig,
  );
  const level = oscParameterFactory.createOSCParameter<Unit<'decibels', number>, 'float'>(
    `${oscBasePath}/level`,
    levelParamaterConfig,
  );
  const tap = oscParameterFactory.createOSCParameter(
    `${oscBasePath}/tap`,
    fxSendTapParameterConfig,
  );

  return {
    fetchIsGroupEnabled: grpEnabled.fetch,
    updateGroupEnabled: grpEnabled.update,
    fetchLevel: level.fetch,
    updateLevel: level.update,
    fetchTap: tap.fetch,
    updateTap: tap.update,
  };
};
