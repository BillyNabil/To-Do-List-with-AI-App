'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface Schedule {
  id: string
  title: string
  description: string | null
  due_date: string | null
  is_completed: boolean
  created_at: string
}

interface ScheduleItemProps {
  schedule: Schedule
  onUpdate: () => void
  onDelete: () => void
}

export function ScheduleItem({ schedule, onUpdate, onDelete }: ScheduleItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(schedule.title)
  const [editDescription, setEditDescription] = useState(schedule.description || '')
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: schedule.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleToggleComplete = async () => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update({ is_completed: !schedule.is_completed })
        .eq('id', schedule.id)

      if (error) throw error
      onUpdate()
    } catch (error) {
      console.error('Error toggling completion:', error)
    }
  }

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update({
          title: editTitle,
          description: editDescription || null,
        })
        .eq('id', schedule.id)

      if (error) throw error
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error('Error updating schedule:', error)
    }
  }

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true)
      return
    }

    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', schedule.id)

      if (error) throw error
      onDelete()
    } catch (error) {
      console.error('Error deleting schedule:', error)
    }
  }

  const isOverdue = schedule.due_date && new Date(schedule.due_date) < new Date() && !schedule.is_completed

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`card p-4 cursor-move transition-all duration-200 ${
        isDragging ? 'shadow-lg ring-2 ring-gray-900 dark:ring-gray-100' : ''
      } ${isOverdue ? 'border-red-300 dark:border-red-600' : ''}`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
            autoFocus
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <button
              onClick={handleToggleComplete}
              className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                schedule.is_completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 dark:border-gray-500 hover:border-green-500'
              }`}
            >
              {schedule.is_completed && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <div className="flex-1">
              <h4 className={`font-medium text-gray-900 dark:text-gray-100 ${
                schedule.is_completed ? 'line-through opacity-60' : ''
              }`}>
                {schedule.title}
              </h4>
              
              {schedule.description && (
                <p className={`text-sm text-gray-600 dark:text-gray-300 mt-1 ${
                  schedule.is_completed ? 'line-through opacity-60' : ''
                }`}>
                  {schedule.description}
                </p>
              )}
              
              {schedule.due_date && (
                <div className={`text-xs mt-2 ${
                  isOverdue 
                    ? 'text-red-600 dark:text-red-400 font-medium'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Due: {format(new Date(schedule.due_date), 'MMM d, yyyy h:mm a')}
                  {isOverdue && ' (Overdue)'}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className={`text-xs px-2 py-1 ${
                isDeleting 
                  ? 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              {isDeleting ? 'Confirm?' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
