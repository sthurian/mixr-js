import { z } from 'zod';

import { OSCParameterConfig, Unit } from '../osc-parameter.js';
export const onOffParameterConfig: OSCParameterConfig<Unit<'flag', boolean>, 'integer'> = {
  oscDataType: 'integer',
  validateRawValue: z.union([z.literal(0), z.literal(1)]).parse,
  validateUnitValue: z.boolean().parse,
  convertToRaw: (value) => (value ? 1 : 0),
  convertToUnit: (value) => (value === 1 ? true : false),
};

export const onOffInvertedParameterConfig: OSCParameterConfig<Unit<'flag', boolean>, 'integer'> = {
  oscDataType: 'integer',
  validateRawValue: z.union([z.literal(0), z.literal(1)]).parse,
  validateUnitValue: z.boolean().parse,
  convertToRaw: (value) => (value ? 0 : 1),
  convertToUnit: (value) => (value === 1 ? false : true),
};
