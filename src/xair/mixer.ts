import { OSCClient } from '../osc/client.js';
import { Channel, ChannelDependencies } from './channel/channel.js';
import { MainLR, MainLRDependencies } from './main-lr/main-lr.js';
import { LRMix } from './mix/lr-mix.js';
import { MixerModel, MixerModelMap } from './models.js';
import { MainLRCompressor, MainLRCompressorDependencies } from './main-lr/compressor/compressor.js';
import { Config } from './config/config.js';
import { Insert, InsertDependencies } from './insert/insert.js';
import { DynamicsFilter, DynamicsFilterDependencies } from './dynamics/filter/filter.js';
import { EqualizerBand, EqualizerBandDependencies } from './equalizer/band/eq-band.js';
import { ChannelConfig, ChannelConfigDependencies } from './channel/config/config.js';
import {
  ChannelCompressor,
  ChannelCompressorDependencies,
} from './channel/dynamics/compressor/compressor.js';
import { ChannelAutomix, ChannelAutomixDependencies } from './channel/automix/automix.js';
import { Equalizer, EqualizerDependencies } from './equalizer/equalizer.js';
import { ChannelFxSend, ChannelFxSendDependencies } from './channel/sends/fx-send.js';
import { ChannelSendBus, ChannelSendBusDependencies } from './channel/sends/send-bus.js';
import { ChannelGate, ChannelGateDependencies } from './channel/dynamics/gate/gate.js';
import { ChannelPreamp, ChannelPreampDependencies } from './channel/preamp/preamp.js';
import { DCAGroup, DCAGroupDependencies } from './dca/dca-group.js';
import { Mix, MixDependencies } from './mix/mix.js';
import { MuteGroup, MuteGroupDependencies } from './mute/mute-group.js';
import { MainLREqualizer, MainLREqualizerDependencies } from './main-lr/equalizer/equalizer.js';
import { Bus, BusDependencies } from './bus/bus.js';
export type Mixer<M extends MixerModel> = {
  getChannel(channel: MixerModelMap[M]['channel']): Channel;
  getBus(bus: MixerModelMap[M]['bus']): Bus;
  getMainLR(): MainLR;
  closeConnection(): Promise<void>;
};

type MixerDependencies = {
  oscClient: OSCClient;
  createChannel: (dependencies: ChannelDependencies) => Channel;
  createChannelConfig: (dependencies: ChannelConfigDependencies) => ChannelConfig;
  createChannelCompressor: (dependencies: ChannelCompressorDependencies) => ChannelCompressor;
  createDynamicsFilter: (dependencies: DynamicsFilterDependencies) => DynamicsFilter;
  createEqualizerBand: (dependencies: EqualizerBandDependencies) => EqualizerBand;
  createChannelAutomix: (dependencies: ChannelAutomixDependencies) => ChannelAutomix;
  createEqualizer: <T extends 4 | 6>(dependencies: EqualizerDependencies<T>) => Equalizer<T>;
  createChannelGate: (dependencies: ChannelGateDependencies) => ChannelGate;
  createInsert: (dependencies: InsertDependencies) => Insert;
  createDCAGroup: (dependencies: DCAGroupDependencies) => DCAGroup;
  createMuteGroup: (dependencies: MuteGroupDependencies) => MuteGroup;
  createMix: (dependencies: MixDependencies) => Mix;
  createChannelPreamp: (dependencies: ChannelPreampDependencies) => ChannelPreamp;
  createChannelFxSend: (dependencies: ChannelFxSendDependencies) => ChannelFxSend;
  createChannelSendBus: (dependencies: ChannelSendBusDependencies) => ChannelSendBus;
  createConfig: (dependencies: { oscClient: OSCClient; oscBasePath: string }) => Config;
  createMainLR: (dependencies: MainLRDependencies) => MainLR;
  createLRMix: (dependencies: { oscClient: OSCClient; oscBasePath: string }) => LRMix;
  createMainLRCompressor: (dependencies: MainLRCompressorDependencies) => MainLRCompressor;
  createMainLREqualizer: (dependencies: MainLREqualizerDependencies) => MainLREqualizer;
  createBus: (dependencies: BusDependencies) => Bus;
};
export const createMixer = <M extends MixerModel>(dependencies: MixerDependencies): Mixer<M> => {
  const {
    oscClient,
    createChannel,
    createChannelConfig,
    createChannelCompressor,
    createDynamicsFilter,
    createEqualizerBand,
    createChannelAutomix,
    createEqualizer,
    createChannelGate,
    createInsert,
    createDCAGroup,
    createMuteGroup,
    createMix,
    createChannelPreamp,
    createChannelFxSend,
    createChannelSendBus,
    createConfig,
    createMainLR,
    createLRMix,
    createMainLRCompressor,
    createMainLREqualizer,
    createBus,
  } = dependencies;
  return {
    getChannel: (channel: MixerModelMap[M]['channel']): Channel => {
      const channelNumber = parseInt(channel.replace('CH', ''), 10);
      return createChannel({
        channel: channelNumber,
        oscClient,
        createChannelConfig,
        createChannelCompressor,
        createDynamicsFilter,
        createEqualizerBand,
        createChannelAutomix,
        createEqualizer,
        createChannelFxSend,
        createChannelSendBus,
        createChannelGate,
        createChannelPreamp,
        createDCAGroup,
        createInsert,
        createMix,
        createMuteGroup,
      });
    },
    getBus: (bus: MixerModelMap[M]['bus']) => {
      const busNumber = parseInt(bus.replace('Bus', ''), 10);
      return createBus({
        bus: busNumber,
        oscClient,
        createConfig,
        createChannelCompressor,
        createDynamicsFilter,
        createEqualizer,
        createEqualizerBand,
        createDCAGroup,
        createInsert,
        createMix,
        createMuteGroup,
      });
    },
    getMainLR: () => {
      return createMainLR({
        oscClient,
        createConfig,
        createLRMix,
        createInsert,
        createMainLRCompressor,
        createDynamicsFilter,
        createEqualizer,
        createEqualizerBand,
        createMainLREqualizer,
      });
    },
    closeConnection: () => {
      return oscClient.close();
    },
  };
};
