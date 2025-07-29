import { suite, test } from 'mocha';
import { createChannelConfig } from './config.js';
import { fake } from 'sinon';
import assert from 'node:assert';
import { oscClientFactory } from '../../../osc/test-factories/client.js';
suite('ChannelConfig', () => {
  test('send the correct osc message to fetch the channels name', async () => {
    const query = fake.resolves({
      address: '/ch/01/config/name',
      args: [{ type: 'string', value: 'test-channel' }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const channelConfig = createChannelConfig({
      channel: 1,
      oscClient,
    });
    const result = await channelConfig.fetchName('string');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/config/name'), true);
    assert.strictEqual(result, 'test-channel');
  });

  test('send the correct osc message to set the channels name', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({
      set,
    });
    const channelConfig = createChannelConfig({
      channel: 1,
      oscClient,
    });
    await channelConfig.updateName('test-channel', 'string');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/config/name', [{ type: 'string', value: 'test-channel' }]),
      true,
    );
  });

  test('send the correct osc message to fetch the channels color', async () => {
    const query = fake.resolves({
      address: '/ch/01/config/color',
      args: [{ type: 'integer', value: 2 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const channelConfig = createChannelConfig({
      channel: 1,
      oscClient,
    });
    const result = await channelConfig.fetchColor('color');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/config/color'), true);
    assert.strictEqual(result, 'Green');
  });

  test('send the correct osc message to set the channels color', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({
      set,
    });
    const channelConfig = createChannelConfig({
      channel: 1,
      oscClient,
    });
    await channelConfig.updateColor('Blue Inv', 'color');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/config/color', [{ type: 'integer', value: 12 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the channels analog source', async () => {
    const query = fake.resolves({
      address: '/ch/01/config/insrc',
      args: [{ type: 'integer', value: 3 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const channelConfig = createChannelConfig({
      channel: 1,
      oscClient,
    });
    const result = await channelConfig.fetchAnalogSource('inputSource');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/config/insrc'), true);
    assert.strictEqual(result, 'INP 04');
  });

  test('send the correct osc message to set the channels analog source', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({
      set,
    });
    const channelConfig = createChannelConfig({
      channel: 1,
      oscClient,
    });
    await channelConfig.updateAnalogSource('INP 06', 'inputSource');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/config/insrc', [{ type: 'integer', value: 5 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the channels usb return source', async () => {
    const query = fake.resolves({
      address: '/ch/01/config/rtnsrc',
      args: [{ type: 'integer', value: 2 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const channelConfig = createChannelConfig({
      channel: 1,
      oscClient,
    });
    const result = await channelConfig.fetchUsbReturnSource('usbReturnSource');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/config/rtnsrc'), true);
    assert.strictEqual(result, 'USB 03');
  });

  test('send the correct osc message to set the channels usb return source', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({
      set,
    });
    const channelConfig = createChannelConfig({
      channel: 1,
      oscClient,
    });
    await channelConfig.updateUsbReturnSource('USB 10', 'usbReturnSource');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/config/rtnsrc', [{ type: 'integer', value: 9 }]),
      true,
    );
  });
});
