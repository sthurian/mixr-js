import { suite, test } from 'mocha';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import assert from 'node:assert';
import { fake } from 'sinon';
import { createMuteGroup } from './mute-group.js';

suite('MuteGroup', () => {
  const MUTE1 = 1;
  const MUTE2 = 1 << 1;
  const MUTE3 = 1 << 2;
  const MUTE4 = 1 << 3;

  test('send the correct osc message to check if a channel is assigned to MUTE1', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/mute',
      args: [{ type: 'integer', value: MUTE1 | MUTE4 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const muteGroup = createMuteGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const isEnabled = await muteGroup.isEnabled(1);
    assert.strictEqual(isEnabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/mute'), true);
  });

  test('send the correct osc message to check if a channel is assigned to MUTE2', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/mute',
      args: [{ type: 'integer', value: MUTE1 | MUTE3 | MUTE4 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const muteGroup = createMuteGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const isEnabled = await muteGroup.isEnabled(2);
    assert.strictEqual(isEnabled, false);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/mute'), true);
  });

  test('send the correct osc message to check if a channel is assigned to MUTE3', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/mute',
      args: [{ type: 'integer', value: MUTE1 | MUTE3 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const muteGroup = createMuteGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const isEnabled = await muteGroup.isEnabled(3);
    assert.strictEqual(isEnabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/mute'), true);
  });

  test('send the correct osc message to check if a channel is assigned to MUTE4', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/mute',
      args: [{ type: 'integer', value: MUTE1 | MUTE3 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const muteGroup = createMuteGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const isEnabled = await muteGroup.isEnabled(4);
    assert.strictEqual(isEnabled, false);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/mute'), true);
  });

  test('send the correct osc message to assign a Mute, leaving others untouched', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/mute',
      args: [{ type: 'integer', value: MUTE1 | MUTE3 }],
    });
    const set = fake();
    const oscClient = oscClientFactory.build({
      query,
      set,
    });
    const muteGroup = createMuteGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await muteGroup.updateEnabled(2);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/mute'), true);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/grp/mute', [
        { type: 'integer', value: MUTE1 | MUTE2 | MUTE3 },
      ]),
      true,
    );
  });

  test('send the correct osc message to unassign a Mute, leaving others untouched', async () => {
    const query = fake.resolves({
      address: '/ch/01/grp/mute',
      args: [{ type: 'integer', value: MUTE1 | MUTE3 }],
    });
    const set = fake();
    const oscClient = oscClientFactory.build({
      query,
      set,
    });
    const muteGroup = createMuteGroup({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await muteGroup.updateDisabled(1);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/grp/mute'), true);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/grp/mute', [{ type: 'integer', value: MUTE3 }]),
      true,
    );
  });
});
