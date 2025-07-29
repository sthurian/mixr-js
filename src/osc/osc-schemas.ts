import { z } from 'zod';

export const oscIntegerArgumentSchema = z.object({
  type: z.literal('integer'),
  value: z.number().int(),
});

export const oscFloatArgumentSchema = z.object({
  type: z.literal('float'),
  value: z.float32(),
});

export const oscStringArgumentSchema = z.object({
  type: z.literal('string'),
  value: z.string(),
});

export const oscArgumentSchema = z.discriminatedUnion('type', [
  oscIntegerArgumentSchema,
  oscFloatArgumentSchema,
  oscStringArgumentSchema,
]);
export const oscArgumentListSchema = z.array(oscArgumentSchema);
export const oscArgumentValueSchema = oscArgumentSchema.transform((data) => data.value);

export type OscArgument = z.infer<typeof oscArgumentSchema>;
export type OscArgumentValue = z.infer<typeof oscArgumentValueSchema>;
export type OscArgumentList = z.infer<typeof oscArgumentListSchema>;
