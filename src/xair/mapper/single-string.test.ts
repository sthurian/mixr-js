import { suite, test } from 'mocha';
import assert from 'node:assert';
import { stringOscParameterConfig } from './single-string.js';

suite('stringOscParameterConfig', () => {
  test('has the correct oscDataType', () => {
    assert.strictEqual(stringOscParameterConfig.oscDataType, 'string');
  });
  suite('conversion to raw level', () => {
    test('maps string values to themselves', () => {
      assert.strictEqual(stringOscParameterConfig.convertToRaw('foo', 'string'), 'foo');
      assert.strictEqual(stringOscParameterConfig.convertToRaw('bar', 'string'), 'bar');
      assert.strictEqual(stringOscParameterConfig.convertToRaw('baz', 'string'), 'baz');
    });
  });
  suite('conversion to unit level', () => {
    test('maps string values to themselves', () => {
      assert.strictEqual(stringOscParameterConfig.convertToUnit('foo', 'string'), 'foo');
      assert.strictEqual(stringOscParameterConfig.convertToUnit('bar', 'string'), 'bar');
      assert.strictEqual(stringOscParameterConfig.convertToUnit('baz', 'string'), 'baz');
    });
  });
  test('validateRawValue throws an exception for non-string values', () => {
    assert.throws(
      () => stringOscParameterConfig.validateRawValue(42),
      /Invalid input: expected string, received number/,
    );
    assert.throws(
      () => stringOscParameterConfig.validateRawValue(NaN),
      /Invalid input: expected string, received NaN/,
    );
    assert.throws(
      () => stringOscParameterConfig.validateRawValue({} as unknown as string),
      /Invalid input: expected string, received object/,
    );
  });
  test('validateUnitValue throws an exception for non-string values', () => {
    assert.throws(
      () => stringOscParameterConfig.validateUnitValue(42 as unknown as string),
      /Invalid input: expected string, received number/,
    );
    assert.throws(
      () => stringOscParameterConfig.validateUnitValue(NaN as unknown as string),
      /Invalid input: expected string, received NaN/,
    );
    assert.throws(
      () => stringOscParameterConfig.validateUnitValue({} as unknown as string),
      /Invalid input: expected string, received object/,
    );
  });
});
