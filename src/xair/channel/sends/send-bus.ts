import { OSCClient } from '../../../osc/client.js';
import { createOSCParameterFactory, AsyncGetter, AsyncSetter, Unit } from '../../osc-parameter.js';
import { levelParamaterConfig } from '../../mapper/level.js';
import { ChannelSendBusLabel, mapChannelSendBusLabelToNumber } from './mapper/send-bus.js';
import { SendBusTap, sendBusTapParameterConfig } from './mapper/bus-tap.js';
import { createLinearParameterConfig } from '../../mapper/linear.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';

export type ChannelSendBus = {
  /**
   * Fetch the current group enabled state for this send bus
   * @param unit - Optional unit parameter. If 'flag' is provided, returns boolean value
   * @returns Promise that resolves to either raw OSC integer (0/1) or boolean
   * @example
   * // Get raw OSC value (0 = disabled, 1 = enabled)
   * const rawEnabled = await sendBus.fetchIsGroupEnabled();
   * 
   * // Get boolean value
   * const isEnabled = await sendBus.fetchIsGroupEnabled('flag');
   */
  fetchIsGroupEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  
  /**
   * Update the group enabled state for this send bus
   * @param value - The enabled state: raw OSC integer (0/1) or boolean
   * @param unit - Optional unit parameter. If 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = disabled, 1 = enabled)
   * await sendBus.updateGroupEnabled(1);
   * 
   * // Set using boolean
   * await sendBus.updateGroupEnabled(true, 'flag');
   */
  updateGroupEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetches the level of the send bus.
   * @param unit - Optional unit parameter. If 'decibels' is provided, returns level in dB
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or level in dB (-∞ to +10dB)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawLevel = await sendBus.fetchLevel();
   * 
   * // Get level in decibels (-∞ to +10dB)
   * const levelDb = await sendBus.fetchLevel('decibels');
   */
  fetchLevel: AsyncGetter<Unit<'decibels', number>, 'float'>;
  
  /**
   * Update the level of the send bus
   * @param value - The level value: raw OSC float (0.0-1.0) or level in dB (-∞ to +10dB)
   * @param unit - Optional unit parameter. If 'decibels' is provided, value should be in dB
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await sendBus.updateLevel(0.75);
   * 
   * // Set using decibels (-∞ to +10dB)
   * await sendBus.updateLevel(-6, 'decibels');
   */
  updateLevel: AsyncSetter<Unit<'decibels', number>, 'float'>;

  /**
   * Fetch the current pan position
   * @param unit - Optional unit parameter. If 'percent' is provided, returns percentage
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or percentage (-100% to +100%)
   * @example
   * // Get raw OSC value (0.0 = left, 0.5 = center, 1.0 = right)
   * const rawPan = await sendBus.fetchPan();
   * 
   * // Get pan percentage (-100% = left, 0% = center, +100% = right)
   * const panPercent = await sendBus.fetchPan('percent');
   */
  fetchPan: AsyncGetter<Unit<'percent', number>, 'float'>;
  
  /**
   * Update the pan position
   * @param value - The pan value: raw OSC float (0.0-1.0) or percentage (-100% to +100%)
   * @param unit - Optional unit parameter. If 'percent' is provided, value should be percentage
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 = left, 0.5 = center, 1.0 = right)
   * await sendBus.updatePan(0.5);
   * 
   * // Set using percentage (-100% = left, 0% = center, +100% = right)
   * await sendBus.updatePan(25, 'percent');
   */
  updatePan: AsyncSetter<Unit<'percent', number>, 'float'>;

  /**
   * Fetch the current send tap point
   * @param unit - Optional unit parameter. If 'tap' is provided, returns tap string
   * @returns Promise that resolves to either raw OSC integer (0-5) or tap string ('IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST', 'GRP')
   * @example
   * // Get raw OSC value (0-5)
   * const rawTap = await sendBus.fetchTap();
   * 
   * // Get tap string ('IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST', 'GRP')
   * const tap = await sendBus.fetchTap('tap');
   */
  fetchTap: AsyncGetter<Unit<'tap', SendBusTap>, 'integer'>;
  
  /**
   * Update the send tap point
   * @param value - The tap point: raw OSC integer (0-5) or tap string ('IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST', 'GRP')
   * @param unit - Optional unit parameter. If 'tap' is provided, value should be tap string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = 'IN', 4 = 'POST', 5 = 'GRP')
   * await sendBus.updateTap(4);
   * 
   * // Set using tap string
   * await sendBus.updateTap('POST', 'tap');
   */
  updateTap: AsyncSetter<Unit<'tap', SendBusTap>, 'integer'>;
};

type ChannelSendBusDependencies = {
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
  const level = oscParameterFactory.createOSCParameter<Unit<'decibels', number>, 'float'>(
    `${oscBasePath}/level`,
    levelParamaterConfig,
  );
  const pan = oscParameterFactory.createOSCParameter<Unit<'percent', number>, 'float'>(
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
