import { OSCClient } from '../../osc/client.js';
import { Config, ConfigDependencies } from '../config/config.js';
import { DynamicsFilter, DynamicsFilterDependencies } from '../dynamics/filter/filter.js';
import { EqualizerBand, EqualizerBandDependencies } from '../equalizer/band/eq-band.js';
import { Equalizer, EqualizerDependencies } from '../equalizer/equalizer.js';
import { Insert, InsertDependencies } from '../insert/insert.js';
import { LRMix, LRMixDependencies } from '../mix/lr-mix.js';
import { MainLRCompressor, MainLRCompressorDependencies } from './compressor/compressor.js';
import { MainLREqualizer, MainLREqualizerDependencies } from './equalizer/equalizer.js';

export type MainLR = {
  getMix: () => LRMix;
  getConfig: () => Config;
  getCompressor: () => MainLRCompressor;
  getEqualizer: () => MainLREqualizer;
};

export type MainLRDependencies = {
  oscClient: OSCClient;
  createConfig: (dependencies: ConfigDependencies) => Config;
  createLRMix: (dependencies: LRMixDependencies) => LRMix;
  createInsert: (dependencies: InsertDependencies) => Insert;
  createDynamicsFilter: (dependencies: DynamicsFilterDependencies) => DynamicsFilter;
  createMainLRCompressor: (dependencies: MainLRCompressorDependencies) => MainLRCompressor;
  createMainLREqualizer: (dependencies: MainLREqualizerDependencies) => MainLREqualizer;
  createEqualizer: (dependencies: EqualizerDependencies) => Equalizer;
  createEqualizerBand: (dependencies: EqualizerBandDependencies) => EqualizerBand;
};

export const createMainLR = (dependencies: MainLRDependencies): MainLR => {
  const {
    oscClient,
    createConfig,
    createLRMix,
    createInsert,
    createMainLRCompressor,
    createDynamicsFilter,
    createMainLREqualizer,
    createEqualizer,
    createEqualizerBand,
  } = dependencies;
  const oscBasePath = '/lr';
  const lrMix = createLRMix({ oscClient, oscBasePath });
  const config = createConfig({ oscClient, oscBasePath });
  const compressor = createMainLRCompressor({ oscClient, createInsert, createDynamicsFilter });
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
