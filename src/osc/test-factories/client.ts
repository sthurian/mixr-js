import { Factory } from 'fishery';
import { OSCClient } from '../client.js';
import { fake } from 'sinon';
export const oscClientFactory = Factory.define<OSCClient>(() => {
  return {
    close: fake(),
    query: fake(),
    set: fake(),
  };
});
