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
    const createChannelConfig = fake.returns('config' as unknown as ChannelConfig<'XR18'>);
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    assert.strictEqual(channel.getConfig(), 'config');
    assert.strictEqual(
      createChannelConfig.calledOnceWithExactly({ channel: 1, oscClient, model: 'XR18' }),
      true,
    );
  });

  test('creates the compressor correctly', () => {
    const oscClient = oscClientFactory.build();
    const createChannelCompressor = fake.returns('compressor' as unknown as ChannelCompressor);
    const createDynamicsFilter = fake();
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    assert.strictEqual(channel.getCompressor(), 'compressor');
    assert.strictEqual(
      createChannelCompressor.calledOnceWithExactly({
        oscBasePath: '/ch/01',
        oscClient,
        createDynamicsFilter,
      }),
      true,
    );
  });
  test('creates the fx send correctly', () => {
    const oscClient = oscClientFactory.build();
    const createChannelFxSend = fake.returns('fxSend' as unknown as ChannelFxSend);
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    assert.strictEqual(channel.getSendFx('FX1'), 'fxSend');
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
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    assert.strictEqual(channel.getSendBus('Bus1'), 'sendBus');
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
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    assert.strictEqual(channel.getAutomix(), 'automix');
    assert.strictEqual(createChannelAutomix.calledOnceWithExactly({ channel: 1, oscClient }), true);
  });
  test('creates the gate correctly', () => {
    const oscClient = oscClientFactory.build();
    const createChannelGate = fake.returns('gate' as unknown as ChannelGate);
    const createDynamicsFilter = fake();
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    assert.strictEqual(channel.getGate(), 'gate');
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
    const createChannelPreamp = fake.returns('preamp' as unknown as ChannelPreamp<'XR18'>);
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    assert.strictEqual(channel.getPreAmp(), 'preamp');
    assert.strictEqual(
      createChannelPreamp.calledOnceWithExactly({ channel: 1, oscClient, model: 'XR18' }),
      true,
    );
  });
  test('creates the equalizer correctly', () => {
    const oscClient = oscClientFactory.build();
    const createEqualizer = fake.returns('equalizer' as unknown as Equalizer<4>);
    const createEqualizerBand = fake();
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    assert.strictEqual(channel.getEqualizer(), 'equalizer');
    assert.strictEqual(
      createEqualizer.calledOnceWithExactly({
        oscBasePath: '/ch/01',
        oscClient,
        numberOfBands: 4,
        createEqualizerBand,
      }),
      true,
    );
  });

  test('creates the insert correctly', () => {
    const oscClient = oscClientFactory.build();
    const createInsert = fake.returns('insert' as unknown as Insert);
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    const insert = channel.getInsert();
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
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    const mix = channel.getMix();
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
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    const dcaGroup = channel.getDCAGroup();
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
    const channel = createChannel({
      oscClient,
      model: 'XR18',
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
    const muteGroup = channel.getMuteGroup();
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
