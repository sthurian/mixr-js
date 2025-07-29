import { z } from 'zod';
import { OSCParameterConfig, Unit } from '../osc-parameter.js';

export const integerOscParameterConfig: OSCParameterConfig<Unit<'integer', number>, 'integer'> = {
  oscDataType: 'integer',
  validateRawValue: z.number().int().parse,
  validateUnitValue: z.number().int().parse,
  convertToRaw: (value) => value,
  convertToUnit: (value) => value,
};
