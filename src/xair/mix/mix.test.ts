import { suite, test } from 'mocha';
import { createMix } from './mix.js';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import { fake, match } from 'sinon';
import { assertClose, isClose } from '../../test-helpers/is-close.js';
import assert from 'node:assert';

suite('Mix', () => {
  test('send the correct osc message to fetch the mixes fader level', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/fader',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const mix = createMix({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const fader = await mix.fetchFader('decibels');
    assertClose(fader, -10);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/fader'), true);
  });

  test('send the correct osc message to set the mixes fader level', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const mix = createMix({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await mix.updateFader(6, 'decibels');
    assert.ok(
      set.calledWithMatch('/ch/01/mix/fader', [match({ type: 'float', value: isClose(0.9) })]),
    );
  });

  test('send the correct osc message to fetch the mixes fader pan', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/pan',
      args: [{ type: 'float', value: 0.75 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const mix = createMix({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const pan = await mix.fetchPan('percent');
    assert.strictEqual(pan, 50);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/pan'), true);
  });

  test('send the correct osc message to set the mixes fader pan', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const mix = createMix({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await mix.updatePan(100, 'percent');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/pan', [{ type: 'float', value: 1 }]),
      true,
    );
  });

  test('send the correct osc message to check if the mix is muted', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/on',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const mix = createMix({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const mixMuted = await mix.fetchIsMuted('flag');
    assert.strictEqual(mixMuted, false);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/on'), true);
  });

  test('send the correct osc message to mute the mix', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const mix = createMix({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await mix.updateMuted(true, 'flag');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/on', [{ type: 'integer', value: 0 }]),
      true,
    );
  });

  test('send the correct osc message to check if the left/right assignement is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/mix/on',
      args: [{ type: 'integer', value: 0 }],
    });
    const oscClient = oscClientFactory.build({
      query,
    });
    const mix = createMix({
      oscBasePath: '/ch/01',
      oscClient,
    });
    const mixMuted = await mix.fetchIsLeftRightAssignmentEnabled('flag');
    assert.strictEqual(mixMuted, false);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/mix/lr'), true);
  });

  test('send the correct osc message to enable the mixes left/right assignment', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const mix = createMix({
      oscBasePath: '/ch/01',
      oscClient,
    });
    await mix.updateLeftRightAssignmentEnabled(true, 'flag');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/mix/lr', [{ type: 'integer', value: 1 }]),
      true,
    );
  });
});
