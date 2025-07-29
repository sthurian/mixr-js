import { OSCClient } from '../../../osc/client.js';
import { createEntityFactory } from '../../entity.js';
import { levelMapper, Decibel } from '../../mapper/level.js';
import { onOffMapper } from '../../mapper/on-off.js';
import { ChannelFxSendLabel, mapChannelFxSendLabelToNumber } from './mapper/fx-send.js';
import { FxSendTap, fxSendTapMapper } from './mapper/fx-tap.js';

export type ChannelFxSend = {
  fetchIsGroupEnabled: () => Promise<boolean>;
  updateGroupEnabled: (enabled: boolean) => Promise<void>;

  fetchLevel: () => Promise<Decibel>;
  updateLevel: (level: Decibel) => Promise<void>;

  fetchTap: () => Promise<FxSendTap>;
  updateTap: (tap: FxSendTap) => Promise<void>;
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
  const entityFactory = createEntityFactory(oscClient);
  const grpEnabled = entityFactory.createEntity(`${oscBasePath}/grpon`, onOffMapper);
  const level = entityFactory.createEntity(`${oscBasePath}/level`, levelMapper);
  const tap = entityFactory.createEntity(`${oscBasePath}/tap`, fxSendTapMapper);

  return {
    fetchIsGroupEnabled: grpEnabled.get,
    updateGroupEnabled: grpEnabled.set,
    fetchLevel: level.get,
    updateLevel: level.set,
    fetchTap: tap.get,
    updateTap: tap.set,
  };
};
