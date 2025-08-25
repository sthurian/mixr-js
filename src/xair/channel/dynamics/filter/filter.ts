import { OSCClient } from '../../../../osc/client.js';
import { createLogarithmicParameterConfig } from '../../../mapper/log.js';
import { onOffParameterConfig } from '../../../mapper/on-off.js';
import {
  AsyncGetter,
  AsyncSetter,
  createOSCParameterFactory,
  Unit,
} from '../../../osc-parameter.js';
import { CompressorFilterType, compressorFilterTypeParameterConfig } from './mapper/filter-type.js';

export type DynamicsFilter = {
  /**
   * Updates the dynamics filter enable/disable status.
   * 
   * @param enabled - Flag controlling the filter state. Either a boolean (true/false) or a raw OSC integer (0=off, 1=on).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using boolean value
   * await filter.updateEnabled(true);
   * 
   * // Using raw OSC value
   * await filter.updateEnabled(1);
   * ```
   */
  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetches the current dynamics filter enable/disable status.
   * 
   * @returns Promise resolving to the filter state. Returns boolean (true/false) or raw OSC integer (0=off, 1=on).
   * 
   * @example
   * ```typescript
   * // Get as boolean
   * const isEnabled = await filter.fetchIsEnabled();
   * 
   * // Get as raw OSC value  
   * const oscValue = await filter.fetchIsEnabled();
   * ```
   */
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Updates the dynamics filter frequency.
   * 
   * @param frequency - Filter frequency. Either in hertz (20-20000Hz) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using frequency in Hz
   * await filter.updateFrequency(1000);
   * 
   * // Using raw OSC value
   * await filter.updateFrequency(0.5);
   * ```
   */
  updateFrequency: AsyncSetter<Unit<'hertz', number>, 'float'>;

  /**
   * Fetches the current dynamics filter frequency.
   * 
   * @returns Promise resolving to the filter frequency. Returns frequency in hertz (20-20000Hz) or raw OSC float (0.0-1.0).
   * 
   * @example
   * ```typescript
   * // Get frequency in Hz
   * const frequency = await filter.fetchFrequency();
   * 
   * // Get as raw OSC value
   * const oscValue = await filter.fetchFrequency();
   * ```
   */
  fetchFrequency: AsyncGetter<Unit<'hertz', number>, 'float'>;

  /**
   * Updates the dynamics filter type.
   * 
   * @param type - Filter type. Either a string literal ('LC6', 'LC12', 'HC6', 'HC12', '1.0', '2.0', '3.0', '5.0', '10.0') or a raw OSC integer (0-8).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using filter type literal
   * await filter.updateType('LC6');
   * 
   * // Using raw OSC value
   * await filter.updateType(0);
   * ```
   */
  updateType: AsyncSetter<Unit<'filterType', CompressorFilterType>, 'integer'>;

  /**
   * Fetches the current dynamics filter type.
   * 
   * @returns Promise resolving to the filter type. Returns string literal ('LC6', 'LC12', 'HC6', 'HC12', '1.0', '2.0', '3.0', '5.0', '10.0') or raw OSC integer (0-8).
   * 
   * @example
   * ```typescript
   * // Get as filter type literal
   * const type = await filter.fetchType();
   * 
   * // Get as raw OSC value
   * const oscValue = await filter.fetchType();
   * ```
   */
  fetchType: AsyncGetter<Unit<'filterType', CompressorFilterType>, 'integer'>;
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
