import { z } from 'zod/v4';
// import { Mapper } from '../entity.js';
import { OSCParameterConfig } from '../osc-parameter.js';

function mapZeroToOneToRange(value: number, min: number, max: number): number {
  return min + value * (max - min);
}

function mapRangeToZeroToOne(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

export const createLinearParameterConfig = <Unit>(min: number, max: number):  OSCParameterConfig<Unit, 'float'> => {
  if (max === min) throw new Error('min and max must be different');
  return {
    oscDataType: 'float',
    convertToUnit: (raw) => mapZeroToOneToRange(raw, min, max),
    convertToRaw: (unit) => mapRangeToZeroToOne(unit, min, max),
    validateRawValue: z.number().min(0).max(1).parse,
    validateUnitValue: z.number().min(min).max(max).parse
  }
};
