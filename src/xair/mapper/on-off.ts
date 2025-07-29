import { Mapper } from '../entity.js';

export const onOffMapper: Mapper<boolean> = {
  mixerValueToOscArgument: (value) => {
    return value ? 1 : 0;
  },
  oscArgumentToMixerValue: (arg) => {
    if (arg === 0) {
      return false;
    }
    if (arg === 1) {
      return true;
    }
    throw new Error(`Invalid value for on/off mapper: ${arg}. Expected 0 or 1.`);
  },
  getOscType: () => 'integer',
};
