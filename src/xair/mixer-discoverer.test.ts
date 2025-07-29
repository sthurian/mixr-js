import { suite, test } from 'mocha';
import { fake } from 'sinon';
import { createMixerDiscoverer } from './mixer-discoverer.js';
import { createClock } from './clock.js';
import assert from 'node:assert';
import { OscSocket } from '../osc/socket.js';

type TestOscOutputMessage = {
  address: string;
  args: Array<{ type: 'string'; value: string }>;
};
type TestRemoteInfo = { address: string; port: number };

suite('MixerDiscoverer', () => {
  test('should discover mixers', async () => {
    const fakeTimeout = fake((callback) => callback());
    const fakeClock = createClock(fakeTimeout);
    const setBroadcastFake = fake();
    const sendFake = fake.resolves({});
    const closeFake = fake();
    const onFake = fake((_address, handler) => {
      handler(
        {
          address: '/xinfo',
          args: [
            { type: 'string', value: '192.168.1.1' },
            { type: 'string', value: 'XR18-20-04-3D' },
            { type: 'string', value: 'XR18' },
            { type: 'string', value: '1.16' },
          ],
        },
        {
          address: '192.168.1.1',
          port: 10024,
        },
      );
    });
    const fakeOscSocket: OscSocket = {
      on: onFake,
      off: fake(),
      setBroadcast: setBroadcastFake,
      send: sendFake,
      close: closeFake,
    };

    const mixerDiscoverer = createMixerDiscoverer({
      clock: fakeClock,
      socket: fakeOscSocket,
    });

    const result = await mixerDiscoverer.discover();
    assert.deepStrictEqual(result, [
      {
        mixerAddress: '192.168.1.1',
        mixerPort: 10024,
        model: 'XR18',
      },
    ]);
    assert.strictEqual(onFake.calledWith('/xinfo'), true);
    assert.strictEqual(
      sendFake.calledWith({ address: '/xinfo', args: [] }, 10024, '255.255.255.255'),
      true,
    );
    assert.strictEqual(setBroadcastFake.calledWith(true), true);
    assert.strictEqual(setBroadcastFake.calledWith(false), true);
    assert.strictEqual(closeFake.called, true);
  });

  test('should ignore duplicate mixer addresses', async () => {
    const fakeTimeout = fake((callback) => callback());
    const fakeClock = createClock(fakeTimeout);
    const setBroadcastFake = fake();
    const sendFake = fake.resolves({});
    const closeFake = fake();
    let handlerRef: ((msg: TestOscOutputMessage, rinfo: TestRemoteInfo) => void) | undefined;
    const onFake = fake(
      (_address: string, handler: (msg: TestOscOutputMessage, rinfo: TestRemoteInfo) => void) => {
        handlerRef = handler;
      },
    );
    const fakeOscSocket: OscSocket = {
      on: onFake,
      off: fake(),
      setBroadcast: setBroadcastFake,
      send: sendFake,
      close: closeFake,
    };
    const mixerDiscoverer = createMixerDiscoverer({
      clock: fakeClock,
      socket: fakeOscSocket,
    });
    const discoverPromise = mixerDiscoverer.discover();
    assert.ok(handlerRef, 'Handler should be set');
    handlerRef(
      {
        address: '/xinfo',
        args: [
          { type: 'string', value: '192.168.1.1' },
          { type: 'string', value: 'XR18-20-04-3D' },
          { type: 'string', value: 'XR18' },
          { type: 'string', value: '1.16' },
        ],
      },
      { address: '192.168.1.1', port: 10024 },
    );
    handlerRef(
      {
        address: '/xinfo',
        args: [
          { type: 'string', value: '192.168.1.1' },
          { type: 'string', value: 'XR18-20-04-3D' },
          { type: 'string', value: 'XR18' },
          { type: 'string', value: '1.16' },
        ],
      },
      { address: '192.168.1.1', port: 10024 },
    );
    const result = await discoverPromise;
    assert.deepStrictEqual(result, [
      {
        mixerAddress: '192.168.1.1',
        mixerPort: 10024,
        model: 'XR18',
      },
    ]);
  });

  test('should reject if socket.send fails', async () => {
    const fakeTimeout = fake((callback) => callback());
    const fakeClock = createClock(fakeTimeout);
    const setBroadcastFake = fake();
    const sendFake = fake.rejects(new Error('send failed'));
    const closeFake = fake();
    const onFake = fake();
    const fakeOscSocket: OscSocket = {
      on: onFake,
      off: fake(),
      setBroadcast: setBroadcastFake,
      send: sendFake,
      close: closeFake,
    };
    const mixerDiscoverer = createMixerDiscoverer({
      clock: fakeClock,
      socket: fakeOscSocket,
    });
    await assert.rejects(async () => {
      await mixerDiscoverer.discover();
    }, /send failed/);
    assert.strictEqual(closeFake.called, true);
  });

  test('should respect custom timeout', async () => {
    let timeoutValue = 0;
    const fakeTimeout = fake((_cb, timeoutInMilliseconds) => {
      timeoutValue = timeoutInMilliseconds;
      _cb();
    });
    const fakeClock = createClock(fakeTimeout);
    const setBroadcastFake = fake();
    const sendFake = fake.resolves({});
    const closeFake = fake();
    const onFake = fake();
    const fakeOscSocket: OscSocket = {
      on: onFake,
      off: fake(),
      setBroadcast: setBroadcastFake,
      send: sendFake,
      close: closeFake,
    };
    const mixerDiscoverer = createMixerDiscoverer({
      clock: fakeClock,
      socket: fakeOscSocket,
    });
    await mixerDiscoverer.discover({ timeout: 1234 });
    assert.strictEqual(timeoutValue, 1234);
  });

  test('should use custom broadcast address', async () => {
    const fakeTimeout = fake((callback) => callback());
    const fakeClock = createClock(fakeTimeout);
    const setBroadcastFake = fake();
    let usedBroadcast = '';
    const sendFake = fake((_msg, _port, broadcast) => {
      usedBroadcast = broadcast;
      return Promise.resolve();
    });
    const closeFake = fake();
    const onFake = fake();
    const fakeOscSocket: OscSocket = {
      on: onFake,
      off: fake(),
      setBroadcast: setBroadcastFake,
      send: sendFake,
      close: closeFake,
    };
    const mixerDiscoverer = createMixerDiscoverer({
      clock: fakeClock,
      socket: fakeOscSocket,
    });
    await mixerDiscoverer.discover({ broadcastAddress: '10.0.0.255' });
    assert.strictEqual(usedBroadcast, '10.0.0.255');
  });

  test('should throw an error if OSC message parsing fails', async () => {
    const fakeTimeout = fake((callback) => callback());
    const fakeClock = createClock(fakeTimeout);
    const setBroadcastFake = fake();
    const sendFake = fake.resolves({});
    const closeFake = fake();
    const onFake = fake((_address, handler) => {
      handler(
        {
          address: '/xinfo',
          args: ['invalid', 'data'],
        },
        {
          address: '192.168.1.1',
          port: 10024,
        },
      );
    });
    const fakeOscSocket: OscSocket = {
      on: onFake,
      off: fake(),
      setBroadcast: setBroadcastFake,
      send: sendFake,
      close: closeFake,
    };

    const mixerDiscoverer = createMixerDiscoverer({
      clock: fakeClock,
      socket: fakeOscSocket,
    });
    await assert.rejects(async () => {
      await mixerDiscoverer.discover();
    }, /Invalid input: expected object, received string/);
  });
});
