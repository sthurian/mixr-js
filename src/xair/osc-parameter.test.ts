import { suite, test } from 'mocha';
import { OSCClient } from '../osc/client.js';
import { createOSCParameterFactory } from './osc-parameter.js';
import { fake } from 'sinon';
import assert from 'node:assert';

suite('OSC Parameter', () => {
  test('fetch returns the raw value', async () => {
    const query = fake.resolves({
      address: '/test/parameter',
      args: [{ type: 'float', value: 0.5 }],
    });
    const oscClient: OSCClient = {
      close: fake(),
      query,
      set: fake(),
    };
    const validateRawValue = fake.returns(0.5);
    const oscParameterFactory = createOSCParameterFactory(oscClient);
    const oscParameter = oscParameterFactory.createOSCParameter<'myUnit', 'float'>('/test/parameter', {
      convertToRaw: (value) => value,
      convertToUnit: (value) => value,
      validateRawValue,
      validateUnitValue: (value) => value,
      oscDataType: 'float',
    });

    const result = await oscParameter.fetch();
    assert.strictEqual(query.calledOnceWithExactly('/test/parameter'), true);
    assert.strictEqual(validateRawValue.calledOnceWithExactly(0.5),true)
    assert.strictEqual(result, 0.5);
  });
});
