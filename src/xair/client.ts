import { createOSCClient } from '../osc/client.js';
import { createOSCSocket } from '../osc/socket.js';
import { MixerConnectionInformation } from './mixer-discoverer.js';
import { createMixer, Mixer } from './mixer.js';
import { createSocket } from 'node:dgram';
import { fromBuffer, toBuffer } from 'osc-min';
import { MixerModel } from './models.js';
import { createChannelConfig } from './channel/config/config.js';
import { createChannelAutomix } from './channel/automix/automix.js';
import { createChannelCompressor } from './channel/dynamics/compressor/compressor.js';
import { createDynamicsFilter } from './dynamics/filter/filter.js';
import { createEqualizerBand } from './equalizer/band/eq-band.js';
import { createEqualizer } from './equalizer/equalizer.js';
import { createChannelGate } from './channel/dynamics/gate/gate.js';
import { createInsert } from './insert/insert.js';
import { createDCAGroup } from './dca/dca-group.js';
import { createMuteGroup } from './mute/mute-group.js';
import { createMix } from './mix/mix.js';
import { createChannelPreamp } from './channel/preamp/preamp.js';
import { createChannelFxSend } from './channel/sends/fx-send.js';
import { createChannelSendBus } from './channel/sends/send-bus.js';
import { createConfig } from './config/config.js';
import { createLRMix } from './mix/lr-mix.js';
import { createChannel } from './channel/channel.js';
import { createMainLR } from './main-lr/main-lr.js';
import { createMainLREqualizer } from './main-lr/equalizer/equalizer.js';
import { createBus } from './bus/bus.js';
import { createCompressor } from './dynamics/compressor/compressor.js';
export const connectToMixer = async <M extends MixerModel>(
  options: MixerConnectionInformation & { model: M },
): Promise<Mixer<M>> => {
  const { mixerPort = 10024, mixerAddress } = options;
  const oscSocket = await createOSCSocket({
    socket: createSocket({ type: 'udp4', reuseAddr: true }),
    fromBuffer,
    toBuffer,
  });
  const oscClient = createOSCClient({
    oscSocket,
    address: mixerAddress,
    port: mixerPort,
  });

  return createMixer<M>({
    oscClient,
    createChannel,
    createChannelConfig,
    createChannelAutomix,
    createChannelCompressor,
    createDynamicsFilter,
    createEqualizerBand,
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
    createCompressor,
    createMainLREqualizer,
    createBus,
  });
};
