import { OSCClient } from '../../../osc/client.js';
import { createOSCParameterFactory } from '../../osc-parameter.js';
import { levelParamaterConfig } from '../../mapper/level.js';
import { ChannelSendBusLabel, mapChannelSendBusLabelToNumber } from './mapper/send-bus.js';
import { SendBusTap, sendBusTapParameterConfig } from './mapper/bus-tap.js';
import { createLinearParameterConfig } from '../../mapper/linear.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';

export type ChannelSendBus = {
  /**
   * Fetch the current group enabled state for this send bus as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = disabled, 1 = enabled)
   * @example
   * // Get raw OSC value
   * const rawEnabled = await sendBus.fetchIsGroupEnabled();
   */
  fetchIsGroupEnabled(): Promise<number>;

  /**
   * Fetch the current group enabled state for this send bus as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isEnabled = await sendBus.fetchIsGroupEnabled('flag');
   */
  fetchIsGroupEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the group enabled state for this send bus using raw OSC value
   * @param value - The enabled state as raw OSC integer (0 = disabled, 1 = enabled)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await sendBus.updateGroupEnabled(1);
   */
  updateGroupEnabled(value: number): Promise<void>;

  /**
   * Update the group enabled state for this send bus using boolean
   * @param value - The enabled state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await sendBus.updateGroupEnabled(true, 'flag');
   */
  updateGroupEnabled(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Fetch the level of the send bus as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawLevel = await sendBus.fetchLevel();
   */
  fetchLevel(): Promise<number>;

  /**
   * Fetch the level of the send bus in decibels
   * @param unit - Must be 'decibels' to get level in dB
   * @returns Promise that resolves to level in dB (-∞ to +10dB)
   * @example
   * // Get level in decibels
   * const levelDb = await sendBus.fetchLevel('decibels');
   */
  fetchLevel(unit: 'decibels'): Promise<number>;

  /**
   * Update the level of the send bus using raw OSC value
   * @param value - The level value as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await sendBus.updateLevel(0.75);
   */
  updateLevel(value: number): Promise<void>;

  /**
   * Update the level of the send bus using decibels
   * @param value - The level value in dB (-∞ to +10dB)
   * @param unit - Must be 'decibels' when using dB values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using decibels
   * await sendBus.updateLevel(-6, 'decibels');
   */
  updateLevel(value: number, unit: 'decibels'): Promise<void>;

  /**
   * Fetch the current pan position as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0 = left, 0.5 = center, 1.0 = right)
   * @example
   * // Get raw OSC value
   * const rawPan = await sendBus.fetchPan();
   */
  fetchPan(): Promise<number>;

  /**
   * Fetch the current pan position as percentage
   * @param unit - Must be 'percent' to get percentage value
   * @returns Promise that resolves to percentage (-100% = left, 0% = center, +100% = right)
   * @example
   * // Get pan percentage
   * const panPercent = await sendBus.fetchPan('percent');
   */
  fetchPan(unit: 'percent'): Promise<number>;

  /**
   * Update the pan position using raw OSC value
   * @param value - The pan value as raw OSC float (0.0 = left, 0.5 = center, 1.0 = right)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await sendBus.updatePan(0.5);
   */
  updatePan(value: number): Promise<void>;

  /**
   * Update the pan position using percentage
   * @param value - The pan value as percentage (-100% = left, 0% = center, +100% = right)
   * @param unit - Must be 'percent' when using percentage values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using percentage
   * await sendBus.updatePan(25, 'percent');
   */
  updatePan(value: number, unit: 'percent'): Promise<void>;

  /**
   * Fetch the current send tap point as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-5)
   * @example
   * // Get raw OSC value
   * const rawTap = await sendBus.fetchTap();
   */
  fetchTap(): Promise<number>;

  /**
   * Fetch the current send tap point as tap string
   * @param unit - Must be 'tap' to get tap string
   * @returns Promise that resolves to tap string ('IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST', 'GRP')
   * @example
   * // Get tap string
   * const tap = await sendBus.fetchTap('tap');
   */
  fetchTap(unit: 'tap'): Promise<SendBusTap>;

  /**
   * Update the send tap point using raw OSC value
   * @param value - The tap point as raw OSC integer (0-5)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (4 = 'POST')
   * await sendBus.updateTap(4);
   */
  updateTap(value: number): Promise<void>;

  /**
   * Update the send tap point using tap string
   * @param value - The tap point as tap string ('IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST', 'GRP')
   * @param unit - Must be 'tap' when using tap string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using tap string
   * await sendBus.updateTap('POST', 'tap');
   */
  updateTap(value: SendBusTap, unit: 'tap'): Promise<void>;
};

export type ChannelSendBusDependencies = {
  channel: number;
  sendBus: ChannelSendBusLabel;
  oscClient: OSCClient;
};

export const createChannelSendBus = (dependencies: ChannelSendBusDependencies): ChannelSendBus => {
  const { channel, oscClient, sendBus } = dependencies;
  const busNumber = mapChannelSendBusLabelToNumber(sendBus);
  const busGroupNumber = busNumber % 2 === 0 ? busNumber - 1 : busNumber;
  const channelNumber = channel.toString().padStart(2, '0');
  const oscBasePath = `/ch/${channelNumber}/mix/${busNumber.toString().padStart(2, '0')}`;
  const oscBaseGroupPath = `/ch/${channelNumber}/mix/${busGroupNumber.toString().padStart(2, '0')}`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const grpEnabled = oscParameterFactory.createOSCParameter(
    `${oscBasePath}/grpon`,
    onOffParameterConfig,
  );
  const level = oscParameterFactory.createOSCParameter(
    `${oscBasePath}/level`,
    levelParamaterConfig,
  );
  const pan = oscParameterFactory.createOSCParameter(
    `${oscBaseGroupPath}/pan`,
    createLinearParameterConfig<'percent'>(-100, 100),
  );
  const tap = oscParameterFactory.createOSCParameter(
    `${oscBasePath}/tap`,
    sendBusTapParameterConfig,
  );
  return {
    fetchIsGroupEnabled: grpEnabled.fetch,
    updateGroupEnabled: grpEnabled.update,
    fetchLevel: level.fetch,
    updateLevel: level.update,
    fetchPan: pan.fetch,
    updatePan: pan.update,
    fetchTap: tap.fetch,
    updateTap: tap.update,
  };
};
