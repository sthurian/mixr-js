import { OSCClient } from '../../osc/client.js';
import { createEntityFactory } from '../entity.js';
import { singleIntegerMapper } from '../mapper/single-integer.js';

export type DCAGroupNumber = 1 | 2 | 3 | 4;

export type DCAGroup = {
  isEnabled: (dcaGroupNumber: DCAGroupNumber) => Promise<boolean>;
  updateEnabled: (dcaGroupNumber: DCAGroupNumber) => Promise<void>;
  updateDisabled: (dcaGroupNumber: DCAGroupNumber) => Promise<void>;
};

type DCAGroupDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createDCAGroup = (dependencies: DCAGroupDependencies): DCAGroup => {
  const { oscBasePath, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/grp`;
  const entityFactory = createEntityFactory(oscClient);
  const bitmaskEntity = entityFactory.createEntity(`${oscBaseAddress}/dca`, singleIntegerMapper);

  return {
    isEnabled: async (dcaGroupNumber) => {
      const bitmask = await bitmaskEntity.get();
      const bitPos = dcaGroupNumber - 1;
      return (bitmask & (1 << bitPos)) !== 0;
    },
    updateEnabled: async (dcaGroupNumber) => {
      const currentBitmask = await bitmaskEntity.get();
      const bitPos = dcaGroupNumber - 1;
      const newBitmask = currentBitmask | (1 << bitPos);
      if (newBitmask !== currentBitmask) {
        await bitmaskEntity.set(newBitmask);
      }
    },
    updateDisabled: async (dcaGroupNumber) => {
      const currentBitmask = await bitmaskEntity.get();
      const bitPos = dcaGroupNumber - 1;
      const newBitmask = currentBitmask & ~(1 << bitPos);
      if (newBitmask !== currentBitmask) {
        await bitmaskEntity.set(newBitmask);
      }
    },
  };
};
