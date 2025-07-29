import { createLiteralParameterConfig } from '../../../mapper/literal.js';

const channelAnalogInputSourceMap = [
  'INP 01',
  'INP 02',
  'INP 03',
  'INP 04',
  'INP 05',
  'INP 06',
  'INP 07',
  'INP 08',
  'INP 09',
  'INP 10',
  'INP 11',
  'INP 12',
  'INP 13',
  'INP 14',
  'INP 15',
  'INP 16',
  'LINE 17',
  'LINE 18',
  'OFF',
] as const;

export type ChannelAnalogInputSource = (typeof channelAnalogInputSourceMap)[number];

export const channelAnalogInputSourceParameterConfig = createLiteralParameterConfig<
  'inputSource',
  ChannelAnalogInputSource
>(channelAnalogInputSourceMap);
