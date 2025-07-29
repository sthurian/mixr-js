import { suite, test } from 'mocha';
import { fake, match } from 'sinon';
import { oscClientFactory } from '../../../../osc/test-factories/client.js';
import { createChannelGate } from './gate.js';
import { assertClose, isClose } from '../../../../test-helpers/is-close.js';
import assert from 'node:assert';

suite('ChannelGate', () => {
  test('send the correct osc message to fetch the gates attack', async () => {
    const query = fake.resolves({
      address: '/ch/01/gate/attack',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    const attack = await gate.fetchAttack();
    assert.strictEqual(attack, 60);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/gate/attack'), true);
  });

  test('send the correct osc message to set the gates attack', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    await gate.updateAttack(90);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/gate/attack', [{ type: 'float', value: 0.75 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the gates hold time', async () => {
    const query = fake.resolves({
      address: '/ch/01/gate/hold',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    const hold = await gate.fetchHold();
    assertClose(hold, 6.325);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/gate/hold'), true);
  });

  test('send the correct osc message to set the gates hold time', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    await gate.updateHold(1500);
    assert.ok(
      set.calledWithMatch('/ch/01/gate/hold', [match({ type: 'float', value: isClose(0.975) })]),
    );
  });

  test('send the correct osc message to fetch the gates key source', async () => {
    const query = fake.resolves({
      address: '/ch/01/gate/keysrc',
      args: [{ type: 'integer', value: 3 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    const keysrc = await gate.fetchKeySource();
    assert.strictEqual(keysrc, 'CH03');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/gate/keysrc'), true);
  });

  test('send the correct osc message to set the gates key source', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    await gate.updateKeySource('BUS02');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/gate/keysrc', [{ type: 'integer', value: 18 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the gates mode', async () => {
    const query = fake.resolves({
      address: '/ch/01/gate/mode',
      args: [{ type: 'integer', value: 2 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    const mode = await gate.fetchMode();
    assert.strictEqual(mode, 'EXP4');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/gate/mode'), true);
  });

  test('send the correct osc message to set the gates mode', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    await gate.updateMode('GATE');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/gate/mode', [{ type: 'integer', value: 3 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the gates range', async () => {
    const query = fake.resolves({
      address: '/ch/01/gate/range',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    const range = await gate.fetchRange();
    assert.strictEqual(range, 31.5);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/gate/range'), true);
  });

  test('send the correct osc message to set the gates range', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    await gate.updateRange(60);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/gate/range', [{ type: 'float', value: 1 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the gates release time', async () => {
    const query = fake.resolves({
      address: '/ch/01/gate/release',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    const release = await gate.fetchRelease();
    assertClose(release, 141.421);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/gate/release'), true);
  });

  test('send the correct osc message to set the gates release time', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    await gate.updateRelease(1500);
    assert.ok(
      set.calledWithMatch('/ch/01/gate/release', [match({ type: 'float', value: isClose(0.853) })]),
    );
  });

  test('send the correct osc message to fetch the gates threshold', async () => {
    const query = fake.resolves({
      address: '/ch/01/gate/thr',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    const threshold = await gate.fetchThreshold();
    assert.strictEqual(threshold, -40);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/gate/thr'), true);
  });

  test('send the correct osc message to set the gates threshold', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    await gate.updateThreshold(-60);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/gate/thr', [{ type: 'float', value: 0.25 }]),
      true,
    );
  });

  test('send the correct osc message to query if the gate is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/gate/on',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    const enabled = await gate.fetchIsEnabled();
    assert.strictEqual(enabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/gate/on'), true);
  });

  test('send the correct osc message to enable the gate', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const gate = createChannelGate({
      channel: 1,
      oscClient,
    });
    await gate.updateEnabled(false);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/gate/on', [{ type: 'integer', value: 0 }]),
      true,
    );
  });
});
