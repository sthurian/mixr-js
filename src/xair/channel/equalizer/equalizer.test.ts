import { suite, test } from 'mocha';
import { fake } from 'sinon';
import { oscClientFactory } from '../../../osc/test-factories/client.js';
import { createChannelEqualizer } from './equalizer.js';
import assert from 'node:assert';

suite('ChannelEqualizer', () => {
  test('send the correct osc message to query if the equalizer is enabled', async () => {
    const query = fake.resolves({ address: '/ch/01/eq/on', args: [{ type: 'integer', value: 1 }] });
    const oscClient = oscClientFactory.build({ query });
    const eq = createChannelEqualizer({
      channel: 1,
      oscClient,
    });
    const enabled = await eq.fetchIsEnabled();
    assert.strictEqual(enabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/eq/on'), true);
  });

  test('send the correct osc message to enable the equalizer', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const eq = createChannelEqualizer({
      channel: 1,
      oscClient,
    });
    await eq.updateEnabled(false);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/eq/on', [{ type: 'integer', value: 0 }]),
      true,
    );
  });
});
