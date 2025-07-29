import { createEntityFactory } from '../../../entity.js';
import { createLinearMapper } from '../../../mapper/linear.js';
import { onOffMapper } from '../../../mapper/on-off.js';
import { CompressorDetectionMode, compressorDetectionModeMapper } from './mapper/detection-mode.js';
import { CompressorEnvelope, compressorEnvelopeMapper } from './mapper/envelope.js';
import { DynamicsKeySource, dynamicsKeySourceMapper } from '../mapper/key-source.js';
import { CompressorMode, compressorModeMapper } from './mapper/mode.js';
import { CompressorRatio, compressorRatioMapper } from './mapper/ratio.js';
import { DynamicsFilter, createDynamicsFilter } from '../filter/filter.js';
import { createLogarithmicMapper } from '../../../mapper/log.js';
import { OSCClient } from '../../../../osc/client.js';

export type ChannelCompressor = {
  fetchIsAutoTimeEnabled: () => Promise<boolean>;
  updateAutoTimeEnabled: (enabled: boolean) => Promise<void>;
  /**
   * Sets the compressor's attack time.
   * @param attack - Attack time in milliseconds.
   * @returns A promise that resolves when the operation is complete.
   */
  updateAttack: (attack: number) => Promise<void>;
  /**
   * Gets the compressor's attack time.
   * @returns A promise that resolves to the attack time in milliseconds.
   */
  fetchAttack: () => Promise<number>;

  updateDetectionMode: (mode: CompressorDetectionMode) => Promise<void>;
  fetchDetectionMode: () => Promise<CompressorDetectionMode>;

  updateEnvelope: (mode: CompressorEnvelope) => Promise<void>;
  fetchEnvelope: () => Promise<CompressorEnvelope>;

  getFilter: () => DynamicsFilter;

  updateHold: (time: number) => Promise<void>;
  fetchHold: () => Promise<number>;

  updateKeySource: (type: DynamicsKeySource) => Promise<void>;
  fetchKeySource: () => Promise<DynamicsKeySource>;

  updateKnee: (time: number) => Promise<void>;
  fetchKnee: () => Promise<number>;

  updateGain: (time: number) => Promise<void>;
  fetchGain: () => Promise<number>;

  updateMix: (time: number) => Promise<void>;
  fetchMix: () => Promise<number>;

  updateMode: (mode: CompressorMode) => Promise<void>;
  fetchMode: () => Promise<CompressorMode>;

  updateEnabled: (enabled: boolean) => Promise<void>;
  fetchIsEnabled: () => Promise<boolean>;

  updateRatio: (ratio: CompressorRatio) => Promise<void>;
  fetchRatio: () => Promise<CompressorRatio>;

  updateRelease: (time: number) => Promise<void>;
  fetchRelease: () => Promise<number>;

  updateThreshold: (threshold: number) => Promise<void>;
  fetchThreshold: () => Promise<number>;
};

type ChannelCompressorDependencies = {
  channel: number;
  oscClient: OSCClient;
};

export const createChannelCompressor = (
  dependencies: ChannelCompressorDependencies,
): ChannelCompressor => {
  const { channel, oscClient } = dependencies;
  const oscBaseAddress = `/ch/${channel.toString().padStart(2, '0')}/dyn`;
  const entityFactory = createEntityFactory(oscClient);
  const autotime = entityFactory.createEntity(`${oscBaseAddress}/auto`, onOffMapper);
  const attack = entityFactory.createEntity(
    `${oscBaseAddress}/attack`,
    createLinearMapper(0.0, 120.0),
  );
  const detectionMode = entityFactory.createEntity(
    `${oscBaseAddress}/det`,
    compressorDetectionModeMapper,
  );
  const envelope = entityFactory.createEntity(`${oscBaseAddress}/env`, compressorEnvelopeMapper);
  const filter = createDynamicsFilter({ ...dependencies, dynamicsType: 'compressor' });

  const hold = entityFactory.createEntity(
    `${oscBaseAddress}/hold`,
    createLogarithmicMapper(0.02, 2000),
  );

  const keySource = entityFactory.createEntity(`${oscBaseAddress}/keysrc`, dynamicsKeySourceMapper);
  const knee = entityFactory.createEntity(`${oscBaseAddress}/knee`, createLinearMapper(0, 5));
  const gain = entityFactory.createEntity(`${oscBaseAddress}/mgain`, createLinearMapper(0, 24));
  const mix = entityFactory.createEntity(`${oscBaseAddress}/mix`, createLinearMapper(0, 100));
  const mode = entityFactory.createEntity(`${oscBaseAddress}/mode`, compressorModeMapper);
  const enabled = entityFactory.createEntity(`${oscBaseAddress}/on`, onOffMapper);
  const ratio = entityFactory.createEntity(`${oscBaseAddress}/ratio`, compressorRatioMapper);
  const release = entityFactory.createEntity(
    `${oscBaseAddress}/release`,
    createLogarithmicMapper(5, 4000),
  );
  const threshold = entityFactory.createEntity(`${oscBaseAddress}/thr`, createLinearMapper(-60, 0));

  return {
    fetchIsAutoTimeEnabled: autotime.get,
    updateAutoTimeEnabled: autotime.set,
    fetchAttack: attack.get,
    updateAttack: attack.set,
    fetchDetectionMode: detectionMode.get,
    updateDetectionMode: detectionMode.set,
    fetchEnvelope: envelope.get,
    updateEnvelope: envelope.set,
    getFilter: () => filter,
    updateHold: hold.set,
    fetchHold: hold.get,
    updateKeySource: keySource.set,
    fetchKeySource: keySource.get,
    updateKnee: knee.set,
    fetchKnee: knee.get,
    updateGain: gain.set,
    fetchGain: gain.get,
    updateMix: mix.set,
    fetchMix: mix.get,
    fetchMode: mode.get,
    updateMode: mode.set,
    updateEnabled: enabled.set,
    fetchIsEnabled: enabled.get,
    updateRatio: ratio.set,
    fetchRatio: ratio.get,
    updateRelease: release.set,
    fetchRelease: release.get,
    updateThreshold: threshold.set,
    fetchThreshold: threshold.get,
  };
};
