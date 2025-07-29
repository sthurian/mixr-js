import { createLiteralParameterConfig } from '../../../../mapper/literal.js';

const eqBandType = ['LCut', 'LShv', 'PEQ', 'VEQ', 'HShv', 'HCut'] as const;

export type EqBandType = (typeof eqBandType)[number];
export const eqBandTypeParameterConfig = createLiteralParameterConfig<'type', EqBandType>(
  eqBandType,
);
