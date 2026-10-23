import { z } from 'zod'

export const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const requiredIdSchema = z.string().regex(uuidRegex, 'Invalid UUID')

export const optionalIdSchema = z
  .string()
  .optional()
  .nullable()
  .transform((val) => (val && val.trim() !== '' ? val : undefined))
  .refine((val) => val === undefined || uuidRegex.test(val), {
    message: 'Invalid UUID',
  })
