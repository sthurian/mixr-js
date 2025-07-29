export const busSendLabelMap = ['Bus1', 'Bus2', 'Bus3', 'Bus4', 'Bus5', 'Bus6'] as const;

export type ChannelBusSendLabel = (typeof busSendLabelMap)[number];

export const mapChannelBusSendLabelToNumber = (channelSend: ChannelBusSendLabel): number => {
  return busSendLabelMap.indexOf(channelSend) + 1;
};
