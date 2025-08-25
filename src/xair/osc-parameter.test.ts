import { suite, test } from 'mocha';
import { OSCClient } from '../osc/client.js';
import { createOSCParameterFactory, Unit } from './osc-parameter.js';
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
    const convertToUnit = fake.returns(100);
    const oscParameterFactory = createOSCParameterFactory(oscClient);
    const oscParameter = oscParameterFactory.createOSCParameter<Unit<'myUnit', number>, 'float'>(
      '/test/parameter',
      {
        convertToRaw: (value) => value,
        convertToUnit,
        validateRawValue,
        validateUnitValue: (value) => value,
        oscDataType: 'float',
      },
    );

    const result = await oscParameter.fetch();
    assert.strictEqual(query.calledOnceWithExactly('/test/parameter'), true);
    assert.strictEqual(validateRawValue.calledOnceWithExactly(0.5), true);
    assert.strictEqual(result, 0.5);
  });

  test('fetch returns the value converted to the specified unit', async () => {
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
    const convertToUnit = fake.returns(100);
    const oscParameterFactory = createOSCParameterFactory(oscClient);
    const oscParameter = oscParameterFactory.createOSCParameter<Unit<'myUnit', number>, 'float'>(
      '/test/parameter',
      {
        convertToRaw: (value) => value,
        convertToUnit,
        validateRawValue,
        validateUnitValue: (value) => value,
        oscDataType: 'float',
      },
    );

    const result = await oscParameter.fetch('myUnit');
    assert.strictEqual(query.calledOnceWithExactly('/test/parameter'), true);
    assert.strictEqual(validateRawValue.calledOnceWithExactly(0.5), true);
    assert.strictEqual(result, 100);
  });

  test('update sends the raw value', async () => {
    const set = fake.resolves({});
    const oscClient: OSCClient = {
      close: fake(),
      query: fake(),
      set,
    };
    const validateRawValue = fake.returns(0.42);
    const oscParameterFactory = createOSCParameterFactory(oscClient);
    const oscParameter = oscParameterFactory.createOSCParameter<Unit<'myUnit', number>, 'float'>(
      '/test/parameter',
      {
        convertToRaw: fake(),
        convertToUnit: fake(),
        validateRawValue,
        validateUnitValue: fake(),
        oscDataType: 'float',
      },
    );

    await oscParameter.update(0.42);
    assert.strictEqual(
      set.calledOnceWithExactly('/test/parameter', [{ type: 'float', value: 0.42 }]),
      true,
    );
    assert.strictEqual(validateRawValue.calledOnceWithExactly(0.42), true);
  });

  test('update sends the value converted to raw', async () => {
    const set = fake.resolves(1);
    const oscClient: OSCClient = {
      close: fake(),
      query: fake(),
      set,
    };

    const convertToRaw = fake.returns(0.5);
    const oscParameterFactory = createOSCParameterFactory(oscClient);
    const validateUnitValue = fake.returns(50);
    const oscParameter = oscParameterFactory.createOSCParameter<Unit<'myUnit', number>, 'float'>(
      '/test/parameter',
      {
        convertToRaw,
        convertToUnit: fake(),
        validateRawValue: fake(),
        validateUnitValue,
        oscDataType: 'float',
      },
    );

    await oscParameter.update(42, 'myUnit');
    assert.strictEqual(
      set.calledOnceWithExactly('/test/parameter', [{ type: 'float', value: 0.5 }]),
      true,
    );
    assert.strictEqual(validateUnitValue.calledOnceWithExactly(42), true);
    assert.strictEqual(convertToRaw.calledOnceWithExactly(50, 'myUnit'), true);
  });

  test('update sends string parameters correctly', async () => {
    const set = fake.resolves({});
    const oscClient: OSCClient = {
      close: fake(),
      query: fake(),
      set,
    };
    const validateRawValue = fake.returns('test');
    const oscParameterFactory = createOSCParameterFactory(oscClient);
    const oscParameter = oscParameterFactory.createOSCParameter<Unit<'raw', string>, 'string'>(
      '/test/parameter',
      {
        convertToRaw: fake(),
        convertToUnit: fake(),
        validateRawValue,
        validateUnitValue: fake(),
        oscDataType: 'string',
      },
    );

    await oscParameter.update('test');
    assert.strictEqual(
      set.calledOnceWithExactly('/test/parameter', [{ type: 'string', value: 'test' }]),
      true,
    );
    assert.strictEqual(validateRawValue.calledOnceWithExactly('test'), true);
  });

  test('update sends integer parameters correctly', async () => {
    const set = fake.resolves({});
    const oscClient: OSCClient = {
      close: fake(),
      query: fake(),
      set,
    };
    const validateRawValue = fake.returns(42);
    const oscParameterFactory = createOSCParameterFactory(oscClient);
    const oscParameter = oscParameterFactory.createOSCParameter<Unit<'raw', number>, 'integer'>(
      '/test/parameter',
      {
        convertToRaw: fake(),
        convertToUnit: fake(),
        validateRawValue,
        validateUnitValue: fake(),
        oscDataType: 'integer',
      },
    );

    await oscParameter.update(42);
    assert.strictEqual(
      set.calledOnceWithExactly('/test/parameter', [{ type: 'integer', value: 42 }]),
      true,
    );
    assert.strictEqual(validateRawValue.calledOnceWithExactly(42), true);
  });

  test('throws an error for unsupported OSC types', async () => {
    const oscClient: OSCClient = {
      close: fake(),
      query: fake(),
      set: fake(),
    };
    const oscParameterFactory = createOSCParameterFactory(oscClient);
    const oscParameter = oscParameterFactory.createOSCParameter<Unit<'raw', number>, 'float'>(
      '/test/parameter',
      {
        convertToRaw: fake(),
        convertToUnit: fake(),
        validateRawValue: fake(),
        validateUnitValue: fake(),
        oscDataType: 'float',
      },
    );

    assert.throws(
      () => oscParameter.update(undefined as unknown as number),
      new Error('Unsupported OSC type "undefined" for address "/test/parameter"'),
    );
  });

  test('throws an error when fetching and no valid argument is returned', async () => {
    const query = fake.resolves({
      address: '/test/parameter',
      args: [],
    });
    const oscClient: OSCClient = {
      close: fake(),
      query,
      set: fake(),
    };
    const oscParameterFactory = createOSCParameterFactory(oscClient);
    const oscParameter = oscParameterFactory.createOSCParameter<Unit<'myUnit', number>, 'float'>(
      '/test/parameter',
      {
        convertToRaw: (value) => value,
        convertToUnit: (value) => value,
        validateRawValue: (value) => parseInt(`${value}`, 10),
        validateUnitValue: (value) => value,
        oscDataType: 'float',
      },
    );

    await assert.rejects(async () => {
      await oscParameter.fetch();
    }, new Error('No valid OSC argument found for address "/test/parameter"'));
  });
});
