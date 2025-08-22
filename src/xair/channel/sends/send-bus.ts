import { OSCClient } from '../../../osc/client.js';
import { createEntityFactory } from '../../entity.js';
import { createOSCParameterFactory, AsyncGetter, AsyncSetter } from '../../osc-parameter.js';
import { levelParamaterConfig } from '../../mapper/level.js';
import { onOffMapper } from '../../mapper/on-off.js';
import { ChannelSendBusLabel, mapChannelSendBusLabelToNumber } from './mapper/send-bus.js';
import { SendBusTap, sendBusTapMapper } from './mapper/bus-tap.js';
import { createLinearParameterConfig } from '../../mapper/linear.js';

export type ChannelSendBus = {
  fetchIsGroupEnabled: () => Promise<boolean>;
  updateGroupEnabled: (enabled: boolean) => Promise<void>;

  /**
   * Fetches the level of the send bus.
   * @param unit - Optional. If provided, the value will be converted to this unit, otherwise it will return the raw osc value.
   * @returns A promise that resolves to the level in the specified unit.
   */
  fetchLevel: AsyncGetter<'decibels', 'float', number>;
  updateLevel: AsyncSetter<'decibels', 'float', number>;

  fetchPan: AsyncGetter<'percent', 'float', number>;
  updatePan: AsyncSetter<'percent', 'float', number>;

  fetchTap: () => Promise<SendBusTap>;
  updateTap: (tap: SendBusTap) => Promise<void>;
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
  const entityFactory = createEntityFactory(oscClient);
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const grpEnabled = entityFactory.createEntity(`${oscBasePath}/grpon`, onOffMapper);
  const level = oscParameterFactory.createOSCParameter<'decibels', 'float', number>(
    `${oscBasePath}/level`,
    levelParamaterConfig,
  );
  const pan = oscParameterFactory.createOSCParameter(`${oscBaseGroupPath}/pan`, createLinearParameterConfig<'percent'>(-100, 100));
  const tap = entityFactory.createEntity(`${oscBasePath}/tap`, sendBusTapMapper);
  return {
    fetchIsGroupEnabled: grpEnabled.get,
    updateGroupEnabled: grpEnabled.set,
    fetchLevel: level.fetch,
    updateLevel: level.update,
    fetchPan: pan.fetch,
    updatePan: pan.update,
    fetchTap: tap.get,
    updateTap: tap.set,
  };
};
