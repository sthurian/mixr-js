import { OSCClient } from '../osc/client.js';
import { OscArgument, oscArgumentListSchema, OscArgumentValue } from '../osc/osc-schemas.js';

type OSCDataType = 'float' | 'integer' | 'string';
type OSCValue<T extends OSCDataType> = T extends 'string' ? string : number;

export type AsyncGetter<Unit, T extends OSCDataType> = {
  /**
   * Fetch the value of the parameter.
   * @param unit - Optional. If provided, the value will be converted to this unit, otherwise it will return the raw osc value.
   */
  (): Promise<OSCValue<T>>;
  (unit: Unit): Promise<OSCValue<T>>;
};

export type AsyncSetter<Unit, T extends OSCDataType> = {
  /**
   * Update the value of the parameter.
   * @param value - The value to set.
   * @param unit - Optional. If provided, the value has to be interpreted as this unit, otherwise it will be treated as raw osc value.
   * @returns A promise that resolves when the update is complete.
   * @throws If the value is not valid for the specified OSC data type.
   */
  (value: OSCValue<T>): Promise<void>;
  (value: OSCValue<T>, unit: Unit): Promise<void>;
};

export type OSCParameter<Unit, T extends OSCDataType> = {
  fetch: AsyncGetter<Unit, T>;
  update: AsyncSetter<Unit, T>;
};

export type OSCParameterConfig<Unit, T extends OSCDataType> = {
  oscDataType: T;
  convertToUnit: (rawValue: OSCValue<T>, unit: Unit) => OSCValue<T>;
  convertToRaw: (unitValue: OSCValue<T>, unit: Unit) => OSCValue<T>;
  validateRawValue: (oscValue: OscArgumentValue) => OSCValue<T>;
  validateUnitValue: (value: OSCValue<T>) => OSCValue<T>;
};

export type OSCParameterDependencies<Unit, T extends OSCDataType> = {
  oscClient: OSCClient;
  oscAddress: string;
  config: OSCParameterConfig<Unit, T>;
};

const createOSCParameter = <Unit, T extends OSCDataType>(
  deps: OSCParameterDependencies<Unit, T>
): OSCParameter<Unit, T> => {
  const { oscClient, oscAddress, config } = deps;

  const createOSCArgument = (value: OSCValue<T>): OscArgument => {
    if (typeof value === 'string' && config.oscDataType === 'string') {
      return { type: 'string', value };
    }
    if (typeof value === 'number' && config.oscDataType === 'integer') {
      return { type: 'integer', value };
    }
    if (typeof value === 'number' && config.oscDataType === 'float') {
      return { type: 'float', value };
    }

    throw new Error(`Unsupported OSC type "${typeof value}" for address "${oscAddress}"`);
  };

  return {
    fetch: async (unit: Unit | 'raw' = 'raw') => {
      const response = await oscClient.query(oscAddress);
      const [firstArg] = oscArgumentListSchema.parse(response.args);
      const rawValue = config.validateRawValue(firstArg.value);
      return unit === 'raw' ? rawValue : config.convertToUnit(rawValue, unit);
    },
    update: async (value: OSCValue<T>, unit: Unit | 'raw' = 'raw') => {
      const rawValue = unit === 'raw' 
        ? config.validateRawValue(value) 
        : config.convertToRaw(config.validateUnitValue(value), unit);
      const argument = createOSCArgument(rawValue);
      return oscClient.set(oscAddress, [argument]);
    },
  } as OSCParameter<Unit, T>;
};

export type OSCParameterFactory = {
  createOSCParameter: <Unit, T extends OSCDataType>(
    oscAddress: string,
    config: OSCParameterConfig<Unit, T>,
  ) => OSCParameter<Unit, T>;
};

export const createOSCParameterFactory = (oscClient: OSCClient): OSCParameterFactory => {
  return {
    createOSCParameter: (oscAddress, config) => {
      return createOSCParameter({ oscAddress, oscClient, config });
    },
  };
};
