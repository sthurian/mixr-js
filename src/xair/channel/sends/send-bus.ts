import { OSCClient } from '../../../osc/client.js';
import { createOSCParameterFactory, AsyncGetter, AsyncSetter, Unit } from '../../osc-parameter.js';
import { levelParamaterConfig } from '../../mapper/level.js';
import { ChannelSendBusLabel, mapChannelSendBusLabelToNumber } from './mapper/send-bus.js';
import { SendBusTap, sendBusTapParameterConfig } from './mapper/bus-tap.js';
import { createLinearParameterConfig } from '../../mapper/linear.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';

export type ChannelSendBus = {
  fetchIsGroupEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  updateGroupEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetches the level of the send bus.
   * @param unit - Optional. If provided, the value will be converted to this unit, otherwise it will return the raw osc value.
   * @returns A promise that resolves to the level in the specified unit.
   */
  fetchLevel: AsyncGetter<Unit<'decibels', number>, 'float'>;
  updateLevel: AsyncSetter<Unit<'decibels', number>, 'float'>;

  fetchPan: AsyncGetter<Unit<'percent', number>, 'float'>;
  updatePan: AsyncSetter<Unit<'percent', number>, 'float'>;

  fetchTap: AsyncGetter<Unit<'tap', SendBusTap>, 'integer'>;
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
