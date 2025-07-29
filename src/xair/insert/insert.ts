import { OSCClient } from '../../osc/client.js';
import { createEntityFactory } from '../entity.js';
import { onOffMapper } from '../mapper/on-off.js';
import { InsertFxSlot, insertFxSlotMapper } from './mapper/fx-slot.js';

export type Insert = {
  fetchIsEnabled: () => Promise<boolean>;
  updateEnabled: (enabled: boolean) => Promise<void>;
  fetchFxSlot: () => Promise<InsertFxSlot>;
  updateFxSlot: (source: InsertFxSlot) => Promise<void>;
};

type InsertDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createInsert = (dependencies: InsertDependencies): Insert => {
  const { oscBasePath, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/insert`;
  const entityFactory = createEntityFactory(oscClient);
  const fxslot = entityFactory.createEntity(`${oscBaseAddress}/sel`, insertFxSlotMapper);
  const enabled = entityFactory.createEntity(`${oscBaseAddress}/on`, onOffMapper);

  return {
    updateEnabled: enabled.set,
    fetchIsEnabled: enabled.get,
    updateFxSlot: fxslot.set,
    fetchFxSlot: fxslot.get,
  };
};
