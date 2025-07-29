import { Mapper } from '../entity.js';

/**
 * Maps a value from a logarithmic range [min, max] to the normalized 0–1 scale.
 * Equivalent to: log10(value / min) / log10(max / min)
 */
export function mapRangeToZeroToOne(value: number, min: number, max: number): number {
  //   if (value < min || value > max) throw new RangeError("Value out of range");
  return Math.log10(value / min) / Math.log10(max / min);
}

/**
 * Maps a normalized value (0–1) to a logarithmic range [min, max].
 * Equivalent to: min * (max / min) ^ t
 */
export function mapZeroToOneToRange(value: number, min: number, max: number): number {
  //   if (value < 0 || value > 1) throw new RangeError("Value must be between 0 and 1");
  return min * Math.pow(max / min, value);
}

export const createLogarithmicMapper = (min: number, max: number): Mapper<number> => {
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
