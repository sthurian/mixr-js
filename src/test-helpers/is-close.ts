import assert from 'node:assert';
import { match } from 'sinon';

export const isClose = (expected: number, epsilon = 0.001) =>
  match((val: number) => Math.abs(val - expected) < epsilon, `≈ ${expected}`);

export function assertClose(actual: number, expected: number, epsilon = 0.001): void {
  const diff = Math.abs(actual - expected);
  assert.ok(
    diff < epsilon,
    `Expected ${actual} ≈ ${expected} (difference: ${diff}, epsilon: ${epsilon})`,
  );
}
