'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Stats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  todoTasks: number
  completionRate: number
}

interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  is_completed: boolean
  created_at: string
  status?: string
}

export function StatsDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    todoTasks: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return

        const { data: tasks } = await supabase
          .from('schedules')
          .select('status')
          .eq('user_id', user.id)

        if (tasks) {
          const total = tasks.length
          const completed = tasks.filter((task: { status?: string }) => task.status === 'completed').length
          const inProgress = tasks.filter((task: { status?: string }) => task.status === 'in_progress').length
          const todo = tasks.filter((task: { status?: string }) => task.status === 'todo').length
          const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

          setStats({
            totalTasks: total,
            completedTasks: completed,
            inProgressTasks: inProgress,
            todoTasks: todo,
            completionRate
          })
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card p-6">
            <div className="skeleton h-4 w-20 mb-2 rounded"></div>
            <div className="skeleton h-8 w-12 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 animate-fade-in">
      <div className="card p-6 hover-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {stats.totalTasks}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card p-6 hover-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">To Do</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {stats.todoTasks}
            </p>
          </div>
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card p-6 hover-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {stats.inProgressTasks}
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card p-6 hover-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {stats.completedTasks}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="card p-6 hover-lift">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completion Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {stats.completionRate}%
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
