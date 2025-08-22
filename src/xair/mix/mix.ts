import { OSCClient } from '../../osc/client.js';
import { createEntityFactory } from '../entity.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory } from '../osc-parameter.js';
import { levelParamaterConfig } from '../mapper/level.js';
import { onOffMapper } from '../mapper/on-off.js';
import { createLinearParameterConfig } from '../mapper/linear.js';

export type Mix = {
  fetchIsMuted: () => Promise<boolean>;
  updateMuted: (enabled: boolean) => Promise<void>;
  fetchIsLeftRightAssignmentEnabled: () => Promise<boolean>;
  updateLeftRightAssignmentEnabled: (enabled: boolean) => Promise<void>;
  fetchFader: AsyncGetter<'decibels', 'float', number>;
  updateFader: AsyncSetter<'decibels', 'float', number>;
  fetchPan: AsyncGetter<'percent', 'float', number>;
  updatePan: AsyncSetter<'percent', 'float', number>;
};

type MixDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createMix = (dependencies: MixDependencies): Mix => {
  const { oscBasePath, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/mix`;
  const entityFactory = createEntityFactory(oscClient);
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const on = entityFactory.createEntity(`${oscBaseAddress}/on`, onOffMapper);
  const lrAssignment = entityFactory.createEntity(`${oscBaseAddress}/lr`, onOffMapper);
  const fader = oscParameterFactory.createOSCParameter<'decibels', 'float', number>(
    `${oscBaseAddress}/fader`,
    levelParamaterConfig,
  );
  const pan = oscParameterFactory.createOSCParameter(`${oscBaseAddress}/pan`, createLinearParameterConfig<'percent'>(-100, 100));
  return {
    updateMuted: (muted) => on.set(!muted),
    fetchIsMuted: async () => {
      const isOn = await on.get();
      return !isOn;
    },
    updateLeftRightAssignmentEnabled: lrAssignment.set,
    fetchIsLeftRightAssignmentEnabled: lrAssignment.get,
    updateFader: fader.update,
    fetchFader: fader.fetch,
    fetchPan: pan.fetch,
    updatePan: pan.update,
  };
};
