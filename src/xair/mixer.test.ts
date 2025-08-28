import { suite, test } from 'mocha';
import { createMixer } from './mixer.js';
import { fake } from 'sinon';
import assert from 'node:assert';
import { oscClientFactory } from '../osc/test-factories/client.js';
import { Channel } from './channel/channel.js';
import { MainLR } from './main-lr/main-lr.js';
import { Bus } from './bus/bus.js';

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
    const createCompressor = fake();
    const createMainLREqualizer = fake();
    const createMainLR = fake();
    const createBus = fake();
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
      createCompressor,
      createMainLR,
      createMainLREqualizer,
      createBus,
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

  test('create the bus correctly', () => {
    const oscClient = oscClientFactory.build();
    const createBus = fake.returns('bus' as unknown as Bus);
    const createConfig = fake();
    const createChannelCompressor = fake();
    const createDynamicsFilter = fake();
    const createEqualizer = fake();
    const createEqualizerBand = fake();
    const createDCAGroup = fake();
    const createInsert = fake();
    const createMix = fake();
    const createMuteGroup = fake();
    const mixer = createMixer({
      oscClient,
      createChannel: fake(),
      createChannelConfig: fake(),
      createChannelCompressor,
      createDynamicsFilter,
      createEqualizerBand,
      createChannelAutomix: fake(),
      createEqualizer,
      createChannelGate: fake(),
      createInsert,
      createDCAGroup,
      createMuteGroup,
      createMix,
      createChannelPreamp: fake(),
      createChannelFxSend: fake(),
      createChannelSendBus: fake(),
      createConfig,
      createLRMix: fake(),
      createCompressor: fake(),
      createMainLR: fake(),
      createMainLREqualizer: fake(),
      createBus,
    });
    const bus = mixer.getBus('Bus1');
    assert.strictEqual(bus, 'bus');
    assert.strictEqual(
      createBus.calledOnceWithExactly({
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
    const createCompressor = fake();
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
      createBus: fake(),
      createConfig,
      createLRMix,
      createCompressor,
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
        createCompressor,
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
      createCompressor: fake(),
      createMainLR: fake(),
      createMainLREqualizer: fake(),
      createBus: fake(),
    });
    await mixer.closeConnection();
    assert.strictEqual(close.calledOnce, true);
  });
});
