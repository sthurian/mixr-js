import { Compressor } from '../dynamics/compressor/compressor.js';
import { ChannelAutomix, ChannelAutomixDependencies } from './automix/automix.js';
import { ChannelConfig, ChannelConfigDependencies } from './config/config.js';
import { Equalizer, EqualizerDependencies } from '../equalizer/equalizer.js';
import { ChannelGate, ChannelGateDependencies } from './dynamics/gate/gate.js';
import { Insert, InsertDependencies } from '../insert/insert.js';
import { ChannelSendBusLabel } from './sends/mapper/send-bus.js';
import { ChannelFxSend, ChannelFxSendDependencies } from './sends/fx-send.js';
import { ChannelFxSendLabel } from './sends/mapper/fx-send.js';
import { ChannelSendBus, ChannelSendBusDependencies } from './sends/send-bus.js';
import { DCAGroup, DCAGroupDependencies } from '../dca/dca-group.js';
import { MuteGroup, MuteGroupDependencies } from '../mute/mute-group.js';
import { Mix, MixDependencies } from '../mix/mix.js';
import { ChannelPreamp, ChannelPreampDependencies } from './preamp/preamp.js';
import { OSCClient } from '../../osc/client.js';
import { DynamicsFilter, DynamicsFilterDependencies } from '../dynamics/filter/filter.js';
import { EqualizerBand, EqualizerBandDependencies } from '../equalizer/band/eq-band.js';
import {
  ChannelCompressor,
  ChannelCompressorDependencies,
} from './dynamics/compressor/compressor.js';

export type Channel = {
  getConfig(): ChannelConfig;
  getAutomix(): ChannelAutomix;
  getCompressor(): Compressor;
  getEqualizer(): Equalizer;
  getGate(): ChannelGate;
  getInsert(): Insert;
  getSendBus(send: ChannelSendBusLabel): ChannelSendBus;
  getSendFx(fx: ChannelFxSendLabel): ChannelFxSend;
  getDCAGroup(): DCAGroup;
  getMuteGroup(): MuteGroup;
  getMix(): Mix;
  getPreAmp(): ChannelPreamp;
};

export type ChannelDependencies = {
  channel: number;
  oscClient: OSCClient;
  createChannelConfig: (dependencies: ChannelConfigDependencies) => ChannelConfig;
  createChannelCompressor: (dependencies: ChannelCompressorDependencies) => ChannelCompressor;
  createDynamicsFilter: (dependencies: DynamicsFilterDependencies) => DynamicsFilter;
  createEqualizerBand: (dependencies: EqualizerBandDependencies) => EqualizerBand;
  createChannelAutomix: (dependencies: ChannelAutomixDependencies) => ChannelAutomix;
  createEqualizer: (dependencies: EqualizerDependencies) => Equalizer;
  createChannelGate: (dependencies: ChannelGateDependencies) => ChannelGate;
  createInsert: (dependencies: InsertDependencies) => Insert;
  createDCAGroup: (dependencies: DCAGroupDependencies) => DCAGroup;
  createMuteGroup: (dependencies: MuteGroupDependencies) => MuteGroup;
  createMix: (dependencies: MixDependencies) => Mix;
  createChannelPreamp: (dependencies: ChannelPreampDependencies) => ChannelPreamp;
  createChannelFxSend: (dependencies: ChannelFxSendDependencies) => ChannelFxSend;
  createChannelSendBus: (dependencies: ChannelSendBusDependencies) => ChannelSendBus;
};

export const createChannel = (dependencies: ChannelDependencies): Channel => {
  const {
    channel,
    oscClient,
    createDynamicsFilter,
    createEqualizerBand,
    createChannelCompressor,
    createChannelConfig,
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
  } = dependencies;
  const oscBasePath = `/ch/${channel.toString().padStart(2, '0')}`;
  const config = createChannelConfig({ channel, oscClient });
  const compressor = createChannelCompressor({ channel, oscClient, createDynamicsFilter });
  const automix = createChannelAutomix({ channel, oscClient });
  const equalizer = createEqualizer({ oscBasePath, oscClient, createEqualizerBand });
  const gate = createChannelGate({ channel, oscClient, createDynamicsFilter });
  const insert = createInsert({ oscBasePath, oscClient });
  const dcaGroup = createDCAGroup({ oscBasePath, oscClient });
  const muteGroup = createMuteGroup({ oscBasePath, oscClient });
  const mix = createMix({ oscBasePath, oscClient });
  const preamp = createChannelPreamp({ channel, oscClient });
  return {
    getConfig: () => config,
    getCompressor: () => compressor,
    getAutomix: () => automix,
    getEqualizer: () => equalizer,
    getGate: () => gate,
    getInsert: () => insert,
    getSendBus: (sendBus: ChannelSendBusLabel) =>
      createChannelSendBus({ channel, oscClient, sendBus }),
    getSendFx: (fx: ChannelFxSendLabel) => createChannelFxSend({ channel, oscClient, fx }),
    getDCAGroup: () => dcaGroup,
    getMuteGroup: () => muteGroup,
    getMix: () => mix,
    getPreAmp: () => preamp,
  };
};
