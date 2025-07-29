import { suite, test } from 'mocha';
import { createLogarithmicMapper } from './log.js';
import { assertClose } from '../../test-helpers/is-close.js';
import assert from 'node:assert';

suite('LogarithmicMapper', () => {
  const logarithmicMapper = createLogarithmicMapper(20, 20000);

  test('maps to float', () => {
    assert.strictEqual(logarithmicMapper.getOscType(), 'float');
  });
  suite('to mixer value', () => {
    test('throws when a string is provided', () => {
      assert.throws(
        () => logarithmicMapper.oscArgumentToMixerValue('foo'),
        new Error('Cannot map a string value'),
      );
    });
    test('maps from [0, 1] to [20, 20000]', () => {
      assertClose(logarithmicMapper.oscArgumentToMixerValue(0), 20);
      assertClose(logarithmicMapper.oscArgumentToMixerValue(0.5), 632.455);
      assertClose(logarithmicMapper.oscArgumentToMixerValue(1), 20000);
    });
  });
  suite('to osc value', () => {
    test('maps from [20, 20000] to [0, 1]', () => {
      assertClose(logarithmicMapper.mixerValueToOscArgument(20) as number, 0);
      assertClose(logarithmicMapper.mixerValueToOscArgument(632.455) as number, 0.5);
      assertClose(logarithmicMapper.mixerValueToOscArgument(20000) as number, 1);
    });
  });
});
