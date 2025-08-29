import { OSCClient } from '../../osc/client.js';
import { Config, ConfigDependencies } from '../config/config.js';
import { Compressor, CompressorDependencies } from '../dynamics/compressor/compressor.js';
import { DynamicsFilter, DynamicsFilterDependencies } from '../dynamics/filter/filter.js';
import { EqualizerBand, EqualizerBandDependencies } from '../equalizer/band/eq-band.js';
import { Equalizer, EqualizerDependencies } from '../equalizer/equalizer.js';
import { LRMix, LRMixDependencies } from '../mix/lr-mix.js';
import { SixBandEqualizer, SixBandEqualizerDependencies } from '../equalizer/six-band-equalizer.js';
import { MainLRInsert, MainLRInsertDependencies } from './insert/insert.js';
import { GraphicEqualizer, GraphicEqualizerDependencies } from '../equalizer/geq.js';

export type MainLR = {
  getMix: () => LRMix;
  getConfig: () => Config;
  getCompressor: () => Compressor;
  getEqualizer: () => SixBandEqualizer;
  getGraphicEqualizer: () => GraphicEqualizer;
  getInsert: () => MainLRInsert;
};

export type MainLRDependencies = {
  oscClient: OSCClient;
  createConfig: (dependencies: ConfigDependencies) => Config;
  createLRMix: (dependencies: LRMixDependencies) => LRMix;
  createMainLRInsert: (dependencies: MainLRInsertDependencies) => MainLRInsert;
  createDynamicsFilter: (dependencies: DynamicsFilterDependencies) => DynamicsFilter;
  createCompressor: (dependencies: CompressorDependencies) => Compressor;
  createSixBandEqualizer: (dependencies: SixBandEqualizerDependencies) => SixBandEqualizer;
  createEqualizer: <T extends 6>(dependencies: EqualizerDependencies<T>) => Equalizer<T>;
  createEqualizerBand: (dependencies: EqualizerBandDependencies) => EqualizerBand;
  createGraphicEqualizer: (dependencies: GraphicEqualizerDependencies) => GraphicEqualizer;
};

export const createMainLR = (dependencies: MainLRDependencies): MainLR => {
  const {
    oscClient,
    createConfig,
    createLRMix,
    createCompressor,
    createDynamicsFilter,
    createSixBandEqualizer,
    createEqualizer,
    createEqualizerBand,
    createMainLRInsert,
    createGraphicEqualizer,
  } = dependencies;
  const oscBasePath = '/lr';
  const lrMix = createLRMix({ oscClient, oscBasePath });
  const config = createConfig({ oscClient, oscBasePath });
  const compressor = createCompressor({ oscClient, oscBasePath, createDynamicsFilter });
  const insert = createMainLRInsert({ oscClient, oscBasePath });
  const eq = createSixBandEqualizer({
    createEqualizer,
    createEqualizerBand,
    oscClient,
  });
  const geq = createGraphicEqualizer({ oscClient, oscBasePath });
  return {
    getMix: () => lrMix,
    getConfig: () => config,
    getCompressor: () => compressor,
    getEqualizer: () => eq,
    getGraphicEqualizer: () => geq,
    getInsert: () => insert,
  };
};
