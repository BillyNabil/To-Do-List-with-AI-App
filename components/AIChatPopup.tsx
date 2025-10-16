'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIChatPopup({ onScheduleCreated }: { onScheduleCreated: () => void }) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const clearChat = () => {
    setMessages([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading || !user) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/parse-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim() }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to process request')
      }

        // Handle the parsed schedule data
      if (Array.isArray(result)) {
        // Multiple schedules
        const schedulePromises = result.map(async (schedule) => {
          const response = await fetch('/api/schedules', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: schedule.title,
              description: schedule.description || null,
              due_date: schedule.due_date || null,
              user_id: user.id,
            }),
          })
          return response.json()
        })

        await Promise.all(schedulePromises)
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I've created ${result.length} tasks for you:\n\n${result.map((s, i) => 
            `${i + 1}. **${s.title}**${s.due_date ? ` (Due: ${new Date(s.due_date).toLocaleDateString()})` : ''}`
          ).join('\n')}`,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, assistantMessage])
        onScheduleCreated()
      } else if (result.title) {
        // Single schedule
        const response = await fetch('/api/schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: result.title,
            description: result.description || null,
            due_date: result.due_date || null,
            user_id: user.id,
          }),
        })

        if (response.ok) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I've created the task "**${result.title}**" for you${result.due_date ? ` (Due: ${new Date(result.due_date).toLocaleDateString()})` : ''}.`,
            timestamp: new Date()
          }
          
          setMessages(prev => [...prev, assistantMessage])
          onScheduleCreated()
        }
      }
    } catch (error) {
      console.error('Error processing message:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I had trouble understanding that. Could you try rephrasing your request? For example: "Schedule a meeting for tomorrow at 2 PM" or "Create a task to finish the project by Friday".',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <div className="card w-[calc(100vw-2rem)] h-[80vh] sm:w-96 sm:h-[600px] flex flex-col shadow-2xl fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                AI Schedule Assistant
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Ask me to create tasks
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Clear chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <div className="mb-3">
                  <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-sm">Try asking me to create tasks:</p>
                <div className="mt-2 text-xs space-y-1">
                  <p>"Meeting tomorrow at 2 PM"</p>
                  <p>"Finish project by Friday"</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-black text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to create a task..."
                className="input-field flex-1 text-sm py-2 px-3"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="btn-primary px-3 py-2 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Floating Button */
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="max-w-0 overflow-hidden group-hover:max-w-[80px] sm:group-hover:max-w-xs transition-all duration-300">
              <span className="pl-0 pr-0 group-hover:px-2 whitespace-nowrap text-xs sm:text-sm">
                AI
              </span>
            </span>
          </div>
        </button>
      )}
    </div>
  )
}
