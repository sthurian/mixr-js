import { suite, test } from 'mocha';
import { fake } from 'sinon';
import { oscClientFactory } from '../../../osc/test-factories/client.js';
import { createChannelAutomix } from './automix.js';
import assert from 'node:assert';

suite('ChannelAutomix', () => {
  test('send the correct osc message to fetch the channels automix group', async () => {
    const query = fake.resolves({
      address: '/ch/01/automix/group',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const automix = createChannelAutomix({
      channel: 1,
      oscClient,
    });
    const result = await automix.fetchGroup();
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/automix/group'), true);
    assert.strictEqual(result, 'OFF');
  });

  test('send the correct osc message to set the channels automix group', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({
      set,
    });
    const automix = createChannelAutomix({
      channel: 1,
      oscClient,
    });
    await automix.updateGroup('Y');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/automix/group', [{ type: 'integer', value: 2 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the channels automix weight', async () => {
    const query = fake.resolves({
      address: '/ch/01/automix/weight',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const automix = createChannelAutomix({
      channel: 1,
      oscClient,
    });
    const result = await automix.fetchWeight();
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/automix/weight'), true);
    assert.strictEqual(result, 0);
  });

  test('send the correct osc message to set the channels automix weight', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({
      set,
    });
    const automix = createChannelAutomix({
      channel: 1,
      oscClient,
    });
    await automix.updateWeight(-12);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/automix/weight', [{ type: 'float', value: 0 }]),
      true,
    );
  });
});
