import { suite, test } from 'mocha';
import { fake } from 'sinon';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import { createEqualizer } from './equalizer.js';
import assert from 'node:assert';
import { EqualizerBand } from './band/eq-band.js';

suite('ChannelEqualizer', () => {
  test('send the correct osc message to query if the equalizer is enabled', async () => {
    const query = fake.resolves({ address: '/ch/01/eq/on', args: [{ type: 'integer', value: 1 }] });
    const oscClient = oscClientFactory.build({ query });
    const eq = createEqualizer({
      oscBasePath: '/ch/01',
      oscClient,
      createEqualizerBand: fake(),
    });
    const enabled = await eq.fetchIsEnabled('flag');
    assert.strictEqual(enabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/eq/on'), true);
  });

  test('send the correct osc message to enable the equalizer', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const eq = createEqualizer({
      oscBasePath: '/ch/01',
      oscClient,
      createEqualizerBand: fake(),
    });
    await eq.updateEnabled(false, 'flag');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/eq/on', [{ type: 'integer', value: 0 }]),
      true,
    );
  });

  test('getBand calls the factory with the correct parameters', () => {
    const createEqualizerBand = fake.returns('band' as unknown as EqualizerBand);
    const oscClient = oscClientFactory.build();
    const eq = createEqualizer({
      oscBasePath: '/ch/03',
      oscClient,
      createEqualizerBand,
    });
    const band = eq.getBand(2);
    assert.strictEqual(band, 'band');
    assert.strictEqual(
      createEqualizerBand.calledOnceWithExactly({ band: 2, oscBasePath: '/ch/03', oscClient }),
      true,
    );
  });
});
