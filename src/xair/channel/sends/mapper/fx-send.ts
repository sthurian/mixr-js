import { sendBusLabelMap } from './send-bus.js';

const fxSendLabelMap = ['FX1', 'FX2', 'FX3', 'FX4'] as const;

export type ChannelFxSendLabel = (typeof fxSendLabelMap)[number];

export const mapChannelFxSendLabelToNumber = (channelSend: ChannelFxSendLabel): number => {
  return fxSendLabelMap.indexOf(channelSend) + sendBusLabelMap.length + 1;
};
