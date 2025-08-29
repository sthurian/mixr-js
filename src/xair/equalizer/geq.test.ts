import { suite, test } from 'mocha';
import { createGraphicEqualizer } from './geq.js';
import { oscClientFactory } from '../../osc/test-factories/client.js';
import { fake } from 'sinon';
import assert from 'node:assert';
import { assertClose } from '../../test-helpers/is-close.js';

suite('GraphicEqualizer', () => {
  test('send the correct osc message to fetch the bands gain in decibel', async () => {
    const query = fake.resolves({
      address: '/lr/geq/2k',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const geq = createGraphicEqualizer({
      oscBasePath: '/lr',
      oscClient,
    });
    const band = await geq.fetchBandGain('2k', 'decibels');
    assertClose(band, -10);
    assert.strictEqual(query.calledOnceWithExactly('/lr/qeq/2k'), true);
  });

  test('send the correct osc message to fetch the bands gain in raw value', async () => {
    const query = fake.resolves({
      address: '/lr/geq/2k',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const geq = createGraphicEqualizer({
      oscBasePath: '/lr',
      oscClient,
    });
    const band = await geq.fetchBandGain('2k');
    assertClose(band, 0.5);
    assert.strictEqual(query.calledOnceWithExactly('/lr/qeq/2k'), true);
  });

  test('send the correct osc message to update the bands gain in decibel', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const geq = createGraphicEqualizer({
      oscBasePath: '/lr',
      oscClient,
    });
    await geq.updateBandGain('2k', -10, 'decibels');
    assert.strictEqual(
      set.calledOnceWithExactly('/lr/qeq/2k', [{ type: 'float', value: 0.5 }]),
      true,
    );
  });

  test('send the correct osc message to update the bands gain in raw value', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const geq = createGraphicEqualizer({
      oscBasePath: '/lr',
      oscClient,
    });
    await geq.updateBandGain('2k', 0.5);
    assert.strictEqual(
      set.calledOnceWithExactly('/lr/qeq/2k', [{ type: 'float', value: 0.5 }]),
      true,
    );
  });
});
