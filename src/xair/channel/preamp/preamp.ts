import { OSCClient } from '../../../osc/client.js';
import { createEntityFactory } from '../../entity.js';
import { createLinearMapper } from '../../mapper/linear.js';
import { createLogarithmicMapper } from '../../mapper/log.js';
import { onOffMapper } from '../../mapper/on-off.js';

export type ChannelPreamp = {
  fetchIsLowCutEnabled: () => Promise<boolean>;
  updateLowCutEnabled: (enabled: boolean) => Promise<void>;
  fetchIsPolarityInverted: () => Promise<boolean>;
  updatePolarityInverted: (enabled: boolean) => Promise<void>;
  fetchIsUSBReturnEnabled: () => Promise<boolean>;
  updateUSBReturnEnabled: (enabled: boolean) => Promise<void>;
  updateLowCutFrequency: (frequency: number) => Promise<void>;
  fetchLowCutFrequency: () => Promise<number>;
  updateUSBTrim: (frequency: number) => Promise<void>;
  fetchUSBTrim: () => Promise<number>;
  updateGain: (gain: number) => Promise<void>;
  fetchGain: () => Promise<number>;
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
  const lowcut = entityFactory.createEntity(`${oscBaseAddress}/hpon`, onOffMapper);
  const usbSwitch = entityFactory.createEntity(`${oscBaseAddress}/rtnsw`, onOffMapper);
  const polaritySwitch = entityFactory.createEntity(`${oscBaseAddress}/invert`, onOffMapper);
  const lowcutFreq = entityFactory.createEntity(
    `${oscBaseAddress}/hpf`,
    createLogarithmicMapper(20, 400),
  );
  const usbtrim = entityFactory.createEntity(
    `${oscBaseAddress}/rtntrim`,
    createLinearMapper(-18, 18),
  );
  const gain = entityFactory.createEntity(
    `${headAmpOscBaseAddress}/gain`,
    createLinearMapper(-12, 60),
  );
  const phantom = entityFactory.createEntity(`${headAmpOscBaseAddress}/phantom`, onOffMapper);

  return {
    fetchLowCutFrequency: lowcutFreq.get,
    updateLowCutFrequency: lowcutFreq.set,
    fetchUSBTrim: usbtrim.get,
    updateUSBTrim: usbtrim.set,
    fetchIsLowCutEnabled: lowcut.get,
    updateLowCutEnabled: lowcut.set,
    fetchIsPolarityInverted: polaritySwitch.get,
    updatePolarityInverted: polaritySwitch.set,
    fetchIsUSBReturnEnabled: usbSwitch.get,
    updateUSBReturnEnabled: usbSwitch.set,
    fetchGain: gain.get,
    updateGain: gain.set,
    fetchIsPhantomPowerEnabled: phantom.get,
    updatePhantomPowerEnabled: phantom.set,
  };
};
