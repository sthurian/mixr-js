import { OSCClient } from '../../osc/client.js';
import { createOSCParameterFactory } from '../osc-parameter.js';
import { createLinearParameterConfig } from '../mapper/linear.js';
import { createFXSendMix, FXSendMix } from './fx-send-mix.js';

export type LRMix = FXSendMix & {
  /**
   * Fetch the current pan position as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawPan = await mix.fetchPan();
   */
  fetchPan(): Promise<number>;

  /**
   * Fetch the current pan position as percentage
   * @param unit - Must be 'percent' to get position as percentage
   * @returns Promise that resolves to position as percentage (-100% to +100%)
   * @example
   * // Get position as percentage
   * const panPercent = await mix.fetchPan('percent');
   */
  fetchPan(unit: 'percent'): Promise<number>;

  /**
   * Update the pan position using raw OSC value
   * @param value - The position as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value (0.25 = 50% left)
   * await mix.updatePan(0.25);
   */
  updatePan(value: number): Promise<void>;

  /**
   * Update the pan position using percentage
   * @param value - The position as percentage (-100% to +100%)
   * @param unit - Must be 'percent' when using percentage values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using percentage (negative = left, positive = right)
   * await mix.updatePan(-50, 'percent');
   */
  updatePan(value: number, unit: 'percent'): Promise<void>;
};

export type LRMixDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createLRMix = (dependencies: LRMixDependencies): LRMix => {
  const { oscBasePath, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/mix`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const fxSendMix = createFXSendMix(dependencies);
  const pan = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/pan`,
    createLinearParameterConfig<'percent'>(-100, 100),
  );
  return {
    ...fxSendMix,
    fetchPan: pan.fetch,
    updatePan: pan.update,
  };
};
