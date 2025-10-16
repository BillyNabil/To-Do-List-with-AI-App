'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface AddScheduleFormProps {
  onScheduleAdded: () => void
}

export function AddScheduleForm({ onScheduleAdded }: AddScheduleFormProps) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !title.trim()) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('schedules')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        })

      if (error) throw error

      // Reset form
      setTitle('')
      setDescription('')
      setDueDate('')
      
      onScheduleAdded()
    } catch (error) {
      console.error('Error creating schedule:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-50">
        Add New Task
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field w-full"
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field w-full resize-none"
            placeholder="Enter task description (optional)"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Due Date
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  )
}
