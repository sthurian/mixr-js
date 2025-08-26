import { OSCClient } from '../../osc/client.js';
import { integerOscParameterConfig } from '../mapper/single-integer.js';
import { createOSCParameterFactory } from '../osc-parameter.js';

type DCAGroupNumber = 1 | 2 | 3 | 4;

export type DCAGroup = {
  /**
   * Checks if the channel is assigned to the specified DCA group.
   *
   * DCA (Digitally Controlled Amplifier) groups allow you to control multiple channels' levels
   * simultaneously using a single DCA fader. This method checks if the current channel is
   * assigned to and will be controlled by the specified DCA group.
   *
   * @param dcaGroupNumber - The DCA group number to check (1, 2, 3, or 4).
   * @returns Promise resolving to true if the channel is assigned to the DCA group, false otherwise.
   *
   * @example
   * ```typescript
   * // Check if channel is assigned to DCA group 1
   * const isInDCA1 = await channel.getDCAGroup().isEnabled(1);
   *
   * if (isInDCA1) {
   *   console.log('Channel is controlled by DCA group 1');
   * }
   * ```
   */
  isEnabled: (dcaGroupNumber: DCAGroupNumber) => Promise<boolean>;

  /**
   * Assigns the channel to the specified DCA group.
   *
   * When a channel is assigned to a DCA group, moving the DCA group's fader will
   * proportionally affect the channel's output level. Multiple channels can be
   * assigned to the same DCA group for simultaneous level control.
   *
   * @param dcaGroupNumber - The DCA group number to assign to (1, 2, 3, or 4).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Assign channel to DCA group 2
   * await channel.getDCAGroup().updateEnabled(2);
   *
   * // Now this channel's level will be affected by DCA group 2's fader
   * ```
   */
  updateEnabled: (dcaGroupNumber: DCAGroupNumber) => Promise<void>;

  /**
   * Removes the channel from the specified DCA group.
   *
   * After removing a channel from a DCA group, the DCA group's fader will no longer
   * affect this channel's output level. The channel will only be controlled by its
   * individual fader.
   *
   * @param dcaGroupNumber - The DCA group number to remove from (1, 2, 3, or 4).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Remove channel from DCA group 3
   * await channel.getDCAGroup().updateDisabled(3);
   *
   * // Channel is no longer controlled by DCA group 3's fader
   * ```
   */
  updateDisabled: (dcaGroupNumber: DCAGroupNumber) => Promise<void>;
};

export type DCAGroupDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createDCAGroup = (dependencies: DCAGroupDependencies): DCAGroup => {
  const { oscBasePath, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/grp`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const bitmaskEntity = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/dca`,
    integerOscParameterConfig,
  );

  return {
    isEnabled: async (dcaGroupNumber) => {
      const bitmask = await bitmaskEntity.fetch('integer');
      const bitPos = dcaGroupNumber - 1;
      return (bitmask & (1 << bitPos)) !== 0;
    },
    updateEnabled: async (dcaGroupNumber) => {
      const currentBitmask = await bitmaskEntity.fetch('integer');
      const bitPos = dcaGroupNumber - 1;
      const newBitmask = currentBitmask | (1 << bitPos);
      if (newBitmask !== currentBitmask) {
        await bitmaskEntity.update(newBitmask, 'integer');
      }
    },
    updateDisabled: async (dcaGroupNumber) => {
      const currentBitmask = await bitmaskEntity.fetch('integer');
      const bitPos = dcaGroupNumber - 1;
      const newBitmask = currentBitmask & ~(1 << bitPos);
      if (newBitmask !== currentBitmask) {
        await bitmaskEntity.update(newBitmask, 'integer');
      }
    },
  };
};
