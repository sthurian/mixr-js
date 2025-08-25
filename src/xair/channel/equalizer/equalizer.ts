import { OSCClient } from '../../../osc/client.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../../osc-parameter.js';
import { ChannelEqualizerBand, createChannelEqualizerBand } from './band/eq-band.js';

export type ChannelEqualizer = {
  /**
   * Update the equalizer enabled state
   * @param value - The enabled state: raw OSC integer (0/1) or boolean
   * @param unit - Optional unit parameter. If 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = disabled, 1 = enabled)
   * await equalizer.updateEnabled(1);
   *
   * // Set using boolean
   * await equalizer.updateEnabled(true, 'flag');
   */
  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetch the current equalizer enabled state
   * @param unit - Optional unit parameter. If 'flag' is provided, returns boolean value
   * @returns Promise that resolves to either raw OSC integer (0/1) or boolean
   * @example
   * // Get raw OSC value (0 = disabled, 1 = enabled)
   * const rawEnabled = await equalizer.fetchIsEnabled();
   *
   * // Get boolean value
   * const isEnabled = await equalizer.fetchIsEnabled('flag');
   */
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Get access to a specific equalizer band
   * @param band - The band number (1-4 for most channels)
   * @returns ChannelEqualizerBand object for the specified band
   * @example
   * // Get band 1 (low frequency)
   * const lowBand = equalizer.getBand(1);
   *
   * // Get band 4 (high frequency)
   * const highBand = equalizer.getBand(4);
   */
  getBand: (band: number) => ChannelEqualizerBand;
};

type ChannelEqualizerDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelEqualizer = (
  dependencies: ChannelEqualizerDependencies,
): ChannelEqualizer => {
  const { channel, oscClient } = dependencies;
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/eq`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );

  return {
    updateEnabled: enabled.update,
    fetchIsEnabled: enabled.fetch,
    getBand: (band) => createChannelEqualizerBand({ band, channel, oscClient }),
  };
};
