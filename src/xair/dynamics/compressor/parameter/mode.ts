import { createLiteralParameterConfig } from '../../../mapper/literal.js';

const compressorModeMap = ['COMP', 'EXP'] as const;

export type CompressorMode = (typeof compressorModeMap)[number];
export const compressorModeParameterConfig = createLiteralParameterConfig<'mode', CompressorMode>(
  compressorModeMap,
);
