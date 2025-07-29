import { createLiteralMapper } from '../../../mapper/literal.js';

const colorMap = [
  'Black',
  'Red',
  'Green',
  'Yellow',
  'Blue',
  'Magenta',
  'Cyan',
  'White',
  'Black Inv',
  'Red Inv',
  'Green Inv',
  'Yellow Inv',
  'Blue Inv',
  'Magenta Inv',
  'Cyan Inv',
  'White Inv',
] as const;

export type ChannelColor = (typeof colorMap)[number];

export const channelColorMapper = createLiteralMapper(colorMap);
