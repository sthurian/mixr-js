import { suite, test } from 'mocha';
import { createChannelBusSend } from './bus-send.js';
import { oscClientFactory } from '../../../osc/test-factories/client.js';
import { fake, match } from 'sinon';
import { assertClose, isClose } from '../../../test-helpers/is-close.js';
import assert from 'node:assert';
import { decibel } from '../../mapper/level.js';

suite('ChannelBusSend', () => {
  test('send the correct osc message to fetch the bus sends level', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/02/level',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const busSend = createChannelBusSend({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    const level = await busSend.fetchLevel();
    assertClose(level, -10);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/02/level'), true);
  });

  test('send the correct osc message to set the bus sends level', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const busSend = createChannelBusSend({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    await busSend.updateLevel(decibel(6));
    assert.ok(
      set.calledWithMatch('/ch/01/mix/02/level', [match({ type: 'float', value: isClose(0.9) })]),
    );
  });

  test('send the correct osc message to fetch the bus sends pan for even bus numbers', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/01/pan',
      args: [{ type: 'float', value: 0.25 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const busSend = createChannelBusSend({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    const pan = await busSend.fetchPan();
    assert.strictEqual(pan, -50);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/01/pan'), true);
  });

  test('send the correct osc message to set the bus sends pan for even bus numbers', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const busSend = createChannelBusSend({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    await busSend.updatePan(100);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/01/pan', [{ type: 'float', value: 1.0 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the bus sends pan for odd bus numbers', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/03/pan',
      args: [{ type: 'float', value: 0.25 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const busSend = createChannelBusSend({
      channel: 1,
      oscClient,
      sendBus: 'Bus3',
    });
    const pan = await busSend.fetchPan();
    assert.strictEqual(pan, -50);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/03/pan'), true);
  });

  test('send the correct osc message to set the bus sends pan for odd bus numbers', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const busSend = createChannelBusSend({
      channel: 1,
      oscClient,
      sendBus: 'Bus3',
    });
    await busSend.updatePan(100);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/03/pan', [{ type: 'float', value: 1.0 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the bus sends tap', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/02/tap',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const busSend = createChannelBusSend({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    const tap = await busSend.fetchTap();
    assert.strictEqual(tap, 'IN');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/02/tap'), true);
  });

  test('send the correct osc message to set the bus sends tap', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const busSend = createChannelBusSend({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    await busSend.updateTap('POSTEQ');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/02/tap', [{ type: 'integer', value: 2 }]),
      true,
    );
  });

  test('send the correct osc message to check if the bus sends group is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/02/grpon',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const busSend = createChannelBusSend({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    const grpEnabled = await busSend.fetchIsGroupEnabled();
    assert.strictEqual(grpEnabled, false);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/02/grpon'), true);
  });

  test('send the correct osc message to enable the bus sends group', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const busSend = createChannelBusSend({
      channel: 1,
      oscClient,
      sendBus: 'Bus2',
    });
    await busSend.updateGroupEnabled(true);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/02/grpon', [{ type: 'integer', value: 1 }]),
      true,
    );
  });
});
