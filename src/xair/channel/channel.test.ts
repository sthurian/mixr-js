import { suite, test } from 'mocha';
import { createChannel } from './channel.js';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import { fake } from 'sinon';
import assert from 'node:assert';

suite('Channel', () => {
  test('fetches the name of a channel', async () => {
    const query = fake.resolves({
      address: '/ch/01/config/name',
      args: [{ type: 'string', value: 'test-channel' }],
    });
    const oscClient = oscClientFactory.build({ query });
    const channel = createChannel({
      channel: 1,
      oscClient,
    });
    const result = await channel.getConfig().fetchName();
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/config/name'), true);
    assert.strictEqual(result, 'test-channel');
  });

  test('updates the name of a channel', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const channel = createChannel({
      channel: 1,
      oscClient,
    });
    await channel.getConfig().updateName('test-channel');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/config/name', [{ type: 'string', value: 'test-channel' }]),
      true,
    );
  });

  test('fetches the color of a channel', async () => {
    const query = fake.resolves({
      address: '/ch/01/config/color',
      args: [{ type: 'integer', value: 2 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const channel = createChannel({
      channel: 1,
      oscClient,
    });
    const result = await channel.getConfig().fetchColor('color');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/config/color'), true);
    assert.strictEqual(result, 'Green');
  });

  test('updates the color of a channel', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const channel = createChannel({
      channel: 1,
      oscClient,
    });
    await channel.getConfig().updateColor('Green', 'color');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/config/color', [{ type: 'integer', value: 2 }]),
      true,
    );
  });

  test('fetches the fader level of a channel', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/fader',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const channel = createChannel({
      channel: 1,
      oscClient,
    });
    const result = await channel.getMix().fetchFader('decibels');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/fader'), true);
    assert.strictEqual(result, -10);
  });
});
