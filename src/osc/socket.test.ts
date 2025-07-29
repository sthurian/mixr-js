import { suite, test } from 'mocha';
import { createOSCSocket } from './socket.js';
import { fake, spy } from 'sinon';
import assert from 'node:assert';
import { RemoteInfo, Socket } from 'node:dgram';
suite('OSCSocket', () => {
  test('binds the dgram socket on initialisation', async () => {
    const bind = fake((cb) => {
      cb();
    });
    await createOSCSocket({
      socket: {
        bind,
        on: () => {},
        send: () => {},
        close: () => {},
      } as unknown as Socket,
      toBuffer: fake(),
      fromBuffer: fake(),
    });
    assert.strictEqual(bind.calledOnce, true);
  });

  test("converts the outgoing osc message and calls dgram socket's send with the correct arguments when sending a message", async () => {
    const fakeBuffer = new DataView(new ArrayBuffer(8));
    const toBuffer = fake.returns(fakeBuffer);
    const send = fake();
    const socket = await createOSCSocket({
      socket: {
        bind: fake((cb) => {
          cb();
        }),
        on: () => {},
        send,
        close: () => {},
      } as unknown as Socket,
      toBuffer,
      fromBuffer: fake(),
    });
    socket.send({ address: '/test', args: [] }, 1234, 'localhost');
    assert.strictEqual(toBuffer.calledOnceWithExactly({ address: '/test', args: [] }), true);
    assert.strictEqual(send.calledOnceWith(fakeBuffer, 1234, 'localhost'), true);
  });

  test('rejects when sending a message fails', async () => {
    const error = new Error('Send failed');
    const send = fake((_buffer, _port, _address, errorHandler) => {
      errorHandler(error);
    });
    const socket = await createOSCSocket({
      socket: {
        bind: fake((cb) => {
          cb();
        }),
        on: () => {},
        send,
        close: () => {},
      } as unknown as Socket,
      toBuffer: fake(),
      fromBuffer: fake(),
    });

    assert.rejects(
      () => socket.send({ address: '/test', args: [] }, 1234, 'localhost'),
      /Send failed/,
    );
  });

  test('resolves on socket callback without error', async () => {
    const send = fake((_buffer, _port, _address, callback) => {
      callback(null);
    });
    const socket = await createOSCSocket({
      socket: {
        bind: fake((cb) => {
          cb();
        }),
        on: () => {},
        send,
        close: () => {},
      } as unknown as Socket,
      toBuffer: fake(),
      fromBuffer: fake(),
    });

    assert.doesNotReject(
      () => socket.send({ address: '/test', args: [] }, 1234, 'localhost'),
      /Send failed/,
    );
  });

  test('should call the registered OSC handler when a message with matching address arrives', async () => {
    const testAddress = '/test';
    const testArgs = [{ type: 'integer', value: 42 } as const];

    let capturedCallback;
    const fakeOn = fake((event, cb) => {
      if (event === 'message') capturedCallback = cb;
    });

    const fakeSocket = {
      bind: fake((cb) => {
        cb();
      }),
      on: fakeOn,
      send: fake(),
      close: fake(),
    } as unknown as Socket;

    const fromBuffer = fake.returns({
      oscType: 'message',
      address: testAddress,
      args: testArgs,
    } as const);

    const toBuffer = fake();

    const oscSocket = await createOSCSocket({
      socket: fakeSocket,
      toBuffer,
      fromBuffer,
    });

    const handler = fake();
    oscSocket.on(testAddress, handler);
    const msg = Buffer.from('hello');
    const rinfo = { address: '1.2.3.4', port: 1234, size: 5 };
    capturedCallback!(msg, rinfo);

    assert.strictEqual(fakeOn.calledOnce, true);
    assert.strictEqual(handler.calledWith({ address: testAddress, args: testArgs }), true);
    assert.strictEqual(fromBuffer.calledOnceWithExactly(msg), true);
  });

  test('should not call the OSC handler if the message address does not match', async () => {
    const testAddress = '/test';
    const testArgs = [{ type: 'integer', value: 42 } as const];

    let capturedCallback;
    const fakeOn = fake((event, cb) => {
      if (event === 'message') capturedCallback = cb;
    });

    const fakeSocket = {
      bind: fake((cb) => {
        cb();
      }),
      on: fakeOn,
      send: fake(),
      close: fake(),
    } as unknown as Socket;

    const fromBuffer = fake.returns({
      oscType: 'message',
      address: '/different',
      args: testArgs,
    } as const);

    const toBuffer = fake();

    const oscSocket = await createOSCSocket({
      socket: fakeSocket,
      toBuffer,
      fromBuffer,
    });

    const handler = spy();
    oscSocket.on(testAddress, handler);
    const msg = Buffer.from('hello');
    const rinfo = { address: '1.2.3.4', port: 1234, size: 5 };
    capturedCallback!(msg, rinfo);
    assert.strictEqual(fakeOn.calledOnce, true);
    assert.strictEqual(handler.notCalled, true);
    assert.strictEqual(fromBuffer.calledOnceWithExactly(msg), true);
  });

  test('should not call the OSC handler if it is removed', async () => {
    const testAddress = '/test';
    const testArgs = [{ type: 'integer', value: 42 } as const];

    let capturedCallback;
    const fakeOn = fake((event, cb) => {
      if (event === 'message') capturedCallback = cb;
    });

    const fakeSocket = {
      bind: fake((cb) => {
        cb();
      }),
      on: fakeOn,
      send: fake(),
      close: fake(),
    } as unknown as Socket;

    const fromBuffer = fake.returns({
      oscType: 'message',
      address: testAddress,
      args: testArgs,
    } as const);

    const toBuffer = fake();

    const oscSocket = await createOSCSocket({
      socket: fakeSocket,
      toBuffer,
      fromBuffer,
    });

    const handler = spy();
    oscSocket.on(testAddress, handler);
    oscSocket.off(testAddress, handler);

    const msg = Buffer.from('hello');
    const rinfo = { address: '1.2.3.4', port: 1234, size: 5 };
    capturedCallback!(msg, rinfo);
    assert.strictEqual(fakeOn.calledOnce, true);
    assert.strictEqual(handler.notCalled, true);
    assert.strictEqual(fromBuffer.calledOnceWithExactly(msg), true);
  });

  test('should remove all handlers for an address when off is called without a handler', async () => {
    const testAddress = '/test';
    const testArgs = [{ type: 'integer', value: 42 } as const];

    let capturedCallback;
    const fakeOn = fake((event, cb) => {
      if (event === 'message') capturedCallback = cb;
    });

    const fakeSocket = {
      bind: fake((cb) => {
        cb();
      }),
      on: fakeOn,
      send: fake(),
      close: fake(),
    } as unknown as Socket;

    const fromBuffer = fake.returns({
      oscType: 'message',
      address: testAddress,
      args: testArgs,
    } as const);

    const toBuffer = fake();

    const oscSocket = await createOSCSocket({
      socket: fakeSocket,
      toBuffer,
      fromBuffer,
    });

    const handler1 = spy();
    const handler2 = spy();
    oscSocket.on(testAddress, handler1);
    oscSocket.on(testAddress, handler2);

    oscSocket.off(testAddress);

    const msg = Buffer.from('hello');
    const rinfo = { address: '1.2.3.4', port: 1234, size: 5 };
    capturedCallback!(msg, rinfo);
    assert.strictEqual(fakeOn.calledOnce, true);
    assert.strictEqual(handler1.notCalled, true);
    assert.strictEqual(handler2.notCalled, true);
    assert.strictEqual(fromBuffer.calledOnceWithExactly(msg), true);
  });

  test('should be graceful when removing a non-existing handler', async () => {
    const fakeSocket = {
      bind: fake((cb) => {
        cb();
      }),
      on: fake(),
      send: fake(),
      close: fake(),
    } as unknown as Socket;

    const fromBuffer = fake();

    const toBuffer = fake();

    const oscSocket = await createOSCSocket({
      socket: fakeSocket,
      toBuffer,
      fromBuffer,
    });

    assert.doesNotThrow(() => oscSocket.off('/non-existing-address'));
  });

  test('should throw an error if a non-message OSC packet is received', async () => {
    const testAddress = '/test';
    let capturedCallback;
    const fakeOn = fake((event, cb) => {
      if (event === 'message') capturedCallback = cb;
    });

    const fakeSocket = {
      bind: fake((cb) => {
        cb();
      }),
      on: fakeOn,
      send: fake(),
      close: fake(),
    } as unknown as Socket;

    const fromBuffer = fake.returns({
      oscType: 'bundle' as const,
      timetag: [123, 456] as [number, number],
      elements: [],
    });

    const toBuffer = fake();

    const oscSocket = await createOSCSocket({
      socket: fakeSocket,
      toBuffer,
      fromBuffer,
    });

    assert.throws(() => {
      oscSocket.on(testAddress, () => {});
      const msg = Buffer.from('hello');
      capturedCallback!(msg, {} as RemoteInfo);
    }, /Non-message OSC packet is currently not supported/);
    assert.strictEqual(fakeOn.calledOnce, true);
    assert.strictEqual(fromBuffer.calledOnceWithExactly(Buffer.from('hello')), true);
  });

  test('should set the broadcast flag', async () => {
    const setBroadcast = fake();
    const fakeSocket = {
      bind: fake((cb) => {
        cb();
      }),
      on: fake(),
      send: fake(),
      close: fake(),
      setBroadcast,
    } as unknown as Socket;

    const oscSocket = await createOSCSocket({
      socket: fakeSocket,
      toBuffer: fake(),
      fromBuffer: fake(),
    });

    oscSocket.setBroadcast(true);
    oscSocket.setBroadcast(false);
    assert.strictEqual(setBroadcast.firstCall.calledWithExactly(true), true);
    assert.strictEqual(setBroadcast.secondCall.calledWithExactly(false), true);
  });

  test('should close the socket when close is called', async () => {
    const close = fake();
    const fakeSocket = {
      bind: fake((cb) => {
        cb();
      }),
      on: fake(),
      send: fake(),
      close,
    } as unknown as Socket;

    const oscSocket = await createOSCSocket({
      socket: fakeSocket,
      toBuffer: fake(),
      fromBuffer: fake(),
    });

    await oscSocket.close();
    assert.strictEqual(close.calledOnce, true);
  });
});
