import { describe, it, expect } from 'vitest'
import {
  registerSchema,
  loginSchema,
  issueCreateSchema,
  issueUpdateSchema,
  isValidStatusTransition,
} from '@/lib/validations'

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects username shorter than 3 characters', () => {
    const result = registerSchema.safeParse({
      username: 'ab',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 6 characters', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      password: '12345',
    })
    expect(result.success).toBe(false)
  })

  it('rejects username with special characters', () => {
    const result = registerSchema.safeParse({
      username: 'test@user',
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({
      username: 'testuser',
      password: 'password',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty username', () => {
    const result = loginSchema.safeParse({
      username: '',
      password: 'password',
    })
    expect(result.success).toBe(false)
  })

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({
      username: 'testuser',
      password: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('issueCreateSchema', () => {
  it('accepts valid issue data', () => {
    const result = issueCreateSchema.safeParse({
      title: 'Test Issue',
      description: 'This is a test issue',
      priority: 'HIGH',
    })
    expect(result.success).toBe(true)
  })

  it('defaults priority to MEDIUM', () => {
    const result = issueCreateSchema.safeParse({
      title: 'Test Issue',
      description: 'This is a test issue',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.priority).toBe('MEDIUM')
    }
  })

  it('rejects empty title', () => {
    const result = issueCreateSchema.safeParse({
      title: '',
      description: 'Description',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid priority', () => {
    const result = issueCreateSchema.safeParse({
      title: 'Test',
      description: 'Description',
      priority: 'INVALID',
    })
    expect(result.success).toBe(false)
  })
})

describe('issueUpdateSchema', () => {
  it('accepts partial updates', () => {
    const result = issueUpdateSchema.safeParse({
      title: 'Updated Title',
    })
    expect(result.success).toBe(true)
  })

  it('accepts status update', () => {
    const result = issueUpdateSchema.safeParse({
      status: 'IN_PROGRESS',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid status', () => {
    const result = issueUpdateSchema.safeParse({
      status: 'INVALID',
    })
    expect(result.success).toBe(false)
  })
})

describe('isValidStatusTransition', () => {
  it('allows OPEN to IN_PROGRESS', () => {
    expect(isValidStatusTransition('OPEN', 'IN_PROGRESS')).toBe(true)
  })

  it('allows IN_PROGRESS to DONE', () => {
    expect(isValidStatusTransition('IN_PROGRESS', 'DONE')).toBe(true)
  })

  it('allows DONE to OPEN', () => {
    expect(isValidStatusTransition('DONE', 'OPEN')).toBe(true)
  })

  it('allows same status (no change)', () => {
    expect(isValidStatusTransition('OPEN', 'OPEN')).toBe(true)
    expect(isValidStatusTransition('IN_PROGRESS', 'IN_PROGRESS')).toBe(true)
    expect(isValidStatusTransition('DONE', 'DONE')).toBe(true)
  })

  it('rejects OPEN to DONE directly', () => {
    expect(isValidStatusTransition('OPEN', 'DONE')).toBe(false)
  })

  it('rejects IN_PROGRESS to OPEN', () => {
    expect(isValidStatusTransition('IN_PROGRESS', 'OPEN')).toBe(false)
  })

  it('rejects DONE to IN_PROGRESS', () => {
    expect(isValidStatusTransition('DONE', 'IN_PROGRESS')).toBe(false)
  })
})
