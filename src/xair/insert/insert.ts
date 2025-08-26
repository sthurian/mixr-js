import { OSCClient } from '../../osc/client.js';
import { onOffParameterConfig } from '../mapper/on-off.js';
import { createOSCParameterFactory } from '../osc-parameter.js';
import { InsertFxSlot, insertFxSlotParameterConfig } from './mapper/fx-slot.js';

export type Insert = {
  /**
   * Fetch the current insert enabled state as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = disabled, 1 = enabled)
   * @example
   * // Get raw OSC value
   * const rawEnabled = await insert.fetchIsEnabled();
   */
  fetchIsEnabled(): Promise<number>;

  /**
   * Fetch the current insert enabled state as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isEnabled = await insert.fetchIsEnabled('flag');
   */
  fetchIsEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the insert enabled state using raw OSC value
   * @param value - The enabled state as raw OSC integer (0 = disabled, 1 = enabled)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await insert.updateEnabled(1);
   */
  updateEnabled(value: number): Promise<void>;

  /**
   * Update the insert enabled state using boolean
   * @param value - The enabled state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await insert.updateEnabled(true, 'flag');
   */
  updateEnabled(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Fetch the current insert FX slot assignment as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-8)
   * @example
   * // Get raw OSC value
   * const rawSlot = await insert.fetchFxSlot();
   */
  fetchFxSlot(): Promise<number>;

  /**
   * Fetch the current insert FX slot assignment as slot string
   * @param unit - Must be 'slot' to get slot string
   * @returns Promise that resolves to FX slot string ('OFF', 'Fx1A', 'Fx1B', 'Fx2A', 'Fx2B', 'Fx3A', 'Fx3B', 'Fx4A', 'Fx4B')
   * @example
   * // Get FX slot string
   * const slot = await insert.fetchFxSlot('slot');
   */
  fetchFxSlot(unit: 'slot'): Promise<InsertFxSlot>;

  /**
   * Update the insert FX slot assignment using raw OSC value
   * @param value - The FX slot as raw OSC integer (0-8)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (1 = 'Fx1A')
   * await insert.updateFxSlot(1);
   */
  updateFxSlot(value: number): Promise<void>;

  /**
   * Update the insert FX slot assignment using slot string
   * @param value - The FX slot string ('OFF', 'Fx1A', 'Fx1B', 'Fx2A', 'Fx2B', 'Fx3A', 'Fx3B', 'Fx4A', 'Fx4B')
   * @param unit - Must be 'slot' when using slot string
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using FX slot string
   * await insert.updateFxSlot('Fx1A', 'slot');
   */
  updateFxSlot(value: InsertFxSlot, unit: 'slot'): Promise<void>;
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
