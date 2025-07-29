import { createLiteralParameterConfig } from '../../../../mapper/literal.js';

const gateModeMap = ['EXP2', 'EXP3', 'EXP4', 'GATE', 'DUCK'] as const;

export type GateMode = (typeof gateModeMap)[number];
export const gateModeParameterConfig = createLiteralParameterConfig<'mode', GateMode>(gateModeMap);
