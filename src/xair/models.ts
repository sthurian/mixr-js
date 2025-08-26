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

type XR16Channel = XR12Channel | 'CH11' | 'CH12' | 'CH13' | 'CH14';
type XR18Channel = XR16Channel | 'CH15' | 'CH16';

const mixerModels = ['XR12', 'XR16', 'XR18'] as const;
export type MixerModel = (typeof mixerModels)[number];

type MixerConfigMap = {
  XR12: {
    channel: XR12Channel;
  };
  XR16: {
    channel: XR16Channel;
  };
  XR18: {
    channel: XR18Channel;
  };
};

export type MixerModelMap = {
  [M in keyof MixerConfigMap]: MixerConfigMap[M]['channel'];
};

export function isMixerModel(model: string): model is MixerModel {
  return mixerModels.includes(model as MixerModel);
}
