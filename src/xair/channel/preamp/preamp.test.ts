import { suite, test } from 'mocha';
import { fake, match } from 'sinon';
import { oscClientFactory } from '../../../osc/test-factories/client.js';
import { createChannelPreamp } from './preamp.js';
import assert from 'node:assert';
import { assertClose, isClose } from '../../../test-helpers/is-close.js';

suite('ChannelPreamp', () => {
  test('send the correct osc message to fetch the preamps gain', async () => {
    const query = fake.resolves({
      address: '/headamp/01/gain',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    const gain = await preamp.fetchGain('decibels');
    assert.strictEqual(gain, 24);
    assert.strictEqual(query.calledOnceWithExactly('/headamp/01/gain'), true);
  });

  test('send the correct osc message to set the preamps gain', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    await preamp.updateGain(6, 'decibels');
    assert.strictEqual(
      set.calledOnceWithExactly('/headamp/01/gain', [{ type: 'float', value: 0.25 }]),
      true,
    );
  });

  test('send the correct osc message to fetch the preamps lowcut frequency', async () => {
    const query = fake.resolves({
      address: '/ch/01/preamp/hpf',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    const lcf = await preamp.fetchLowCutFrequency();
    assertClose(lcf, 89.442);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/preamp/hpf'), true);
  });

  test('send the correct osc message to set the preamps lowcut frequency', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    await preamp.updateLowCutFrequency(200);
    assert.ok(
      set.calledWithMatch('/ch/01/preamp/hpf', [match({ type: 'float', value: isClose(0.768) })]),
    );
  });

  test('send the correct osc message to fetch the preamps usb trim', async () => {
    const query = fake.resolves({
      address: '/ch/01/preamp/rtntrim',
      args: [{ type: 'float', value: 0.75 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    const trim = await preamp.fetchUSBTrim('decibels');
    assert.strictEqual(trim, 9);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/preamp/rtntrim'), true);
  });

  test('send the correct osc message to set the preamps usb trim', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    await preamp.updateUSBTrim(-9, 'decibels');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/preamp/rtntrim', [{ type: 'float', value: 0.25 }]),
      true,
    );
  });

  test('send the correct osc message to check if the preamps lowcut is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/preamp/hpon',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    const lowcutEnabled = await preamp.fetchIsLowCutEnabled();
    assert.strictEqual(lowcutEnabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/preamp/hpon'), true);
  });

  test('send the correct osc message to enable the preamps lowcut', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    await preamp.updateLowCutEnabled(false);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/preamp/hpon', [{ type: 'integer', value: 0 }]),
      true,
    );
  });

  test('send the correct osc message to check if the preamps phantom power is enabled', async () => {
    const query = fake.resolves({
      address: '/headamp/01/phantom',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    const phantomPowerEnabled = await preamp.fetchIsPhantomPowerEnabled();
    assert.strictEqual(phantomPowerEnabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/headamp/01/phantom'), true);
  });

  test('send the correct osc message to enable the preamps phantom power', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    await preamp.updatePhantomPowerEnabled(false);
    assert.strictEqual(
      set.calledOnceWithExactly('/headamp/01/phantom', [{ type: 'integer', value: 0 }]),
      true,
    );
  });

  test('send the correct osc message to check if the preamps polarity switch is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/preamp/invert',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    const polaritySwitchEnabled = await preamp.fetchIsPolarityInverted();
    assert.strictEqual(polaritySwitchEnabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/preamp/invert'), true);
  });

  test('send the correct osc message to enable the preamps polarity switch', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    await preamp.updatePolarityInverted(false);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/preamp/invert', [{ type: 'integer', value: 0 }]),
      true,
    );
  });

  test('send the correct osc message to check if the preamps usb return is enabled', async () => {
    const query = fake.resolves({
      address: '/ch/01/preamp/rtnsw',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient = oscClientFactory.build({ query });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    const usbReturnEnabled = await preamp.fetchIsUSBReturnEnabled();
    assert.strictEqual(usbReturnEnabled, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/preamp/rtnsw'), true);
  });

  test('send the correct osc message to enable the preamps usb return', async () => {
    const set = fake();
    const oscClient = oscClientFactory.build({ set });
    const preamp = createChannelPreamp({
      channel: 1,
      oscClient,
    });
    await preamp.updateUSBReturnEnabled(false);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/preamp/rtnsw', [{ type: 'integer', value: 0 }]),
      true,
    );
  });
});
