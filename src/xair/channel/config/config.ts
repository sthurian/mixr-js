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
  fetchAnalogSource: AsyncGetter<Unit<'inputSource', ChannelAnalogInputSource>, 'integer'>;
  updateAnalogSource: AsyncSetter<Unit<'inputSource', ChannelAnalogInputSource>, 'integer'>;
  fetchColor: AsyncGetter<Unit<'color', ChannelColor>, 'integer'>;
  updateColor: AsyncSetter<Unit<'color', ChannelColor>, 'integer'>;
  fetchName: AsyncGetter<Unit<'string', string>, 'string'>;
  updateName: AsyncSetter<Unit<'string', string>, 'string'>;
  fetchUsbReturnSource: AsyncGetter<Unit<'usbReturnSource', ChannelUsbReturnSource>, 'integer'>;
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
