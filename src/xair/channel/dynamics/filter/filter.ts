import { OSCClient } from '../../../../osc/client.js';
import { createEntityFactory } from '../../../entity.js';
import { createLogarithmicMapper } from '../../../mapper/log.js';
import { onOffMapper } from '../../../mapper/on-off.js';
import { CompressorFilterType, compressorFilterTypeMapper } from './mapper/filter-type.js';

export type DynamicsFilter = {
  updateEnabled: (enabled: boolean) => Promise<void>;
  fetchIsEnabled: () => Promise<boolean>;
  updateFrequency: (frequency: number) => Promise<void>;
  fetchFrequency: () => Promise<number>;
  updateType: (type: CompressorFilterType) => Promise<void>;
  fetchType: () => Promise<CompressorFilterType>;
};

type DynamicsFilterDependencies = {
  channel: number;
  oscClient: OSCClient;
  dynamicsType: 'compressor' | 'gate';
};

export const createDynamicsFilter = (dependencies: DynamicsFilterDependencies): DynamicsFilter => {
  const { channel, oscClient, dynamicsType } = dependencies;
  const oscDynamicsPath = dynamicsType === 'compressor' ? 'dyn' : 'gate';
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/${oscDynamicsPath}/filter`;
  const entityFactory = createEntityFactory(oscClient);
  const enabled = entityFactory.createEntity(`${oscBaseAddress}/on`, onOffMapper);
  const frequency = entityFactory.createEntity(
    `${oscBaseAddress}/f`,
    createLogarithmicMapper(20, 20000),
  );
  const type = entityFactory.createEntity(`${oscBaseAddress}/type`, compressorFilterTypeMapper);

  return {
    fetchIsEnabled: enabled.get,
    updateEnabled: enabled.set,
    fetchFrequency: frequency.get,
    updateFrequency: frequency.set,
    fetchType: type.get,
    updateType: type.set,
  };
};
