import { OSCClient } from '../../osc/client.js';
import { levelParamaterConfig } from '../mapper/level.js';
import { createOSCParameterFactory } from '../osc-parameter.js';

type GEQBand =
  | '100'
  | '10k'
  | '125'
  | '12k5'
  | '160'
  | '16k'
  | '1k'
  | '1k25'
  | '1k6'
  | '20'
  | '200'
  | '20k'
  | '25'
  | '250'
  | '2k'
  | '2k5'
  | '31.5'
  | '315'
  | '3k15'
  | '40'
  | '400'
  | '4k'
  | '50'
  | '500'
  | '5k'
  | '63'
  | '630'
  | '6k3'
  | '80'
  | '800'
  | '8k';

export type GraphicEqualizer = {
  /**
   * Update the gain of a specific graphic EQ band using raw OSC value
   * @param band - The GEQ band identifier (e.g., '1k', '2k5', '10k')
   * @param value - The gain as raw OSC value (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await geq.updateBandGain('1k', 0.75);
   */
  updateBandGain(band: GEQBand, value: number): Promise<void>;

  /**
   * Update the gain of a specific graphic EQ band using decibels
   * @param band - The GEQ band identifier (e.g., '1k', '2k5', '10k')
   * @param value - The gain in decibels (-15dB to +15dB)
   * @param unit - Must be 'decibels' when using decibel values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using decibel values
   * await geq.updateBandGain('1k', 3.5, 'decibels');
   */
  updateBandGain(band: GEQBand, value: number, unit: 'decibels'): Promise<void>;

  /**
   * Fetch the current gain of a specific graphic EQ band as raw OSC value
   * @param band - The GEQ band identifier (e.g., '1k', '2k5', '10k')
   * @returns Promise that resolves to raw OSC value (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawGain = await geq.fetchBandGain('1k');
   */
  fetchBandGain(band: GEQBand): Promise<number>;

  /**
   * Fetch the current gain of a specific graphic EQ band in decibels
   * @param band - The GEQ band identifier (e.g., '1k', '2k5', '10k')
   * @param unit - Must be 'decibels' to get decibel values
   * @returns Promise that resolves to gain in decibels (-15dB to +15dB)
   * @example
   * // Get decibel values
   * const gainDB = await geq.fetchBandGain('1k', 'decibels');
   */
  fetchBandGain(band: GEQBand, unit: 'decibels'): Promise<number>;
};

export type GraphicEqualizerDependencies = {
  oscClient: OSCClient;
  oscBasePath: string;
};

export const createGraphicEqualizer = (
  dependencies: GraphicEqualizerDependencies,
): GraphicEqualizer => {
  const { oscClient, oscBasePath } = dependencies;
  const oscParameterFactory = createOSCParameterFactory(oscClient);

  return {
    updateBandGain: (band: GEQBand, value: number, unit?: 'decibels') => {
      const param = oscParameterFactory.createOSCParameter(
        `${oscBasePath}/qeq/${band}`,
        levelParamaterConfig,
      );
      if (unit === 'decibels') {
        return param.update(value, unit);
      }
      return param.update(value);
    },
    fetchBandGain: (band: GEQBand, unit?: 'decibels') => {
      const param = oscParameterFactory.createOSCParameter(
        `${oscBasePath}/qeq/${band}`,
        levelParamaterConfig,
      );
      if (unit === 'decibels') {
        return param.fetch(unit);
      }
      return param.fetch();
    },
  };
};
