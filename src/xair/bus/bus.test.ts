import { suite, test } from 'mocha';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import { fake } from 'sinon';
import assert from 'node:assert';
import { createBus } from './bus.js';
import { Config } from '../config/config.js';
import { ChannelCompressor } from '../channel/dynamics/compressor/compressor.js';
import { Equalizer } from '../equalizer/equalizer.js';
import { DCAGroup } from '../dca/dca-group.js';
import { MuteGroup } from '../mute/mute-group.js';
import { Insert } from '../insert/insert.js';
import { Mix } from '../mix/mix.js';

suite('Bus', () => {
  test('creates the config correctly', () => {
    const oscClient = oscClientFactory.build();
    const createConfig = fake.returns('config' as unknown as Config);
    const createChannelCompressor = fake();
    const createDynamicsFilter = fake();
    const createEqualizer = fake();
    const createEqualizerBand = fake();
    const createDCAGroup = fake();
    const createInsert = fake();
    const createMix = fake();
    const createMuteGroup = fake();
    const bus = createBus({
      bus: 1,
      oscClient,
      createConfig,
      createChannelCompressor,
      createDynamicsFilter,
      createEqualizer,
      createEqualizerBand,
      createDCAGroup,
      createInsert,
      createMix,
      createMuteGroup,
    });
    assert.strictEqual(bus.getConfig(), 'config');
    assert.strictEqual(
      createConfig.calledOnceWithExactly({ oscBasePath: '/bus/1', oscClient }),
      true,
    );
  });

  test('creates the compressor correctly', () => {
    const oscClient = oscClientFactory.build();
    const createConfig = fake();
    const createChannelCompressor = fake.returns('compressor' as unknown as ChannelCompressor);
    const createDynamicsFilter = fake();
    const createEqualizer = fake();
    const createEqualizerBand = fake();
    const createDCAGroup = fake();
    const createInsert = fake();
    const createMix = fake();
    const createMuteGroup = fake();
    const bus = createBus({
      bus: 1,
      oscClient,
      createConfig,
      createChannelCompressor,
      createDynamicsFilter,
      createEqualizer,
      createEqualizerBand,
      createDCAGroup,
      createInsert,
      createMix,
      createMuteGroup,
    });
    assert.strictEqual(bus.getCompressor(), 'compressor');
    assert.strictEqual(
      createChannelCompressor.calledOnceWithExactly({
        oscBasePath: '/bus/1',
        oscClient,
        createDynamicsFilter,
      }),
      true,
    );
  });

  test('creates the equalizer correctly', () => {
    const oscClient = oscClientFactory.build();
    const createEqualizer = fake.returns('equalizer' as unknown as Equalizer<6>);
    const createEqualizerBand = fake();
    const createDCAGroup = fake();
    const createInsert = fake();
    const createMix = fake();
    const createMuteGroup = fake();
    const bus = createBus({
      bus: 1,
      oscClient,
      createConfig: fake(),
      createChannelCompressor: fake(),
      createDynamicsFilter: fake(),
      createEqualizer,
      createEqualizerBand,
      createDCAGroup,
      createInsert,
      createMix,
      createMuteGroup,
    });
    assert.strictEqual(bus.getEqualizer(), 'equalizer');
    assert.strictEqual(
      createEqualizer.calledOnceWithExactly({
        createEqualizerBand,
        numberOfBands: 6,
        oscBasePath: '/bus/1',
        oscClient,
      }),
      true,
    );
  });

  test('creates the dca group correctly', () => {
    const oscClient = oscClientFactory.build();
    const createDCAGroup = fake.returns('dcaGroup' as unknown as DCAGroup);
    const bus = createBus({
      bus: 1,
      oscClient,
      createConfig: fake(),
      createChannelCompressor: fake(),
      createDynamicsFilter: fake(),
      createEqualizer: fake(),
      createEqualizerBand: fake(),
      createDCAGroup,
      createInsert: fake(),
      createMix: fake(),
      createMuteGroup: fake(),
    });
    assert.strictEqual(bus.getDCAGroup(), 'dcaGroup');
    assert.strictEqual(
      createDCAGroup.calledOnceWithExactly({
        oscBasePath: '/bus/1',
        oscClient,
      }),
      true,
    );
  });

  test('create the mute group correctly', () => {
    const oscClient = oscClientFactory.build();
    const createMuteGroup = fake.returns('muteGroup' as unknown as MuteGroup);
    const bus = createBus({
      bus: 1,
      oscClient,
      createConfig: fake(),
      createChannelCompressor: fake(),
      createDynamicsFilter: fake(),
      createEqualizer: fake(),
      createEqualizerBand: fake(),
      createDCAGroup: fake(),
      createInsert: fake(),
      createMix: fake(),
      createMuteGroup,
    });
    assert.strictEqual(bus.getMuteGroup(), 'muteGroup');
    assert.strictEqual(
      createMuteGroup.calledOnceWithExactly({
        oscBasePath: '/bus/1',
        oscClient,
      }),
      true,
    );
  });
  test('creates the insert correctly', () => {
    const oscClient = oscClientFactory.build();
    const createInsert = fake.returns('insert' as unknown as Insert);
    const bus = createBus({
      bus: 1,
      oscClient,
      createConfig: fake(),
      createChannelCompressor: fake(),
      createDynamicsFilter: fake(),
      createEqualizer: fake(),
      createEqualizerBand: fake(),
      createDCAGroup: fake(),
      createInsert,
      createMix: fake(),
      createMuteGroup: fake(),
    });
    assert.strictEqual(bus.getInsert(), 'insert');
    assert.strictEqual(
      createInsert.calledOnceWithExactly({
        oscBasePath: '/bus/1',
        oscClient,
      }),
      true,
    );
  });
  test('creates the mix correctly', () => {
    const oscClient = oscClientFactory.build();
    const createMix = fake.returns('mix' as unknown as Mix);
    const bus = createBus({
      bus: 1,
      oscClient,
      createConfig: fake(),
      createChannelCompressor: fake(),
      createDynamicsFilter: fake(),
      createEqualizer: fake(),
      createEqualizerBand: fake(),
      createDCAGroup: fake(),
      createInsert: fake(),
      createMix,
      createMuteGroup: fake(),
    });
    assert.strictEqual(bus.getMix(), 'mix');
    assert.strictEqual(
      createMix.calledOnceWithExactly({
        oscBasePath: '/bus/1',
        oscClient,
      }),
      true,
    );
  });
});
