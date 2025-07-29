import { suite, test } from 'mocha';
import { createLinearMapper } from './linear.js';
import assert from 'node:assert';

suite('LinearMapper', () => {
  test('maps to float', () => {
    const linearMapper = createLinearMapper(0, 1);
    assert.strictEqual(linearMapper.getOscType(), 'float');
  });

  suite('to mixer value', () => {
    test('throws when a string is provided', () => {
      const linearMapper = createLinearMapper(0, 1);
      assert.throws(
        () => linearMapper.oscArgumentToMixerValue('foo'),
        new Error('Cannot map a string value'),
      );
    });

    test('maps linear from 0 to 10', () => {
      const linearMapper = createLinearMapper(0, 10);
      assert.strictEqual(linearMapper.mixerValueToOscArgument(0), 0);
      assert.strictEqual(linearMapper.mixerValueToOscArgument(2.5), 0.25);
      assert.strictEqual(linearMapper.mixerValueToOscArgument(5), 0.5);
      assert.strictEqual(linearMapper.mixerValueToOscArgument(7.5), 0.75);
      assert.strictEqual(linearMapper.mixerValueToOscArgument(10), 1.0);
    });

    test('maps linear from -10 to 10', () => {
      const linearMapper = createLinearMapper(-10, 10);
      assert.strictEqual(linearMapper.mixerValueToOscArgument(-10), 0);
      assert.strictEqual(linearMapper.mixerValueToOscArgument(-5), 0.25);
      assert.strictEqual(linearMapper.mixerValueToOscArgument(0), 0.5);
      assert.strictEqual(linearMapper.mixerValueToOscArgument(5), 0.75);
      assert.strictEqual(linearMapper.mixerValueToOscArgument(10), 1.0);
    });
  });

  suite('to osc value', () => {
    test('maps linear from 0 to 10', () => {
      const linearMapper = createLinearMapper(0, 10);
      assert.strictEqual(linearMapper.oscArgumentToMixerValue(0), 0);
      assert.strictEqual(linearMapper.oscArgumentToMixerValue(0.25), 2.5);
      assert.strictEqual(linearMapper.oscArgumentToMixerValue(0.5), 5);
      assert.strictEqual(linearMapper.oscArgumentToMixerValue(0.75), 7.5);
      assert.strictEqual(linearMapper.oscArgumentToMixerValue(1.0), 10);
    });

    test('maps linear from -10 to 10', () => {
      const linearMapper = createLinearMapper(-10, 10);
      assert.strictEqual(linearMapper.oscArgumentToMixerValue(0), -10);
      assert.strictEqual(linearMapper.oscArgumentToMixerValue(0.25), -5);
      assert.strictEqual(linearMapper.oscArgumentToMixerValue(0.5), 0);
      assert.strictEqual(linearMapper.oscArgumentToMixerValue(0.75), 5);
      assert.strictEqual(linearMapper.oscArgumentToMixerValue(1.0), 10);
    });
  });
});
