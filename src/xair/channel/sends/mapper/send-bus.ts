export const sendBusLabelMap = ['Bus1', 'Bus2', 'Bus3', 'Bus4', 'Bus5', 'Bus6'] as const;

export type ChannelSendBusLabel = (typeof sendBusLabelMap)[number];

export const mapChannelSendBusLabelToNumber = (channelSend: ChannelSendBusLabel): number => {
  return sendBusLabelMap.indexOf(channelSend) + 1;
};
