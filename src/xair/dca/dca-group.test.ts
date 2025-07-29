import { suite, test } from 'mocha';
import { createDCAGroup } from './dca-group.js';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import assert from 'node:assert';
import { fake } from 'sinon';

suite('DCAGroup', () => {
  const DCA1 = 1;
  const DCA2 = 1 << 1;
  const DCA3 = 1 << 2;
  const DCA4 = 1 << 3;

  test('send the correct osc message to check if something is assigned to DCA1', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/dca',
      args: [{ type: 'integer', value: DCA1 | DCA4 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const dcaGroup = createDCAGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const isEnabled = await dcaGroup.isEnabled(1);
    assert.strictEqual(isEnabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/dca'), true);
  });

  test('send the correct osc message to check if something is assigned to DCA2', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/dca',
      args: [{ type: 'integer', value: DCA1 | DCA3 | DCA4 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const dcaGroup = createDCAGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const isEnabled = await dcaGroup.isEnabled(2);
    assert.strictEqual(isEnabled, false);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/dca'), true);
  });

  test('send the correct osc message to check if something is assigned to DCA3', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/dca',
      args: [{ type: 'integer', value: DCA1 | DCA3 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const dcaGroup = createDCAGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const isEnabled = await dcaGroup.isEnabled(3);
    assert.strictEqual(isEnabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/dca'), true);
  });

  test('send the correct osc message to check if something is assigned to DCA4', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/dca',
      args: [{ type: 'integer', value: DCA1 | DCA4 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const dcaGroup = createDCAGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const isEnabled = await dcaGroup.isEnabled(4);
    assert.strictEqual(isEnabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/dca'), true);
  });

  test('send the correct osc message to assign a DCA, leaving others untouched', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/dca',
      args: [{ type: 'integer', value: DCA1 | DCA3 }],
    });
    const set = fake();
    const oscClient = oscClientFactory.build({
      query,
      set,
    });
    const dcaGroup = createDCAGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await dcaGroup.updateEnabled(2);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/dca'), true);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/grp/dca', [{ type: 'integer', value: DCA1 | DCA2 | DCA3 }]),
      true,
    );
  });

  test('send the correct osc message to unassign a DCA, leaving others untouched', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/dca',
      args: [{ type: 'integer', value: DCA1 | DCA3 }],
    });
    const set = fake();
    const oscClient = oscClientFactory.build({
      query,
      set,
    });
    const dcaGroup = createDCAGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await dcaGroup.updateDisabled(1);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/dca'), true);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/grp/dca', [{ type: 'integer', value: DCA3 }]),
      true,
    );
  });
});
