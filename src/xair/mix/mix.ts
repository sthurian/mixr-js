import { OSCClient } from '../../osc/client.js';
import { createEntityFactory } from '../entity.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory } from '../osc-parameter.js';
import { levelParamaterConfig } from '../mapper/level.js';
import { createLinearMapper } from '../mapper/linear.js';
import { onOffMapper } from '../mapper/on-off.js';

export type Mix = {
  fetchIsMuted: () => Promise<boolean>;
  updateMuted: (enabled: boolean) => Promise<void>;
  fetchIsLeftRightAssignmentEnabled: () => Promise<boolean>;
  updateLeftRightAssignmentEnabled: (enabled: boolean) => Promise<void>;
  fetchFader: AsyncGetter<'decibel', 'float'>;
  updateFader: AsyncSetter<'decibel', 'float'>;
  fetchPan: () => Promise<number>;
  updatePan: (pan: number) => Promise<void>;
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
  const fader = oscParameterFactory.createOSCParameter<'decibel', 'float'>(
    `${oscBaseAddress}/fader`,
    levelParamaterConfig,
  );
  const pan = entityFactory.createEntity(`${oscBaseAddress}/pan`, createLinearMapper(-100, 100));
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
    fetchPan: pan.get,
    updatePan: pan.set,
  };
};
