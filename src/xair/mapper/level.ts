import { z } from 'zod/v4';
import { Mapper } from '../entity.js';

const decibelSchema = z.number().or(z.literal(Number.NEGATIVE_INFINITY)).brand<"Decibel">();
export type Decibel = z.infer<typeof decibelSchema>;

export const decibel = (decibel: number): Decibel =>{
  return decibelSchema.parse(decibel);
}

const linearMap = (x: number, x1: number, x2: number, y1: number, y2: number): number => {
  const t = (x - x1) / (x2 - x1);
  return y1 + t * (y2 - y1);
};

export const levelToDb = (level: number): Decibel => {
  if (level <= 0.00625) return decibel(Number.NEGATIVE_INFINITY);

  if (level <= 0.0625) {
    return decibel(linearMap(level, 0.00625, 0.0625, -87, -60));
  }

  if (level <= 0.25) {
    return decibel(linearMap(level, 0.0625, 0.25, -60, -30));
  }

  if (level <= 0.5) {
    return decibel(linearMap(level, 0.25, 0.5, -30, -10));
  }

  if (level <= 1.0) {
    return decibel(linearMap(level, 0.5, 1.0, -10, +10));
  }

  return decibel(10);
};

const inverseLinearMap = (y: number, y1: number, y2: number, x1: number, x2: number): number => {
  const t = (y - y1) / (y2 - y1);
  return x1 + t * (x2 - x1);
};

export const dbToLevel = (db: Decibel): number => {
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

const createLevelMapper = (): Mapper<Decibel> => {
  return {
    mixerValueToOscArgument: (value) => {
      return dbToLevel(value);
    },
    oscArgumentToMixerValue: (arg) => {
      if (typeof arg === 'string') {
        throw new Error('Cannot map a string value');
      }
      return levelToDb(arg);
    },
    getOscType: () => 'float',
  };
};

export const levelMapper = createLevelMapper();
