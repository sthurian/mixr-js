import { OSCClient } from '../../../osc/client.js';
import { createLinearParameterConfig } from '../../mapper/linear.js';
import { createLiteralParameterConfig } from '../../mapper/literal.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory } from '../../osc-parameter.js';
import { AutomixGroup, automixGroupMap } from './mapper/automix.js';

export type ChannelAutomix = {
  fetchGroup: AsyncGetter<'groupName', 'integer', AutomixGroup>;
  updateGroup: AsyncSetter<'groupName', 'integer', AutomixGroup>;
  fetchWeight: AsyncGetter<'decibels', 'float', number>;
  updateWeight: AsyncSetter<'decibels', 'float', number>;
};

type ChannelAutomixDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelAutomix = (dependencies: ChannelAutomixDependencies): ChannelAutomix => {
  const { channel, oscClient } = dependencies;
  // const entityFactory = createEntityFactory(oscClient);
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const channelAutoMixOscAddress = `/ch/${channel.toString().padStart(2, '0')}/automix`;
  const automixGroup = oscParameterFactory.createOSCParameter<'groupName', 'integer', AutomixGroup>(
    `${channelAutoMixOscAddress}/group`,
    createLiteralParameterConfig(automixGroupMap),
  );
  const automixWeight = oscParameterFactory.createOSCParameter(
    `${channelAutoMixOscAddress}/weight`,
    createLinearParameterConfig<'decibels'>(-12, 12),
  );

  return {
    fetchGroup: automixGroup.fetch,
    updateGroup: automixGroup.update,
    fetchWeight: automixWeight.fetch,
    updateWeight: automixWeight.update,
  };
};
