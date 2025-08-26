import { OSCClient } from '../../../osc/client.js';
import { EqualizerBand, EqualizerBandDependencies } from '../../equalizer/band/eq-band.js';
import { Equalizer, EqualizerDependencies } from '../../equalizer/equalizer.js';
import { createOSCParameterFactory } from '../../osc-parameter.js';
import { EqMode, eqModeParameterConfig } from './parameters/mode.js';

export type MainLREqualizer = Equalizer & {
  /**
   * Update the equalizer mode using raw OSC value
   * @param value - The mode as raw OSC integer (0-5)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (2 = 'PEQ')
   * await eq.updateMode(2);
   */
  updateMode(value: number): Promise<void>;

  /**
   * Update the equalizer mode using type string
   * @param value - The mode string ('LCut', 'LShv', 'PEQ', 'VEQ', 'HShv', 'HCut')
   * @param unit - Must be 'mode' when using type string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using equalizer mode string
   * await eq.updateMode('PEQ', 'mode');
   */
  updateMode(value: EqMode, unit: 'mode'): Promise<void>;

  /**
   * Fetch the current equalizer  mode as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-5)
   * @example
   * // Get raw OSC value
   * const rawMode = await eq.fetchMode();
   */
  fetchMode(): Promise<number>;

  /**
   * Fetch the current equalizer mode as type string
   * @param unit - Must be 'mode' to get mode string
   * @returns Promise that resolves to mode string ('LCut', 'LShv', 'PEQ', 'VEQ', 'HShv', 'HCut')
   * @example
   * // Get equalizer mode string
   * const modeStr = await eq.fetchMode('mode');
   */
  fetchMode(unit: 'mode'): Promise<EqMode>;
};

export type MainLREqualizerDependencies = {
  oscClient: OSCClient;
  createEqualizer: (dependencies: EqualizerDependencies) => Equalizer;
  createEqualizerBand: (dependencies: EqualizerBandDependencies) => EqualizerBand;
};

export const createMainLREqualizer = (
  dependencies: MainLREqualizerDependencies,
): MainLREqualizer => {
  const { oscClient, createEqualizer, createEqualizerBand } = dependencies;
  const oscBasePath = `/lr`;
  const channelEqualizer = createEqualizer({ oscBasePath, oscClient, createEqualizerBand });
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const mode = oscParameterFactory.createOSCParameter(
    `${oscBasePath}/eq/mode`,
    eqModeParameterConfig,
  );
  return {
    ...channelEqualizer,
    updateMode: mode.update,
    fetchMode: mode.fetch,
  };
};
