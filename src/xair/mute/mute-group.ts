import { OSCClient } from '../../osc/client.js';
import { createEntityFactory } from '../entity.js';
import { singleIntegerMapper } from '../mapper/single-integer.js';

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
  const entityFactory = createEntityFactory(oscClient);
  const bitmaskEntity = entityFactory.createEntity(`${oscBaseAddress}/mute`, singleIntegerMapper);

  return {
    isEnabled: async (muteGroupNumber) => {
      const bitmask = await bitmaskEntity.get();
      const bitPos = muteGroupNumber - 1;
      return (bitmask & (1 << bitPos)) !== 0;
    },
    updateEnabled: async (muteGroupNumber) => {
      const currentBitmask = await bitmaskEntity.get();
      const bitPos = muteGroupNumber - 1;
      const newBitmask = currentBitmask | (1 << bitPos);
      if (newBitmask !== currentBitmask) {
        await bitmaskEntity.set(newBitmask);
      }
    },
    updateDisabled: async (muteGroupNumber) => {
      const currentBitmask = await bitmaskEntity.get();
      const bitPos = muteGroupNumber - 1;
      const newBitmask = currentBitmask & ~(1 << bitPos);
      if (newBitmask !== currentBitmask) {
        await bitmaskEntity.set(newBitmask);
      }
    },
  };
};
