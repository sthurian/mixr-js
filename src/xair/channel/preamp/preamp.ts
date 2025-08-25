import { OSCClient } from '../../../osc/client.js';
import { createLinearParameterConfig } from '../../mapper/linear.js';
import { createLogarithmicParameterConfig } from '../../mapper/log.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../../osc-parameter.js';

export type ChannelPreamp = {
  /**
   * Fetch the current low cut filter enabled state
   * @param unit - Optional unit parameter. If 'flag' is provided, returns boolean value
   * @returns Promise that resolves to either raw OSC integer (0/1) or boolean
   * @example
   * // Get raw OSC value (0 = disabled, 1 = enabled)
   * const rawEnabled = await preamp.fetchIsLowCutEnabled();
   *
   * // Get boolean value
   * const isEnabled = await preamp.fetchIsLowCutEnabled('flag');
   */
  fetchIsLowCutEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Update the low cut filter enabled state
   * @param value - The enabled state: raw OSC integer (0/1) or boolean
   * @param unit - Optional unit parameter. If 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = disabled, 1 = enabled)
   * await preamp.updateLowCutEnabled(1);
   *
   * // Set using boolean
   * await preamp.updateLowCutEnabled(true, 'flag');
   */
  updateLowCutEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetch the current polarity inversion state
   * @param unit - Optional unit parameter. If 'flag' is provided, returns boolean value
   * @returns Promise that resolves to either raw OSC integer (0/1) or boolean
   * @example
   * // Get raw OSC value (0 = normal, 1 = inverted)
   * const rawInverted = await preamp.fetchIsPolarityInverted();
   *
   * // Get boolean value
   * const isInverted = await preamp.fetchIsPolarityInverted('flag');
   */
  fetchIsPolarityInverted: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Update the polarity inversion state
   * @param value - The inversion state: raw OSC integer (0/1) or boolean
   * @param unit - Optional unit parameter. If 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = normal, 1 = inverted)
   * await preamp.updatePolarityInverted(1);
   *
   * // Set using boolean
   * await preamp.updatePolarityInverted(true, 'flag');
   */
  updatePolarityInverted: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetch the current USB return enabled state
   * @param unit - Optional unit parameter. If 'flag' is provided, returns boolean value
   * @returns Promise that resolves to either raw OSC integer (0/1) or boolean
   * @example
   * // Get raw OSC value (0 = disabled, 1 = enabled)
   * const rawEnabled = await preamp.fetchIsUSBReturnEnabled();
   *
   * // Get boolean value
   * const isEnabled = await preamp.fetchIsUSBReturnEnabled('flag');
   */
  fetchIsUSBReturnEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Update the USB return enabled state
   * @param value - The enabled state: raw OSC integer (0/1) or boolean
   * @param unit - Optional unit parameter. If 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = disabled, 1 = enabled)
   * await preamp.updateUSBReturnEnabled(1);
   *
   * // Set using boolean
   * await preamp.updateUSBReturnEnabled(true, 'flag');
   */
  updateUSBReturnEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Update the low cut filter frequency
   * @param value - The frequency value: raw OSC float (0.0-1.0) or frequency in Hz (20-400Hz)
   * @param unit - Optional unit parameter. If 'hertz' is provided, value should be in Hz
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await preamp.updateLowCutFrequency(0.5);
   *
   * // Set using frequency in Hz (20 to 400Hz)
   * await preamp.updateLowCutFrequency(100, 'hertz');
   */
  updateLowCutFrequency: AsyncSetter<Unit<'hertz', number>, 'float'>;

  /**
   * Fetch the current low cut filter frequency
   * @param unit - Optional unit parameter. If 'hertz' is provided, returns frequency in Hz
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or frequency in Hz (20-400Hz)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawFreq = await preamp.fetchLowCutFrequency();
   *
   * // Get frequency in Hz (20 to 400Hz)
   * const freqHz = await preamp.fetchLowCutFrequency('hertz');
   */
  fetchLowCutFrequency: AsyncGetter<Unit<'hertz', number>, 'float'>;

  /**
   * Update the USB return trim level
   * @param value - The trim value: raw OSC float (0.0-1.0) or level in dB (-18 to +18dB)
   * @param unit - Optional unit parameter. If 'decibels' is provided, value should be in dB
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await preamp.updateUSBTrim(0.75);
   *
   * // Set using decibels (-18 to +18dB)
   * await preamp.updateUSBTrim(-6, 'decibels');
   */
  updateUSBTrim: AsyncSetter<Unit<'decibels', number>, 'float'>;

  /**
   * Fetch the current USB return trim level
   * @param unit - Optional unit parameter. If 'decibels' is provided, returns level in dB
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or level in dB (-18 to +18dB)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawTrim = await preamp.fetchUSBTrim();
   *
   * // Get trim level in dB (-18 to +18dB)
   * const trimDb = await preamp.fetchUSBTrim('decibels');
   */
  fetchUSBTrim: AsyncGetter<Unit<'decibels', number>, 'float'>;

  /**
   * Update the preamp gain
   * @param value - The gain value: raw OSC float (0.0-1.0) or level in dB (-12 to +60dB)
   * @param unit - Optional unit parameter. If 'decibels' is provided, value should be in dB
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await preamp.updateGain(0.5);
   *
   * // Set using decibels (-12 to +60dB)
   * await preamp.updateGain(30, 'decibels');
   */
  updateGain: AsyncSetter<Unit<'decibels', number>, 'float'>;

  /**
   * Fetch the current preamp gain
   * @param unit - Optional unit parameter. If 'decibels' is provided, returns level in dB
   * @returns Promise that resolves to either raw OSC float (0.0-1.0) or level in dB (-12 to +60dB)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawGain = await preamp.fetchGain();
   *
   * // Get gain level in dB (-12 to +60dB)
   * const gainDb = await preamp.fetchGain('decibels');
   */
  fetchGain: AsyncGetter<Unit<'decibels', number>, 'float'>;

  /**
   * Fetch the current phantom power enabled state
   * @param unit - Optional unit parameter. If 'flag' is provided, returns boolean value
   * @returns Promise that resolves to either raw OSC integer (0/1) or boolean
   * @example
   * // Get raw OSC value (0 = disabled, 1 = enabled)
   * const rawEnabled = await preamp.fetchIsPhantomPowerEnabled();
   *
   * // Get boolean value
   * const isEnabled = await preamp.fetchIsPhantomPowerEnabled('flag');
   */
  fetchIsPhantomPowerEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Update the phantom power enabled state
   * @param value - The enabled state: raw OSC integer (0/1) or boolean
   * @param unit - Optional unit parameter. If 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = disabled, 1 = enabled)
   * await preamp.updatePhantomPowerEnabled(1);
   *
   * // Set using boolean
   * await preamp.updatePhantomPowerEnabled(true, 'flag');
   */
  updatePhantomPowerEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
};

type ChannelPreampDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelPreamp = (dependencies: ChannelPreampDependencies): ChannelPreamp => {
  const { channel, oscClient } = dependencies;
  const channelNumber = channel.toString().padStart(2, '0');
  const oscBaseAddress = `/ch/${channelNumber}/preamp`;
  const headAmpOscBaseAddress = `/headamp/${channelNumber}`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const lowcut = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/hpon`,
    onOffParameterConfig,
  );
  const usbSwitch = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/rtnsw`,
    onOffParameterConfig,
  );
  const polaritySwitch = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/invert`,
    onOffParameterConfig,
  );
  const lowcutFreq = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/hpf`,
    createLogarithmicParameterConfig<'hertz'>(20, 400),
  );
  const usbtrim = oscParameterFactory.createOSCParameter<Unit<'decibels', number>, 'float'>(
    `${oscBaseAddress}/rtntrim`,
    createLinearParameterConfig<'decibels'>(-18, 18),
  );
  const gain = oscParameterFactory.createOSCParameter<Unit<'decibels', number>, 'float'>(
    `${headAmpOscBaseAddress}/gain`,
    createLinearParameterConfig<'decibels'>(-12, 60),
  );
  const phantom = oscParameterFactory.createOSCParameter(
    `${headAmpOscBaseAddress}/phantom`,
    onOffParameterConfig,
  );

  return {
    fetchLowCutFrequency: lowcutFreq.fetch,
    updateLowCutFrequency: lowcutFreq.update,
    fetchUSBTrim: usbtrim.fetch,
    updateUSBTrim: usbtrim.update,
    fetchIsLowCutEnabled: lowcut.fetch,
    updateLowCutEnabled: lowcut.update,
    fetchIsPolarityInverted: polaritySwitch.fetch,
    updatePolarityInverted: polaritySwitch.update,
    fetchIsUSBReturnEnabled: usbSwitch.fetch,
    updateUSBReturnEnabled: usbSwitch.update,
    fetchGain: gain.fetch,
    updateGain: gain.update,
    fetchIsPhantomPowerEnabled: phantom.fetch,
    updatePhantomPowerEnabled: phantom.update,
  };
};
