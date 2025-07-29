import { OscSocket, OscOutputMessage, OscMessageInputArgument } from './socket.js';

export type OSCClient = {
  query: (oscAddress: string) => Promise<OscOutputMessage>;
  set: <T extends OscMessageInputArgument[]>(oscAddress: string, value: T) => Promise<void>;
  close: () => Promise<void>;
};

type OSCClientDependencies = {
  oscSocket: OscSocket;
  port: number;
  address: string;
};

export const createOSCClient = (dependencies: OSCClientDependencies): OSCClient => {
  const { oscSocket, port, address } = dependencies;
  const query = (oscAddress: string): Promise<OscOutputMessage> => {
    return new Promise((resolve) => {
      const handler = (msg: OscOutputMessage) => {
        oscSocket.off(oscAddress, handler);
        resolve(msg);
      };
      oscSocket.on(oscAddress, handler);
      oscSocket.send({ address: oscAddress, args: [] }, port, address);
    });
  };
  return {
    query,
    set: async (oscAddress, values) => {
      return oscSocket.send({ address: oscAddress, args: values }, port, address);
    },
    close: async () => {
      oscSocket.close();
    },
  };
};
