import { OSCClient } from '../../../../osc/client.js';
import { createLogarithmicParameterConfig } from '../../../mapper/log.js';
import { onOffParameterConfig } from '../../../mapper/on-off.js';
import {
  AsyncGetter,
  AsyncSetter,
  createOSCParameterFactory,
  Unit,
} from '../../../osc-parameter.js';
import { CompressorFilterType, compressorFilterTypeParameterConfig } from './mapper/filter-type.js';

export type DynamicsFilter = {
  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  updateFrequency: AsyncSetter<Unit<'hertz', number>, 'float'>;
  fetchFrequency: AsyncGetter<Unit<'hertz', number>, 'float'>;
  updateType: AsyncSetter<Unit<'filterType', CompressorFilterType>, 'integer'>;
  fetchType: AsyncGetter<Unit<'filterType', CompressorFilterType>, 'integer'>;
};

type DynamicsFilterDependencies = {
  channel: number;
  oscClient: OSCClient;
  dynamicsType: 'compressor' | 'gate';
};

export const createDynamicsFilter = (dependencies: DynamicsFilterDependencies): DynamicsFilter => {
  const { channel, oscClient, dynamicsType } = dependencies;
  const oscDynamicsPath = dynamicsType === 'compressor' ? 'dyn' : 'gate';
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/${oscDynamicsPath}/filter`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );
  const frequency = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/f`,
    createLogarithmicParameterConfig<'hertz'>(20, 20000),
  );
  const type = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/type`,
    compressorFilterTypeParameterConfig,
  );

  return {
    fetchIsEnabled: enabled.fetch,
    updateEnabled: enabled.update,
    fetchFrequency: frequency.fetch,
    updateFrequency: frequency.update,
    fetchType: type.fetch,
    updateType: type.update,
  };
};
