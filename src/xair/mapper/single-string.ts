import { Mapper } from '../entity.js';

export const singleStringMapper: Mapper<string> = {
  mixerValueToOscArgument: (value) => {
    return value;
  },
  oscArgumentToMixerValue: (value) => {
    if (typeof value !== 'string') {
      throw new Error('Cannot map a number');
    }
    return `${value}`;
  },
  getOscType: () => 'string',
};
