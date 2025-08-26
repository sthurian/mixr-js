import { OSCClient } from '../../osc/client.js';
import { ChannelColor, channelColorParameterConfig } from './parameter/color.js';
import { stringOscParameterConfig } from '../mapper/single-string.js';
import { createOSCParameterFactory } from '../osc-parameter.js';

export type Config = {
  /**
   * Fetch the current channel color as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0-15, representing different color options)
   * @example
   * // Get raw OSC value
   * const rawColor = await config.fetchColor();
   * // rawColor: 0 = OFF, 1 = RED, 2 = GREEN, 3 = YELLOW, 4 = BLUE, 5 = MAGENTA, 6 = CYAN, 7 = WHITE, etc.
   */
  fetchColor(): Promise<number>;

  /**
   * Fetch the current channel color as color name
   * @param unit - Must be 'color' to get color name
   * @returns Promise that resolves to color name ('OFF', 'RED', 'GREEN', 'YELLOW', 'BLUE', 'MAGENTA', 'CYAN', 'WHITE', etc.)
   * @example
   * // Get color name
   * const colorName = await config.fetchColor('color');
   * // colorName: 'OFF', 'RED', 'GREEN', 'YELLOW', 'BLUE', 'MAGENTA', 'CYAN', 'WHITE', etc.
   */
  fetchColor(unit: 'color'): Promise<ChannelColor>;

  /**
   * Update the channel color using raw OSC value
   * @param value - The color as raw OSC integer (0-15, representing different color options)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set to RED using raw OSC value
   * await config.updateColor(1);
   *
   * // Set to BLUE using raw OSC value
   * await config.updateColor(4);
   *
   * // Set to OFF using raw OSC value
   * await config.updateColor(0);
   */
  updateColor(value: number): Promise<void>;

  /**
   * Update the channel color using color name
   * @param value - The color name ('OFF', 'RED', 'GREEN', 'YELLOW', 'BLUE', 'MAGENTA', 'CYAN', 'WHITE', etc.)
   * @param unit - Must be 'color' when using color names
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set to RED using color name
   * await config.updateColor('RED', 'color');
   *
   * // Set to BLUE using color name
   * await config.updateColor('BLUE', 'color');
   *
   * // Set to OFF using color name
   * await config.updateColor('OFF', 'color');
   */
  updateColor(value: ChannelColor, unit: 'color'): Promise<void>;

  /**
   * Fetch the current channel name
   * @returns Promise that resolves to channel name string (up to 12 characters)
   * @example
   * // Get channel name
   * const name = await config.fetchName();
   * // name: "Kick Drum", "Lead Vocal", "Guitar L", etc.
   */
  fetchName(): Promise<string>;

  /**
   * Update the channel name using string value
   * @param value - The channel name string (up to 12 characters, longer names will be truncated)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set channel name
   * await config.updateName("Kick Drum");
   *
   * // Set longer name (will be truncated to 12 chars)
   * await config.updateName("Lead Vocalist");
   *
   * // Set short name
   * await config.updateName("GTR L");
   */
  updateName(value: string): Promise<void>;
};

export type ConfigDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createConfig = (dependencies: ConfigDependencies): Config => {
  const { oscBasePath, oscClient } = dependencies;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const oscBaseAddress = `${oscBasePath}/config`;
  const name = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/name`,
    stringOscParameterConfig,
  );
  const color = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/color`,
    channelColorParameterConfig,
  );

  return {
    fetchName: name.fetch,
    updateName: name.update,
    fetchColor: color.fetch,
    updateColor: color.update,
  };
};
