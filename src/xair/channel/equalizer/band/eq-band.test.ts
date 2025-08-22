import { suite, test } from 'mocha';
import { fake, match } from 'sinon';
import { oscClientFactory } from '../../../../osc/test-factories/client.js';
import { createChannelEqualizerBand } from './eq-band.js';
import assert from 'node:assert';
import { assertClose, isClose } from '../../../../test-helpers/is-close.js';
suite('ChannelEqualizerBand', () => {
  test('send the correct osc message to query if the eq band is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/eq/2/on',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const eqBand = createChannelEqualizerBand({
      channel: 1,
      band: 2,
      oscClient,
    });
    const enabled = await eqBand.fetchIsEnabled();
    assert.strictEqual(enabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/eq/2/on'), true);
  });

  test('send the correct osc message to enable the eq band', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const eqBand = createChannelEqualizerBand({
      channel: 1,
      band: 2,
      oscClient,
    });
    await eqBand.updateEnabled(false);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/eq/2/on', [{ type: 'integer', value: 0 }]),
      true,
    );
  });

  test('send the correct osc message to query the eq bands frequency', async () => {
    const query = fake.resolves({
      address: '/ch/01/eq/2/f',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const eqBand = createChannelEqualizerBand({
      channel: 1,
      band: 2,
      oscClient,
    });
    const freq = await eqBand.fetchFrequency();
    assertClose(freq, 632.455);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/eq/2/f'), true);
  });

  test('send the correct osc message to set the eq bands frequency', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const eqBand = createChannelEqualizerBand({
      channel: 1,
      band: 2,
      oscClient,
    });
    await eqBand.updateFrequency(1500);
    assert.ok(
      set.calledWithMatch('/ch/01/eq/2/f', [match({ type: 'float', value: isClose(0.625) })]),
    );
  });

  test('send the correct osc message to query the eq bands gain', async () => {
    const query = fake.resolves({
      address: '/ch/01/eq/2/g',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const eqBand = createChannelEqualizerBand({
      channel: 1,
      band: 2,
      oscClient,
    });
    const gain = await eqBand.fetchGain('decibels');
    assert.strictEqual(gain, 0);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/eq/2/g'), true);
  });

  test('send the correct osc message to set the eq bands gain', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const eqBand = createChannelEqualizerBand({
      channel: 1,
      band: 2,
      oscClient,
    });
    await eqBand.updateGain(7.5, 'decibels');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/eq/2/g', [{ type: 'float', value: 0.75 }]),
      true,
    );
  });

  test('send the correct osc message to query the eq bands q', async () => {
    const query = fake.resolves({
      address: '/ch/01/eq/2/q',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const eqBand = createChannelEqualizerBand({
      channel: 1,
      band: 2,
      oscClient,
    });
    const q = await eqBand.fetchQ();
    assertClose(q, 1.732);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/eq/2/q'), true);
  });

  test('send the correct osc message to set the eq bands q', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const eqBand = createChannelEqualizerBand({
      channel: 1,
      band: 2,
      oscClient,
    });
    await eqBand.updateQ(5);
    assert.ok(
      set.calledWithMatch('/ch/01/eq/2/q', [match({ type: 'float', value: isClose(0.197) })]),
    );
  });

  test('send the correct osc message to query the eq bands type', async () => {
    const query = fake.resolves({
      address: '/ch/01/eq/2/type',
      args: [{ type: 'integer', value: 2 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const eqBand = createChannelEqualizerBand({
      channel: 1,
      band: 2,
      oscClient,
    });
    const type = await eqBand.fetchType();
    assert.strictEqual(type, 'PEQ');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/eq/2/type'), true);
  });

  test('send the correct osc message to set the eq bands type', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const eqBand = createChannelEqualizerBand({
      channel: 1,
      band: 2,
      oscClient,
    });
    await eqBand.updateType('VEQ');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/eq/2/type', [{ type: 'integer', value: 3 }]),
      true,
    );
  });
});
