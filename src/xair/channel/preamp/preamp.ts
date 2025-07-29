import { OSCClient } from '../../../osc/client.js';
import { createLinearParameterConfig } from '../../mapper/linear.js';
import { createLogarithmicParameterConfig } from '../../mapper/log.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../../osc-parameter.js';

export type ChannelPreamp = {
  fetchIsLowCutEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  updateLowCutEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
  fetchIsPolarityInverted: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  updatePolarityInverted: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
  fetchIsUSBReturnEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  updateUSBReturnEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
  updateLowCutFrequency: AsyncSetter<Unit<'hertz', number>, 'float'>;
  fetchLowCutFrequency: AsyncGetter<Unit<'hertz', number>, 'float'>;
  updateUSBTrim: AsyncSetter<Unit<'decibels', number>, 'float'>;
  fetchUSBTrim: AsyncGetter<Unit<'decibels', number>, 'float'>;
  updateGain: AsyncSetter<Unit<'decibels', number>, 'float'>;
  fetchGain: AsyncGetter<Unit<'decibels', number>, 'float'>;
  fetchIsPhantomPowerEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
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
