import { createLiteralParameterConfig } from '../../../../mapper/literal.js';

const compressorEnvelopeMap = ['LIN', 'LOG'] as const;

export type CompressorEnvelope = (typeof compressorEnvelopeMap)[number];
export const compressorEnvelopeParameterConfig = createLiteralParameterConfig<
  'envelope',
  CompressorEnvelope
>(compressorEnvelopeMap);
