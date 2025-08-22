import { z } from 'zod/v4';
import { Mapper } from '../entity.js';
import { OSCParameterConfig } from '../osc-parameter.js';

export const createLiteralMapper = <T>(map: readonly T[]): Mapper<T> => {
  return {
    mixerValueToOscArgument: (value) => {
      return map.indexOf(value);
    },
    oscArgumentToMixerValue: (arg) => {
      if (typeof arg === 'string') {
        throw new Error('Cannot find literal by index. Index is not a number');
      }
      return map[arg];
    },
    getOscType: () => 'integer',
  };
};

export const createLiteralParameterConfig = <UnitName extends string, T extends string>(map: readonly T[]): OSCParameterConfig<UnitName, 'integer', T> => {
  const literalSchemas = map.map(value => z.literal(value));
  const unitValueSchema = z.union(literalSchemas as [z.ZodLiteral<T>, ...z.ZodLiteral<T>[]]);

  return {
    convertToRaw: (value) => {
      return map.indexOf(value);
    },
    convertToUnit: (value) => {
      return map[value];
    },
    validateRawValue: z.number().min(0).max(map.length - 1).int().parse,
    validateUnitValue: unitValueSchema.parse,
    oscDataType: 'integer',
  };
}