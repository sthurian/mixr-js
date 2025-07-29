import { createLiteralMapper } from '../../../../mapper/literal.js';

const compressorModeMap = ['COMP', 'EXP'] as const;

export type CompressorMode = (typeof compressorModeMap)[number];

export const compressorModeMapper = createLiteralMapper(compressorModeMap);
