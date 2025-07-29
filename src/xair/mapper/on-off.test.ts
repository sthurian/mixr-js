import { suite, test } from 'mocha';
import assert from 'node:assert';
import { onOffMapper } from './on-off.js';

suite('OnOffMapper', () => {
  test('maps to integer', () => {
    assert.strictEqual(onOffMapper.getOscType(), 'integer');
  });

  suite('to mixer value', () => {
    test('throws an error for invalid values', () => {
      assert.throws(
        () => onOffMapper.oscArgumentToMixerValue(2),
        new Error('Invalid value for on/off mapper: 2. Expected 0 or 1.'),
      );
      assert.throws(
        () => onOffMapper.oscArgumentToMixerValue(-1),
        new Error('Invalid value for on/off mapper: -1. Expected 0 or 1.'),
      );
      assert.throws(
        () => onOffMapper.oscArgumentToMixerValue('foo'),
        new Error('Invalid value for on/off mapper: foo. Expected 0 or 1.'),
      );
    });

    test('maps 0 to false', () => {
      assert.strictEqual(onOffMapper.oscArgumentToMixerValue(0), false);
    });

    test('maps 1 to true', () => {
      assert.strictEqual(onOffMapper.oscArgumentToMixerValue(1), true);
    });
  });

  suite('to osc value', () => {
    test('maps false to 0', () => {
      assert.strictEqual(onOffMapper.mixerValueToOscArgument(false), 0);
    });

    test('maps true to 1', () => {
      assert.strictEqual(onOffMapper.mixerValueToOscArgument(true), 1);
    });
  });
});
