import { OSCClient } from '../osc/client.js';
import { OscArgument, oscArgumentListSchema, OscArgumentValue } from '../osc/osc-schemas.js';

export type Entity<MixerType> = {
  get: () => Promise<MixerType>;
  set: (value: MixerType) => Promise<void>;
};

export type Mapper<SemanticType> = {
  mixerValueToOscArgument: (value: SemanticType) => OscArgumentValue;
  oscArgumentToMixerValue: (value: OscArgumentValue) => SemanticType;
  getOscType(): 'string' | 'integer' | 'float';
};

type EntityDependencies<MixerType> = {
  path: string;
  oscClient: OSCClient;
  mapper: Mapper<MixerType>;
};

const createEntity = <MixerType>(
  dependencies: EntityDependencies<MixerType>,
): Entity<MixerType> => {
  const { path, oscClient, mapper } = dependencies;

  const toExplicitOscType = (
    value: OscArgumentValue,
    oscType: 'string' | 'integer' | 'float',
  ): OscArgument => {
    if (typeof value === 'string' && oscType === 'string') {
      return { type: 'string', value };
    }
    if (typeof value === 'number' && oscType === 'integer') {
      return { type: 'integer', value };
    }
    if (typeof value === 'number' && oscType === 'float') {
      return { type: 'float', value };
    }

    throw new Error(`Unsupported OSC type "${typeof value}" for address "${path}"`);
  };

  return {
    get: async () => {
      const result = await oscClient.query(path);
      const parsedResult = oscArgumentListSchema.safeParse(result.args);
      if (!parsedResult.success) {
        throw parsedResult.error;
      }
      const args = parsedResult.data.map((argument) => {
        return argument.value;
      });
      return mapper.oscArgumentToMixerValue(args[0]);
    },
    set: async (value: MixerType) => {
      const arg = mapper.mixerValueToOscArgument(value);
      return oscClient.set(path, [toExplicitOscType(arg, mapper.getOscType())]);
    },
  };
};

export type EntityFactory = {
  createEntity: <T>(path: string, mapper: Mapper<T>) => Entity<T>;
};

export const createEntityFactory = (oscClient: OSCClient): EntityFactory => {
  return {
    createEntity: (path, mapper) => {
      return createEntity({ path, oscClient, mapper });
    },
  };
};
