import { OSCClient } from '../osc/client.js';
import { OscArgument, oscArgumentListSchema, OscArgumentValue } from '../osc/osc-schemas.js';

type OSCDataType = 'float' | 'integer' | 'string';

type UnitType = string | number | boolean;
type OSCValue<T extends OSCDataType> = T extends 'string' ? string : number;

export type AsyncGetter<UnitName extends string, T extends OSCDataType, K extends UnitType> = {
  /**
   * Fetch the value of the parameter.
   * @param unit - Optional. If provided, the value will be converted to this unit, otherwise it will return the raw osc value.
   */
  (): Promise<OSCValue<T>>;
  (unit: UnitName): Promise<K>;
};

export type AsyncSetter<UnitName extends string, T extends OSCDataType, K extends UnitType> = {
  /**
   * Update the value of the parameter.
   * @param value - The value to set.
   * @param unit - Optional. If provided, the value has to be interpreted as this unit, otherwise it will be treated as raw osc value.
   * @returns A promise that resolves when the update is complete.
   * @throws If the value is not valid for the specified OSC data type.
   */
  (value: OSCValue<T>): Promise<void>;
  (value: K, unit: UnitName): Promise<void>;
};

export type OSCParameter<UnitName extends string, T extends OSCDataType, K extends UnitType> = {
  fetch: AsyncGetter<UnitName, T, K>;
  update: AsyncSetter<UnitName, T, K>;
};

export type OSCParameterConfig<UnitName, T extends OSCDataType, K extends UnitType> = {
  oscDataType: T;
  convertToUnit: (rawValue: OSCValue<T>, unit: UnitName) => K;
  convertToRaw: (unitValue: K, unit: UnitName) => OSCValue<T>;
  validateRawValue: (oscValue: OscArgumentValue) => OSCValue<T>;
  validateUnitValue: (value: K) => K;
};

export type OSCParameterDependencies<UnitName, T extends OSCDataType, K extends UnitType> = {
  oscClient: OSCClient;
  oscAddress: string;
  config: OSCParameterConfig<UnitName, T, K>;
};

const createOSCParameter = <UnitName extends string, T extends OSCDataType, K extends UnitType>(
  deps: OSCParameterDependencies<UnitName, T, K>,
): OSCParameter<UnitName, T, K> => {
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
  async function fetch(unit: UnitName): Promise<K>;
  async function fetch(unit?: UnitName): Promise<OSCValue<T> | K> {
    const response = await oscClient.query(oscAddress);
    const [firstArg] = oscArgumentListSchema.parse(response.args);
    const rawValue = config.validateRawValue(firstArg.value);

    if (unit === undefined) {
      return rawValue;
    }

    return config.convertToUnit(rawValue, unit);
  }

  function update(value: OSCValue<T>): Promise<void>;
  function update(value: K, unit: UnitName): Promise<void>;
  function update(...args: [OSCValue<T>] | [K, UnitName]): Promise<void> {
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
  createOSCParameter: <UnitName extends string, T extends OSCDataType, K extends UnitType>(
    oscAddress: string,
    config: OSCParameterConfig<UnitName, T, K>,
  ) => OSCParameter<UnitName, T, K>;
};

export const createOSCParameterFactory = (oscClient: OSCClient): OSCParameterFactory => {
  return {
    createOSCParameter: (oscAddress, config) => {
      return createOSCParameter({ oscAddress, oscClient, config });
    },
  };
};
