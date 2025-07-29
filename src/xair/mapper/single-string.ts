import z from 'zod';
import { OSCParameterConfig, Unit } from '../osc-parameter.js';

export const stringOscParameterConfig: OSCParameterConfig<Unit<'string', string>, 'string'> = {
  convertToRaw: (value: string) => value,
  convertToUnit: (value: string) => value,
  validateRawValue: z.string().parse,
  validateUnitValue: z.string().parse,
  oscDataType: 'string',
};
