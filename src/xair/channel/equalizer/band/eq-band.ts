import { OSCClient } from '../../../../osc/client.js';
import { createLinearParameterConfig } from '../../../mapper/linear.js';
import { createLogarithmicParameterConfig } from '../../../mapper/log.js';
import { onOffParameterConfig } from '../../../mapper/on-off.js';
import {
  AsyncGetter,
  AsyncSetter,
  createOSCParameterFactory,
  Unit,
} from '../../../osc-parameter.js';
import { EqBandType, eqBandTypeParameterConfig } from './mapper/eq-band-type.js';

export type ChannelEqualizerBand = {
  /**
   * Fetches the current equalizer band enable/disable status.
   * 
   * @returns Promise resolving to the band state. Returns boolean (true=enabled, false=disabled) or raw OSC integer (0=disabled, 1=enabled).
   * 
   * @example
   * ```typescript
   * // Get as boolean
   * const isEnabled = await band.fetchIsEnabled();
   * 
   * // Get as raw OSC value
   * const oscValue = await band.fetchIsEnabled();
   * ```
   */
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Updates the equalizer band enable/disable status.
   * 
   * @param enabled - Band state. Either a boolean (true=enabled, false=disabled) or a raw OSC integer (0=disabled, 1=enabled).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using boolean value
   * await band.updateEnabled(true);
   * 
   * // Using raw OSC value
   * await band.updateEnabled(1);
   * ```
   */
  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Updates the equalizer band frequency.
   * 
   * @param frequency - Band frequency. Either in hertz (20-20000Hz) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using frequency in Hz
   * await band.updateFrequency(1000);
   * 
   * // Using raw OSC value
   * await band.updateFrequency(0.5);
   * ```
   */
  updateFrequency: AsyncSetter<Unit<'hertz', number>, 'float'>;

  /**
   * Fetches the current equalizer band frequency.
   * 
   * @returns Promise resolving to the band frequency. Returns frequency in hertz (20-20000Hz) or raw OSC float (0.0-1.0).
   * 
   * @example
   * ```typescript
   * // Get frequency in Hz
   * const frequency = await band.fetchFrequency();
   * 
   * // Get as raw OSC value
   * const oscValue = await band.fetchFrequency();
   * ```
   */
  fetchFrequency: AsyncGetter<Unit<'hertz', number>, 'float'>;

  /**
   * Updates the equalizer band type.
   * 
   * @param type - Band type. Either a string literal ('LCut', 'LShv', 'PEQ', 'VEQ', 'HShv', 'HCut') or a raw OSC integer (0-5).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using band type literal
   * await band.updateType('PEQ');
   * 
   * // Using raw OSC value
   * await band.updateType(2);
   * ```
   */
  updateType: AsyncSetter<Unit<'type', EqBandType>, 'integer'>;

  /**
   * Fetches the current equalizer band type.
   * 
   * @returns Promise resolving to the band type. Returns string literal ('LCut', 'LShv', 'PEQ', 'VEQ', 'HShv', 'HCut') or raw OSC integer (0-5).
   * 
   * @example
   * ```typescript
   * // Get as band type literal
   * const type = await band.fetchType();
   * 
   * // Get as raw OSC value
   * const oscValue = await band.fetchType();
   * ```
   */
  fetchType: AsyncGetter<Unit<'type', EqBandType>, 'integer'>;

  /**
   * Updates the equalizer band gain.
   * 
   * @param gain - Band gain. Either in decibels (-15 to +15dB) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using gain in dB
   * await band.updateGain(6);
   * 
   * // Using raw OSC value
   * await band.updateGain(0.7);
   * ```
   */
  updateGain: AsyncSetter<Unit<'decibels', number>, 'float'>;

  /**
   * Fetches the current equalizer band gain.
   * 
   * @returns Promise resolving to the band gain. Returns gain in decibels (-15 to +15dB) or raw OSC float (0.0-1.0).
   * 
   * @example
   * ```typescript
   * // Get gain in dB
   * const gain = await band.fetchGain();
   * 
   * // Get as raw OSC value
   * const oscValue = await band.fetchGain();
   * ```
   */
  fetchGain: AsyncGetter<Unit<'decibels', number>, 'float'>;

  /**
   * Updates the equalizer band Q factor (resonance).
   * 
   * @param q - Q factor. Either as number (0.3-10.0) or as a raw OSC float (0.0-1.0).
   * @returns Promise that resolves when the operation completes.
   * 
   * @example
   * ```typescript
   * // Using Q factor value
   * await band.updateQ(2.5);
   * 
   * // Using raw OSC value
   * await band.updateQ(0.4);
   * ```
   */
  updateQ: AsyncSetter<Unit<'number', number>, 'float'>;

  /**
   * Fetches the current equalizer band Q factor (resonance).
   * 
   * @returns Promise resolving to the Q factor. Returns Q factor (0.3-10.0) or raw OSC float (0.0-1.0).
   * 
   * @example
   * ```typescript
   * // Get Q factor value
   * const q = await band.fetchQ();
   * 
   * // Get as raw OSC value
   * const oscValue = await band.fetchQ();
   * ```
   */
  fetchQ: AsyncGetter<Unit<'number', number>, 'float'>;
};

type ChannelEqualizerBandDependencies = {
  channel: number;
  band: number;
  oscClient: OSCClient;
};

export const createChannelEqualizerBand = (
  dependencies: ChannelEqualizerBandDependencies,
): ChannelEqualizerBand => {
  const { channel, band, oscClient } = dependencies;
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/eq/${band}`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );
  const frequency = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/f`,
    createLogarithmicParameterConfig<'hertz'>(20, 20000),
  );
  const gain = oscParameterFactory.createOSCParameter<Unit<'decibels', number>, 'float'>(
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
