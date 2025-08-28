import { OSCClient } from '../../../../osc/client.js';
import { Compressor, createCompressor } from '../../../dynamics/compressor/compressor.js';
import { DynamicsFilter, DynamicsFilterDependencies } from '../../../dynamics/filter/filter.js';
import {
  DynamicsKeySource,
  dynamicsKeySourceParameterConfig,
} from '../../../dynamics/mapper/key-source.js';
import { createOSCParameterFactory } from '../../../osc-parameter.js';

export type ChannelCompressor = Compressor & {
  /**
   * Update the key source for sidechain using raw OSC value
   * @param value - The key source as raw OSC integer
   * @returns Promise that resolves when the update is complete
   */
  updateKeySource(value: number): Promise<void>;

  /**
   * Update the key source for sidechain using source string
   * @param value - The key source as source string
   * @param unit - Must be 'keySource' when using source string
   * @returns Promise that resolves when the update is complete
   */
  updateKeySource(value: DynamicsKeySource, unit: 'keySource'): Promise<void>;

  /**
   * Fetch the current key source as raw OSC value
   * @returns Promise that resolves to raw OSC integer
   */
  fetchKeySource(): Promise<number>;

  /**
   * Fetch the current key source as source string
   * @param unit - Must be 'keySource' to get source string
   * @returns Promise that resolves to source string
   */
  fetchKeySource(unit: 'keySource'): Promise<DynamicsKeySource>;
};

export type ChannelCompressorDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
  createDynamicsFilter: (dependencies: DynamicsFilterDependencies) => DynamicsFilter;
};

export const createChannelCompressor = (
  dependencies: ChannelCompressorDependencies,
): ChannelCompressor => {
  const { oscBasePath, oscClient, createDynamicsFilter } = dependencies;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const compressor = createCompressor({ oscBasePath, oscClient, createDynamicsFilter });

  const keySource = oscParameterFactory.createOSCParameter(
    `${oscBasePath}/dyn/keysrc`,
    dynamicsKeySourceParameterConfig,
  );

  return {
    ...compressor,
    updateKeySource: keySource.update,
    fetchKeySource: keySource.fetch,
  };
};
