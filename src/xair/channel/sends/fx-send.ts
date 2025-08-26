import { OSCClient } from '../../../osc/client.js';
import { createOSCParameterFactory } from '../../osc-parameter.js';
import { levelParamaterConfig } from '../../mapper/level.js';
import { ChannelFxSendLabel, mapChannelFxSendLabelToNumber } from './mapper/fx-send.js';
import { FxSendTap, fxSendTapParameterConfig } from './mapper/fx-tap.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';

export type ChannelFxSend = {
  /**
   * Fetch the current FX send group enabled state as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = disabled, 1 = enabled)
   * @example
   * // Get raw OSC value
   * const rawEnabled = await fxSend.fetchIsGroupEnabled();
   */
  fetchIsGroupEnabled(): Promise<number>;

  /**
   * Fetch the current FX send group enabled state as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isEnabled = await fxSend.fetchIsGroupEnabled('flag');
   */
  fetchIsGroupEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the FX send group enabled state using raw OSC value
   * @param value - The enabled state as raw OSC integer (0 = disabled, 1 = enabled)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await fxSend.updateGroupEnabled(1);
   */
  updateGroupEnabled(value: number): Promise<void>;

  /**
   * Update the FX send group enabled state using boolean
   * @param value - The enabled state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await fxSend.updateGroupEnabled(true, 'flag');
   */
  updateGroupEnabled(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Fetch the current FX send level as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawLevel = await fxSend.fetchLevel();
   */
  fetchLevel(): Promise<number>;

  /**
   * Fetch the current FX send level in decibels
   * @param unit - Must be 'decibels' to get level in dB
   * @returns Promise that resolves to level in dB (-∞ to +10dB)
   * @example
   * // Get level in decibels
   * const levelDb = await fxSend.fetchLevel('decibels');
   */
  fetchLevel(unit: 'decibels'): Promise<number>;

  /**
   * Update the FX send level using raw OSC value
   * @param value - The level as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await fxSend.updateLevel(0.5);
   */
  updateLevel(value: number): Promise<void>;

  /**
   * Update the FX send level using decibels
   * @param value - The level in dB (-∞ to +10dB)
   * @param unit - Must be 'decibels' when using dB values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using level in dB
   * await fxSend.updateLevel(-20, 'decibels');
   */
  updateLevel(value: number, unit: 'decibels'): Promise<void>;

  /**
   * Fetch the current FX send tap point as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-4)
   * @example
   * // Get raw OSC value
   * const rawTap = await fxSend.fetchTap();
   */
  fetchTap(): Promise<number>;

  /**
   * Fetch the current FX send tap point as tap string
   * @param unit - Must be 'tap' to get tap string
   * @returns Promise that resolves to tap string ('IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST')
   * @example
   * // Get tap point string
   * const tap = await fxSend.fetchTap('tap');
   */
  fetchTap(unit: 'tap'): Promise<FxSendTap>;

  /**
   * Update the FX send tap point using raw OSC value
   * @param value - The tap point as raw OSC integer (0-4)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (3 = 'PRE')
   * await fxSend.updateTap(3);
   */
  updateTap(value: number): Promise<void>;

  /**
   * Update the FX send tap point using tap string
   * @param value - The tap point as tap string ('IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST')
   * @param unit - Must be 'tap' when using tap string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using tap point string
   * await fxSend.updateTap('PRE', 'tap');
   */
  updateTap(value: FxSendTap, unit: 'tap'): Promise<void>;
};

export type ChannelFxSendDependencies = {
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
  const level = oscParameterFactory.createOSCParameter(
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
