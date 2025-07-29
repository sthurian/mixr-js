import { createLinearParameterConfig } from '../../../mapper/linear.js';
import { createLiteralParameterConfig } from '../../../mapper/literal.js';

export const automixGroupMap = ['OFF', 'X', 'Y'] as const;
export type AutomixGroup = (typeof automixGroupMap)[number];
export const automixGroupParameterConfig = createLiteralParameterConfig<'groupName', AutomixGroup>(
  automixGroupMap,
);
export const automixWeightParameterConfig = createLinearParameterConfig<'decibels'>(-12, 12);
