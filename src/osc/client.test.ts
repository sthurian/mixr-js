import assert from 'node:assert';
import sinon from 'sinon';
import { createOSCClient } from './client.js';
import { OscOutputMessage, OscSocket, RInfo } from './socket.js';
import { beforeEach, suite, test } from 'mocha';

suite('OSCClient', () => {
  let oscSocketMock: sinon.SinonStubbedInstance<OscSocket>;
  const dummyPort = 9000;
  const dummyAddress = '127.0.0.1';

  beforeEach(() => {
    oscSocketMock = {
      on: sinon.stub(),
      off: sinon.stub(),
      send: sinon.stub(),
      close: sinon.stub(),
      setBroadcast: sinon.stub(),
    };
  });

  test('should send the correct OSC message when querying', async () => {
    const osc_address = '/test';
    const response: OscOutputMessage = { address: '/test', args: [{ type: 'integer', value: 42 }] };

    oscSocketMock.on.callsFake((address, cb) => {
      assert.strictEqual(address, osc_address);
      cb(response, { address: 'localhost', port: 1234 });
    });

    const client = createOSCClient({
      oscSocket: oscSocketMock,
      port: dummyPort,
      address: dummyAddress,
    });

    const result = await client.query(osc_address);

    assert.deepStrictEqual(result, response);
    assert.strictEqual(
      oscSocketMock.send.calledWithExactly(
        { address: osc_address, args: [] },
        dummyPort,
        dummyAddress,
      ),
      true,
    );
  });

  test('should only handle a single response even if multiple responses arrive', async () => {
    const osc_address = '/test';
    const response1: OscOutputMessage = {
      address: osc_address,
      args: [{ type: 'integer', value: 42 }],
    };
    const response2: OscOutputMessage = {
      address: osc_address,
      args: [{ type: 'integer', value: 100 }],
    };

    let cb: (msg: OscOutputMessage, rinfo: RInfo) => void;
    oscSocketMock.on.callsFake((_address, callback) => {
      cb = callback;
    });

    const client = createOSCClient({
      oscSocket: oscSocketMock,
      port: dummyPort,
      address: dummyAddress,
    });

    const promise = client.query(osc_address);
    cb!(response1, { address: 'localhost', port: 1234 });
    cb!(response2, { address: 'localhost', port: 1234 });

    const result = await promise;
    assert.strictEqual(result, response1);
  });

  test('should send the correct OSC message when setting a value', async () => {
    const osc_address = '/set/test';
    const values = [{ type: 'integer', value: 42 } as const];

    const client = createOSCClient({
      oscSocket: oscSocketMock,
      port: dummyPort,
      address: dummyAddress,
    });

    await client.set(osc_address, values);

    assert.strictEqual(
      oscSocketMock.send.calledWithExactly(
        { address: osc_address, args: values },
        dummyPort,
        dummyAddress,
      ),
      true,
    );
  });

  test('should call oscSocket.close when close is called', () => {
    const client = createOSCClient({
      oscSocket: oscSocketMock,
      port: dummyPort,
      address: dummyAddress,
    });
    client.close();
    assert.strictEqual(oscSocketMock.close.calledOnce, true);
  });
});
