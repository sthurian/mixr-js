import { OSCClient } from '../../osc/client.js';
import { createOSCParameterFactory } from '../osc-parameter.js';
import { onOffParameterConfig } from '../mapper/on-off.js';
import { createLRMix, LRMix } from './lr-mix.js';

export type Mix = LRMix & {
  /**
   * Fetch the current left-right assignment enabled state as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = disabled, 1 = enabled)
   * @example
   * // Get raw OSC value
   * const rawAssignment = await mix.fetchIsLeftRightAssignmentEnabled();
   */
  fetchIsLeftRightAssignmentEnabled(): Promise<number>;

  /**
   * Fetch the current left-right assignment enabled state as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isAssigned = await mix.fetchIsLeftRightAssignmentEnabled('flag');
   */
  fetchIsLeftRightAssignmentEnabled(unit: 'flag'): Promise<boolean>;

  /**
   * Update the left-right assignment enabled state using raw OSC value
   * @param value - The assignment state as raw OSC integer (0 = disabled, 1 = enabled)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await mix.updateLeftRightAssignmentEnabled(1);
   */
  updateLeftRightAssignmentEnabled(value: number): Promise<void>;

  /**
   * Update the left-right assignment enabled state using boolean
   * @param value - The assignment state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await mix.updateLeftRightAssignmentEnabled(true, 'flag');
   */
  updateLeftRightAssignmentEnabled(value: boolean, unit: 'flag'): Promise<void>;
};

export type MixDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createMix = (dependencies: MixDependencies): Mix => {
  const { oscBasePath, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/mix`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const lrMix = createLRMix(dependencies);
  const lrAssignment = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/lr`,
    onOffParameterConfig,
  );
  return {
    ...lrMix,
    updateLeftRightAssignmentEnabled: lrAssignment.update,
    fetchIsLeftRightAssignmentEnabled: lrAssignment.fetch,
  };
};
