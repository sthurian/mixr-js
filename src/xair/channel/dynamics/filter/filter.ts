import { OSCClient } from '../../../../osc/client.js';
import { createLogarithmicParameterConfig } from '../../../mapper/log.js';
import { onOffParameterConfig } from '../../../mapper/on-off.js';
import { createOSCParameterFactory } from '../../../osc-parameter.js';
import { CompressorFilterType, compressorFilterTypeParameterConfig } from './mapper/filter-type.js';

export type DynamicsFilter = {
  /**
   * Update the dynamics filter enabled state using raw OSC value
   * @param value - The enabled state as raw OSC integer (0 = disabled, 1 = enabled)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await filter.updateEnabled(1);
   */
  updateEnabled(value: number): Promise<void>;

  /**
   * Update the dynamics filter enabled state using boolean
   * @param value - The enabled state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await filter.updateEnabled(true, 'flag');
   */
  updateEnabled(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Fetch the current dynamics filter enabled state as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = disabled, 1 = enabled)
   * @example
   * // Get raw OSC value
   * const rawEnabled = await filter.fetchIsEnabled();
   */
  fetchIsEnabled(): Promise<number>;

  /**
   * Fetch the current dynamics filter enabled state as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isEnabled = await filter.fetchIsEnabled('flag');
   */
  fetchIsEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the dynamics filter frequency using raw OSC value
   * @param value - The frequency as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await filter.updateFrequency(0.5);
   */
  updateFrequency(value: number): Promise<void>;

  /**
   * Update the dynamics filter frequency using hertz
   * @param value - The frequency in hertz (20-20000Hz)
   * @param unit - Must be 'hertz' when using Hz values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using frequency in Hz
   * await filter.updateFrequency(1000, 'hertz');
   */
  updateFrequency(value: number, unit: 'hertz'): Promise<void>;

  /**
   * Fetch the current dynamics filter frequency as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawFreq = await filter.fetchFrequency();
   */
  fetchFrequency(): Promise<number>;

  /**
   * Fetch the current dynamics filter frequency in hertz
   * @param unit - Must be 'hertz' to get frequency in Hz
   * @returns Promise that resolves to frequency in hertz (20-20000Hz)
   * @example
   * // Get frequency in Hz
   * const freqHz = await filter.fetchFrequency('hertz');
   */
  fetchFrequency(unit: 'hertz'): Promise<number>;

  /**
   * Update the dynamics filter type using raw OSC value
   * @param value - The filter type as raw OSC integer (0-8)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = 'LC6')
   * await filter.updateType(0);
   */
  updateType(value: number): Promise<void>;

  /**
   * Update the dynamics filter type using filter type string
   * @param value - The filter type string ('LC6', 'LC12', 'HC6', 'HC12', '1.0', '2.0', '3.0', '5.0', '10.0')
   * @param unit - Must be 'filterType' when using filter type string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using filter type string
   * await filter.updateType('LC6', 'filterType');
   */
  updateType(value: CompressorFilterType, unit: 'filterType'): Promise<void>;

  /**
   * Fetch the current dynamics filter type as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-8)
   * @example
   * // Get raw OSC value
   * const rawType = await filter.fetchType();
   */
  fetchType(): Promise<number>;

  /**
   * Fetch the current dynamics filter type as filter type string
   * @param unit - Must be 'filterType' to get filter type string
   * @returns Promise that resolves to filter type string ('LC6', 'LC12', 'HC6', 'HC12', '1.0', '2.0', '3.0', '5.0', '10.0')
   * @example
   * // Get filter type string
   * const filterType = await filter.fetchType('filterType');
   */
  fetchType(unit: 'filterType'): Promise<CompressorFilterType>;
};

type DynamicsFilterDependencies = {
  channel: number;
  oscClient: OSCClient;
  dynamicsType: 'compressor' | 'gate';
};

export const createDynamicsFilter = (dependencies: DynamicsFilterDependencies): DynamicsFilter => {
  const { channel, oscClient, dynamicsType } = dependencies;
  const oscDynamicsPath = dynamicsType === 'compressor' ? 'dyn' : 'gate';
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/${oscDynamicsPath}/filter`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );
  const frequency = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/f`,
    createLogarithmicParameterConfig<'hertz'>(20, 20000),
  );
  const type = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/type`,
    compressorFilterTypeParameterConfig,
  );

  return {
    fetchIsEnabled: enabled.fetch,
    updateEnabled: enabled.update,
    fetchFrequency: frequency.fetch,
    updateFrequency: frequency.update,
    fetchType: type.fetch,
    updateType: type.update,
  };
};
