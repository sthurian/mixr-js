import { Compressor } from '../dynamics/compressor/compressor.js';
import { ChannelAutomix, ChannelAutomixDependencies } from './automix/automix.js';
import { ChannelConfig, ChannelConfigDependencies } from './config/config.js';
import { Equalizer, EqualizerDependencies } from '../equalizer/equalizer.js';
import { ChannelGate, ChannelGateDependencies } from './dynamics/gate/gate.js';
import { Insert, InsertDependencies } from '../insert/insert.js';
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
import { MixerModel, MixerModelMap } from '../models.js';

export type Channel<M extends MixerModel> = {
  getConfig(): ChannelConfig<M>;
  getAutomix(): ChannelAutomix;
  getCompressor(): Compressor;
  getEqualizer(): Equalizer<4>;
  getGate(): ChannelGate;
  getInsert(): Insert;
  getSendBus(send: MixerModelMap[M]['bus']): ChannelSendBus;
  getSendFx(fx: ChannelFxSendLabel): ChannelFxSend;
  getDCAGroup(): DCAGroup;
  getMuteGroup(): MuteGroup;
  getMix(): Mix;
  getPreAmp(): ChannelPreamp<M>;
};

export type ChannelDependencies<M extends MixerModel> = {
  channel: number;
  oscClient: OSCClient;
  model: M;
  createChannelConfig: (dependencies: ChannelConfigDependencies<M>) => ChannelConfig<M>;
  createChannelCompressor: (dependencies: ChannelCompressorDependencies) => ChannelCompressor;
  createDynamicsFilter: (dependencies: DynamicsFilterDependencies) => DynamicsFilter;
  createEqualizerBand: (dependencies: EqualizerBandDependencies) => EqualizerBand;
  createChannelAutomix: (dependencies: ChannelAutomixDependencies) => ChannelAutomix;
  createEqualizer: <T extends 4>(dependencies: EqualizerDependencies<T>) => Equalizer<T>;
  createChannelGate: (dependencies: ChannelGateDependencies) => ChannelGate;
  createInsert: (dependencies: InsertDependencies) => Insert;
  createDCAGroup: (dependencies: DCAGroupDependencies) => DCAGroup;
  createMuteGroup: (dependencies: MuteGroupDependencies) => MuteGroup;
  createMix: (dependencies: MixDependencies) => Mix;
  createChannelPreamp: (dependencies: ChannelPreampDependencies<M>) => ChannelPreamp<M>;
  createChannelFxSend: (dependencies: ChannelFxSendDependencies) => ChannelFxSend;
  createChannelSendBus: (dependencies: ChannelSendBusDependencies) => ChannelSendBus;
};

export const createChannel = <M extends MixerModel>(
  dependencies: ChannelDependencies<M>,
): Channel<M> => {
  const {
    channel,
    oscClient,
    model,
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
  const config = createChannelConfig({ channel, oscClient, model });
  const compressor = createChannelCompressor({ oscBasePath, oscClient, createDynamicsFilter });
  const automix = createChannelAutomix({ channel, oscClient });
  const equalizer = createEqualizer({
    oscBasePath,
    numberOfBands: 4,
    oscClient,
    createEqualizerBand,
  });
  const gate = createChannelGate({ channel, oscClient, createDynamicsFilter });
  const insert = createInsert({ oscBasePath, oscClient });
  const dcaGroup = createDCAGroup({ oscBasePath, oscClient });
  const muteGroup = createMuteGroup({ oscBasePath, oscClient });
  const mix = createMix({ oscBasePath, oscClient });
  const preamp = createChannelPreamp({ channel, oscClient, model });
  return {
    getConfig: () => config,
    getCompressor: () => compressor,
    getAutomix: () => automix,
    getEqualizer: () => equalizer,
    getGate: () => gate,
    getInsert: () => insert,
    getSendBus: (sendBus: MixerModelMap[M]['bus']) =>
      createChannelSendBus({ channel, oscClient, sendBus }),
    getSendFx: (fx: ChannelFxSendLabel) => createChannelFxSend({ channel, oscClient, fx }),
    getDCAGroup: () => dcaGroup,
    getMuteGroup: () => muteGroup,
    getMix: () => mix,
    getPreAmp: () => preamp,
  };
};
