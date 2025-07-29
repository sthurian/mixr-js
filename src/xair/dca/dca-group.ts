import { OSCClient } from '../../osc/client.js';
import { integerOscParameterConfig } from '../mapper/single-integer.js';
import { createOSCParameterFactory } from '../osc-parameter.js';

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
