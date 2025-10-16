'use client'

import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { ScheduleItem } from '@/components/ScheduleItem'

// Droppable Column Component
function DroppableColumn({ id, title, children, schedules }: { 
  id: ColumnType
  title: string
  children: React.ReactNode
  schedules: Schedule[]
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 transition-all duration-200 border-2 border-gray-200 dark:border-gray-700 ${
        isOver ? 'ring-2 ring-gray-900 dark:ring-gray-100 bg-gray-100 dark:bg-gray-800' : ''
      }`}
    >
      <h3 className="font-semibold text-lg mb-6 text-gray-900 dark:text-gray-50">
        {title} ({schedules.length})
      </h3>
      {children}
    </div>
  )
}

interface Schedule {
  id: string
  title: string
  description: string | null
  due_date: string | null
  is_completed: boolean
  status: 'todo' | 'inProgress' | 'completed'
  created_at: string
}

type ColumnType = 'todo' | 'inProgress' | 'completed'

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'inProgress', title: 'In Progress' },
  { id: 'completed', title: 'Completed' }
]

interface SimpleKanbanBoardProps {
  refreshKey?: number
  searchQuery?: string
}

export function SimpleKanbanBoard({ refreshKey, searchQuery = '' }: SimpleKanbanBoardProps) {
  const { user } = useAuth()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    if (user) {
      fetchSchedules()
    }
  }, [user, refreshKey])


  const fetchSchedules = async () => {
    try {
      console.log('Fetching schedules for user:', user?.id)
      
      // First try the simple query without status column
      let { data, error } = await supabase
        .from('schedules')
        .select('id, title, description, due_date, is_completed, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error in simple query:', error)
        throw error
      }

      console.log('Fetched data:', data)

      // Add status field based on is_completed
      const dataWithStatus = data?.map(item => ({
        ...item,
        status: (item.is_completed ? 'completed' : 'todo') as 'todo' | 'inProgress' | 'completed'
      })) || []

      console.log('Data with status:', dataWithStatus)
      setSchedules(dataWithStatus)
    } catch (error) {
      console.error('Error fetching schedules:', error)
      // Set empty array on error to prevent infinite loading
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Add visual feedback
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeSchedule = schedules.find(s => s.id === active.id)
    if (!activeSchedule) return

    // Determine the target column
    let targetColumn: ColumnType
    if (over.id === 'completed') {
      targetColumn = 'completed'
    } else if (over.id === 'inProgress') {
      targetColumn = 'inProgress'
    } else {
      targetColumn = 'todo'
    }

    // Update both status and is_completed
    const newIsCompleted = targetColumn === 'completed'
    const newStatus = targetColumn

    if (activeSchedule.status !== newStatus || activeSchedule.is_completed !== newIsCompleted) {
      try {
        const response = await fetch('/api/schedules', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: activeSchedule.id,
            status: newStatus,
            is_completed: newIsCompleted,
            user_id: user?.id,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update task')
        }

        setSchedules(prev =>
          prev.map(schedule =>
            schedule.id === activeSchedule.id
              ? { ...schedule, status: newStatus, is_completed: newIsCompleted }
              : schedule
          )
        )
      } catch (error) {
        console.error('Error updating schedule:', error)
      }
    }
  }

  const getSchedulesByColumn = (columnId: ColumnType) => {
    const filteredSchedules = schedules.filter(schedule => {
      const matchesColumn = schedule.status === columnId
      const matchesSearch = searchQuery === '' || 
        schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (schedule.description && schedule.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesColumn && matchesSearch
    })
    return filteredSchedules
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading schedules...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => {
            const columnSchedules = getSchedulesByColumn(column.id as ColumnType)
            
            return (
              <DroppableColumn
                key={column.id}
                id={column.id as ColumnType}
                title={column.title}
                schedules={columnSchedules}
              >
                <SortableContext
                  items={columnSchedules.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {columnSchedules.map(schedule => (
                      <ScheduleItem
                        key={schedule.id}
                        schedule={schedule}
                        onUpdate={() => fetchSchedules()}
                        onDelete={() => fetchSchedules()}
                      />
                    ))}
                    {columnSchedules.length === 0 && (
                      <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No tasks in {column.title.toLowerCase()}
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DroppableColumn>
            )
          })}
        </div>
        
        <DragOverlay>
          {activeId ? (
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 transform rotate-2 opacity-90">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {schedules.find(s => s.id === activeId)?.title || 'Task'}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
