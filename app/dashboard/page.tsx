'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { SimpleKanbanBoard } from '@/components/SimpleKanbanBoard'
import { AIChatPopup } from '@/components/AIChatPopup'
import { AddTaskModal } from '@/components/AddTaskModal'
import { StatsDashboard } from '@/components/StatsDashboard'
import { SearchBar } from '@/components/SearchBar'
import { useNotifications } from '@/components/NotificationSystem'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme, mounted } = useTheme()
  const router = useRouter()
  const [refreshKey, setRefreshKey] = useState(0)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { addNotification } = useNotifications()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      addNotification({
        type: 'error',
        title: 'Sign Out Error',
        message: 'Failed to sign out. Please try again.'
      })
    }
  }

  const handleTaskCreated = () => {
    setRefreshKey(prev => prev + 1)
    addNotification({
      type: 'success',
      title: 'Task Created',
      message: 'Your task has been created successfully!'
    })
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                  AI Schedule
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>

                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSignOut}
                    className="btn-secondary"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Dashboard */}
          <StatsDashboard />

          {/* Top Section with Search and Button */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                My Tasks
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and track your tasks efficiently
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <SearchBar onSearch={setSearchQuery} />
              
              {/* Add New Task Button */}
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-black dark:bg-white text-white dark:text-black rounded-full px-6 py-2 text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 hover:shadow-md flex items-center justify-center space-x-2 hover-scale"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Kanban Board - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SimpleKanbanBoard refreshKey={refreshKey} searchQuery={searchQuery} />
          </motion.div>

          {/* AI Chat Popup - Floating */}
          <AIChatPopup onScheduleCreated={handleTaskCreated} />
        </main>

        {/* Add Task Modal */}
        <AddTaskModal 
          isOpen={isTaskModalOpen} 
          onClose={() => setIsTaskModalOpen(false)} 
        />
      </div>
    </div>
  )
}
