import { suite, test } from 'mocha';
import { oscClientFactory } from '../../../osc/test-factories/client.js';
import { fake, match } from 'sinon';
import { assertClose, isClose } from '../../../test-helpers/is-close.js';
import assert from 'node:assert';
import { createChannelFxSend } from './fx-send.js';
import { decibel } from '../../mapper/level.js';

suite('ChannelFxSend', () => {
  test('send the correct osc message to fetch the fx sends level', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/08/level',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const fxSend = createChannelFxSend({
      channel: 1,
      oscClient,
      fx: 'FX2',
    });
    const level = await fxSend.fetchLevel();
    assertClose(level, -10);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/08/level'), true);
  });

  test('send the correct osc message to set the fx sends level', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const fxSend = createChannelFxSend({
      channel: 1,
      oscClient,
      fx: 'FX2',
    });
    await fxSend.updateLevel(decibel(6));
    assert.ok(
      set.calledWithMatch('/ch/01/mix/08/level', [match({ type: 'float', value: isClose(0.9) })]),
    );
  });

  test('send the correct osc message to fetch the fx sends tap', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/08/tap',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const fxSend = createChannelFxSend({
      channel: 1,
      oscClient,
      fx: 'FX2',
    });
    const tap = await fxSend.fetchTap();
    assert.strictEqual(tap, 'IN');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/08/tap'), true);
  });

  test('send the correct osc message to set the fx sends tap', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const fxSend = createChannelFxSend({
      channel: 1,
      oscClient,
      fx: 'FX2',
    });
    await fxSend.updateTap('POSTEQ');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/08/tap', [{ type: 'integer', value: 2 }]),
      true,
    );
  });

  test('send the correct osc message to check if the fx sends group is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/08/grpon',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const fxSend = createChannelFxSend({
      channel: 1,
      oscClient,
      fx: 'FX2',
    });
    const grpEnabled = await fxSend.fetchIsGroupEnabled();
    assert.strictEqual(grpEnabled, false);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/08/grpon'), true);
  });

  test('send the correct osc message to enable the fx sends group', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const fxSend = createChannelFxSend({
      channel: 1,
      oscClient,
      fx: 'FX2',
    });
    await fxSend.updateGroupEnabled(true);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/08/grpon', [{ type: 'integer', value: 1 }]),
      true,
    );
  });
});
