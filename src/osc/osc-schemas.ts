import { z } from 'zod';

const oscIntegerArgumentSchema = z.object({
  type: z.literal('integer'),
  value: z.number().int(),
});

const oscFloatArgumentSchema = z.object({
  type: z.literal('float'),
  value: z.float32(),
});

const oscStringArgumentSchema = z.object({
  type: z.literal('string'),
  value: z.string(),
});

const oscArgumentSchema = z.discriminatedUnion('type', [
  oscIntegerArgumentSchema,
  oscFloatArgumentSchema,
  oscStringArgumentSchema,
]);
export const oscArgumentListSchema = z.array(oscArgumentSchema);
export type OscArgument = z.infer<typeof oscArgumentSchema>;
export type OscArgumentValue = OscArgument['value'];
