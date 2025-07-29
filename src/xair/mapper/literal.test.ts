import { suite, test } from 'mocha';
import { createLiteralMapper } from './literal.js';
import assert from 'node:assert';

suite('LiteralMapper', () => {
  const literals = ['A', 'B', 'C'];
  const literalMapper = createLiteralMapper(literals);

  test('maps to integer', () => {
    assert.strictEqual(literalMapper.getOscType(), 'integer');
  });

  suite('to mixer value', () => {
    test('throws when a string is provided', () => {
      assert.throws(
        () => literalMapper.oscArgumentToMixerValue('foo'),
        new Error('Cannot find literal by index. Index is not a number'),
      );
    });

    test('maps the literals', () => {
      assert.strictEqual(literalMapper.oscArgumentToMixerValue(0), 'A');
      assert.strictEqual(literalMapper.oscArgumentToMixerValue(1), 'B');
      assert.strictEqual(literalMapper.oscArgumentToMixerValue(2), 'C');
    });
  });

  suite('to osc value', () => {
    test('maps the literals', () => {
      assert.strictEqual(literalMapper.mixerValueToOscArgument('A'), 0);
      assert.strictEqual(literalMapper.mixerValueToOscArgument('B'), 1);
      assert.strictEqual(literalMapper.mixerValueToOscArgument('C'), 2);
    });
  });
});
