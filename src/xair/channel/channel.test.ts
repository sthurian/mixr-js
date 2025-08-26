import { suite, test } from 'mocha';
import { createChannel } from './channel.js';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import { fake } from 'sinon';
import assert from 'node:assert';
import { ChannelConfig } from './config/config.js';
import { ChannelCompressor } from './dynamics/compressor/compressor.js';
import { ChannelSendBus } from './sends/send-bus.js';
import { ChannelFxSend } from './sends/fx-send.js';
import { ChannelAutomix } from './automix/automix.js';
import { ChannelGate } from './dynamics/gate/gate.js';
import { ChannelPreamp } from './preamp/preamp.js';
import { Equalizer } from '../equalizer/equalizer.js';
import { Insert } from '../insert/insert.js';
import { Mix } from '../mix/mix.js';
import { DCAGroup } from '../dca/dca-group.js';

suite('Channel', () => {
  test('creates the config correctly', () => {
    const oscClient = oscClientFactory.build();
    const createChannelConfig = fake.returns('config' as unknown as ChannelConfig);
    const mainLR = createChannel({
      oscClient,
      createChannelConfig,
      channel: 1,
      createDynamicsFilter: fake(),
      createEqualizerBand: fake(),
      createChannelCompressor: fake(),
      createChannelAutomix: fake(),
      createEqualizer: fake(),
      createChannelGate: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createInsert: fake(),
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp: fake(),
    });
    assert.strictEqual(mainLR.getConfig(), 'config');
    assert.strictEqual(createChannelConfig.calledOnceWithExactly({ channel: 1, oscClient }), true);
  });

  test('creates the compressor correctly', () => {
    const oscClient = oscClientFactory.build();
    const createChannelCompressor = fake.returns('compressor' as unknown as ChannelCompressor);
    const createDynamicsFilter = fake();
    const mainLR = createChannel({
      oscClient,
      createChannelConfig: fake(),
      channel: 1,
      createDynamicsFilter,
      createEqualizerBand: fake(),
      createChannelCompressor,
      createChannelAutomix: fake(),
      createEqualizer: fake(),
      createChannelGate: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createInsert: fake(),
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp: fake(),
    });
    assert.strictEqual(mainLR.getCompressor(), 'compressor');
    assert.strictEqual(
      createChannelCompressor.calledOnceWithExactly({
        channel: 1,
        oscClient,
        createDynamicsFilter,
      }),
      true,
    );
  });
  test('creates the fx send correctly', () => {
    const oscClient = oscClientFactory.build();
    const createChannelFxSend = fake.returns('fxSend' as unknown as ChannelFxSend);
    const mainLR = createChannel({
      oscClient,
      createChannelConfig: fake(),
      channel: 1,
      createDynamicsFilter: fake(),
      createEqualizerBand: fake(),
      createChannelCompressor: fake(),
      createChannelAutomix: fake(),
      createEqualizer: fake(),
      createChannelGate: fake(),
      createChannelFxSend,
      createChannelSendBus: fake(),
      createInsert: fake(),
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp: fake(),
    });
    assert.strictEqual(mainLR.getSendFx('FX1'), 'fxSend');
    assert.strictEqual(
      createChannelFxSend.calledOnceWithExactly({
        channel: 1,
        fx: 'FX1',
        oscClient,
      }),
      true,
    );
  });
  test('creates the send bus correctly', () => {
    const oscClient = oscClientFactory.build();
    const createChannelSendBus = fake.returns('sendBus' as unknown as ChannelSendBus);
    const mainLR = createChannel({
      oscClient,
      createChannelConfig: fake(),
      channel: 1,
      createDynamicsFilter: fake(),
      createEqualizerBand: fake(),
      createChannelCompressor: fake(),
      createChannelAutomix: fake(),
      createEqualizer: fake(),
      createChannelGate: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus,
      createInsert: fake(),
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp: fake(),
    });
    assert.strictEqual(mainLR.getSendBus('Bus1'), 'sendBus');
    assert.strictEqual(
      createChannelSendBus.calledOnceWithExactly({
        channel: 1,
        sendBus: 'Bus1',
        oscClient,
      }),
      true,
    );
  });
  test('creates the automix correctly', () => {
    const oscClient = oscClientFactory.build();
    const createChannelAutomix = fake.returns('automix' as unknown as ChannelAutomix);
    const mainLR = createChannel({
      oscClient,
      createChannelConfig: fake(),
      channel: 1,
      createDynamicsFilter: fake(),
      createEqualizerBand: fake(),
      createChannelCompressor: fake(),
      createChannelAutomix,
      createEqualizer: fake(),
      createChannelGate: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createInsert: fake(),
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp: fake(),
    });
    assert.strictEqual(mainLR.getAutomix(), 'automix');
    assert.strictEqual(createChannelAutomix.calledOnceWithExactly({ channel: 1, oscClient }), true);
  });
  test('creates the gate correctly', () => {
    const oscClient = oscClientFactory.build();
    const createChannelGate = fake.returns('gate' as unknown as ChannelGate);
    const createDynamicsFilter = fake();
    const mainLR = createChannel({
      oscClient,
      createChannelConfig: fake(),
      channel: 1,
      createDynamicsFilter,
      createInsert: fake(),
      createEqualizerBand: fake(),
      createChannelCompressor: fake(),
      createChannelAutomix: fake(),
      createEqualizer: fake(),
      createChannelGate,
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp: fake(),
    });
    assert.strictEqual(mainLR.getGate(), 'gate');
    assert.strictEqual(
      createChannelGate.calledOnceWithExactly({
        channel: 1,
        oscClient,
        createDynamicsFilter,
      }),
      true,
    );
  });
  test('creates the preamp correctly', () => {
    const oscClient = oscClientFactory.build();
    const createChannelPreamp = fake.returns('preamp' as unknown as ChannelPreamp);
    const mainLR = createChannel({
      oscClient,
      channel: 1,
      createChannelConfig: fake(),
      createDynamicsFilter: fake(),
      createEqualizerBand: fake(),
      createChannelCompressor: fake(),
      createChannelAutomix: fake(),
      createEqualizer: fake(),
      createChannelGate: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createInsert: fake(),
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp,
    });
    assert.strictEqual(mainLR.getPreAmp(), 'preamp');
    assert.strictEqual(createChannelPreamp.calledOnceWithExactly({ channel: 1, oscClient }), true);
  });
  test('creates the equalizer correctly', () => {
    const oscClient = oscClientFactory.build();
    const createEqualizer = fake.returns('equalizer' as unknown as Equalizer);
    const createEqualizerBand = fake();
    const mainLR = createChannel({
      oscClient,
      createChannelConfig: fake(),
      channel: 1,
      createDynamicsFilter: fake(),
      createEqualizerBand,
      createChannelCompressor: fake(),
      createChannelAutomix: fake(),
      createEqualizer,
      createChannelGate: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createInsert: fake(),
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp: fake(),
    });
    assert.strictEqual(mainLR.getEqualizer(), 'equalizer');
    assert.strictEqual(
      createEqualizer.calledOnceWithExactly({
        oscBasePath: '/ch/01',
        oscClient,
        createEqualizerBand,
      }),
      true,
    );
  });

  test('creates the insert correctly', () => {
    const oscClient = oscClientFactory.build();
    const createInsert = fake.returns('insert' as unknown as Insert);
    const mainLR = createChannel({
      oscClient,
      createChannelConfig: fake(),
      channel: 1,
      createDynamicsFilter: fake(),
      createEqualizerBand: fake(),
      createChannelCompressor: fake(),
      createChannelAutomix: fake(),
      createEqualizer: fake(),
      createChannelGate: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createInsert,
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp: fake(),
    });
    const insert = mainLR.getInsert();
    assert.strictEqual(insert, 'insert');
    assert.strictEqual(
      createInsert.calledOnceWithExactly({
        oscBasePath: '/ch/01',
        oscClient,
      }),
      true,
    );
  });

  test('creates the mix correctly', () => {
    const oscClient = oscClientFactory.build();
    const createMix = fake.returns('mix' as unknown as Mix);
    const mainLR = createChannel({
      oscClient,
      createChannelConfig: fake(),
      channel: 1,
      createDynamicsFilter: fake(),
      createEqualizerBand: fake(),
      createChannelCompressor: fake(),
      createChannelAutomix: fake(),
      createEqualizer: fake(),
      createChannelGate: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createInsert: fake(),
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix,
      createChannelPreamp: fake(),
    });
    const mix = mainLR.getMix();
    assert.strictEqual(mix, 'mix');
    assert.strictEqual(
      createMix.calledOnceWithExactly({
        oscBasePath: '/ch/01',
        oscClient,
      }),
      true,
    );
  });

  test('creates the dca group correctly', () => {
    const oscClient = oscClientFactory.build();
    const createDCAGroup = fake.returns('dcaGroup' as unknown as DCAGroup);
    const mainLR = createChannel({
      oscClient,
      createChannelConfig: fake(),
      channel: 1,
      createDynamicsFilter: fake(),
      createEqualizerBand: fake(),
      createChannelCompressor: fake(),
      createChannelAutomix: fake(),
      createEqualizer: fake(),
      createChannelGate: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createInsert: fake(),
      createDCAGroup,
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp: fake(),
    });
    const dcaGroup = mainLR.getDCAGroup();
    assert.strictEqual(dcaGroup, 'dcaGroup');
    assert.strictEqual(
      createDCAGroup.calledOnceWithExactly({
        oscBasePath: '/ch/01',
        oscClient,
      }),
      true,
    );
  });

  test('creates the mute group correctly', () => {
    const oscClient = oscClientFactory.build();
    const createMuteGroup = fake.returns('muteGroup' as unknown as DCAGroup);
    const mainLR = createChannel({
      oscClient,
      createChannelConfig: fake(),
      channel: 1,
      createDynamicsFilter: fake(),
      createEqualizerBand: fake(),
      createChannelCompressor: fake(),
      createChannelAutomix: fake(),
      createEqualizer: fake(),
      createChannelGate: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createInsert: fake(),
      createDCAGroup: fake(),
      createMuteGroup,
      createMix: fake(),
      createChannelPreamp: fake(),
    });
    const muteGroup = mainLR.getMuteGroup();
    assert.strictEqual(muteGroup, 'muteGroup');
    assert.strictEqual(
      createMuteGroup.calledOnceWithExactly({
        oscBasePath: '/ch/01',
        oscClient,
      }),
      true,
    );
  });
});
