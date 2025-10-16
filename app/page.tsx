'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/LoginForm'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting to dashboard...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4 tracking-tight animate-slide-up">
            AI Schedule
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Professional schedule management with AI
          </p>
        </div>
        
        <LoginForm />
        
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-6">
            <div className="card p-6 text-center hover:shadow-md transition-shadow duration-200 hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                AI-Powered
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create schedules using natural language commands
              </p>
            </div>
            
            <div className="card p-6 text-center hover:shadow-md transition-shadow duration-200 hover-lift animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Visual Board
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                intuitive Kanban interface for task management
              </p>
            </div>
            
            <div className="card p-6 text-center hover:shadow-md transition-shadow duration-200 hover-lift animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Secure
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enterprise-grade security for your data
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
