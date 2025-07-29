import { z } from 'zod';
import { OSCParameterConfig, Unit } from '../osc-parameter.js';
export const createLiteralParameterConfig = <UnitName extends string, T extends string>(
  map: readonly T[],
): OSCParameterConfig<Unit<UnitName, T>, 'integer'> => {
  if (map.length === 0) {
    throw new Error('Map must contain at least one value');
  }
  const literalSchemas = map.map((value) => z.literal(value));
  const unitValueSchema = z.union(literalSchemas as [z.ZodLiteral<T>, ...z.ZodLiteral<T>[]]);

  return {
    convertToRaw: (value) => {
      return map.indexOf(value);
    },
    convertToUnit: (value) => {
      return map[value];
    },
    validateRawValue: z
      .number()
      .min(0)
      .max(map.length - 1)
      .int().parse,
    validateUnitValue: unitValueSchema.parse,
    oscDataType: 'integer',
  };
};
