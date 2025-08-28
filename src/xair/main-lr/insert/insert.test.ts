import { suite, test } from 'mocha';
import { createMainLRInsert } from './insert.js';
import { fake } from 'sinon';
import assert from 'node:assert';
import { oscClientFactory } from '../../../osc/test-factories/client.js';
suite('MainLRInsert', () => {
  test('send the correct osc message to fetch the inserts fxslot', async () => {
    const query = fake.resolves({
      address: '/lr/insert/sel',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const insert = createMainLRInsert({
      oscBasePath: '/lr',
      oscClient,
    });
    const fxslot = await insert.fetchFxSlot('slot');
    assert.strictEqual(fxslot, 'FX1');
    assert.strictEqual(query.calledOnceWithExactly('/lr/insert/sel'), true);
  });

  test('send the correct osc message to set the inserts fxslot', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({
      set,
    });
    const insert = createMainLRInsert({
      oscBasePath: '/lr',
      oscClient,
    });
    await insert.updateFxSlot('OFF', 'slot');
    assert.strictEqual(
      set.calledOnceWithExactly('/lr/insert/sel', [{ type: 'integer', value: 0 }]),
      true,
    );
  });

  test('send the correct osc message to check if the insert is enabled', async () => {
    const query = fake.resolves({
      address: '/lr/insert/on',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const insert = createMainLRInsert({
      oscBasePath: '/lr',
      oscClient,
    });
    const insertEnabled = await insert.fetchIsEnabled('flag');
    assert.strictEqual(insertEnabled, false);
    assert.strictEqual(query.calledOnceWithExactly('/lr/insert/on'), true);
  });

  test('send the correct osc message to enable the insert', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({
      set,
    });
    const insert = createMainLRInsert({
      oscBasePath: '/lr',
      oscClient,
    });
    await insert.updateEnabled(true, 'flag');
    assert.strictEqual(
      set.calledOnceWithExactly('/lr/insert/on', [{ type: 'integer', value: 1 }]),
      true,
    );
  });
});
