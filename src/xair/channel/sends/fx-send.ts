import { OSCClient } from '../../../osc/client.js';
import { createEntityFactory } from '../../entity.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory } from '../../osc-parameter.js';
import { levelParamaterConfig } from '../../mapper/level.js';
import { onOffMapper } from '../../mapper/on-off.js';
import { ChannelFxSendLabel, mapChannelFxSendLabelToNumber } from './mapper/fx-send.js';
import { FxSendTap, fxSendTapMapper } from './mapper/fx-tap.js';

export type ChannelFxSend = {
  fetchIsGroupEnabled: () => Promise<boolean>;
  updateGroupEnabled: (enabled: boolean) => Promise<void>;

  fetchLevel: AsyncGetter<'decibels', 'float', number>;
  updateLevel: AsyncSetter<'decibels', 'float', number>;

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
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const grpEnabled = entityFactory.createEntity(`${oscBasePath}/grpon`, onOffMapper);
  const level = oscParameterFactory.createOSCParameter(`${oscBasePath}/level`, levelParamaterConfig);
  const tap = entityFactory.createEntity(`${oscBasePath}/tap`, fxSendTapMapper);

  return {
    fetchIsGroupEnabled: grpEnabled.get,
    updateGroupEnabled: grpEnabled.set,
    fetchLevel: level.fetch,
    updateLevel: level.update,
    fetchTap: tap.get,
    updateTap: tap.set,
  };
};
