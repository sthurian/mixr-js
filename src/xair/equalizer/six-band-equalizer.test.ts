import { suite, test } from 'mocha';
import { createSixBandEqualizer } from './six-band-equalizer.js';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import { fake } from 'sinon';
import assert from 'node:assert';

suite('SixBandEqualizer', () => {
  test('', () => {
    const query = fake.resolves({
      address: '/lr/eq/mode',
      args: [{ type: 'integer', value: 2 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const eq = createSixBandEqualizer({
      oscClient,
      createEqualizer: fake(),
      createEqualizerBand: fake(),
    });
    const mode = eq.fetchMode('mode');
    assert.strictEqual(query.calledOnceWithExactly('/lr/eq/mode'), true);
    return mode.then((value) => assert.strictEqual(value, 'TEQ'));
  });
});
