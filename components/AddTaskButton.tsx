'use client'

import { useState } from 'react'
import { AddTaskModal } from '@/components/AddTaskModal'

export function AddTaskButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Floating Add Task Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center group"
        aria-label="Add new task"
      >
        <svg 
          className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 4v16m8-8H4" 
          />
        </svg>
      </button>

      {/* Add Task Modal */}
      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
