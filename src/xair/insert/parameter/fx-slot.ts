import { createLiteralParameterConfig } from '../../mapper/literal.js';

const insertFxSlotChannelMap = [
  'OFF',
  'Fx1A',
  'Fx1B',
  'Fx2A',
  'Fx2B',
  'Fx3A',
  'Fx3B',
  'Fx4A',
  'Fx4B',
] as const;

export type InsertFxSlot = (typeof insertFxSlotChannelMap)[number];
export const insertFxSlotParameterConfig = createLiteralParameterConfig<'slot', InsertFxSlot>(
  insertFxSlotChannelMap,
);
