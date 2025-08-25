import { OSCClient } from '../osc/client.js';
import { OscArgument, oscArgumentListSchema, OscArgumentValue } from '../osc/osc-schemas.js';

type OSCDataType = 'float' | 'integer' | 'string';

type OSCValue<T extends OSCDataType> = T extends 'string' ? string : number;
export type Unit<N extends string = string, V = string | number | boolean> = { name: N; value: V };

export type AsyncGetter<U extends Unit, T extends OSCDataType> = {
  /**
   * Fetch the value of the parameter.
   * @param unit - Optional. If provided, the value will be converted to this unit, otherwise it will return the raw osc value.
   */
  (): Promise<OSCValue<T>>;
  (unit: U['name']): Promise<U['value']>;
};

export type AsyncSetter<U extends Unit, T extends OSCDataType> = {
  /**
   * Update the value of the parameter.
   * @param value - The value to set.
   * @param unit - Optional. If provided, the value has to be interpreted as this unit, otherwise it will be treated as raw osc value.
   * @returns A promise that resolves when the update is complete.
   * @throws If the value is not valid for the specified OSC data type.
   */
  (value: OSCValue<T>): Promise<void>;
  (value: U['value'], unit: U['name']): Promise<void>;
};

export type OSCParameter<U extends Unit, T extends OSCDataType> = {
  fetch: AsyncGetter<U, T>;
  update: AsyncSetter<U, T>;
};

export type OSCParameterConfig<U extends Unit, T extends OSCDataType> = {
  oscDataType: T;
  convertToUnit: (rawValue: OSCValue<T>, unit: U['name']) => U['value'];
  convertToRaw: (unitValue: U['value'], unit: U['name']) => OSCValue<T>;
  validateRawValue: (oscValue: OscArgumentValue) => OSCValue<T>;
  validateUnitValue: (value: U['value']) => U['value'];
};

export type OSCParameterDependencies<U extends Unit, T extends OSCDataType> = {
  oscClient: OSCClient;
  oscAddress: string;
  config: OSCParameterConfig<U, T>;
};

const createOSCParameter = <U extends Unit, T extends OSCDataType>(
  deps: OSCParameterDependencies<U, T>,
): OSCParameter<U, T> => {
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

  async function fetch(): Promise<OSCValue<T>>;
  async function fetch(unit: U['name']): Promise<U['value']>;
  async function fetch(unit?: U['name']): Promise<OSCValue<T> | U['value']> {
    const response = await oscClient.query(oscAddress);
    const [firstArg] = oscArgumentListSchema.parse(response.args);
    if(firstArg === undefined) {
      throw new Error(`No valid OSC argument found for address "${oscAddress}"`);
    }
    const rawValue = config.validateRawValue(firstArg.value);

    if (unit === undefined) {
      return rawValue;
    }

    return config.convertToUnit(rawValue, unit);
  }

  function update(value: OSCValue<T>): Promise<void>;
  function update(value: U['value'], unit: U['name']): Promise<void>;
  function update(...args: [OSCValue<T>] | [U['value'], U['name']]): Promise<void> {
    if (args.length === 1) {
      const [value] = args;
      const rawValue = config.validateRawValue(value);
      const argument = createOSCArgument(rawValue);
      return oscClient.set(oscAddress, [argument]);
    } else {
      const [value, unit] = args;
      const validatedValue = config.validateUnitValue(value);
      const rawValue = config.convertToRaw(validatedValue, unit);
      const argument = createOSCArgument(rawValue);
      return oscClient.set(oscAddress, [argument]);
    }
  }

  return { fetch, update };
};

export type OSCParameterFactory = {
  createOSCParameter: <U extends Unit, T extends OSCDataType>(
    oscAddress: string,
    config: OSCParameterConfig<U, T>,
  ) => OSCParameter<U, T>;
};

export const createOSCParameterFactory = (oscClient: OSCClient): OSCParameterFactory => {
  return {
    createOSCParameter: (oscAddress, config) => {
      return createOSCParameter({ oscAddress, oscClient, config });
    },
  };
};
