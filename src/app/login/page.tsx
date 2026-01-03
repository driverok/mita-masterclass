'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid username or password')
      } else {
        router.push('/issues')
        router.refresh()
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">MITA</h1>
          <h2 className="mt-2 text-center text-xl text-gray-600">
            Mini Issue Tracker
          </h2>
          <p className="mt-4 text-center text-sm text-gray-500">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-500">
              Register
            </Link>
          </p>
        </form>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            <strong>Demo credentials:</strong><br />
            Username: demo<br />
            Password: demo123
          </p>
        </div>
      </div>
    </div>
  )
}
