import { createLiteralParameterConfig } from '../../../mapper/literal.js';

const compressorRatioMap = [
  '1.1',
  '1.3',
  '1.5',
  '2.0',
  '2.5',
  '3.0',
  '4.0',
  '5.0',
  '7.0',
  '10',
  '20',
  '100',
] as const;

export type CompressorRatio = (typeof compressorRatioMap)[number];
export const compressorRatioParameterConfig = createLiteralParameterConfig<
  'ratio',
  CompressorRatio
>(compressorRatioMap);
