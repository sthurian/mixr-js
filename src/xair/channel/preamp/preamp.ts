import { OSCClient } from '../../../osc/client.js';
import { createLinearParameterConfig } from '../../mapper/linear.js';
import { createLogarithmicParameterConfig } from '../../mapper/log.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';
import { MixerModel } from '../../models.js';
import { createOSCParameterFactory } from '../../osc-parameter.js';
type XR12ChannelPreamp = {
  /**
   * Fetch the current low cut filter enabled state
   * @returns Promise that resolves to raw OSC integer (0/1)
   * @example
   * // Get raw OSC value (0 = disabled, 1 = enabled)
   * const rawEnabled = await preamp.fetchIsLowCutEnabled();
   */
  fetchIsLowCutEnabled(): Promise<number>;
  /**
   * Fetch the current low cut filter enabled state
   * @param unit - Unit parameter. When 'flag' is provided, returns boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isEnabled = await preamp.fetchIsLowCutEnabled('flag');
   */
  fetchIsLowCutEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the low cut filter enabled state
   * @param value - The enabled state as raw OSC integer (0/1)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = disabled, 1 = enabled)
   * await preamp.updateLowCutEnabled(1);
   */
  updateLowCutEnabled(value: number): Promise<void>;
  /**
   * Update the low cut filter enabled state
   * @param value - The enabled state as boolean
   * @param unit - Unit parameter. When 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await preamp.updateLowCutEnabled(true, 'flag');
   */
  updateLowCutEnabled(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Fetch the current polarity inversion state
   * @returns Promise that resolves to raw OSC integer (0/1)
   * @example
   * // Get raw OSC value (0 = normal, 1 = inverted)
   * const rawInverted = await preamp.fetchIsPolarityInverted();
   */
  fetchIsPolarityInverted(): Promise<number>;
  /**
   * Fetch the current polarity inversion state
   * @param unit - Unit parameter. When 'flag' is provided, returns boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isInverted = await preamp.fetchIsPolarityInverted('flag');
   */
  fetchIsPolarityInverted(unit: 'flag'): Promise<boolean>;

  /**
   * Update the polarity inversion state
   * @param value - The inversion state as raw OSC integer (0/1)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = normal, 1 = inverted)
   * await preamp.updatePolarityInverted(1);
   */
  updatePolarityInverted(value: number): Promise<void>;
  /**
   * Update the polarity inversion state
   * @param value - The inversion state as boolean
   * @param unit - Unit parameter. When 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await preamp.updatePolarityInverted(true, 'flag');
   */
  updatePolarityInverted(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Update the low cut filter frequency
   * @param value - The frequency value as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await preamp.updateLowCutFrequency(0.5);
   */
  updateLowCutFrequency(value: number): Promise<void>;
  /**
   * Update the low cut filter frequency
   * @param value - The frequency value in Hz (20-400Hz)
   * @param unit - Unit parameter. When 'hertz' is provided, value should be in Hz
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using frequency in Hz (20 to 400Hz)
   * await preamp.updateLowCutFrequency(100, 'hertz');
   */
  updateLowCutFrequency(value: number, unit: 'hertz'): Promise<void>;

  /**
   * Fetch the current low cut filter frequency
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawFreq = await preamp.fetchLowCutFrequency();
   */
  fetchLowCutFrequency(): Promise<number>;
  /**
   * Fetch the current low cut filter frequency
   * @param unit - Unit parameter. When 'hertz' is provided, returns frequency in Hz
   * @returns Promise that resolves to frequency in Hz (20-400Hz)
   * @example
   * // Get frequency in Hz (20 to 400Hz)
   * const freqHz = await preamp.fetchLowCutFrequency('hertz');
   */
  fetchLowCutFrequency(unit: 'hertz'): Promise<number>;

  /**
   * Update the preamp gain
   * @param value - The gain value as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await preamp.updateGain(0.5);
   */
  updateGain(value: number): Promise<void>;
  /**
   * Update the preamp gain
   * @param value - The gain value in dB (-12 to +60dB)
   * @param unit - Unit parameter. When 'decibels' is provided, value should be in dB
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using decibels (-12 to +60dB)
   * await preamp.updateGain(30, 'decibels');
   */
  updateGain(value: number, unit: 'decibels'): Promise<void>;

  /**
   * Fetch the current preamp gain
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawGain = await preamp.fetchGain();
   */
  fetchGain(): Promise<number>;
  /**
   * Fetch the current preamp gain
   * @param unit - Unit parameter. When 'decibels' is provided, returns level in dB
   * @returns Promise that resolves to level in dB (-12 to +60dB)
   * @example
   * // Get gain level in dB (-12 to +60dB)
   * const gainDb = await preamp.fetchGain('decibels');
   */
  fetchGain(unit: 'decibels'): Promise<number>;

  /**
   * Fetch the current phantom power enabled state
   * @returns Promise that resolves to raw OSC integer (0/1)
   * @example
   * // Get raw OSC value (0 = disabled, 1 = enabled)
   * const rawEnabled = await preamp.fetchIsPhantomPowerEnabled();
   */
  fetchIsPhantomPowerEnabled(): Promise<number>;
  /**
   * Fetch the current phantom power enabled state
   * @param unit - Unit parameter. When 'flag' is provided, returns boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isEnabled = await preamp.fetchIsPhantomPowerEnabled('flag');
   */
  fetchIsPhantomPowerEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the phantom power enabled state
   * @param value - The enabled state as raw OSC integer (0/1)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = disabled, 1 = enabled)
   * await preamp.updatePhantomPowerEnabled(1);
   */
  updatePhantomPowerEnabled(value: number): Promise<void>;
  /**
   * Update the phantom power enabled state
   * @param value - The enabled state as boolean
   * @param unit - Unit parameter. When 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await preamp.updatePhantomPowerEnabled(true, 'flag');
   */
  updatePhantomPowerEnabled(value: boolean, unit: 'flag'): Promise<void>;
};

type XR16ChannelPreamp = XR12ChannelPreamp;

type XR18ChannelPreamp = XR16ChannelPreamp & {
  /**
   * Update the USB return trim level
   * @param value - The trim value as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.0 to 1.0)
   * await preamp.updateUSBTrim(0.75);
   */
  updateUSBTrim(value: number): Promise<void>;
  /**
   * Update the USB return trim level
   * @param value - The trim value in dB (-18 to +18dB)
   * @param unit - Unit parameter. When 'decibels' is provided, value should be in dB
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using decibels (-18 to +18dB)
   * await preamp.updateUSBTrim(-6, 'decibels');
   */
  updateUSBTrim(value: number, unit: 'decibels'): Promise<void>;

  /**
   * Fetch the current USB return trim level
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value (0.0 to 1.0)
   * const rawTrim = await preamp.fetchUSBTrim();
   */
  fetchUSBTrim(): Promise<number>;
  /**
   * Fetch the current USB return trim level
   * @param unit - Unit parameter. When 'decibels' is provided, returns level in dB
   * @returns Promise that resolves to level in dB (-18 to +18dB)
   * @example
   * // Get trim level in dB (-18 to +18dB)
   * const trimDb = await preamp.fetchUSBTrim('decibels');
   */
  fetchUSBTrim(unit: 'decibels'): Promise<number>;

  /**
   * Fetch the current USB return enabled state
   * @returns Promise that resolves to raw OSC integer (0/1)
   * @example
   * // Get raw OSC value (0 = disabled, 1 = enabled)
   * const rawEnabled = await preamp.fetchIsUSBReturnEnabled();
   */
  fetchIsUSBReturnEnabled(): Promise<number>;
  /**
   * Fetch the current USB return enabled state
   * @param unit - Unit parameter. When 'flag' is provided, returns boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isEnabled = await preamp.fetchIsUSBReturnEnabled('flag');
   */
  fetchIsUSBReturnEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the USB return enabled state
   * @param value - The enabled state as raw OSC integer (0/1)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = disabled, 1 = enabled)
   * await preamp.updateUSBReturnEnabled(1);
   */
  updateUSBReturnEnabled(value: number): Promise<void>;
  /**
   * Update the USB return enabled state
   * @param value - The enabled state as boolean
   * @param unit - Unit parameter. When 'flag' is provided, value should be boolean
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await preamp.updateUSBReturnEnabled(true, 'flag');
   */
  updateUSBReturnEnabled(value: boolean, unit: 'flag'): Promise<void>;
};

export type ChannelPreamp<M extends MixerModel> = M extends 'XR12'
  ? XR12ChannelPreamp
  : M extends 'XR16'
    ? XR16ChannelPreamp
    : XR18ChannelPreamp;
export type ChannelPreampDependencies<M extends MixerModel> = {
  channel: number;
  oscClient: OSCClient;
  model: M;
};
export function createChannelPreamp<M extends 'XR12'>(
  dependencies: ChannelPreampDependencies<M>,
): XR12ChannelPreamp;
export function createChannelPreamp<M extends 'XR16'>(
  dependencies: ChannelPreampDependencies<M>,
): XR16ChannelPreamp;
export function createChannelPreamp<M extends 'XR18'>(
  dependencies: ChannelPreampDependencies<M>,
): XR18ChannelPreamp;
export function createChannelPreamp(
  dependencies: ChannelPreampDependencies<MixerModel>,
): ChannelPreamp<MixerModel> {
  const { channel, oscClient, model } = dependencies;
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
  const usbtrim = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/rtntrim`,
    createLinearParameterConfig<'decibels'>(-18, 18),
  );
  const gain = oscParameterFactory.createOSCParameter(
    `${headAmpOscBaseAddress}/gain`,
    createLinearParameterConfig<'decibels'>(-12, 60),
  );
  const phantom = oscParameterFactory.createOSCParameter(
    `${headAmpOscBaseAddress}/phantom`,
    onOffParameterConfig,
  );

  if (model !== 'XR18') {
    return {
      fetchIsLowCutEnabled: lowcut.fetch,
      updateLowCutEnabled: lowcut.update,
      fetchIsPolarityInverted: polaritySwitch.fetch,
      updatePolarityInverted: polaritySwitch.update,
      updateLowCutFrequency: lowcutFreq.update,
      fetchLowCutFrequency: lowcutFreq.fetch,
      updateGain: gain.update,
      fetchGain: gain.fetch,
      fetchIsPhantomPowerEnabled: phantom.fetch,
      updatePhantomPowerEnabled: phantom.update,
    };
  }

  return {
    fetchIsLowCutEnabled: lowcut.fetch,
    updateLowCutEnabled: lowcut.update,
    fetchIsPolarityInverted: polaritySwitch.fetch,
    updatePolarityInverted: polaritySwitch.update,
    fetchIsUSBReturnEnabled: usbSwitch.fetch,
    updateUSBReturnEnabled: usbSwitch.update,
    updateLowCutFrequency: lowcutFreq.update,
    fetchLowCutFrequency: lowcutFreq.fetch,
    updateUSBTrim: usbtrim.update,
    fetchUSBTrim: usbtrim.fetch,
    updateGain: gain.update,
    fetchGain: gain.fetch,
    fetchIsPhantomPowerEnabled: phantom.fetch,
    updatePhantomPowerEnabled: phantom.update,
  };
}
