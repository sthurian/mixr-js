import { suite, test } from 'mocha';
import { createMainLR } from './main-lr.js';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import { fake } from 'sinon';
import assert from 'node:assert';
import { Config } from '../config/config.js';
import { LRMix } from '../mix/lr-mix.js';
import { SixBandEqualizer } from '../equalizer/six-band-equalizer.js';
import { Compressor } from '../dynamics/compressor/compressor.js';
import { MainLRInsert } from './insert/insert.js';

suite('MainLR', () => {
  test('creates the config correctly', () => {
    const oscClient = oscClientFactory.build();
    const createConfig = fake.returns('config' as unknown as Config);
    const mainLR = createMainLR({
      oscClient,
      createConfig,
      createLRMix: fake(),
      createCompressor: fake(),
      createMainLRInsert: fake(),
      createDynamicsFilter: fake(),
      createSixBandEqualizer: fake(),
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
      createCompressor: fake(),
      createMainLRInsert: fake(),
      createDynamicsFilter: fake(),
      createSixBandEqualizer: fake(),
      createEqualizer: fake(),
      createEqualizerBand: fake(),
    });
    assert.strictEqual(mainLR.getMix(), 'lrMix');
    assert.strictEqual(createLRMix.calledOnceWithExactly({ oscClient, oscBasePath: '/lr' }), true);
  });

  test('creates the compressor correctly', () => {
    const oscClient = oscClientFactory.build();
    const createCompressor = fake.returns('compressor' as unknown as Compressor);
    const createMainLRInsert = fake();
    const createDynamicsFilter = fake();
    const mainLR = createMainLR({
      oscClient,
      createConfig: fake(),
      createLRMix: fake(),
      createCompressor,
      createMainLRInsert,
      createDynamicsFilter,
      createSixBandEqualizer: fake(),
      createEqualizer: fake(),
      createEqualizerBand: fake(),
    });
    assert.strictEqual(mainLR.getCompressor(), 'compressor');
    assert.strictEqual(
      createCompressor.calledOnceWithExactly({
        oscClient,
        oscBasePath: '/lr',
        createDynamicsFilter,
      }),
      true,
    );
  });

  test('creates the equalizer correctly', () => {
    const oscClient = oscClientFactory.build();
    const createSixBandEqualizer = fake.returns('eq' as unknown as SixBandEqualizer);
    const createEqualizer = fake();
    const createEqualizerBand = fake();
    const mainLR = createMainLR({
      oscClient,
      createConfig: fake(),
      createLRMix: fake(),
      createCompressor: fake(),
      createMainLRInsert: fake(),
      createDynamicsFilter: fake(),
      createSixBandEqualizer,
      createEqualizer,
      createEqualizerBand,
    });
    assert.strictEqual(mainLR.getEqualizer(), 'eq');
    assert.strictEqual(
      createSixBandEqualizer.calledOnceWithExactly({
        createEqualizer,
        createEqualizerBand,
        oscClient,
      }),
      true,
    );
  });

  test('creates the insert correctly', () => {
    const oscClient = oscClientFactory.build();
    const createMainLRInsert = fake.returns('insert' as unknown as MainLRInsert);
    const mainLR = createMainLR({
      oscClient,
      createConfig: fake(),
      createLRMix: fake(),
      createCompressor: fake(),
      createMainLRInsert,
      createDynamicsFilter: fake(),
      createSixBandEqualizer: fake(),
      createEqualizer: fake(),
      createEqualizerBand: fake(),
    });
    assert.strictEqual(mainLR.getInsert(), 'insert');
    assert.strictEqual(
      createMainLRInsert.calledOnceWithExactly({ oscClient, oscBasePath: '/lr' }),
      true,
    );
  });
});
