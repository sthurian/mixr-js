import { Mapper } from '../entity.js';

export const singleIntegerMapper: Mapper<number> = {
  mixerValueToOscArgument: (value) => {
    return value;
  },
  oscArgumentToMixerValue: (arg) => {
    if (typeof arg === 'string') {
      throw new Error('Cannot map a string value');
    }
    return arg;
  },
  getOscType: () => 'integer',
};
