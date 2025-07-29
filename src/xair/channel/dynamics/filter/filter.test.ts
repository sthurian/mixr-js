import { suite, test } from 'mocha';
import { createDynamicsFilter } from './filter.js';
import { oscClientFactory } from '../../../../osc/test-factories/client.js';
import { fake, match } from 'sinon';
import { assertClose, isClose } from '../../../../test-helpers/is-close.js';
import assert from 'node:assert';

suite('DynamicsFilter', () => {
  test('send the correct osc message to fetch the filters frequency', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/filter/f',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const filter = createDynamicsFilter({
      channel: 1,
      oscClient,
      dynamicsType: 'compressor',
    });
    const freq = await filter.fetchFrequency();
    assertClose(freq, 632.455);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/filter/f'), true);
  });

  test('send the correct osc message to set the filters frequency', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const filter = createDynamicsFilter({
      channel: 1,
      oscClient,
      dynamicsType: 'compressor',
    });
    await filter.updateFrequency(1500);
    assert.ok(
      set.calledWithMatch('/ch/01/dyn/filter/f', [match({ type: 'float', value: isClose(0.625) })]),
    );
  });

  test('send the correct osc message to fetch the filters type', async () => {
    const query = fake.resolves({
      address: '/ch/01/dyn/filter/type',
      args: [{ type: 'integer', value: 5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const filter = createDynamicsFilter({
      channel: 1,
      oscClient,
      dynamicsType: 'compressor',
    });
    const type = await filter.fetchType();
    assert.strictEqual(type, '2.0');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/filter/type'), true);
  });

  test('send the correct osc message to set the filters type', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const filter = createDynamicsFilter({
      channel: 1,
      oscClient,
      dynamicsType: 'compressor',
    });
    await filter.updateType('HC6');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/filter/type', [{ type: 'integer', value: 2 }]),
      true,
    );
  });

  test('send the correct osc message to query if the filter is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/gate/filter/on',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const filter = createDynamicsFilter({
      channel: 1,
      oscClient,
      dynamicsType: 'gate',
    });
    const enabled = await filter.fetchIsEnabled();
    assert.strictEqual(enabled, false);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/gate/filter/on'), true);
  });

  test('send the correct osc message to enable the filter', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const filter = createDynamicsFilter({
      channel: 1,
      oscClient,
      dynamicsType: 'gate',
    });
    await filter.updateEnabled(true);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/gate/filter/on', [{ type: 'integer', value: 1 }]),
      true,
    );
  });
});
