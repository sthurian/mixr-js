import { OSCClient } from '../../../osc/client.js';
import { createEntityFactory } from '../../entity.js';
import { Decibel, levelMapper } from '../../mapper/level.js';
import { createLinearMapper } from '../../mapper/linear.js';
import { onOffMapper } from '../../mapper/on-off.js';
import { ChannelBusSendLabel, mapChannelBusSendLabelToNumber } from './mapper/bus-send.js';
import { BusSendTap, busSendTapMapper } from './mapper/bus-tap.js';

export type ChannelBusSend = {
  fetchIsGroupEnabled: () => Promise<boolean>;
  updateGroupEnabled: (enabled: boolean) => Promise<void>;

  fetchLevel: () => Promise<Decibel>;
  updateLevel: (level: Decibel) => Promise<void>;

  fetchPan: () => Promise<number>;
  updatePan: (pan: number) => Promise<void>;

  fetchTap: () => Promise<BusSendTap>;
  updateTap: (tap: BusSendTap) => Promise<void>;
};

type ChannelBusSendDependencies = {
  channel: number;
  sendBus: ChannelBusSendLabel;
  oscClient: OSCClient;
};

export const createChannelBusSend = (dependencies: ChannelBusSendDependencies): ChannelBusSend => {
  const { channel, oscClient, sendBus } = dependencies;
  const busNumber = mapChannelBusSendLabelToNumber(sendBus);
  const busGroupNumber = busNumber % 2 === 0 ? busNumber - 1 : busNumber;
  const channelNumber = channel.toString().padStart(2, '0');
  const oscBasePath = `/ch/${channelNumber}/mix/${busNumber.toString().padStart(2, '0')}`;
  const oscBaseGroupPath = `/ch/${channelNumber}/mix/${busGroupNumber.toString().padStart(2, '0')}`;
  const entityFactory = createEntityFactory(oscClient);
  const grpEnabled = entityFactory.createEntity(`${oscBasePath}/grpon`, onOffMapper);
  const level = entityFactory.createEntity(`${oscBasePath}/level`, levelMapper);
  const pan = entityFactory.createEntity(`${oscBaseGroupPath}/pan`, createLinearMapper(-100, 100));
  const tap = entityFactory.createEntity(`${oscBasePath}/tap`, busSendTapMapper);

  return {
    fetchIsGroupEnabled: grpEnabled.get,
    updateGroupEnabled: grpEnabled.set,
    fetchLevel: level.get,
    updateLevel: level.set,
    fetchPan: pan.get,
    updatePan: pan.set,
    fetchTap: tap.get,
    updateTap: tap.set,
  };
};
