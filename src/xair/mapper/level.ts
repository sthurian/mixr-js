import { z } from 'zod/v4';
import { OSCParameterConfig } from '../osc-parameter.js';

const linearMap = (x: number, x1: number, x2: number, y1: number, y2: number): number => {
  const t = (x - x1) / (x2 - x1);
  return y1 + t * (y2 - y1);
};

export const levelToDb = (level: number): number => {
  if (level <= 0.00625) return Number.NEGATIVE_INFINITY;

  if (level <= 0.0625) {
    return linearMap(level, 0.00625, 0.0625, -87, -60);
  }

  if (level <= 0.25) {
    return linearMap(level, 0.0625, 0.25, -60, -30);
  }

  if (level <= 0.5) {
    return linearMap(level, 0.25, 0.5, -30, -10);
  }

  if (level <= 1.0) {
    return linearMap(level, 0.5, 1.0, -10, +10);
  }

  return 10;
};

const inverseLinearMap = (y: number, y1: number, y2: number, x1: number, x2: number): number => {
  const t = (y - y1) / (y2 - y1);
  return x1 + t * (x2 - x1);
};

export const dbToLevel = (db: number): number => {
  if (db < -87) return 0;

  if (db <= -60) {
    return inverseLinearMap(db, -87, -60, 0.00625, 0.0625);
  }

  if (db <= -30) {
    return inverseLinearMap(db, -60, -30, 0.0625, 0.25);
  }

  if (db <= -10) {
    return inverseLinearMap(db, -30, -10, 0.25, 0.5);
  }

  if (db <= 10) {
    return inverseLinearMap(db, -10, 10, 0.5, 1.0);
  }

  return 1.0;
};
export const levelParamaterConfig: OSCParameterConfig<'decibels', 'float', number> = {
  oscDataType: 'float',
  convertToUnit: levelToDb,
  convertToRaw: dbToLevel,
  validateRawValue: z.number().min(0).max(1).parse,
  validateUnitValue: z.number().max(10).or(z.literal(Number.NEGATIVE_INFINITY)).parse
}