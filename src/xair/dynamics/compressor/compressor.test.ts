import { suite, test } from 'mocha';
import { createCompressor } from './compressor.js';
import { oscClientFactory } from '../../../osc/test-factories/client.js';
import { fake, match } from 'sinon';
import assert from 'node:assert';
import { assertClose, isClose } from '../../../test-helpers/is-close.js';
import { DynamicsFilter } from '../filter/filter.js';

suite('Compressor', () => {
  test('send the correct osc message to fetch the compressors attack', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/attack',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const attack = await compressor.fetchAttack('milliseconds');
    assert.strictEqual(attack, 60);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/attack'), true);
  });

  test('send the correct osc message to set the compressors attack', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateAttack(120, 'milliseconds');
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
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const enabled = await compressor.fetchIsAutoTimeEnabled('flag');
    assert.strictEqual(enabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/auto'), true);
  });

  test('send the correct osc message to set the compressors autotime enabled', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateAutoTimeEnabled(false, 'flag');
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
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const enabled = await compressor.fetchIsEnabled('flag');
    assert.strictEqual(enabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/on'), true);
  });

  test('send the correct osc message to enable the compressor', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateEnabled(false, 'flag');
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
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const detectionMode = await compressor.fetchDetectionMode('detectionMode');
    assert.strictEqual(detectionMode, 'PEAK');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/det'), true);
  });

  test('send the correct osc message to set the compressors detection mode', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateDetectionMode('RMS', 'detectionMode');
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
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const envelope = await compressor.fetchEnvelope('envelope');
    assert.strictEqual(envelope, 'LIN');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/env'), true);
  });

  test('send the correct osc message to set the compressors envelope', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateEnvelope('LOG', 'envelope');
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
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const gain = await compressor.fetchGain('decibels');
    assert.strictEqual(gain, 12);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/mgain'), true);
  });

  test('send the correct osc message to set the compressors makeup gain', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateGain(24, 'decibels');
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
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const hold = await compressor.fetchHold('milliseconds');
    assertClose(hold, 6.325);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/hold'), true);
  });

  test('send the correct osc message to set the compressors hold time', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateHold(1500, 'milliseconds');
    assert.ok(
      set.calledWithMatch('/ch/01/dyn/hold', [match({ type: 'float', value: isClose(0.975) })]),
    );
  });

  test('send the correct osc message to fetch the compressors knee', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/knee',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const knee = await compressor.fetchKnee('number');
    assert.strictEqual(knee, 2.5);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/knee'), true);
  });

  test('send the correct osc message to set the compressors knee', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateKnee(5, 'number');
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
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const mix = await compressor.fetchMix('percent');
    assert.strictEqual(mix, 65);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/mix'), true);
  });

  test('send the correct osc message to set the compressors mix', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateMix(42, 'percent');
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
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const mode = await compressor.fetchMode('mode');
    assert.strictEqual(mode, 'EXP');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/mode'), true);
  });

  test('send the correct osc message to set the compressors mode', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateMode('COMP', 'mode');
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
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const ratio = await compressor.fetchRatio('ratio');
    assert.strictEqual(ratio, '1.5');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/ratio'), true);
  });

  test('send the correct osc message to set the compressors ratio', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateRatio('10', 'ratio');
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
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const release = await compressor.fetchRelease('milliseconds');
    assertClose(release, 141.421);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/release'), true);
  });

  test('send the correct osc message to set the compressors release time', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateRelease(1500, 'milliseconds');
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
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    const threshold = await compressor.fetchThreshold('decibels');
    assert.strictEqual(threshold, -30);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/thr'), true);
  });

  test('send the correct osc message to set the compressors threshold', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter: fake(),
    });
    await compressor.updateThreshold(-45, 'decibels');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/thr', [{ type: 'float', value: 0.25 }]),
      true,
    );
  });

  test('creates the filter correctly', () => {
    const oscClient = oscClientFactory.build();
    const createDynamicsFilter = fake.returns('filter' as unknown as DynamicsFilter);
    const compressor = createCompressor({
      oscBasePath: '/ch/01',
      oscClient,
      createDynamicsFilter,
    });
    assert.strictEqual(compressor.getFilter(), 'filter');
    assert.strictEqual(
      createDynamicsFilter.calledOnceWithExactly({
        oscBasePath: '/ch/01',
        oscClient,
        dynamicsType: 'compressor',
      }),
      true,
    );
  });
});
