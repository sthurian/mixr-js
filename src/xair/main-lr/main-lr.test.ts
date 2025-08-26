import { suite, test } from 'mocha';
import { createMainLR } from './main-lr.js';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import { fake } from 'sinon';
import assert from 'node:assert';
import { Config } from '../config/config.js';
import { MainLRCompressor } from './compressor/compressor.js';
import { LRMix } from '../mix/lr-mix.js';
import { MainLREqualizer } from './equalizer/equalizer.js';

suite('MainLR', () => {
  test('creates the config correctly', () => {
    const oscClient = oscClientFactory.build();
    const createConfig = fake.returns('config' as unknown as Config);
    const mainLR = createMainLR({
      oscClient,
      createConfig,
      createLRMix: fake(),
      createMainLRCompressor: fake(),
      createInsert: fake(),
      createDynamicsFilter: fake(),
      createMainLREqualizer: fake(),
      createEqualizer: fake(),
      createEqualizerBand: fake(),
    });
    assert.strictEqual(mainLR.getConfig(), 'config');
    assert.strictEqual(createConfig.calledOnceWithExactly({ oscClient, oscBasePath: '/lr' }), true);
  });

  test('creates the lrMix correctly', () => {
    const oscClient = oscClientFactory.build();
    const createLRMix = fake.returns('lrMix' as unknown as LRMix);
    const mainLR = createMainLR({
      oscClient,
      createConfig: fake(),
      createLRMix,
      createMainLRCompressor: fake(),
      createInsert: fake(),
      createDynamicsFilter: fake(),
      createMainLREqualizer: fake(),
      createEqualizer: fake(),
      createEqualizerBand: fake(),
    });
    assert.strictEqual(mainLR.getMix(), 'lrMix');
    assert.strictEqual(createLRMix.calledOnceWithExactly({ oscClient, oscBasePath: '/lr' }), true);
  });

  test('creates the compressor correctly', () => {
    const oscClient = oscClientFactory.build();
    const createMainLRCompressor = fake.returns('compressor' as unknown as MainLRCompressor);
    const createInsert = fake();
    const createDynamicsFilter = fake();
    const mainLR = createMainLR({
      oscClient,
      createConfig: fake(),
      createLRMix: fake(),
      createMainLRCompressor,
      createInsert,
      createDynamicsFilter,
      createMainLREqualizer: fake(),
      createEqualizer: fake(),
      createEqualizerBand: fake(),
    });
    assert.strictEqual(mainLR.getCompressor(), 'compressor');
    assert.strictEqual(
      createMainLRCompressor.calledOnceWithExactly({
        oscClient,
        createInsert,
        createDynamicsFilter,
      }),
      true,
    );
  });

  test('creates the equalizer correctly', () => {
    const oscClient = oscClientFactory.build();
    const createMainLREqualizer = fake.returns('eq' as unknown as MainLREqualizer);
    const createEqualizer = fake();
    const createEqualizerBand = fake();
    const mainLR = createMainLR({
      oscClient,
      createConfig: fake(),
      createLRMix: fake(),
      createMainLRCompressor: fake(),
      createInsert: fake(),
      createDynamicsFilter: fake(),
      createMainLREqualizer,
      createEqualizer,
      createEqualizerBand,
    });
    assert.strictEqual(mainLR.getEqualizer(), 'eq');
    assert.strictEqual(
      createMainLREqualizer.calledOnceWithExactly({
        createEqualizer,
        createEqualizerBand,
        oscClient,
      }),
      true,
    );
  });
});
