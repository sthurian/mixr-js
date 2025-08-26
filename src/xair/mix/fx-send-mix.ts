import { OSCClient } from '../../osc/client.js';
import { createOSCParameterFactory } from '../osc-parameter.js';
import { levelParamaterConfig } from '../mapper/level.js';
import { onOffInvertedParameterConfig } from '../mapper/on-off.js';

export type FXSendMix = {
  /**
   * Fetch the current mute status as raw OSC value
   * @returns Promise that resolves to raw OSC integer (0 = unmuted, 1 = muted)
   * @example
   * // Get raw OSC value
   * const rawMuted = await mix.fetchIsMuted();
   */
  fetchIsMuted(): Promise<number>;

  /**
   * Fetch the current mute status as boolean
   * @param unit - Must be 'flag' to get boolean value
   * @returns Promise that resolves to boolean value
   * @example
   * // Get boolean value
   * const isMuted = await mix.fetchIsMuted('flag');
   */
  fetchIsMuted(unit: 'flag'): Promise<boolean>;

  /**
   * Update the mute status using raw OSC value
   * @param value - The mute state as raw OSC integer (0 = unmuted, 1 = muted)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await mix.updateMuted(1);
   */
  updateMuted(value: number): Promise<void>;

  /**
   * Update the mute status using boolean
   * @param value - The mute state as boolean
   * @param unit - Must be 'flag' when using boolean value
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using boolean
   * await mix.updateMuted(true, 'flag');
   */
  updateMuted(value: boolean, unit: 'flag'): Promise<void>;

  /**
   * Fetch the current fader level as raw OSC value
   * @returns Promise that resolves to raw OSC float (0.0-1.0)
   * @example
   * // Get raw OSC value
   * const rawLevel = await mix.fetchFader();
   */
  fetchFader(): Promise<number>;

  /**
   * Fetch the current fader level in decibels
   * @param unit - Must be 'decibels' to get level in dB
   * @returns Promise that resolves to level in dB (-∞ to +10dB)
   * @example
   * // Get level in decibels
   * const levelDb = await mix.fetchFader('decibels');
   */
  fetchFader(unit: 'decibels'): Promise<number>;

  /**
   * Update the fader level using raw OSC value
   * @param value - The level as raw OSC float (0.0-1.0)
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using raw OSC value
   * await mix.updateFader(0.75);
   */
  updateFader(value: number): Promise<void>;

  /**
   * Update the fader level using decibels
   * @param value - The level in dB (-∞ to +10dB)
   * @param unit - Must be 'decibels' when using dB values
   * @returns Promise that resolves when the update is complete
   * @example
   * // Set using level in dB
   * await mix.updateFader(-10, 'decibels');
   */
  updateFader(value: number, unit: 'decibels'): Promise<void>;
};

type FXSendMixDependencies = {
  oscBasePath: string;
  oscClient: OSCClient;
};

export const createFXSendMix = (dependencies: FXSendMixDependencies): FXSendMix => {
  const { oscBasePath, oscClient } = dependencies;
  const oscBaseAddress = `${oscBasePath}/mix`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const on = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/on`,
    onOffInvertedParameterConfig,
  );

  const fader = oscParameterFactory.createOSCParameter(
    `${oscBaseAddress}/fader`,
    levelParamaterConfig,
  );
  return {
    updateMuted: on.update,
    fetchIsMuted: on.fetch,
    updateFader: fader.update,
    fetchFader: fader.fetch,
  };
};
