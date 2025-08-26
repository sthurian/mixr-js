import { createLiteralParameterConfig } from '../../../mapper/literal.js';

const compressorDetectionModeMap = ['PEAK', 'RMS'] as const;

export type CompressorDetectionMode = (typeof compressorDetectionModeMap)[number];
export const compressorDetectionModeParameterConfig = createLiteralParameterConfig<
  'detectionMode',
  CompressorDetectionMode
>(compressorDetectionModeMap);
