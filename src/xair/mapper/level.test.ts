import { suite, test } from 'mocha';
import { decibel, levelMapper } from './level.js';
import assert from 'node:assert';
import { assertClose } from '../../test-helpers/is-close.js';

suite('LevelMapper', () => {
  test('maps to float', () => {
    assert.strictEqual(levelMapper.getOscType(), 'float');
  });

  suite('to mixer value', () => {
    test('throws when a string is provided', () => {
      assert.throws(
        () => levelMapper.oscArgumentToMixerValue('foo'),
        new Error('Cannot map a string value'),
      );
    });

    test('returns negative infinity for values less or equal than 0.00625', () => {
      assert.strictEqual(levelMapper.oscArgumentToMixerValue(0.00625), Number.NEGATIVE_INFINITY);
      assert.strictEqual(levelMapper.oscArgumentToMixerValue(0), Number.NEGATIVE_INFINITY);
    });

    test('maps a linear range [0.00625, 0.0625] to [-87, -60]', () => {
      assertClose(levelMapper.oscArgumentToMixerValue(0.0062501), -87);
      assertClose(levelMapper.oscArgumentToMixerValue(0.034375), -73.5);
      assertClose(levelMapper.oscArgumentToMixerValue(0.0625), -60);
    });

    test('maps a linear range [0.0625, 0.25] to [-60, -30]', () => {
      assertClose(levelMapper.oscArgumentToMixerValue(0.062501), -60);
      assertClose(levelMapper.oscArgumentToMixerValue(0.15625), -45);
      assertClose(levelMapper.oscArgumentToMixerValue(0.25), -30);
    });

    test('maps a linear range [0.25, 0.5] to [-30, -10]', () => {
      assertClose(levelMapper.oscArgumentToMixerValue(0.25001), -30);
      assertClose(levelMapper.oscArgumentToMixerValue(0.375), -20);
      assertClose(levelMapper.oscArgumentToMixerValue(0.5), -10);
    });

    test('maps a linear range [0.5, 1.0] to [-10, 10]', () => {
      assertClose(levelMapper.oscArgumentToMixerValue(0.50001), -10);
      assertClose(levelMapper.oscArgumentToMixerValue(0.75), 0);
      assertClose(levelMapper.oscArgumentToMixerValue(1.0), 10);
    });
  });

  suite('to osc value', () => {
    test('returns zero for less than -87dB', () => {
      assert.strictEqual(levelMapper.mixerValueToOscArgument(decibel(-87.0001)), 0);
      assert.strictEqual(levelMapper.mixerValueToOscArgument(decibel(Number.NEGATIVE_INFINITY)), 0);
    });

    test('maps a linear range [-87dB, -60dB] to [0.00625, 0.0625]', () => {
      assertClose(levelMapper.mixerValueToOscArgument(decibel(-86.999)) as number, 0.00625);
      assertClose(levelMapper.mixerValueToOscArgument(decibel(-73.5)) as number, 0.034375);
      assertClose(levelMapper.mixerValueToOscArgument(decibel(-60)) as number, 0.0625);
    });

    test('maps a linear range [-60dB, -30dB] to [0.0625, 0.25]', () => {
      assertClose(levelMapper.mixerValueToOscArgument(decibel(-59.999)) as number, 0.0625);
      assertClose(levelMapper.mixerValueToOscArgument(decibel(-45)) as number, 0.15625);
      assertClose(levelMapper.mixerValueToOscArgument(decibel(-30)) as number, 0.25);
    });

    test('maps a linear range [-30dB, -10dB] to [0.25, 0.5]', () => {
      assertClose(levelMapper.mixerValueToOscArgument(decibel(-29.999)) as number, 0.25);
      assertClose(levelMapper.mixerValueToOscArgument(decibel(-20)) as number, 0.375);
      assertClose(levelMapper.mixerValueToOscArgument(decibel(-10)) as number, 0.5);
    });

    test('maps a linear range [-10dB, 10dB] to [0.5, 1.0]', () => {
      assertClose(levelMapper.mixerValueToOscArgument(decibel(-9.999)) as number, 0.5);
      assertClose(levelMapper.mixerValueToOscArgument(decibel(0)) as number, 0.75);
      assertClose(levelMapper.mixerValueToOscArgument(decibel(10)) as number, 1.0);
    });
  });
});
