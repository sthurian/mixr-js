import { OSCClient } from '../../../osc/client.js';
import { stringOscParameterConfig } from '../../mapper/single-string.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../../osc-parameter.js';
import { ChannelColor, channelColorParameterConfig } from './parameter/color.js';
import {
  ChannelAnalogInputSource,
  channelAnalogInputSourceParameterConfig,
} from './parameter/input-source.js';
import {
  ChannelUsbReturnSource,
  channelUsbReturnSourceParameterConfig,
} from './parameter/usb-return-source.js';

export type ChannelConfig = {
  /**
   * Fetch the current analog input source assignment
   * @param unit - Optional unit parameter. If 'inputSource' is provided, returns the source name string
   * @returns Promise that resolves to either raw OSC integer (0-18) or input source name string
   * @example
   * // Get raw OSC value (0-18)
   * const rawSource = await config.fetchAnalogSource();
   * 
   * // Get input source name ('INP 01', 'INP 02', ..., 'LINE 17', 'LINE 18', 'OFF')
   * const sourceName = await config.fetchAnalogSource('inputSource');
   */
  fetchAnalogSource: AsyncGetter<Unit<'inputSource', ChannelAnalogInputSource>, 'integer'>;
  
  /**
   * Update the analog input source assignment
   * @param value - The input source value: raw OSC integer (0-18) or source name string
   * @param unit - Optional unit parameter. If 'inputSource' is provided, value should be a source name string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = 'INP 01', 18 = 'OFF')
   * await config.updateAnalogSource(0);
   * 
   * // Set using source name
   * await config.updateAnalogSource('INP 01', 'inputSource');
   */
  updateAnalogSource: AsyncSetter<Unit<'inputSource', ChannelAnalogInputSource>, 'integer'>;
  
  /**
   * Fetch the current channel color
   * @param unit - Optional unit parameter. If 'color' is provided, returns the color name string
   * @returns Promise that resolves to either raw OSC integer (0-15) or color name string ('Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White', 'Black Inv', 'Red Inv', 'Green Inv', 'Yellow Inv', 'Blue Inv', 'Magenta Inv', 'Cyan Inv', 'White Inv')
   * @example
   * // Get raw OSC value (0-15)
   * const rawColor = await config.fetchColor();
   * 
   * // Get color name ('Black', 'Red', 'Green', etc.)
   * const colorName = await config.fetchColor('color');
   */
  fetchColor: AsyncGetter<Unit<'color', ChannelColor>, 'integer'>;
  
  /**
   * Update the channel color
   * @param value - The color value: raw OSC integer (0-15) or color name string ('Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White', 'Black Inv', 'Red Inv', 'Green Inv', 'Yellow Inv', 'Blue Inv', 'Magenta Inv', 'Cyan Inv', 'White Inv')
   * @param unit - Optional unit parameter. If 'color' is provided, value should be a color name string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = 'Black', 1 = 'Red', etc.)
   * await config.updateColor(1);
   * 
   * // Set using color name
   * await config.updateColor('Red', 'color');
   */
  updateColor: AsyncSetter<Unit<'color', ChannelColor>, 'integer'>;
  
  /**
   * Fetch the current channel name
   * @param unit - Optional unit parameter. If 'string' is provided, returns the string value (same as raw)
   * @returns Promise that resolves to the channel name string
   * @example
   * // Get channel name (both calls return the same string)
   * const name = await config.fetchName();
   * const nameWithUnit = await config.fetchName('string');
   */
  fetchName: AsyncGetter<Unit<'string', string>, 'string'>;
  
  /**
   * Update the channel name
   * @param value - The channel name string
   * @param unit - Optional unit parameter. If 'string' is provided, no conversion is performed
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set channel name (both calls do the same thing)
   * await config.updateName('Lead Vocal');
   * await config.updateName('Lead Vocal', 'string');
   */
  updateName: AsyncSetter<Unit<'string', string>, 'string'>;
  
  /**
   * Fetch the current USB return source assignment
   * @param unit - Optional unit parameter. If 'usbReturnSource' is provided, returns the USB source name string
   * @returns Promise that resolves to either raw OSC integer (0-17) or USB source name string
   * @example
   * // Get raw OSC value (0-17)
   * const rawUsbSource = await config.fetchUsbReturnSource();
   * 
   * // Get USB source name ('USB 01', 'USB 02', ..., 'USB 18')
   * const usbSourceName = await config.fetchUsbReturnSource('usbReturnSource');
   */
  fetchUsbReturnSource: AsyncGetter<Unit<'usbReturnSource', ChannelUsbReturnSource>, 'integer'>;
  
  /**
   * Update the USB return source assignment
   * @param value - The USB source value: raw OSC integer (0-17) or USB source name string
   * @param unit - Optional unit parameter. If 'usbReturnSource' is provided, value should be a USB source name string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0 = 'USB 01', 17 = 'USB 18')
   * await config.updateUsbReturnSource(0);
   * 
   * // Set using USB source name
   * await config.updateUsbReturnSource('USB 01', 'usbReturnSource');
   */
  updateUsbReturnSource: AsyncSetter<Unit<'usbReturnSource', ChannelUsbReturnSource>, 'integer'>;
};

type ChannelConfigDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelConfig = (dependencies: ChannelConfigDependencies): ChannelConfig => {
  const { channel, oscClient } = dependencies;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/config`;
  const name = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/name`,
    stringOscParameterConfig,
  );
  const color = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/color`,
    channelColorParameterConfig,
  );
  const analogInputSource = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/insrc`,
    channelAnalogInputSourceParameterConfig,
  );
  const usbReturnSource = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/rtnsrc`,
    channelUsbReturnSourceParameterConfig,
  );

  return {
    fetchName: name.fetch,
    updateName: name.update,
    fetchColor: color.fetch,
    updateColor: color.update,
    fetchAnalogSource: analogInputSource.fetch,
    updateAnalogSource: analogInputSource.update,
    fetchUsbReturnSource: usbReturnSource.fetch,
    updateUsbReturnSource: usbReturnSource.update,
  };
};
