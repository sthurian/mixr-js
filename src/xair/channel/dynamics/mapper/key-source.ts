import { createLiteralParameterConfig } from '../../../mapper/literal.js';

const dynamicsKeySourceMap = [
  'SELF',
  'CH01',
  'CH02',
  'CH03',
  'CH04',
  'CH05',
  'CH06',
  'CH07',
  'CH08',
  'CH09',
  'CH10',
  'CH11',
  'CH12',
  'CH13',
  'CH14',
  'CH15',
  'CH16',
  'BUS01',
  'BUS02',
  'BUS03',
  'BUS04',
  'BUS05',
  'BUS06',
] as const;

export type DynamicsKeySource = (typeof dynamicsKeySourceMap)[number];
export const dynamicsKeySourceParameterConfig = createLiteralParameterConfig<
  'keySource',
  DynamicsKeySource
>(dynamicsKeySourceMap);
