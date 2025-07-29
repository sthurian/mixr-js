import { suite, test } from 'mocha';
import { createLogarithmicParameterConfig } from './log.js';
import { assertClose } from '../../test-helpers/is-close.js';
import assert from 'node:assert';

suite('createLogarithmicParameterConfig', () => {
  test('has the correct oscDataType', () => {
    const logParameterConfig = createLogarithmicParameterConfig<'hertz'>(20, 20000);
    assert.strictEqual(logParameterConfig.oscDataType, 'float');
  });
  test('convertToRaw maps correctly', () => {
    const logParameterConfig = createLogarithmicParameterConfig<'hertz'>(20, 20000);
    assertClose(logParameterConfig.convertToRaw(20, 'hertz'), 0);
    assertClose(logParameterConfig.convertToRaw(632.455, 'hertz'), 0.5);
    assertClose(logParameterConfig.convertToRaw(20000, 'hertz'), 1);
  });
  test('convertToUnit maps correctly', () => {
    const logParameterConfig = createLogarithmicParameterConfig<'hertz'>(20, 20000);
    assertClose(logParameterConfig.convertToUnit(0, 'hertz'), 20);
    assertClose(logParameterConfig.convertToUnit(0.5, 'hertz'), 632.455);
    assertClose(logParameterConfig.convertToUnit(1, 'hertz'), 20000);
  });
  test('validateRawValue throws an exception for out of range values', () => {
    const logParameterConfig = createLogarithmicParameterConfig<'hertz'>(20, 20000);
    assert.throws(
      () => logParameterConfig.validateRawValue(-0.1),
      /Too small: expected number to be >=0/,
    );
    assert.throws(
      () => logParameterConfig.validateRawValue(1.1),
      /Too big: expected number to be <=1/,
    );
  });
  test('validateUnitValue throws an exception for out of range values', () => {
    const logParameterConfig = createLogarithmicParameterConfig<'hertz'>(20, 20000);
    assert.throws(
      () => logParameterConfig.validateUnitValue(19),
      /Too small: expected number to be >=20/,
    );
    assert.throws(
      () => logParameterConfig.validateUnitValue(20001),
      /Too big: expected number to be <=20000/,
    );
  });
  test('throws an exception if min and max are equal', () => {
    assert.throws(
      () => createLogarithmicParameterConfig<'hertz'>(100, 100),
      /min and max must be different/,
    );
  });
});
