type SetTimeoutFunction = (callback: () => void, delay: number) => unknown;

export type Clock = {
  setTimeout: SetTimeoutFunction;
};

export const createClock = (timeoutFunction: SetTimeoutFunction): Clock => {
  return {
    setTimeout: timeoutFunction,
  };
};
