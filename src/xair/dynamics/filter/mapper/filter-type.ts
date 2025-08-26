import { createLiteralParameterConfig } from '../../../mapper/literal.js';

const compressorFilterTypeMap = [
  'LC6',
  'LC12',
  'HC6',
  'HC12',
  '1.0',
  '2.0',
  '3.0',
  '5.0',
  '10.0',
] as const;

export type CompressorFilterType = (typeof compressorFilterTypeMap)[number];
export const compressorFilterTypeParameterConfig = createLiteralParameterConfig<
  'filterType',
  CompressorFilterType
>(compressorFilterTypeMap);
