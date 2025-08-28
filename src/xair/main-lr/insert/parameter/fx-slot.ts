import { createLiteralParameterConfig } from '../../../mapper/literal.js';

const mainLRInsertFxSlotChannelMap = ['OFF', 'FX1', 'FX2', 'FX3', 'FX4'] as const;

export type MainLRInsertFxSlot = (typeof mainLRInsertFxSlotChannelMap)[number];
export const mainLRInsertFxSlotParameterConfig = createLiteralParameterConfig<
  'slot',
  MainLRInsertFxSlot
>(mainLRInsertFxSlotChannelMap);
