import { OSCClient } from '../../../osc/client.js';
import { stringOscParameterConfig } from '../../mapper/single-string.js';
import { createOSCParameterFactory } from '../../osc-parameter.js';
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
   */
  fetchAnalogSource(): Promise<number>;
  /**
   * Fetch the current analog input source assignment
   */
  fetchAnalogSource(unit: 'inputSource'): Promise<ChannelAnalogInputSource>;

  /**
   * Update the analog input source assignment
   */
  updateAnalogSource(value: number): Promise<void>;
  /**
   * Update the analog input source assignment
   */
  updateAnalogSource(value: ChannelAnalogInputSource, unit: 'inputSource'): Promise<void>;

  /**
   * Fetch the current channel color
   */
  fetchColor(): Promise<number>;
  /**
   * Fetch the current channel color
   */
  fetchColor(unit: 'color'): Promise<ChannelColor>;

  /**
   * Update the channel color
   */
  updateColor(value: number): Promise<void>;
  /**
   * Update the channel color
   */
  updateColor(value: ChannelColor, unit: 'color'): Promise<void>;

  /**
   * Fetch the current channel name
   */
  fetchName(): Promise<string>;
  /**
   * Fetch the current channel name
   */
  fetchName(unit: 'string'): Promise<string>;

  /**
   * Update the channel name
   */
  updateName(value: string): Promise<void>;
  /**
   * Update the channel name
   */
  updateName(value: string, unit: 'string'): Promise<void>;

  /**
   * Fetch the current USB return source assignment
   */
  fetchUsbReturnSource(): Promise<number>;
  /**
   * Fetch the current USB return source assignment
   */
  fetchUsbReturnSource(unit: 'usbReturnSource'): Promise<ChannelUsbReturnSource>;

  /**
   * Update the USB return source assignment
   */
  updateUsbReturnSource(value: number): Promise<void>;
  /**
   * Update the USB return source assignment
   */
  updateUsbReturnSource(value: ChannelUsbReturnSource, unit: 'usbReturnSource'): Promise<void>;
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
