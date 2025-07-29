import { OSCClient } from '../../../osc/client.js';
import { createEntityFactory } from '../../entity.js';
import { AutomixGroup, automixGroupMapper, automixWeightMapper } from './mapper/automix.js';

export type ChannelAutomix = {
  fetchGroup: () => Promise<AutomixGroup>;
  updateGroup: (autoMixGroup: AutomixGroup) => Promise<void>;
  fetchWeight: () => Promise<number>;
  updateWeight: (weight: number) => Promise<void>;
};

type ChannelAutomixDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelAutomix = (dependencies: ChannelAutomixDependencies): ChannelAutomix => {
  const { channel, oscClient } = dependencies;
  const entityFactory = createEntityFactory(oscClient);
  const channelAutoMixOscAddress = `/ch/${channel.toString().padStart(2, '0')}/automix`;
  const automixGroup = entityFactory.createEntity(
    `${channelAutoMixOscAddress}/group`,
    automixGroupMapper,
  );
  const automixWeight = entityFactory.createEntity(
    `${channelAutoMixOscAddress}/weight`,
    automixWeightMapper,
  );

  return {
    fetchGroup: automixGroup.get,
    updateGroup: automixGroup.set,
    fetchWeight: automixWeight.get,
    updateWeight: automixWeight.set,
  };
};
