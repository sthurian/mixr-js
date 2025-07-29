import { createLiteralParameterConfig } from '../../../mapper/literal.js';

const channelUsbReturnSourceMap = [
  'USB 01',
  'USB 02',
  'USB 03',
  'USB 04',
  'USB 05',
  'USB 06',
  'USB 07',
  'USB 08',
  'USB 09',
  'USB 10',
  'USB 11',
  'USB 12',
  'USB 13',
  'USB 14',
  'USB 15',
  'USB 16',
  'USB 17',
  'USB 18',
] as const;

export type ChannelUsbReturnSource = (typeof channelUsbReturnSourceMap)[number];

export const channelUsbReturnSourceParameterConfig = createLiteralParameterConfig<
  'usbReturnSource',
  ChannelUsbReturnSource
>(channelUsbReturnSourceMap);
