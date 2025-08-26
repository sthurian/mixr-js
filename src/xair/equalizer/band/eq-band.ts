import { OSCClient } from '../../../osc/client.js';
import { createLinearParameterConfig } from '../../mapper/linear.js';
import { createLogarithmicParameterConfig } from '../../mapper/log.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';
import { createOSCParameterFactory } from '../../osc-parameter.js';
import { EqBandType, eqBandTypeParameterConfig } from './mapper/eq-band-type.js';

export type EqualizerBand = {
  /**
   * Fetch the current equalizer band enabled state as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = disabled, 1 = enabled)
   * @example
   * // Get raw OSC value
   * const rawEnabled = await band.fetchIsEnabled();
   */
  fetchIsEnabled(): Promise<number>;

  /**
   * Fetch the current equalizer band enabled state as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isEnabled = await band.fetchIsEnabled('flag');
   */
  fetchIsEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the equalizer band enabled state using raw OSC value
   * @param value - The enabled state as raw OSC integer (0 = disabled, 1 = enabled)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await band.updateEnabled(1);
   */
  updateEnabled(value: number): Promise<void>;

  /**
   * Update the equalizer band enabled state using boolean
   * @param value - The enabled state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await band.updateEnabled(true, 'flag');
   */
  updateEnabled(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Update the equalizer band frequency using raw OSC value
   * @param value - The frequency as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await band.updateFrequency(0.5);
   */
  updateFrequency(value: number): Promise<void>;

  /**
   * Update the equalizer band frequency using hertz
   * @param value - The frequency in Hz (20-20000Hz)
   * @param unit - Must be 'hertz' when using frequency values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using frequency in Hz
   * await band.updateFrequency(1000, 'hertz');
   */
  updateFrequency(value: number, unit: 'hertz'): Promise<void>;

  /**
   * Fetch the current equalizer band frequency as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawFreq = await band.fetchFrequency();
   */
  fetchFrequency(): Promise<number>;

  /**
   * Fetch the current equalizer band frequency in hertz
   * @param unit - Must be 'hertz' to get frequency in Hz
   * @returns Promise that resolves to frequency in Hz (20-20000Hz)
   * @example
   * // Get frequency in Hz
   * const freqHz = await band.fetchFrequency('hertz');
   */
  fetchFrequency(unit: 'hertz'): Promise<number>;

  /**
   * Update the equalizer band type using raw OSC value
   * @param value - The band type as raw OSC integer (0-5)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (2 = 'PEQ')
   * await band.updateType(2);
   */
  updateType(value: number): Promise<void>;

  /**
   * Update the equalizer band type using type string
   * @param value - The band type string ('LCut', 'LShv', 'PEQ', 'VEQ', 'HShv', 'HCut')
   * @param unit - Must be 'type' when using type string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using band type string
   * await band.updateType('PEQ', 'type');
   */
  updateType(value: EqBandType, unit: 'type'): Promise<void>;

  /**
   * Fetch the current equalizer band type as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-5)
   * @example
   * // Get raw OSC value
   * const rawType = await band.fetchType();
   */
  fetchType(): Promise<number>;

  /**
   * Fetch the current equalizer band type as type string
   * @param unit - Must be 'type' to get type string
   * @returns Promise that resolves to type string ('LCut', 'LShv', 'PEQ', 'VEQ', 'HShv', 'HCut')
   * @example
   * // Get band type string
   * const typeStr = await band.fetchType('type');
   */
  fetchType(unit: 'type'): Promise<EqBandType>;

  /**
   * Update the equalizer band gain using raw OSC value
   * @param value - The gain as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await band.updateGain(0.7);
   */
  updateGain(value: number): Promise<void>;

  /**
   * Update the equalizer band gain using decibels
   * @param value - The gain in decibels (-15 to +15dB)
   * @param unit - Must be 'decibels' when using dB values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using gain in dB
   * await band.updateGain(6, 'decibels');
   */
  updateGain(value: number, unit: 'decibels'): Promise<void>;

  /**
   * Fetch the current equalizer band gain as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawGain = await band.fetchGain();
   */
  fetchGain(): Promise<number>;

  /**
   * Fetch the current equalizer band gain in decibels
   * @param unit - Must be 'decibels' to get level in dB
   * @returns Promise that resolves to gain in dB (-15 to +15dB)
   * @example
   * // Get gain in dB
   * const gainDb = await band.fetchGain('decibels');
   */
  fetchGain(unit: 'decibels'): Promise<number>;

  /**
   * Update the equalizer band Q factor using raw OSC value
   * @param value - The Q factor as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await band.updateQ(0.4);
   */
  updateQ(value: number): Promise<void>;

  /**
   * Update the equalizer band Q factor using number
   * @param value - The Q factor as number (0.3-10.0)
   * @param unit - Must be 'number' when using Q factor values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using Q factor value
   * await band.updateQ(2.5, 'number');
   */
  updateQ(value: number, unit: 'number'): Promise<void>;

  /**
   * Fetch the current equalizer band Q factor as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawQ = await band.fetchQ();
   */
  fetchQ(): Promise<number>;

  /**
   * Fetch the current equalizer band Q factor as number
   * @param unit - Must be 'number' to get Q factor value
   * @returns Promise that resolves to Q factor (0.3-10.0)
   * @example
   * // Get Q factor value
   * const qValue = await band.fetchQ('number');
   */
  fetchQ(unit: 'number'): Promise<number>;
};

export type EqualizerBandDependencies = {
  oscBasePath: string;
  band: number;
  oscClient: OSCClient;
};

export const createEqualizerBand = (dependencies: EqualizerBandDependencies): EqualizerBand => {
  const { oscBasePath, band, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/eq/${band}`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );
  const frequency = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/f`,
    createLogarithmicParameterConfig<'hertz'>(20, 20000),
  );
  const gain = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/g`,
    createLinearParameterConfig<'decibels'>(-15, 15),
  );
  const q = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/q`,
    createLogarithmicParameterConfig<'number'>(10, 0.3),
  );
  const type = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/type`,
    eqBandTypeParameterConfig,
  );

  return {
    fetchIsEnabled: enabled.fetch,
    updateEnabled: enabled.update,
    fetchFrequency: frequency.fetch,
    updateFrequency: frequency.update,
    fetchGain: gain.fetch,
    updateGain: gain.update,
    fetchQ: q.fetch,
    updateQ: q.update,
    fetchType: type.fetch,
    updateType: type.update,
  };
};
