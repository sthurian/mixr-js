import { OSCClient } from '../../../osc/client.js';
import { createEntityFactory } from '../../entity.js';
import { createLinearParameterConfig } from '../../mapper/linear.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory } from '../../osc-parameter.js';
import { AutomixGroup, automixGroupMapper } from './mapper/automix.js';

export type ChannelAutomix = {
  fetchGroup: () => Promise<AutomixGroup>;
  updateGroup: (autoMixGroup: AutomixGroup) => Promise<void>;
  fetchWeight: AsyncGetter<'decibels', 'float'>;
  updateWeight: AsyncSetter<'decibels', 'float'>;
};

type ChannelAutomixDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelAutomix = (dependencies: ChannelAutomixDependencies): ChannelAutomix => {
  const { channel, oscClient } = dependencies;
  const entityFactory = createEntityFactory(oscClient);
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const channelAutoMixOscAddress = `/ch/${channel.toString().padStart(2, '0')}/automix`;
  const automixGroup = entityFactory.createEntity(
    `${channelAutoMixOscAddress}/group`,
    automixGroupMapper,
  );
  const automixWeight = oscParameterFactory.createOSCParameter(
    `${channelAutoMixOscAddress}/weight`,
    createLinearParameterConfig<'decibels'>(-12, 12),
  );

  return {
    fetchGroup: automixGroup.get,
    updateGroup: automixGroup.set,
    fetchWeight: automixWeight.fetch,
    updateWeight: automixWeight.update,
  };
};
