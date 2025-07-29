import { createLiteralParameterConfig } from '../../../mapper/literal.js';

const sendBusTapMap = ['IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST', 'GRP'] as const;

export type SendBusTap = (typeof sendBusTapMap)[number];
export const sendBusTapParameterConfig = createLiteralParameterConfig<'tap', SendBusTap>(
  sendBusTapMap,
);
