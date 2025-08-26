import { OSCClient } from '../../osc/client.js';
import { onOffParameterConfig } from '../mapper/on-off.js';
import { createOSCParameterFactory } from '../osc-parameter.js';
import { EqualizerBand, EqualizerBandDependencies } from './band/eq-band.js';

export type Equalizer = {
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
   * @param band - The band number (1-4 for channels, 1-6 for LR)
   * @returns ChannelEqualizerBand object for the specified band
   * @example
   * // Get band 1 (low frequency)
   * const lowBand = equalizer.getBand(1);
   *
   * // Get band 4 (high frequency)
   * const highBand = equalizer.getBand(4);
   */
  getBand: (band: number) => EqualizerBand;
};

export type EqualizerDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
  createEqualizerBand: (dependencies: EqualizerBandDependencies) => EqualizerBand;
};

export const createEqualizer = (dependencies: EqualizerDependencies): Equalizer => {
  const { oscBasePath, oscClient, createEqualizerBand } = dependencies;
  const oscBaseAddress = `${oscBasePath}/eq`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );

  return {
    updateEnabled: enabled.update,
    fetchIsEnabled: enabled.fetch,
    getBand: (band) => createEqualizerBand({ band, oscBasePath, oscClient }),
  };
};
