import { OSCClient } from '../../osc/client.js';
import { integerOscParameterConfig } from '../mapper/single-integer.js';
import { createOSCParameterFactory } from '../osc-parameter.js';

export type MuteGroupNumber = 1 | 2 | 3 | 4;

export type MuteGroup = {
  isEnabled: (muteGroupNumber: MuteGroupNumber) => Promise<boolean>;
  updateEnabled: (muteGroupNumber: MuteGroupNumber) => Promise<void>;
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
