import { createLiteralParameterConfig } from '../../../mapper/literal.js';

const eqMode = ['PEQ', 'GEQ', 'TEQ'] as const;

export type EqMode = (typeof eqMode)[number];
export const eqModeParameterConfig = createLiteralParameterConfig<'mode', EqMode>(eqMode);
