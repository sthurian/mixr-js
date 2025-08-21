import { suite, test } from 'mocha';
import { levelParamaterConfig } from './level.js';
import assert from 'node:assert';
import { assertClose } from '../../test-helpers/is-close.js';

suite('levelParameterConfig', () => {
  test('has the correct oscDataType', () => {
    assert.strictEqual(levelParamaterConfig.oscDataType, 'float');
  });
  suite('conversion to decibels', () => {
    test('maps to negative infinity for less than 0.00625', () => {
      assert.strictEqual(levelParamaterConfig.convertToUnit(0.00625, 'decibel'), Number.NEGATIVE_INFINITY);
      assert.strictEqual(levelParamaterConfig.convertToUnit(0, 'decibel'), Number.NEGATIVE_INFINITY);
    });
    test('maps a linear range [0.00625, 0.0625] to [-87, -60]', () => {
      assertClose(levelParamaterConfig.convertToUnit(0.0062501, 'decibel'), -87);
      assertClose(levelParamaterConfig.convertToUnit(0.034375, 'decibel'), -73.5);
      assertClose(levelParamaterConfig.convertToUnit(0.0625, 'decibel'), -60);
    });
    test('maps a linear range [0.0625, 0.25] to [-60, -30]', () => {
      assertClose(levelParamaterConfig.convertToUnit(0.062501, 'decibel'), -60);
      assertClose(levelParamaterConfig.convertToUnit(0.15625, 'decibel'), -45);
      assertClose(levelParamaterConfig.convertToUnit(0.25, 'decibel'), -30);
    });
    test('maps a linear range [0.25, 0.5] to [-30, -10]', () => {
      assertClose(levelParamaterConfig.convertToUnit(0.25001, 'decibel'), -30);
      assertClose(levelParamaterConfig.convertToUnit(0.375, 'decibel'), -20);
      assertClose(levelParamaterConfig.convertToUnit(0.5, 'decibel'), -10);
    });
    test('maps a linear range [0.5, 1.0] to [-10, 10]', () => {
      assertClose(levelParamaterConfig.convertToUnit(0.50001, 'decibel'), -10);
      assertClose(levelParamaterConfig.convertToUnit(0.75, 'decibel'), 0);
      assertClose(levelParamaterConfig.convertToUnit(1.0, 'decibel'), 10);
    });
    test('clamps values above 1.0 to 10', () => {
      assert.strictEqual(levelParamaterConfig.convertToUnit(1.0001, 'decibel'), 10);
      assert.strictEqual(levelParamaterConfig.convertToUnit(2, 'decibel'), 10);
    });
  });
  suite('conversion to raw level', () => {
    test('returns zero for less than -87dB', () => {
      assert.strictEqual(levelParamaterConfig.convertToRaw(-87.0001, 'decibel'), 0);
      assert.strictEqual(levelParamaterConfig.convertToRaw(Number.NEGATIVE_INFINITY, 'decibel'), 0);
    });
    test('maps a linear range [-87dB, -60dB] to [0.00625, 0.0625]', () => {
      assertClose(levelParamaterConfig.convertToRaw(-86.999, 'decibel'), 0.00625);
      assertClose(levelParamaterConfig.convertToRaw(-73.5, 'decibel'), 0.034375);
      assertClose(levelParamaterConfig.convertToRaw(-60, 'decibel'), 0.0625);
    });
    test('maps a linear range [-60dB, -30dB] to [0.0625, 0.25]', () => {
      assertClose(levelParamaterConfig.convertToRaw(-59.999, 'decibel'), 0.0625);
      assertClose(levelParamaterConfig.convertToRaw(-45, 'decibel'), 0.15625);
      assertClose(levelParamaterConfig.convertToRaw(-30, 'decibel'), 0.25);
    });
    test('maps a linear range [-30dB, -10dB] to [0.25, 0.5]', () => {
      assertClose(levelParamaterConfig.convertToRaw(-29.999, 'decibel'), 0.25);
      assertClose(levelParamaterConfig.convertToRaw(-20, 'decibel'), 0.375);
      assertClose(levelParamaterConfig.convertToRaw(-10, 'decibel'), 0.5);
    });
    test('maps a linear range [-10dB, 10dB] to [0.5, 1.0]', () => {
      assertClose(levelParamaterConfig.convertToRaw(-9.999, 'decibel'), 0.5);
      assertClose(levelParamaterConfig.convertToRaw(0, 'decibel'), 0.75);
      assertClose(levelParamaterConfig.convertToRaw(10, 'decibel'), 1.0);
    });
    test('clamps values above 10dB to 1.0', () => {
      assert.strictEqual(levelParamaterConfig.convertToRaw(10.0001, 'decibel'), 1.0);
      assert.strictEqual(levelParamaterConfig.convertToRaw(20, 'decibel'), 1.0);
    });
  });
  suite('validateRawValue', () => {
    test('accepts values between 0 and 1', () => {
      assert.strictEqual(levelParamaterConfig.validateRawValue(0), 0);
      assert.strictEqual(levelParamaterConfig.validateRawValue(0.5), 0.5);
      assert.strictEqual(levelParamaterConfig.validateRawValue(1), 1);
    });
    test('rejects values less than 0', () => {
      assert.throws(() => levelParamaterConfig.validateRawValue(-0.1));
    });
    test('rejects values greater than 1', () => {
      assert.throws(() => levelParamaterConfig.validateRawValue(1.1));
    });
  });
  suite('validateUnitValue', () => {
    test('accepts values up to 10 or negative infinity', () => {
      assert.strictEqual(levelParamaterConfig.validateUnitValue(10), 10);
      assert.strictEqual(levelParamaterConfig.validateUnitValue(Number.NEGATIVE_INFINITY), Number.NEGATIVE_INFINITY);
    });
    test('accepts values lower than -87', () => {
      assert.strictEqual(levelParamaterConfig.validateUnitValue(-87.1), -87.1);
    });
    test('rejects values greater than 10', () => {
      assert.throws(() => levelParamaterConfig.validateUnitValue(10.1));
    });
  });
});
