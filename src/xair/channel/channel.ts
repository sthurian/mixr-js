import { ChannelCompressor, createChannelCompressor } from './dynamics/compressor/compressor.js';
import { ChannelAutomix, createChannelAutomix } from './automix/automix.js';
import { ChannelConfig, createChannelConfig } from './config/config.js';
import { ChannelEqualizer, createChannelEqualizer } from './equalizer/equalizer.js';
import { ChannelGate, createChannelGate } from './dynamics/gate/gate.js';
import { createInsert, Insert } from '../insert/insert.js';
import { ChannelSendBusLabel } from './sends/mapper/send-bus.js';
import { ChannelFxSend, createChannelFxSend } from './sends/fx-send.js';
import { ChannelFxSendLabel } from './sends/mapper/fx-send.js';
import { ChannelSendBus, createChannelSendBus } from './sends/send-bus.js';
import { createDCAGroup, DCAGroup } from '../dca/dca-group.js';
import { createMuteGroup, MuteGroup } from '../mute/mute-group.js';
import { createMix, Mix } from '../mix/mix.js';
import { ChannelPreamp, createChannelPreamp } from './preamp/preamp.js';
import { OSCClient } from '../../osc/client.js';

export type Channel = {
  getConfig(): ChannelConfig;
  getAutomix(): ChannelAutomix;
  getCompressor(): ChannelCompressor;
  getEqualizer(): ChannelEqualizer;
  getGate(): ChannelGate;
  getInsert(): Insert;
  getSendBus(send: ChannelSendBusLabel): ChannelSendBus;
  getSendFx(fx: ChannelFxSendLabel): ChannelFxSend;
  getDCAGroup(): DCAGroup;
  getMuteGroup(): MuteGroup;
  getMix(): Mix;
  getPreAmp(): ChannelPreamp;
};

type ChannelDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannel = (dependencies: ChannelDependencies): Channel => {
  const { channel, oscClient } = dependencies;
  const oscBasePath = `/ch/${channel.toString().padStart(2, '0')}`;
  const config = createChannelConfig({ channel, oscClient });
  const compressor = createChannelCompressor(dependencies);
  const automix = createChannelAutomix({ channel, oscClient });
  const equalizer = createChannelEqualizer(dependencies);
  const gate = createChannelGate(dependencies);
  const insert = createInsert({ oscBasePath, oscClient });
  const dcaGroup = createDCAGroup({ oscBasePath, oscClient });
  const muteGroup = createMuteGroup({ oscBasePath, oscClient });
  const mix = createMix({ oscBasePath, oscClient });
  const preamp = createChannelPreamp(dependencies);
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
