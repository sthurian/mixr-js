import { suite, test } from 'mocha';
import { createInsert } from './insert.js';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import { fake } from 'sinon';
import assert from 'node:assert';
suite('Insert', () => {
  test('send the correct osc message to fetch the inserts fxslot', async () => {
    const query = fake.resolves({
      address: '/ch/01/insert/sel',
      args: [{ type: 'integer', value: 2 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const insert = createInsert({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const fxslot = await insert.fetchFxSlot('slot');
    assert.strictEqual(fxslot, 'Fx1B');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/insert/sel'), true);
  });

  test('send the correct osc message to set the inserts fxslot', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({
      set,
    });
    const insert = createInsert({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await insert.updateFxSlot('OFF', 'slot');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/insert/sel', [{ type: 'integer', value: 0 }]),
      true,
    );
  });

  test('send the correct osc message to check if the insert is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/insert/on',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const insert = createInsert({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const insertEnabled = await insert.fetchIsEnabled('flag');
    assert.strictEqual(insertEnabled, false);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/insert/on'), true);
  });

  test('send the correct osc message to enable the insert', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({
      set,
    });
    const insert = createInsert({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await insert.updateEnabled(true, 'flag');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/insert/on', [{ type: 'integer', value: 1 }]),
      true,
    );
  });
});
