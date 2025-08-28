type XR12Channel =
  | 'CH01'
  | 'CH02'
  | 'CH03'
  | 'CH04'
  | 'CH05'
  | 'CH06'
  | 'CH07'
  | 'CH08'
  | 'CH09'
  | 'CH10';

type XR12Bus = 'Bus1' | 'Bus2';
type XR16Bus = XR12Bus | 'Bus3' | 'Bus4';
type XR18Bus = XR16Bus | 'Bus5' | 'Bus6';

type XR16Channel = XR12Channel | 'CH11' | 'CH12' | 'CH13' | 'CH14';
type XR18Channel = XR16Channel | 'CH15' | 'CH16';

const mixerModels = ['XR12', 'XR16', 'XR18'] as const;
export type MixerModel = (typeof mixerModels)[number];

type MixerConfigMap = {
  XR12: {
    channel: XR12Channel;
    bus: XR12Bus;
  };
  XR16: {
    channel: XR16Channel;
    bus: XR16Bus;
  };
  XR18: {
    channel: XR18Channel;
    bus: XR18Bus;
  };
};

export type MixerModelMap = {
  [M in keyof MixerConfigMap]: MixerConfigMap[M];
};

export function isMixerModel(model: string): model is MixerModel {
  return mixerModels.includes(model as MixerModel);
}
