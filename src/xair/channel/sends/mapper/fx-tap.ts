import { createLiteralParameterConfig } from '../../../mapper/literal.js';

const fxSendTapMap = ['IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST'] as const;

export type FxSendTap = (typeof fxSendTapMap)[number];
export const fxSendTapParameterConfig = createLiteralParameterConfig<'tap', FxSendTap>(
  fxSendTapMap,
);
