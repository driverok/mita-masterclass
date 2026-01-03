import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { username, password } = result.data

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      )
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
      },
    })

    return NextResponse.json({
      success: true,
      data: { id: user.id, username: user.username },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    )
  }
}
