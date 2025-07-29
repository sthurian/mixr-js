import { suite, test } from 'mocha';
import { createEntityFactory, Mapper } from './entity.js';
import { OSCClient } from '../osc/client.js';
import { fake } from 'sinon';
import assert from 'node:assert';
import { OscMessageOutput } from 'osc-min';

suite('Entity', () => {
  test('queries the osc address and transforms the osc message', async () => {
    const oscResponse = { type: 'message', args: [{ type: 'integer', value: 42 }] };
    const query = fake.resolves(oscResponse);
    const oscClient: OSCClient = {
      close: fake(),
      query,
      set: fake(),
    };
    const entityFactory = createEntityFactory(oscClient);
    const oscArgumentToMixerValue = fake.returns(42);
    const mapper: Mapper<number> = {
      oscArgumentToMixerValue,
      mixerValueToOscArgument: fake(),
      getOscType: () => 'integer',
    };

    const entity = entityFactory.createEntity('/test', mapper);
    const result = await entity.get();
    assert.strictEqual(query.calledOnceWithExactly('/test'), true);
    assert.strictEqual(oscArgumentToMixerValue.calledOnceWithExactly(42), true);
    assert.deepStrictEqual(result, 42);
  });

  test('it sends the correct osc message', async () => {
    const set = fake.resolves(42);
    const oscClient: OSCClient = {
      close: fake(),
      query: fake(),
      set,
    };
    const entityFactory = createEntityFactory(oscClient);
    const mixerValueToOscArgument = fake.returns(42);
    const mapper: Mapper<number> = {
      oscArgumentToMixerValue: fake(),
      mixerValueToOscArgument,
      getOscType: () => 'integer',
    };
    const entity = entityFactory.createEntity('/test', mapper);
    await entity.set(42);
    assert.strictEqual(mixerValueToOscArgument.calledOnceWithExactly(42), true);
    assert.strictEqual(set.calledOnceWithExactly('/test', [{ type: 'integer', value: 42 }]), true);
  });

  test('throws an error if the osc type is not supported', async () => {
    const oscClient: OSCClient = {
      close: fake(),
      query: fake(),
      set: fake(),
    };
    const entityFactory = createEntityFactory(oscClient);
    const mapper: Mapper<number> = {
      oscArgumentToMixerValue: fake(),
      mixerValueToOscArgument: fake.returns(42),
      getOscType: () => 'string',
    };
    const entity = entityFactory.createEntity('/test', mapper);
    await assert.rejects(() => entity.set(2), {
      message: 'Unsupported OSC type "number" for address "/test"',
    });
  });

  test('throws an error when the query response is not valid', async () => {
    const oscClient: OSCClient = {
      close: fake(),
      query: fake.resolves({
        type: 'message',
        args: [{ type: 'string', value: 42 }],
      } as unknown as OscMessageOutput),
      set: fake(),
    };
    const entityFactory = createEntityFactory(oscClient);
    const mapper: Mapper<number> = {
      oscArgumentToMixerValue: fake(),
      mixerValueToOscArgument: fake(),
      getOscType: () => 'integer',
    };
    const entity = entityFactory.createEntity('/test', mapper);
    await assert.rejects(async () => {
      await entity.get();
    }, /Invalid input: expected string, received number/);
  });
});
