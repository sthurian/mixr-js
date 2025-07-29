import { suite, test } from 'mocha';
import assert from 'node:assert';
import { onOffInvertedParameterConfig, onOffParameterConfig } from './on-off.js';

suite('onOffParameterConfig', () => {
  test('has the correct oscDataType', () => {
    assert.strictEqual(onOffParameterConfig.oscDataType, 'integer');
  });

  test('validateRawValue throws an exception for invalid values', () => {
    assert.throws(() => onOffParameterConfig.validateRawValue(2), /Invalid input: expected 0/);
    assert.throws(() => onOffParameterConfig.validateRawValue(-1), /Invalid input: expected 0/);
    assert.throws(() => onOffParameterConfig.validateRawValue(0.5), /Invalid input: expected 0/);
    assert.throws(() => onOffParameterConfig.validateRawValue(NaN), /Invalid input: expected 0/);
  });

  test('validateUnitValue throws an exception for invalid values', () => {
    assert.throws(
      () => onOffParameterConfig.validateUnitValue(2 as unknown as boolean),
      /Invalid input: expected boolean, received number/,
    );
    assert.throws(
      () => onOffParameterConfig.validateUnitValue('foo' as unknown as boolean),
      /Invalid input: expected boolean, received string/,
    );
  });

  test('convertToRaw maps false to 0 and true to 1', () => {
    assert.strictEqual(onOffParameterConfig.convertToRaw(false, 'flag'), 0);
    assert.strictEqual(onOffParameterConfig.convertToRaw(true, 'flag'), 1);
  });

  test('convertToUnit maps 0 to false and 1 to true', () => {
    assert.strictEqual(onOffParameterConfig.convertToUnit(0, 'flag'), false);
    assert.strictEqual(onOffParameterConfig.convertToUnit(1, 'flag'), true);
  });
});

suite('onOffInvertedParameterConfig', () => {
  test('has the correct oscDataType', () => {
    assert.strictEqual(onOffInvertedParameterConfig.oscDataType, 'integer');
  });

  test('validateRawValue throws an exception for invalid values', () => {
    assert.throws(
      () => onOffInvertedParameterConfig.validateRawValue(2),
      /Invalid input: expected 0/,
    );
    assert.throws(
      () => onOffInvertedParameterConfig.validateRawValue(-1),
      /Invalid input: expected 0/,
    );
    assert.throws(
      () => onOffInvertedParameterConfig.validateRawValue(0.5),
      /Invalid input: expected 0/,
    );
    assert.throws(
      () => onOffInvertedParameterConfig.validateRawValue(NaN),
      /Invalid input: expected 0/,
    );
  });

  test('validateUnitValue throws an exception for invalid values', () => {
    assert.throws(
      () => onOffInvertedParameterConfig.validateUnitValue(2 as unknown as boolean),
      /Invalid input: expected boolean, received number/,
    );
    assert.throws(
      () => onOffInvertedParameterConfig.validateUnitValue('foo' as unknown as boolean),
      /Invalid input: expected boolean, received string/,
    );
  });

  test('convertToRaw maps false to 0 and true to 1', () => {
    assert.strictEqual(onOffInvertedParameterConfig.convertToRaw(false, 'flag'), 1);
    assert.strictEqual(onOffInvertedParameterConfig.convertToRaw(true, 'flag'), 0);
  });

  test('convertToUnit maps 0 to false and 1 to true', () => {
    assert.strictEqual(onOffInvertedParameterConfig.convertToUnit(0, 'flag'), true);
    assert.strictEqual(onOffInvertedParameterConfig.convertToUnit(1, 'flag'), false);
  });
});
