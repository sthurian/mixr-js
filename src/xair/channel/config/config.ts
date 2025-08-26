import { OSCClient } from '../../../osc/client.js';
import { createOSCParameterFactory } from '../../osc-parameter.js';
import {
  ChannelAnalogInputSource,
  channelAnalogInputSourceParameterConfig,
} from './parameter/input-source.js';
import {
  ChannelUsbReturnSource,
  channelUsbReturnSourceParameterConfig,
} from './parameter/usb-return-source.js';
import { Config, createConfig } from '../../config/config.js';

export type ChannelConfig = Config & {
  /**
   * Fetch the current analog input source assignment as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-18, where 0-15 = INP 01-16, 16-17 = LINE 17-18, 18 = OFF)
   * @example
   * // Get raw OSC value
   * const rawSource = await config.fetchAnalogSource();
   * // rawSource: 0 = INP 01, 1 = INP 02, ..., 15 = INP 16, 16 = LINE 17, 17 = LINE 18, 18 = OFF
   */
  fetchAnalogSource(): Promise<number>;

  /**
   * Fetch the current analog input source assignment as input source name
   * @param unit - Must be 'inputSource' to get input source name
   * @returns Promise that resolves to input source name ('INP 01'-'INP 16', 'LINE 17', 'LINE 18', 'OFF')
   * @example
   * // Get input source name
   * const sourceName = await config.fetchAnalogSource('inputSource');
   * // sourceName: 'INP 01', 'INP 02', ..., 'INP 16', 'LINE 17', 'LINE 18', 'OFF'
   */
  fetchAnalogSource(unit: 'inputSource'): Promise<ChannelAnalogInputSource>;

  /**
   * Update the analog input source assignment using raw OSC value
   * @param value - The input source as raw OSC integer (0-18, where 0-15 = INP 01-16, 16-17 = LINE 17-18, 18 = OFF)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set to INP 01 using raw OSC value
   * await config.updateAnalogSource(0);
   *
   * // Set to LINE 17 using raw OSC value
   * await config.updateAnalogSource(16);
   *
   * // Set to OFF using raw OSC value
   * await config.updateAnalogSource(18);
   */
  updateAnalogSource(value: number): Promise<void>;

  /**
   * Update the analog input source assignment using input source name
   * @param value - The input source name ('INP 01'-'INP 16', 'LINE 17', 'LINE 18', 'OFF')
   * @param unit - Must be 'inputSource' when using input source names
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set to INP 01 using source name
   * await config.updateAnalogSource('INP 01', 'inputSource');
   *
   * // Set to LINE 17 using source name
   * await config.updateAnalogSource('LINE 17', 'inputSource');
   *
   * // Set to OFF using source name
   * await config.updateAnalogSource('OFF', 'inputSource');
   */
  updateAnalogSource(value: ChannelAnalogInputSource, unit: 'inputSource'): Promise<void>;

  /**
   * Fetch the current USB return source assignment as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-17, where 0-17 = USB 01-18)
   * @example
   * // Get raw OSC value
   * const rawUsbSource = await config.fetchUsbReturnSource();
   * // rawUsbSource: 0 = USB 01, 1 = USB 02, ..., 17 = USB 18
   */
  fetchUsbReturnSource(): Promise<number>;

  /**
   * Fetch the current USB return source assignment as USB source name
   * @param unit - Must be 'usbReturnSource' to get USB source name
   * @returns Promise that resolves to USB source name ('USB 01'-'USB 18')
   * @example
   * // Get USB source name
   * const usbSourceName = await config.fetchUsbReturnSource('usbReturnSource');
   * // usbSourceName: 'USB 01', 'USB 02', ..., 'USB 18'
   */
  fetchUsbReturnSource(unit: 'usbReturnSource'): Promise<ChannelUsbReturnSource>;

  /**
   * Update the USB return source assignment using raw OSC value
   * @param value - The USB source as raw OSC integer (0-17, where 0-17 = USB 01-18)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set to USB 01 using raw OSC value
   * await config.updateUsbReturnSource(0);
   *
   * // Set to USB 10 using raw OSC value
   * await config.updateUsbReturnSource(9);
   *
   * // Set to USB 18 using raw OSC value
   * await config.updateUsbReturnSource(17);
   */
  updateUsbReturnSource(value: number): Promise<void>;

  /**
   * Update the USB return source assignment using USB source name
   * @param value - The USB source name ('USB 01'-'USB 18')
   * @param unit - Must be 'usbReturnSource' when using USB source names
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set to USB 01 using source name
   * await config.updateUsbReturnSource('USB 01', 'usbReturnSource');
   *
   * // Set to USB 10 using source name
   * await config.updateUsbReturnSource('USB 10', 'usbReturnSource');
   *
   * // Set to USB 18 using source name
   * await config.updateUsbReturnSource('USB 18', 'usbReturnSource');
   */
  updateUsbReturnSource(value: ChannelUsbReturnSource, unit: 'usbReturnSource'): Promise<void>;
};

export type ChannelConfigDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelConfig = (dependencies: ChannelConfigDependencies): ChannelConfig => {
  const { channel, oscClient } = dependencies;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const oscBasePath = `/ch/${channel.toString().padStart(2, '0')}`;
  const oscBaseAddress = `${oscBasePath}/config`;
  const analogInputSource = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/insrc`,
    channelAnalogInputSourceParameterConfig,
  );
  const usbReturnSource = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/rtnsrc`,
    channelUsbReturnSourceParameterConfig,
  );
  const config = createConfig({ oscBasePath, oscClient });

  return {
    ...config,
    fetchAnalogSource: analogInputSource.fetch,
    updateAnalogSource: analogInputSource.update,
    fetchUsbReturnSource: usbReturnSource.fetch,
    updateUsbReturnSource: usbReturnSource.update,
  };
};
