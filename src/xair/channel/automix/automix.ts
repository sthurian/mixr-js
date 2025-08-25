import { OSCClient } from '../../../osc/client.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../../osc-parameter.js';
import {
  AutomixGroup,
  automixGroupParameterConfig,
  automixWeightParameterConfig,
} from './parameter/automix.js';

export type ChannelAutomix = {
  /** 
   * Fetch the current automix group assignment
   * @param unit - Optional unit parameter. If 'groupName' is provided, returns the group name string
   * @returns Promise that resolves to either raw OSC integer (0-2) or group name string
   * @example
   * // Get raw OSC value (0=OFF, 1=X, 2=Y)
   * const rawGroup = await automix.fetchGroup();
   * 
   * // Get group name ('OFF', 'X', or 'Y')
   * const groupName = await automix.fetchGroup('groupName');
   */
  fetchGroup: AsyncGetter<Unit<'groupName', AutomixGroup>, 'integer'>;
  
  /** 
   * Update the automix group assignment
   * @param value - The group value: raw OSC integer (0-2) or group name string ('OFF', 'X', 'Y')
   * @param unit - Optional unit parameter. If 'groupName' is provided, value should be a group name string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0=OFF, 1=X, 2=Y)
   * await automix.updateGroup(1);
   * 
   * // Set using group name
   * await automix.updateGroup('X', 'groupName');
   */
  updateGroup: AsyncSetter<Unit<'groupName', AutomixGroup>, 'integer'>;
  
  /** 
   * Fetch the current automix weight
   * @param unit - Optional unit parameter. If 'decibels' is provided, returns weight in dB
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or decibel value (-12 to +12)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawWeight = await automix.fetchWeight();
   * 
   * // Get weight in decibels (-12dB to +12dB)
   * const weightDb = await automix.fetchWeight('decibels');
   */
  fetchWeight: AsyncGetter<Unit<'decibels', number>, 'float'>;
  
  /** 
   * Update the automix weight
   * @param value - The weight value: raw OSC float (0.0-1.0) or decibel value (-12 to +12)
   * @param unit - Optional unit parameter. If 'decibels' is provided, value should be in dB
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await automix.updateWeight(0.5);
   * 
   * // Set using decibels (-12dB to +12dB)
   * await automix.updateWeight(-6, 'decibels');
   */
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
