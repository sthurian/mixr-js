import { OSCClient } from '../../../osc/client.js';
import { Compressor, createCompressor } from '../../dynamics/compressor/compressor.js';
import { DynamicsFilter, DynamicsFilterDependencies } from '../../dynamics/filter/filter.js';
import { Insert, InsertDependencies } from '../../insert/insert.js';

export type MainLRCompressor = Compressor & {
  getInsert(): Insert;
};

export type MainLRCompressorDependencies = {
  oscClient: OSCClient;
  createInsert: (dependencies: InsertDependencies) => Insert;
  createDynamicsFilter: (dependencies: DynamicsFilterDependencies) => DynamicsFilter;
};

export const createMainLRCompressor = (
  dependencies: MainLRCompressorDependencies,
): MainLRCompressor => {
  const { oscClient, createInsert, createDynamicsFilter } = dependencies;
  const oscBasePath = `/lr`;
  const compressor = createCompressor({ oscBasePath, oscClient, createDynamicsFilter });
  const insert = createInsert({ oscBasePath: `${oscBasePath}/dyn`, oscClient });
  return {
    ...compressor,
    getInsert: () => insert,
  };
};
