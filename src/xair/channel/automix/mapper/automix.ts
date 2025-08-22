import { createLiteralMapper } from '../../../mapper/literal.js';

export const automixGroupMap = ['OFF', 'X', 'Y'] as const;

export type AutomixGroup = (typeof automixGroupMap)[number];

export const automixGroupMapper = createLiteralMapper(automixGroupMap);