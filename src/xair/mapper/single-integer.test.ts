import { suite, test } from 'mocha';
import assert from 'node:assert';
import { integerOscParameterConfig } from './single-integer.js';

suite('integerOscParameterConfig', () => {
  test('has the correct oscDataType', () => {
    assert.strictEqual(integerOscParameterConfig.oscDataType, 'integer');
  });
  suite('conversion to raw level', () => {
    test('maps integer values to themselves', () => {
      assert.strictEqual(integerOscParameterConfig.convertToRaw(0, 'integer'), 0);
      assert.strictEqual(integerOscParameterConfig.convertToRaw(1, 'integer'), 1);
      assert.strictEqual(integerOscParameterConfig.convertToRaw(42, 'integer'), 42);
      assert.strictEqual(integerOscParameterConfig.convertToRaw(-1, 'integer'), -1);
      assert.strictEqual(integerOscParameterConfig.convertToRaw(-42, 'integer'), -42);
    });
  });
  suite('conversion to unit level', () => {
    test('maps integer values to themselves', () => {
      assert.strictEqual(integerOscParameterConfig.convertToUnit(0, 'integer'), 0);
      assert.strictEqual(integerOscParameterConfig.convertToUnit(1, 'integer'), 1);
      assert.strictEqual(integerOscParameterConfig.convertToUnit(42, 'integer'), 42);
      assert.strictEqual(integerOscParameterConfig.convertToUnit(-1, 'integer'), -1);
      assert.strictEqual(integerOscParameterConfig.convertToUnit(-42, 'integer'), -42);
    });
  });
  test('validateRawValue throws an exception for non-integer values', () => {
    assert.throws(
      () => integerOscParameterConfig.validateRawValue(1.1),
      /Invalid input: expected int, received number/,
    );
    assert.throws(
      () => integerOscParameterConfig.validateRawValue(NaN),
      /Invalid input: expected number, received NaN/,
    );
    assert.throws(
      () => integerOscParameterConfig.validateRawValue('foo'),
      /Invalid input: expected number, received string/,
    );
  });
  test('validateUnitValue throws an exception for non-integer values', () => {
    assert.throws(
      () => integerOscParameterConfig.validateUnitValue(1.1),
      /Invalid input: expected int, received number/,
    );
    assert.throws(
      () => integerOscParameterConfig.validateUnitValue(NaN),
      /Invalid input: expected number, received NaN/,
    );
    assert.throws(
      () => integerOscParameterConfig.validateUnitValue('foo' as unknown as number),
      /Invalid input: expected number, received string/,
    );
  });
});
