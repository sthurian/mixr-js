import { OSCClient } from '../../osc/client.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../osc-parameter.js';
import { levelParamaterConfig } from '../mapper/level.js';
import { createLinearParameterConfig } from '../mapper/linear.js';
import { onOffInvertedParameterConfig, onOffParameterConfig } from '../mapper/on-off.js';

export type Mix = {
  fetchIsMuted: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  updateMuted: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
  fetchIsLeftRightAssignmentEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  updateLeftRightAssignmentEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
  fetchFader: AsyncGetter<Unit<'decibels', number>, 'float'>;
  updateFader: AsyncSetter<Unit<'decibels', number>, 'float'>;
  fetchPan: AsyncGetter<Unit<'percent', number>, 'float'>;
  updatePan: AsyncSetter<Unit<'percent', number>, 'float'>;
};

type MixDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createMix = (dependencies: MixDependencies): Mix => {
  const { oscBasePath, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/mix`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const on = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffInvertedParameterConfig,
  );
  const lrAssignment = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/lr`,
    onOffParameterConfig,
  );
  const fader = oscParameterFactory.createOSCParameter<Unit<'decibels', number>, 'float'>(
    `${oscBaseAddress}/fader`,
    levelParamaterConfig,
  );
  const pan = oscParameterFactory.createOSCParameter<Unit<'percent', number>, 'float'>(
    `${oscBaseAddress}/pan`,
    createLinearParameterConfig<'percent'>(-100, 100),
  );
  return {
    updateMuted: on.update,
    fetchIsMuted: on.fetch,
    updateLeftRightAssignmentEnabled: lrAssignment.update,
    fetchIsLeftRightAssignmentEnabled: lrAssignment.fetch,
    updateFader: fader.update,
    fetchFader: fader.fetch,
    fetchPan: pan.fetch,
    updatePan: pan.update,
  };
};
