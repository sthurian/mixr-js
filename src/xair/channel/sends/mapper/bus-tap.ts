import { createLiteralMapper } from '../../../mapper/literal.js';

const busSendTapMap = ['IN', 'PREEQ', 'POSTEQ', 'PRE', 'POST', 'GRP'] as const;

export type BusSendTap = (typeof busSendTapMap)[number];

export const busSendTapMapper = createLiteralMapper(busSendTapMap);
