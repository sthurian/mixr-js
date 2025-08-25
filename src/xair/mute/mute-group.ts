import { OSCClient } from '../../osc/client.js';
import { integerOscParameterConfig } from '../mapper/single-integer.js';
import { createOSCParameterFactory } from '../osc-parameter.js';

export type MuteGroupNumber = 1 | 2 | 3 | 4;

export type MuteGroup = {
  /**
   * Checks if the channel is assigned to the specified mute group.
   *
   * Mute groups allow you to mute multiple channels simultaneously with a single
   * mute group button. This method checks if the current channel is assigned to
   * and will be affected by the specified mute group.
   *
   * @param muteGroupNumber - The mute group number to check (1, 2, 3, or 4).
   * @returns Promise resolving to true if the channel is assigned to the mute group, false otherwise.
   *
   * @example
   * ```typescript
   * // Check if channel is assigned to mute group 1
   * const isInMuteGroup1 = await channel.getMuteGroup().isEnabled(1);
   *
   * if (isInMuteGroup1) {
   *   console.log('Channel will be muted when mute group 1 is activated');
   * }
   * ```
   */
  isEnabled: (muteGroupNumber: MuteGroupNumber) => Promise<boolean>;

  /**
   * Assigns the channel to the specified mute group.
   *
   * When a channel is assigned to a mute group, activating that mute group's
   * button will mute this channel along with all other channels assigned to
   * the same group. This is useful for quickly muting related channels like
   * all drum mics, all vocal mics, or an entire band.
   *
   * @param muteGroupNumber - The mute group number to assign to (1, 2, 3, or 4).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Assign channel to mute group 2
   * await channel.getMuteGroup().updateEnabled(2);
   *
   * // Now this channel will be muted when mute group 2 is activated
   * ```
   */
  updateEnabled: (muteGroupNumber: MuteGroupNumber) => Promise<void>;

  /**
   * Removes the channel from the specified mute group.
   *
   * After removing a channel from a mute group, activating that mute group's
   * button will no longer affect this channel's mute status. The channel will
   * only be controlled by its individual mute button.
   *
   * @param muteGroupNumber - The mute group number to remove from (1, 2, 3, or 4).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Remove channel from mute group 3
   * await channel.getMuteGroup().updateDisabled(3);
   *
   * // Channel will no longer be affected by mute group 3
   * ```
   */
  updateDisabled: (muteGroupNumber: MuteGroupNumber) => Promise<void>;
};

type MuteGroupDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createMuteGroup = (dependencies: MuteGroupDependencies): MuteGroup => {
  const { oscBasePath, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/grp`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const bitmaskEntity = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/mute`,
    integerOscParameterConfig,
  );

  return {
    isEnabled: async (muteGroupNumber) => {
      const bitmask = await bitmaskEntity.fetch('integer');
      const bitPos = muteGroupNumber - 1;
      return (bitmask & (1 << bitPos)) !== 0;
    },
    updateEnabled: async (muteGroupNumber) => {
      const currentBitmask = await bitmaskEntity.fetch('integer');
      const bitPos = muteGroupNumber - 1;
      const newBitmask = currentBitmask | (1 << bitPos);
      if (newBitmask !== currentBitmask) {
        await bitmaskEntity.update(newBitmask, 'integer');
      }
    },
    updateDisabled: async (muteGroupNumber) => {
      const currentBitmask = await bitmaskEntity.fetch('integer');
      const bitPos = muteGroupNumber - 1;
      const newBitmask = currentBitmask & ~(1 << bitPos);
      if (newBitmask !== currentBitmask) {
        await bitmaskEntity.update(newBitmask, 'integer');
      }
    },
  };
};
