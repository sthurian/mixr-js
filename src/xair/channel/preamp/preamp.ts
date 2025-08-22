import { OSCClient } from '../../../osc/client.js';
import { createEntityFactory } from '../../entity.js';
import { createLinearParameterConfig } from '../../mapper/linear.js';
import { createLogarithmicMapper } from '../../mapper/log.js';
import { onOffMapper } from '../../mapper/on-off.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory } from '../../osc-parameter.js';

export type ChannelPreamp = {
  fetchIsLowCutEnabled: () => Promise<boolean>;
  updateLowCutEnabled: (enabled: boolean) => Promise<void>;
  fetchIsPolarityInverted: () => Promise<boolean>;
  updatePolarityInverted: (enabled: boolean) => Promise<void>;
  fetchIsUSBReturnEnabled: () => Promise<boolean>;
  updateUSBReturnEnabled: (enabled: boolean) => Promise<void>;
  updateLowCutFrequency: (frequency: number) => Promise<void>;
  fetchLowCutFrequency: () => Promise<number>;
  updateUSBTrim: AsyncSetter<'decibels', 'float', number>;
  fetchUSBTrim: AsyncGetter<'decibels', 'float', number>;
  updateGain: AsyncSetter<'decibels', 'float', number>;
  fetchGain: AsyncGetter<'decibels', 'float', number>;
  fetchIsPhantomPowerEnabled: () => Promise<boolean>;
  updatePhantomPowerEnabled: (enabled: boolean) => Promise<void>;
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
  const entityFactory = createEntityFactory(oscClient);
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const lowcut = entityFactory.createEntity(`${oscBaseAddress}/hpon`, onOffMapper);
  const usbSwitch = entityFactory.createEntity(`${oscBaseAddress}/rtnsw`, onOffMapper);
  const polaritySwitch = entityFactory.createEntity(`${oscBaseAddress}/invert`, onOffMapper);
  const lowcutFreq = entityFactory.createEntity(
    `${oscBaseAddress}/hpf`,
    createLogarithmicMapper(20, 400),
  );
  const usbtrim = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/rtntrim`,
    createLinearParameterConfig<'decibels'>(-18, 18),
  );
  const gain = oscParameterFactory.createOSCParameter(
    `${headAmpOscBaseAddress}/gain`,
    createLinearParameterConfig<'decibels'>(-12, 60),
  );
  const phantom = entityFactory.createEntity(`${headAmpOscBaseAddress}/phantom`, onOffMapper);

  return {
    fetchLowCutFrequency: lowcutFreq.get,
    updateLowCutFrequency: lowcutFreq.set,
    fetchUSBTrim: usbtrim.fetch,
    updateUSBTrim: usbtrim.update,
    fetchIsLowCutEnabled: lowcut.get,
    updateLowCutEnabled: lowcut.set,
    fetchIsPolarityInverted: polaritySwitch.get,
    updatePolarityInverted: polaritySwitch.set,
    fetchIsUSBReturnEnabled: usbSwitch.get,
    updateUSBReturnEnabled: usbSwitch.set,
    fetchGain: gain.fetch,
    updateGain: gain.update,
    fetchIsPhantomPowerEnabled: phantom.get,
    updatePhantomPowerEnabled: phantom.set,
  };
};
