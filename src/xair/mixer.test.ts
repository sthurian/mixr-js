import { suite, test } from 'mocha';
import { createMixer } from './mixer.js';
import { fake } from 'sinon';
import assert from 'node:assert';
import { oscClientFactory } from '../osc/test-factories/client.js';
import { Channel } from './channel/channel.js';
import { MainLR } from './main-lr/main-lr.js';

suite('Mixer', () => {
  test('creates the channel correctly', () => {
    const oscClient = oscClientFactory.build();
    const createChannel = fake.returns('channel' as unknown as Channel);
    const createChannelConfig = fake();
    const createChannelCompressor = fake();
    const createDynamicsFilter = fake();
    const createEqualizerBand = fake();
    const createChannelAutomix = fake();
    const createEqualizer = fake();
    const createChannelGate = fake();
    const createInsert = fake();
    const createDCAGroup = fake();
    const createMuteGroup = fake();
    const createMix = fake();
    const createChannelPreamp = fake();
    const createChannelFxSend = fake();
    const createChannelSendBus = fake();
    const createConfig = fake();
    const createLRMix = fake();
    const createMainLRCompressor = fake();
    const createMainLREqualizer = fake();
    const createMainLR = fake();
    const mixer = createMixer({
      oscClient,
      createChannel,
      createChannelConfig,
      createChannelCompressor,
      createDynamicsFilter,
      createEqualizerBand,
      createChannelAutomix,
      createEqualizer,
      createChannelGate,
      createInsert,
      createDCAGroup,
      createMuteGroup,
      createMix,
      createChannelPreamp,
      createChannelFxSend,
      createChannelSendBus,
      createConfig,
      createLRMix,
      createMainLRCompressor,
      createMainLR,
      createMainLREqualizer,
    });
    const channel = mixer.getChannel('CH01');
    assert.strictEqual(channel, 'channel');
    assert.strictEqual(
      createChannel.calledOnceWithExactly({
        channel: 1,
        oscClient,
        createChannelConfig,
        createChannelCompressor,
        createDynamicsFilter,
        createEqualizerBand,
        createChannelAutomix,
        createEqualizer,
        createChannelFxSend,
        createChannelSendBus,
        createChannelGate,
        createChannelPreamp,
        createDCAGroup,
        createInsert,
        createMix,
        createMuteGroup,
      }),
      true,
    );
  });

  test('creates the mainLR correctly', () => {
    const oscClient = oscClientFactory.build();
    const createMainLR = fake.returns('mainLR' as unknown as MainLR);
    const createConfig = fake();
    const createLRMix = fake();
    const createInsert = fake();
    const createMainLRCompressor = fake();
    const createDynamicsFilter = fake();
    const createMainLREqualizer = fake();
    const createEqualizer = fake();
    const createEqualizerBand = fake();
    const mixer = createMixer({
      oscClient,
      createChannel: fake(),
      createChannelConfig: fake(),
      createChannelCompressor: fake(),
      createDynamicsFilter,
      createEqualizerBand,
      createChannelAutomix: fake(),
      createEqualizer,
      createChannelGate: fake(),
      createInsert,
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createConfig,
      createLRMix,
      createMainLRCompressor,
      createMainLR,
      createMainLREqualizer,
    });
    const mainLR = mixer.getMainLR();
    assert.strictEqual(mainLR, 'mainLR');
    assert.strictEqual(
      createMainLR.calledOnceWithExactly({
        oscClient,
        createConfig,
        createLRMix,
        createInsert,
        createMainLRCompressor,
        createDynamicsFilter,
        createEqualizer,
        createEqualizerBand,
        createMainLREqualizer,
      }),
      true,
    );
  });

  test('closes the connection correctly', async () => {
    const oscClient = oscClientFactory.build();
    const close = fake.resolves({});
    oscClient.close = close;
    const mixer = createMixer({
      oscClient,
      createChannel: fake(),
      createChannelConfig: fake(),
      createChannelCompressor: fake(),
      createDynamicsFilter: fake(),
      createEqualizerBand: fake(),
      createChannelAutomix: fake(),
      createEqualizer: fake(),
      createChannelGate: fake(),
      createInsert: fake(),
      createDCAGroup: fake(),
      createMuteGroup: fake(),
      createMix: fake(),
      createChannelPreamp: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createConfig: fake(),
      createLRMix: fake(),
      createMainLRCompressor: fake(),
      createMainLR: fake(),
      createMainLREqualizer: fake(),
    });
    await mixer.closeConnection();
    assert.strictEqual(close.calledOnce, true);
  });
});
