import { OSCClient } from '../../osc/client.js';
import { onOffParameterConfig } from '../mapper/on-off.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../osc-parameter.js';
import { InsertFxSlot, insertFxSlotParameterConfig } from './mapper/fx-slot.js';

export type Insert = {
  /**
   * Fetches the current insert enable/disable status.
   *
   * @returns Promise resolving to the insert state. Returns boolean (true=enabled, false=disabled) or raw OSC integer (0=disabled, 1=enabled).
   *
   * @example
   * ```typescript
   * // Get as boolean
   * const isEnabled = await insert.fetchIsEnabled();
   *
   * // Get as raw OSC value
   * const oscValue = await insert.fetchIsEnabled();
   * ```
   */
  fetchIsEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Updates the insert enable/disable status.
   *
   * @param enabled - Insert state. Either a boolean (true=enabled, false=disabled) or a raw OSC integer (0=disabled, 1=enabled).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using boolean value
   * await insert.updateEnabled(true);
   *
   * // Using raw OSC value
   * await insert.updateEnabled(1);
   * ```
   */
  updateEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  /**
   * Fetches the current insert FX slot assignment.
   *
   * @returns Promise resolving to the FX slot. Returns string literal ('OFF', 'Fx1A', 'Fx1B', 'Fx2A', 'Fx2B', 'Fx3A', 'Fx3B', 'Fx4A', 'Fx4B') or raw OSC integer (0-8).
   *
   * @example
   * ```typescript
   * // Get as FX slot literal
   * const slot = await insert.fetchFxSlot();
   *
   * // Get as raw OSC value
   * const oscValue = await insert.fetchFxSlot();
   * ```
   */
  fetchFxSlot: AsyncGetter<Unit<'slot', InsertFxSlot>, 'integer'>;

  /**
   * Updates the insert FX slot assignment.
   *
   * @param slot - FX slot. Either a string literal ('OFF', 'Fx1A', 'Fx1B', 'Fx2A', 'Fx2B', 'Fx3A', 'Fx3B', 'Fx4A', 'Fx4B') or a raw OSC integer (0-8).
   * @returns Promise that resolves when the operation completes.
   *
   * @example
   * ```typescript
   * // Using FX slot literal
   * await insert.updateFxSlot('Fx1A');
   *
   * // Using raw OSC value
   * await insert.updateFxSlot(1);
   * ```
   */
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
