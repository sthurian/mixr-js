import { createLiteralMapper } from '../../mapper/literal.js';

const insertFxSlotMap = [
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

export type InsertFxSlot = (typeof insertFxSlotMap)[number];

export const insertFxSlotMapper = createLiteralMapper(insertFxSlotMap);
