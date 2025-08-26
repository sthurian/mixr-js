import dgram, { RemoteInfo } from 'node:dgram';
import { OscArgOrArrayInput, OscArgOutputOrArray, OscPacketInput, OscPacketOutput } from 'osc-min';

type OscMessageOutputArgument = OscArgOutputOrArray;
export type OscMessageInputArgument = OscArgOrArrayInput;

export type OscOutputMessage = {
  address: string;
  args?: OscMessageOutputArgument[];
};

type OscInputMessage = {
  address: string;
  args?: OscMessageInputArgument[];
};

export type RInfo = {
  address: string;
  port: number;
};
type OscHandler = (message: OscOutputMessage, rinfo: RInfo) => void;

export interface OscSocket {
  send(message: OscInputMessage, port: number, address: string): Promise<void>;
  setBroadcast(flag: boolean): void;
  on(address: string, handler: OscHandler): void;
  off(address: string, handler?: OscHandler): void;
  close(): Promise<void>;
}

type ToBuffer = (msg: OscPacketInput) => DataView<ArrayBufferLike>;
type FromBuffer = (buffer: Buffer) => OscPacketOutput;

type OscSocketDependencies = {
  socket: dgram.Socket;
  toBuffer: ToBuffer;
  fromBuffer: FromBuffer;
};

export const createOSCSocket = async (dependencies: OscSocketDependencies): Promise<OscSocket> => {
  const { socket, toBuffer, fromBuffer } = dependencies;
  return new Promise((resolve) => {
    socket.bind(() => {
      const listeners = new Map<string, Set<OscHandler>>();

      function handleMessage(buffer: Buffer, rinfo: RemoteInfo): void {
        const decoded = fromBuffer(buffer);

        const dispatch = (message: OscPacketOutput) => {
          if (message.oscType !== 'message') {
            throw new Error(
              `Non-message OSC packet is currently not supported. Received: ${message.oscType}`,
            );
          }
          const handlers = listeners.get(message.address);
          if (handlers) {
            handlers.forEach((handler) => {
              handler({ address: message.address, args: message.args }, rinfo);
            });
          }
        };
        dispatch(decoded);
      }
      socket.on('message', handleMessage);

      resolve({
        send: (message: OscOutputMessage, port: number, address: string) => {
          const buffer = toBuffer({
            address: message.address,
            args: message.args,
          });
          return new Promise((resolve, reject) => {
            socket.send(buffer, port, address, (error) => {
              if (error !== null) {
                reject(error);
              } else {
                resolve();
              }
            });
          });
        },
        setBroadcast: (flag) => {
          socket.setBroadcast(flag);
        },
        on: (address: string, handler: OscHandler): void => {
          if (!listeners.has(address)) {
            listeners.set(address, new Set());
          }
          listeners.get(address)!.add(handler);
        },
        off: (address: string, handler?: OscHandler): void => {
          const handlers = listeners.get(address);
          if (!handlers) return;
          if (handler) {
            handlers.delete(handler);
          } else {
            listeners.delete(address);
          }
        },
        close: () => {
          socket.close();
          return Promise.resolve();
        },
      });
    });
  });
};
