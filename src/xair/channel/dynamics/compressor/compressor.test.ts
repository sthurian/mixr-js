import { suite, test } from 'mocha';
import { createChannelCompressor } from './compressor.js';
import { oscClientFactory } from '../../../../osc/test-factories/client.js';
import { fake, match } from 'sinon';
import assert from 'node:assert';
import { assertClose, isClose } from '../../../../test-helpers/is-close.js';

suite('ChannelCompressor', () => {
  test('send the correct osc message to fetch the compressors attack', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/attack',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const attack = await compressor.fetchAttack();
    assert.strictEqual(attack, 60);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/attack'), true);
  });

  test('send the correct osc message to set the compressors attack', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateAttack(120);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/attack', [{ type: 'float', value: 1.0 }]),
      true,
    );
  });

  test('send the correct osc message to fetch if the compressors autotime is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/auto',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const enabled = await compressor.fetchIsAutoTimeEnabled();
    assert.strictEqual(enabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/auto'), true);
  });

  test('send the correct osc message to set the compressors autotime enabled', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateAutoTimeEnabled(false);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/auto', [{ type: 'integer', value: 0 }]),
      true,
    );
  });

  test('send the correct osc message to query if the compressor is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/on',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const enabled = await compressor.fetchIsEnabled();
    assert.strictEqual(enabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/on'), true);
  });

  test('send the correct osc message to enable the compressor', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateEnabled(false);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/on', [{ type: 'integer', value: 0 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the compressors detection mode', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/det',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const detectionMode = await compressor.fetchDetectionMode();
    assert.strictEqual(detectionMode, 'PEAK');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/det'), true);
  });

  test('send the correct osc message to set the compressors detection mode', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateDetectionMode('RMS');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/det', [{ type: 'integer', value: 1 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the compressors envelope', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/env',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const envelope = await compressor.fetchEnvelope();
    assert.strictEqual(envelope, 'LIN');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/env'), true);
  });

  test('send the correct osc message to set the compressors envelope', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateEnvelope('LOG');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/env', [{ type: 'integer', value: 1 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the compressors makeup gain', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/mgain',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const gain = await compressor.fetchGain();
    assert.strictEqual(gain, 12);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/mgain'), true);
  });

  test('send the correct osc message to set the compressors makeup gain', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateGain(24);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/mgain', [{ type: 'float', value: 1.0 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the compressors hold time', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/hold',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const hold = await compressor.fetchHold();
    assertClose(hold, 6.325);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/hold'), true);
  });

  test('send the correct osc message to set the compressors hold time', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateHold(1500);
    assert.ok(
      set.calledWithMatch('/ch/01/dyn/hold', [match({ type: 'float', value: isClose(0.975) })]),
    );
  });

  test('send the correct osc message to fetch the compressors key source', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/keysrc',
      args: [{ type: 'integer', value: 3 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const keysrc = await compressor.fetchKeySource();
    assert.strictEqual(keysrc, 'CH03');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/keysrc'), true);
  });

  test('send the correct osc message to set the compressors key source', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateKeySource('BUS02');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/keysrc', [{ type: 'integer', value: 18 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the compressors knee', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/knee',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const knee = await compressor.fetchKnee();
    assert.strictEqual(knee, 2.5);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/knee'), true);
  });

  test('send the correct osc message to set the compressors knee', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateKnee(5);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/knee', [{ type: 'float', value: 1 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the compressors mix', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/mix',
      args: [{ type: 'float', value: 0.65 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const mix = await compressor.fetchMix();
    assert.strictEqual(mix, 65);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/mix'), true);
  });

  test('send the correct osc message to set the compressors mix', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateMix(42);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/mix', [{ type: 'float', value: 0.42 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the compressors mode', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/mode',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const mode = await compressor.fetchMode();
    assert.strictEqual(mode, 'EXP');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/mode'), true);
  });

  test('send the correct osc message to set the compressors mode', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateMode('COMP');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/mode', [{ type: 'integer', value: 0 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the compressors ratio', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/ratio',
      args: [{ type: 'integer', value: 2 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const ratio = await compressor.fetchRatio();
    assert.strictEqual(ratio, '1.5');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/ratio'), true);
  });

  test('send the correct osc message to set the compressors ratio', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateRatio('10');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/ratio', [{ type: 'integer', value: 9 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the compressors release time', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/release',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const release = await compressor.fetchRelease();
    assertClose(release, 141.421);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/release'), true);
  });

  test('send the correct osc message to set the compressors release time', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateRelease(1500);
    assert.ok(
      set.calledWithMatch('/ch/01/dyn/release', [match({ type: 'float', value: isClose(0.853) })]),
    );
  });

  test('send the correct osc message to fetch the compressors threshold', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/thr',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    const threshold = await compressor.fetchThreshold();
    assert.strictEqual(threshold, -30);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/thr'), true);
  });

  test('send the correct osc message to set the compressors threshold', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createChannelCompressor({
      channel: 1,
      oscClient,
    });
    await compressor.updateThreshold(-45);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/thr', [{ type: 'float', value: 0.25 }]),
      true,
    );
  });
});
