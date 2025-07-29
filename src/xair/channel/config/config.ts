import { OSCClient } from '../../../osc/client.js';
import { createEntityFactory } from '../../entity.js';
import { singleStringMapper } from '../../mapper/single-string.js';
import { ChannelColor, channelColorMapper } from './mapper/color.js';
import { ChannelAnalogInputSource, channelAnalogInputSourceMapper } from './mapper/input-source.js';
import {
  ChannelUsbReturnSource,
  channelUsbReturnSourceMapper,
} from './mapper/usb-return-source.js';

export type ChannelConfig = {
  fetchAnalogSource: () => Promise<ChannelAnalogInputSource>;
  updateAnalogSource: (source: ChannelAnalogInputSource) => Promise<void>;
  fetchColor: () => Promise<ChannelColor>;
  updateColor: (color: ChannelColor) => Promise<void>;
  fetchName: () => Promise<string>;
  updateName: (name: string) => Promise<void>;
  fetchUsbReturnSource: () => Promise<ChannelUsbReturnSource>;
  updateUsbReturnSource: (source: ChannelUsbReturnSource) => Promise<void>;
};

type ChannelConfigDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelConfig = (dependencies: ChannelConfigDependencies): ChannelConfig => {
  const { channel, oscClient } = dependencies;
  const entityFactory = createEntityFactory(oscClient);
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/config`;
  const name = entityFactory.createEntity(`${oscBaseAddress}/name`, singleStringMapper);
  const color = entityFactory.createEntity(`${oscBaseAddress}/color`, channelColorMapper);
  const analogInputSource = entityFactory.createEntity(
    `${oscBaseAddress}/insrc`,
    channelAnalogInputSourceMapper,
  );
  const usbReturnSource = entityFactory.createEntity(
    `${oscBaseAddress}/rtnsrc`,
    channelUsbReturnSourceMapper,
  );

  return {
    fetchName: name.get,
    updateName: name.set,
    fetchColor: color.get,
    updateColor: color.set,
    fetchAnalogSource: analogInputSource.get,
    updateAnalogSource: analogInputSource.set,
    fetchUsbReturnSource: usbReturnSource.get,
    updateUsbReturnSource: usbReturnSource.set,
  };
};
