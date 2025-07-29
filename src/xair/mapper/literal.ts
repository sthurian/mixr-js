import { Mapper } from '../entity.js';

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
