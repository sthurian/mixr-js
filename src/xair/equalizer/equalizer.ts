import { OSCClient } from '../../osc/client.js';
import { onOffParameterConfig } from '../mapper/on-off.js';
import { createOSCParameterFactory } from '../osc-parameter.js';
import { EqualizerBand, EqualizerBandDependencies } from './band/eq-band.js';

type BandNumberChannel = 1 | 2 | 3 | 4;
type BandNumberBus = 1 | 2 | 3 | 4 | 5 | 6;
type BandNumber<T extends 4 | 6> = T extends 4 ? BandNumberChannel : BandNumberBus;

export type Equalizer<T extends 4 | 6> = {
  /**
   * Update the equalizer enabled state
   */
  updateEnabled(value: number): Promise<void>;
  /**
   * Update the equalizer enabled state
   */
  updateEnabled(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Fetch the current equalizer enabled state
   */
  fetchIsEnabled(): Promise<number>;
  /**
   * Fetch the current equalizer enabled state
   */
  fetchIsEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Get access to a specific equalizer band
   * @param band - The band number (1-4 for 4-band EQ, 1-6 for 6-band EQ)
   * @returns EqualizerBand object for the specified band
   * @example
   * // For a 4-band equalizer
   * const fourBandEQ = createEqualizer({ ..., numberOfBands: 4 });
   * const lowBand = fourBandEQ.getBand(1);   // Valid: 1-4
   * const highBand = fourBandEQ.getBand(4);  // Valid: 1-4
   *
   * // For a 6-band equalizer
   * const sixBandEQ = createEqualizer({ ..., numberOfBands: 6 });
   * const midBand = sixBandEQ.getBand(5);    // Valid: 1-6
   * const topBand = sixBandEQ.getBand(6);    // Valid: 1-6
   */
  getBand: (band: BandNumber<T>) => EqualizerBand;
};

export type EqualizerDependencies<T extends 4 | 6> = {
  oscBasePath: string;
  oscClient: OSCClient;
  createEqualizerBand: (dependencies: EqualizerBandDependencies) => EqualizerBand;
  numberOfBands: T;
};

export const createEqualizer = <T extends 4 | 6>(
  dependencies: EqualizerDependencies<T>,
): Equalizer<T> => {
  const { oscBasePath, oscClient, createEqualizerBand, numberOfBands } = dependencies;
  const oscBaseAddress = `${oscBasePath}/eq`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );

  return {
    updateEnabled: enabled.update,
    fetchIsEnabled: enabled.fetch,
    getBand: (band) => {
      if (band > numberOfBands) {
        throw new Error(`Invalid band number: ${band}. Max is ${numberOfBands}`);
      }
      return createEqualizerBand({ band, oscBasePath, oscClient });
    },
  };
};
