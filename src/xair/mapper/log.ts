import { z } from 'zod';
import { OSCParameterConfig, Unit } from '../osc-parameter.js';

export function mapRangeToZeroToOne(value: number, min: number, max: number): number {
  return Math.log10(value / min) / Math.log10(max / min);
}
export function mapZeroToOneToRange(value: number, min: number, max: number): number {
  return min * Math.pow(max / min, value);
}
export const createLogarithmicParameterConfig = <UnitName extends string>(
  min: number,
  max: number,
): OSCParameterConfig<Unit<UnitName, number>, 'float'> => {
  if (max === min) throw new Error('min and max must be different');
  return {
    oscDataType: 'float',
    convertToUnit: (raw) => mapZeroToOneToRange(raw, min, max),
    convertToRaw: (unit) => mapRangeToZeroToOne(unit, min, max),
    validateRawValue: z.number().min(0).max(1).parse,
    validateUnitValue: z.number().min(min).max(max).or(z.number().min(max).max(min)).parse,
  };
};
