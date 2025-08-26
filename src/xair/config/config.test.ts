import { suite, test } from 'mocha';
import { createConfig } from './config.js';
import { fake } from 'sinon';
import assert from 'node:assert';
import { oscClientFactory } from '../../osc/test-factories/client.js';

suite('ChannelConfig', () => {
  test('send the correct osc message to fetch the channels name', async () => {
    const query = fake.resolves({
      address: '/ch/01/config/name',
      args: [{ type: 'string', value: 'test-channel' }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const channelConfig = createConfig({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const result = await channelConfig.fetchName();
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/config/name'), true);
    assert.strictEqual(result, 'test-channel');
  });

  test('send the correct osc message to set the channels name', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({
      set,
    });
    const channelConfig = createConfig({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await channelConfig.updateName('test-channel');
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
    const channelConfig = createConfig({
      oscBasePath: '/ch/01',
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
    const channelConfig = createConfig({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await channelConfig.updateColor('Blue Inv', 'color');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/config/color', [{ type: 'integer', value: 12 }]),
      true,
    );
  });
});
