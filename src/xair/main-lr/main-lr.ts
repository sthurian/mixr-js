import { OSCClient } from '../../osc/client.js';
import { Config, ConfigDependencies } from '../config/config.js';
import { Compressor, CompressorDependencies } from '../dynamics/compressor/compressor.js';
import { DynamicsFilter, DynamicsFilterDependencies } from '../dynamics/filter/filter.js';
import { EqualizerBand, EqualizerBandDependencies } from '../equalizer/band/eq-band.js';
import { Equalizer, EqualizerDependencies } from '../equalizer/equalizer.js';
import { Insert, InsertDependencies } from '../insert/insert.js';
import { LRMix, LRMixDependencies } from '../mix/lr-mix.js';
import { MainLREqualizer, MainLREqualizerDependencies } from './equalizer/equalizer.js';

export type MainLR = {
  getMix: () => LRMix;
  getConfig: () => Config;
  getCompressor: () => Compressor;
  getEqualizer: () => MainLREqualizer;
};

export type MainLRDependencies = {
  oscClient: OSCClient;
  createConfig: (dependencies: ConfigDependencies) => Config;
  createLRMix: (dependencies: LRMixDependencies) => LRMix;
  createInsert: (dependencies: InsertDependencies) => Insert;
  createDynamicsFilter: (dependencies: DynamicsFilterDependencies) => DynamicsFilter;
  createCompressor: (dependencies: CompressorDependencies) => Compressor;
  createMainLREqualizer: (dependencies: MainLREqualizerDependencies) => MainLREqualizer;
  createEqualizer: <T extends 6>(dependencies: EqualizerDependencies<T>) => Equalizer<T>;
  createEqualizerBand: (dependencies: EqualizerBandDependencies) => EqualizerBand;
};

export const createMainLR = (dependencies: MainLRDependencies): MainLR => {
  const {
    oscClient,
    createConfig,
    createLRMix,
    createCompressor,
    createDynamicsFilter,
    createMainLREqualizer,
    createEqualizer,
    createEqualizerBand,
  } = dependencies;
  const oscBasePath = '/lr';
  const lrMix = createLRMix({ oscClient, oscBasePath });
  const config = createConfig({ oscClient, oscBasePath });
  const compressor = createCompressor({ oscClient, oscBasePath, createDynamicsFilter });
  const eq = createMainLREqualizer({
    createEqualizer,
    createEqualizerBand,
    oscClient,
  });
  return {
    getMix: () => lrMix,
    getConfig: () => config,
    getCompressor: () => compressor,
    getEqualizer: () => eq,
  };
};
