import { OSCClient } from '../../osc/client.js';
import {
  ChannelCompressor,
  ChannelCompressorDependencies,
} from '../channel/dynamics/compressor/compressor.js';
import { Config, ConfigDependencies } from '../config/config.js';
import { DCAGroup, DCAGroupDependencies } from '../dca/dca-group.js';
import { DynamicsFilter, DynamicsFilterDependencies } from '../dynamics/filter/filter.js';
import { EqualizerBand, EqualizerBandDependencies } from '../equalizer/band/eq-band.js';
import { Equalizer, EqualizerDependencies } from '../equalizer/equalizer.js';
import { Insert, InsertDependencies } from '../insert/insert.js';
import { Mix, MixDependencies } from '../mix/mix.js';
import { MuteGroup, MuteGroupDependencies } from '../mute/mute-group.js';

export type Bus = {
  getConfig(): Config;
  getCompressor(): ChannelCompressor;
  getEqualizer(): Equalizer<6>;
  getDCAGroup(): DCAGroup;
  getMuteGroup(): MuteGroup;
  getInsert(): Insert;
  getMix(): Mix;
};

export type BusDependencies = {
  bus: number;
  oscClient: OSCClient;
  createConfig: (dependencies: ConfigDependencies) => Config;
  createChannelCompressor: (dependencies: ChannelCompressorDependencies) => ChannelCompressor;
  createDynamicsFilter: (dependencies: DynamicsFilterDependencies) => DynamicsFilter;
  createEqualizer: <T extends 6>(dependencies: EqualizerDependencies<T>) => Equalizer<T>;
  createEqualizerBand: (dependencies: EqualizerBandDependencies) => EqualizerBand;
  createDCAGroup: (dependencies: DCAGroupDependencies) => DCAGroup;
  createMuteGroup: (dependencies: MuteGroupDependencies) => MuteGroup;
  createInsert: (dependencies: InsertDependencies) => Insert;
  createMix: (dependencies: MixDependencies) => Mix;
};

export const createBus = (dependencies: BusDependencies): Bus => {
  const {
    bus,
    oscClient,
    createConfig,
    createChannelCompressor,
    createDynamicsFilter,
    createEqualizer,
    createEqualizerBand,
    createDCAGroup,
    createMuteGroup,
    createInsert,
    createMix,
  } = dependencies;
  const oscBasePath = `/bus/${bus.toString()}`;
  const config = createConfig({ oscBasePath, oscClient });
  const compressor = createChannelCompressor({ oscBasePath, oscClient, createDynamicsFilter });
  const equalizer = createEqualizer({
    createEqualizerBand,
    numberOfBands: 6,
    oscBasePath,
    oscClient,
  });
  const dcaGroup = createDCAGroup({ oscBasePath, oscClient });
  const muteGroup = createMuteGroup({ oscBasePath, oscClient });
  const insert = createInsert({ oscBasePath, oscClient });
  const mix = createMix({ oscBasePath, oscClient });
  return {
    getConfig: () => config,
    getCompressor: () => compressor,
    getEqualizer: () => equalizer,
    getDCAGroup: () => dcaGroup,
    getMuteGroup: () => muteGroup,
    getInsert: () => insert,
    getMix: () => mix,
  };
};
