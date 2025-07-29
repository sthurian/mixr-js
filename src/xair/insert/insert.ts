import { OSCClient } from '../../osc/client.js';
import { onOffParameterConfig } from '../mapper/on-off.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../osc-parameter.js';
import { InsertFxSlot, insertFxSlotParameterConfig } from './mapper/fx-slot.js';

export type Insert = {
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;
  fetchFxSlot: AsyncGetter<Unit<'slot', InsertFxSlot>, 'integer'>;
  updateFxSlot: AsyncSetter<Unit<'slot', InsertFxSlot>, 'integer'>;
};

type InsertDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createInsert = (dependencies: InsertDependencies): Insert => {
  const { oscBasePath, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/insert`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const fxslot = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/sel`,
    insertFxSlotParameterConfig,
  );
  const enabled = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffParameterConfig,
  );

  return {
    updateEnabled: enabled.update,
    fetchIsEnabled: enabled.fetch,
    updateFxSlot: fxslot.update,
    fetchFxSlot: fxslot.fetch,
  };
};
