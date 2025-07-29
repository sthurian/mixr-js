import { OSCClient } from '../../../osc/client.js';
import { AsyncGetter, AsyncSetter, createOSCParameterFactory, Unit } from '../../osc-parameter.js';
import { levelParamaterConfig } from '../../mapper/level.js';
import { ChannelFxSendLabel, mapChannelFxSendLabelToNumber } from './mapper/fx-send.js';
import { FxSendTap, fxSendTapParameterConfig } from './mapper/fx-tap.js';
import { onOffParameterConfig } from '../../mapper/on-off.js';

export type ChannelFxSend = {
  fetchIsGroupEnabled: AsyncGetter<Unit<'flag', boolean>, 'integer'>;
  updateGroupEnabled: AsyncSetter<Unit<'flag', boolean>, 'integer'>;

  fetchLevel: AsyncGetter<Unit<'decibels', number>, 'float'>;
  updateLevel: AsyncSetter<Unit<'decibels', number>, 'float'>;

  fetchTap: AsyncGetter<Unit<'tap', FxSendTap>, 'integer'>;
  updateTap: AsyncSetter<Unit<'tap', FxSendTap>, 'integer'>;
};

type ChannelFxSendDependencies = {
  channel: number;
  fx: ChannelFxSendLabel;
  oscClient: OSCClient;
};

export const createChannelFxSend = (dependencies: ChannelFxSendDependencies): ChannelFxSend => {
  const { channel, oscClient, fx } = dependencies;
  const busNumber = mapChannelFxSendLabelToNumber(fx);
  const oscBasePath = `/ch/${channel.toString().padStart(2, '0')}/mix/${busNumber.toString().padStart(2, '0')}`;
  const oscParameterFactory = createOSCParameterFactory(oscClient);
  const grpEnabled = oscParameterFactory.createOSCParameter(
    `${oscBasePath}/grpon`,
    onOffParameterConfig,
  );
  const level = oscParameterFactory.createOSCParameter<Unit<'decibels', number>, 'float'>(
    `${oscBasePath}/level`,
    levelParamaterConfig,
  );
  const tap = oscParameterFactory.createOSCParameter(
    `${oscBasePath}/tap`,
    fxSendTapParameterConfig,
  );

  return {
    fetchIsGroupEnabled: grpEnabled.fetch,
    updateGroupEnabled: grpEnabled.update,
    fetchLevel: level.fetch,
    updateLevel: level.update,
    fetchTap: tap.fetch,
    updateTap: tap.update,
  };
};
