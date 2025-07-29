import { suite, test } from 'mocha';
import assert from 'node:assert';
import { createLiteralParameterConfig } from './literal.js';

suite('createLiteralParameterConfig', () => {
  test('has the correct oscDataType', () => {
    const literalParameterConfig = createLiteralParameterConfig<'color', 'Red' | 'Green' | 'Blue'>([
      'Red',
      'Green',
      'Blue',
    ]);
    assert.strictEqual(literalParameterConfig.oscDataType, 'integer');
  });

  test('convertToRaw maps correctly', () => {
    const literalParameterConfig = createLiteralParameterConfig<'color', 'Red' | 'Green' | 'Blue'>([
      'Red',
      'Green',
      'Blue',
    ]);
    assert.strictEqual(literalParameterConfig.convertToRaw('Red', 'color'), 0);
    assert.strictEqual(literalParameterConfig.convertToRaw('Green', 'color'), 1);
    assert.strictEqual(literalParameterConfig.convertToRaw('Blue', 'color'), 2);
  });
  test('convertToUnit maps correctly', () => {
    const literalParameterConfig = createLiteralParameterConfig<'color', 'Red' | 'Green' | 'Blue'>([
      'Red',
      'Green',
      'Blue',
    ]);
    assert.strictEqual(literalParameterConfig.convertToUnit(0, 'color'), 'Red');
    assert.strictEqual(literalParameterConfig.convertToUnit(1, 'color'), 'Green');
    assert.strictEqual(literalParameterConfig.convertToUnit(2, 'color'), 'Blue');
  });
  test('validateRawValue throws an exception for out of range values', () => {
    const literalParameterConfig = createLiteralParameterConfig<'color', 'Red' | 'Green' | 'Blue'>([
      'Red',
      'Green',
      'Blue',
    ]);
    assert.throws(
      () => literalParameterConfig.validateRawValue(-1),
      /Too small: expected number to be >=0/,
    );
    assert.throws(
      () => literalParameterConfig.validateRawValue(3),
      /Too big: expected number to be <=2/,
    );
    assert.throws(
      () => literalParameterConfig.validateRawValue(1.5),
      /Invalid input: expected int, received number/,
    );
  });
  test('validateUnitValue throws an exception for invalid literals', () => {
    const literalParameterConfig = createLiteralParameterConfig<'color', 'Red' | 'Green' | 'Blue'>([
      'Red',
      'Green',
      'Blue',
    ]);
    assert.throws(
      () => literalParameterConfig.validateUnitValue('Yellow' as 'Red' | 'Green' | 'Blue'),
      /Invalid input/,
    );
  });

  test('throws an exception if the map is empty', () => {
    assert.throws(
      () => createLiteralParameterConfig<'color', never>([]),
      /Map must contain at least one value/,
    );
  });
});
