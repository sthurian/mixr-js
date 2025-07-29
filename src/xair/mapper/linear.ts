import { Mapper } from '../entity.js';

function mapZeroToOneToRange(value: number, min: number, max: number): number {
  return min + value * (max - min);
}

function mapRangeToZeroToOne(value: number, min: number, max: number): number {
  if (max === min) throw new Error('min and max must be different');
  return (value - min) / (max - min);
}

export const createLinearMapper = (min: number, max: number): Mapper<number> => {
  return {
    mixerValueToOscArgument: (value) => {
      return mapRangeToZeroToOne(value, min, max);
    },
    oscArgumentToMixerValue: (arg) => {
      if (typeof arg === 'string') {
        throw new Error('Cannot map a string value');
      }
      return mapZeroToOneToRange(arg, min, max);
    },
    getOscType: () => 'float',
  };
};
