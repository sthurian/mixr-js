import { suite, test } from 'mocha';
import { createLinearParameterConfig } from './linear.js';
import assert from 'node:assert';

suite('createLinearParameterConfig', () => {
  test('has the correct oscDataType', () => {
    const linearParameterConfig = createLinearParameterConfig<'percent'>(-100, 100);
    assert.strictEqual(linearParameterConfig.oscDataType, 'float');
  });

  test('convertToRaw maps correctly', () => {
    const linearParameterConfig = createLinearParameterConfig<'percent'>(-100, 100);
    assert.strictEqual(linearParameterConfig.convertToRaw(0, 'percent'), 0.5);
    assert.strictEqual(linearParameterConfig.convertToRaw(-100, 'percent'), 0);
    assert.strictEqual(linearParameterConfig.convertToRaw(100, 'percent'), 1);
  });

  test('convertToUnit maps correctly', () => {
    const linearParameterConfig = createLinearParameterConfig<'percent'>(-100, 100);
    assert.strictEqual(linearParameterConfig.convertToUnit(0.5, 'percent'), 0);
    assert.strictEqual(linearParameterConfig.convertToUnit(0, 'percent'), -100);
    assert.strictEqual(linearParameterConfig.convertToUnit(1, 'percent'), 100);
  });

  test('validateRawValue throws an exception for out of range values', () => {
    const linearParameterConfig = createLinearParameterConfig<'percent'>(-100, 100);
    assert.throws(
      () => linearParameterConfig.validateRawValue(-0.1),
      /Too small: expected number to be >=0/,
    );
    assert.throws(
      () => linearParameterConfig.validateRawValue(1.1),
      /Too big: expected number to be <=1/,
    );
  });

  test('validateUnitValue throws an exception for out of range values', () => {
    const linearParameterConfig = createLinearParameterConfig<'percent'>(-100, 100);
    assert.throws(
      () => linearParameterConfig.validateUnitValue(-101),
      /Too small: expected number to be >=-100/,
    );
    assert.throws(
      () => linearParameterConfig.validateUnitValue(101),
      /Too big: expected number to be <=100/,
    );
  });

  test('throws an exception if min and max are equal', () => {
    assert.throws(
      () => createLinearParameterConfig<'percent'>(100, 100),
      /min and max must be different/,
    );
  });
});
