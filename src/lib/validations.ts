import { z } from 'zod'

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const issueCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be at most 2000 characters'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional().default('MEDIUM'),
})

export const issueUpdateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters')
    .optional(),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be at most 2000 characters')
    .optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
})

// Status transition validation
export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['DONE'],
  DONE: ['OPEN'],
}

export function isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
  if (currentStatus === newStatus) return true
  return VALID_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false
}

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type IssueCreateInput = z.infer<typeof issueCreateSchema>
export type IssueUpdateInput = z.infer<typeof issueUpdateSchema>
