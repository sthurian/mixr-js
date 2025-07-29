import { suite, test } from 'mocha';
import { createChannelSendBus } from './send-bus.js';
import { oscClientFactory } from '../../../osc/test-factories/client.js';
import { fake, match } from 'sinon';
import { assertClose, isClose } from '../../../test-helpers/is-close.js';
import assert from 'node:assert';

suite('ChannelSendBus', () => {
  test('send the correct osc message to fetch the send bus level', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/02/level',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const sendBus = createChannelSendBus({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    const level = await sendBus.fetchLevel('decibels');
    assertClose(level, -10);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/02/level'), true);
  });

  test('send the correct osc message to set the send bus level', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const sendBus = createChannelSendBus({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    await sendBus.updateLevel(6, 'decibels');
    assert.ok(
      set.calledWithMatch('/ch/01/mix/02/level', [match({ type: 'float', value: isClose(0.9) })]),
    );
  });

  test('send the correct osc message to fetch the send bus pan for even bus numbers', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/01/pan',
      args: [{ type: 'float', value: 0.25 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const sendBus = createChannelSendBus({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    const pan = await sendBus.fetchPan('percent');
    assert.strictEqual(pan, -50);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/01/pan'), true);
  });

  test('send the correct osc message to set the send bus pan for even bus numbers', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const sendBus = createChannelSendBus({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    await sendBus.updatePan(100, 'percent');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/01/pan', [{ type: 'float', value: 1.0 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the send bus pan for odd bus numbers', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/03/pan',
      args: [{ type: 'float', value: 0.25 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const sendBus = createChannelSendBus({
      channel: 1,
      oscClient,
      sendBus: 'Bus3',
    });
    const pan = await sendBus.fetchPan('percent');
    assert.strictEqual(pan, -50);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/03/pan'), true);
  });

  test('send the correct osc message to set the send bus pan for odd bus numbers', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const sendBus = createChannelSendBus({
      channel: 1,
      oscClient,
      sendBus: 'Bus3',
    });
    await sendBus.updatePan(100, 'percent');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/03/pan', [{ type: 'float', value: 1.0 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the send bus tap', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/02/tap',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const sendBus = createChannelSendBus({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    const tap = await sendBus.fetchTap('tap');
    assert.strictEqual(tap, 'IN');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/02/tap'), true);
  });

  test('send the correct osc message to set the send bus tap', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const sendBus = createChannelSendBus({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    await sendBus.updateTap('POSTEQ', 'tap');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/02/tap', [{ type: 'integer', value: 2 }]),
      true,
    );
  });

  test('send the correct osc message to check if the send bus group is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/02/grpon',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const sendBus = createChannelSendBus({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    const grpEnabled = await sendBus.fetchIsGroupEnabled('flag');
    assert.strictEqual(grpEnabled, false);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/02/grpon'), true);
  });

  test('send the correct osc message to enable the send bus group', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const sendBus = createChannelSendBus({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    await sendBus.updateGroupEnabled(true, 'flag');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/02/grpon', [{ type: 'integer', value: 1 }]),
      true,
    );
  });
});
