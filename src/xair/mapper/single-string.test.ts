import { suite, test } from 'mocha';
import { singleStringMapper } from './single-string.js';
import assert from 'node:assert';

suite('SingleStringMapper', () => {
  test('maps to string', () => {
    assert.strictEqual(singleStringMapper.getOscType(), 'string');
  });

  suite('to mixer value', () => {
    test('throws when a number is provided', () => {
      assert.throws(
        () => singleStringMapper.oscArgumentToMixerValue(42),
        new Error('Cannot map a number'),
      );
    });

    test('maps string values', () => {
      assert.strictEqual(singleStringMapper.oscArgumentToMixerValue('foo'), 'foo');
      assert.strictEqual(singleStringMapper.oscArgumentToMixerValue('bar'), 'bar');
      assert.strictEqual(singleStringMapper.oscArgumentToMixerValue('baz'), 'baz');
    });
  });

  suite('to osc value', () => {
    test('maps string values', () => {
      assert.strictEqual(singleStringMapper.mixerValueToOscArgument('foo'), 'foo');
      assert.strictEqual(singleStringMapper.mixerValueToOscArgument('bar'), 'bar');
      assert.strictEqual(singleStringMapper.mixerValueToOscArgument('baz'), 'baz');
    });
  });
});
