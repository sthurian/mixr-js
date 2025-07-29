import { OSCClient } from '../../../osc/client.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../../osc-parameter.js';
import {
  AutomixGroup,
  automixGroupParameterConfig,
  automixWeightParameterConfig,
} from './parameter/automix.js';

export type ChannelAutomix = {
  fetchGroup: AsyncGetter<Unit<'groupName', AutomixGroup>, 'integer'>;
  updateGroup: AsyncSetter<Unit<'groupName', AutomixGroup>, 'integer'>;
  fetchWeight: AsyncGetter<Unit<'decibels', number>, 'float'>;
  updateWeight: AsyncSetter<Unit<'decibels', number>, 'float'>;
};

type ChannelAutomixDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelAutomix = (dependencies: ChannelAutomixDependencies): ChannelAutomix => {
  const { channel, oscClient } = dependencies;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const channelAutoMixOscAddress = `/ch/${channel.toString().padStart(2, '0')}/automix`;
  const automixGroup = oscParameterFactory.createOSCParameter(
    `${channelAutoMixOscAddress}/group`,
    automixGroupParameterConfig,
  );
  const automixWeight = oscParameterFactory.createOSCParameter(
    `${channelAutoMixOscAddress}/weight`,
    automixWeightParameterConfig,
  );

  return {
    fetchGroup: automixGroup.fetch,
    updateGroup: automixGroup.update,
    fetchWeight: automixWeight.fetch,
    updateWeight: automixWeight.update,
  };
};
