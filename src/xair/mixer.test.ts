import { suite, test } from 'mocha';
import { createMixer } from './mixer.js';
import { OSCClient } from '../osc/client.js';
import { fake } from 'sinon';
import assert from 'node:assert';

suite('Mixer', () => {
  test('queries the correct osc-address for a string', async () => {
    const query = fake.resolves({
      type: 'message',
      args: [{ type: 'string', value: 'my-mixer' }],
    });
    const oscClient: OSCClient = {
      close: fake(),
      query,
      set: fake(),
    };
    const mixer = createMixer(oscClient);
    const result = await mixer.getChannel('CH01').getConfig().fetchName();
    assert.strictEqual(result, 'my-mixer');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/config/name'), true);
  });

  test('queries the correct osc-address for a literal', async () => {
    const query = fake.resolves({
      type: 'message',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient: OSCClient = {
      close: fake(),
      query,
      set: fake(),
    };
    const mixer = createMixer(oscClient);
    const result = await mixer.getChannel('CH01').getConfig().fetchColor();
    assert.strictEqual(result, 'Red');
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/config/color'), true);
  });

  test('queries the correct osc-address for a on/off-switch', async () => {
    const query = fake.resolves({
      type: 'message',
      args: [{ type: 'integer', value: 1 }],
    });
    const oscClient: OSCClient = {
      close: fake(),
      query,
      set: fake(),
    };
    const mixer = createMixer(oscClient);
    const result = await mixer.getChannel('CH01').getCompressor().fetchIsAutoTimeEnabled();
    assert.strictEqual(result, true);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/auto'), true);
  });

  test('queries the correct osc-address for a linear range', async () => {
    const query = fake.resolves({
      type: 'message',
      args: [{ type: 'float', value: 1.0 }],
    });
    const oscClient: OSCClient = {
      close: fake(),
      query,
      set: fake(),
    };
    const mixer = createMixer(oscClient);
    const result = await mixer.getChannel('CH01').getCompressor().fetchAttack('milliseconds');
    assert.strictEqual(result, 120);
    assert.strictEqual(query.calledOnceWithExactly('/ch/01/dyn/attack'), true);
  });

  test('sets the osc-address and arguments correctly for a single string', async () => {
    const set = fake.resolves({});
    const oscClient: OSCClient = {
      close: fake(),
      query: fake(),
      set,
    };
    const mixer = createMixer(oscClient);
    await mixer.getChannel('CH01').getConfig().updateName('my-mixer');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/config/name', [{ type: 'string', value: 'my-mixer' }]),
      true,
    );
  });

  test('sets the osc-address and arguments correctly for a single literal', async () => {
    const set = fake.resolves({});
    const oscClient: OSCClient = {
      close: fake(),
      query: fake(),
      set,
    };
    const mixer = createMixer(oscClient);
    await mixer.getChannel('CH01').getConfig().updateColor('Red');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/config/color', [{ type: 'integer', value: 1 }]),
      true,
    );
  });

  test('sets the osc-address and arguments correctly for a single on/off-switch', async () => {
    const set = fake.resolves({});
    const oscClient: OSCClient = {
      close: fake(),
      query: fake(),
      set,
    };
    const mixer = createMixer(oscClient);
    await mixer.getChannel('CH01').getCompressor().updateAutoTimeEnabled(true);
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/auto', [{ type: 'integer', value: 1 }]),
      true,
    );
  });

  test('sets the osc-address and arguments correctly for a linear range', async () => {
    const set = fake.resolves({});
    const oscClient: OSCClient = {
      close: fake(),
      query: fake(),
      set,
    };
    const mixer = createMixer(oscClient);
    await mixer.getChannel('CH01').getCompressor().updateAttack(120, 'milliseconds');
    assert.strictEqual(
      set.calledOnceWithExactly('/ch/01/dyn/attack', [{ type: 'float', value: 1.0 }]),
      true,
    );
  });

  test('closes the osc client when the mixer is closed', async () => {
    const close = fake();
    const oscClient: OSCClient = {
      close,
      query: fake(),
      set: fake(),
    };
    const mixer = createMixer(oscClient);
    await mixer.closeConnection();
    assert.strictEqual(close.calledOnce, true);
  });
});
