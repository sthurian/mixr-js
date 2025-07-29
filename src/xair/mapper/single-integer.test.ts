import { suite, test } from 'mocha';
import assert from 'node:assert';
import { singleIntegerMapper } from './single-integer.js';

suite('SingleIntegerMapper', () => {
  test('maps to integer', () => {
    assert.strictEqual(singleIntegerMapper.getOscType(), 'integer');
  });
  suite('to mixer value', () => {
    test('throws when a string is provided', () => {
      assert.throws(
        () => singleIntegerMapper.oscArgumentToMixerValue('foo'),
        new Error('Cannot map a string value'),
      );
    });
    test('maps integer values', () => {
      assert.strictEqual(singleIntegerMapper.oscArgumentToMixerValue(0), 0);
      assert.strictEqual(singleIntegerMapper.oscArgumentToMixerValue(1), 1);
      assert.strictEqual(singleIntegerMapper.oscArgumentToMixerValue(42), 42);
    });
  });

  suite('to osc value', () => {
    test('maps integer values', () => {
      assert.strictEqual(singleIntegerMapper.mixerValueToOscArgument(0), 0);
      assert.strictEqual(singleIntegerMapper.mixerValueToOscArgument(1), 1);
      assert.strictEqual(singleIntegerMapper.mixerValueToOscArgument(42), 42);
    });
  });
});
