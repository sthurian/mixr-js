import { OSCClient } from '../../../osc/client.js';
import { createOSCParameterFactory } from '../../osc-parameter.js';
import {
  AutomixGroup,
  automixGroupParameterConfig,
  automixWeightParameterConfig,
} from './parameter/automix.js';

export type ChannelAutomix = {
  /**
   * Fetch the current automix group assignment as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = OFF, 1 = X, 2 = Y)
   */
  fetchGroup(): Promise<number>;

  /**
   * Fetch the current automix group assignment as group name
   * @param unit - Must be 'groupName' to get group name string
   * @returns Promise that resolves to group name string ('OFF', 'X', 'Y')
   */
  fetchGroup(unit: 'groupName'): Promise<AutomixGroup>;

  /**
   * Update the automix group assignment using raw OSC value
   * @param value - The group value as raw OSC integer (0 = OFF, 1 = X, 2 = Y)
   * @returns Promise that resolves when the update is complete
   */
  updateGroup(value: number): Promise<void>;

  /**
   * Update the automix group assignment using group name
   * @param value - The group name string ('OFF', 'X', 'Y')
   * @param unit - Must be 'groupName' when using group name string
   * @returns Promise that resolves when the update is complete
   */
  updateGroup(value: AutomixGroup, unit: 'groupName'): Promise<void>;

  /**
   * Fetch the current automix weight as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   */
  fetchWeight(): Promise<number>;

  /**
   * Fetch the current automix weight in decibels
   * @param unit - Must be 'decibels' to get weight in dB
   * @returns Promise that resolves to decibel value (-12 to +12dB)
   */
  fetchWeight(unit: 'decibels'): Promise<number>;

  /**
   * Update the automix weight using raw OSC value
   * @param value - The weight value as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   */
  updateWeight(value: number): Promise<void>;

  /**
   * Update the automix weight using decibels
   * @param value - The weight value in decibels (-12 to +12dB)
   * @param unit - Must be 'decibels' when using dB values
   * @returns Promise that resolves when the update is complete
   */
  updateWeight(value: number, unit: 'decibels'): Promise<void>;
};

export type ChannelAutomixDependencies = {
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
