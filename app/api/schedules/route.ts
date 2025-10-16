import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase'

// Only create Supabase client if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('Supabase environment variables are not properly configured')
}

const supabase = supabaseUrl && supabaseServiceKey && supabaseUrl !== 'https://placeholder.supabase.co'
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching schedules:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { title, description, due_date, user_id } = body

    if (!title || !user_id) {
      return NextResponse.json(
        { error: 'Title and user_id are required' },
        { status: 400 }
      )
    }

    // Try to insert with status first, fallback if column doesn't exist
    let insertData: any = {
      title: title.trim(),
      description: description?.trim() || null,
      due_date: due_date ? new Date(due_date).toISOString() : null,
      user_id,
    }

    // Only add status if it's provided and not the default
    if (body.status && body.status !== 'todo') {
      insertData.status = body.status
    }

    let { data, error } = await supabase
      .from('schedules')
      .insert(insertData)
      .select()
      .single()

    // If status column doesn't exist, try without it
    if (error && error.message.includes('column "status" does not exist')) {
      console.log('Status column not found, inserting without status')
      const result = await supabase
        .from('schedules')
        .insert({
          title: title.trim(),
          description: description?.trim() || null,
          due_date: due_date ? new Date(due_date).toISOString() : null,
          user_id,
        })
        .select()
        .single()
      
      data = result.data
      error = result.error
    }

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating schedule:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { id, title, description, due_date, is_completed, status, user_id } = body

    if (!id || !user_id) {
      return NextResponse.json(
        { error: 'ID and user_id are required' },
        { status: 400 }
      )
    }

    const updateData: any = { user_id }
    
    if (title !== undefined) updateData.title = title.trim()
    if (description !== undefined) updateData.description = description?.trim() || null
    if (due_date !== undefined) updateData.due_date = due_date ? new Date(due_date).toISOString() : null
    if (is_completed !== undefined) updateData.is_completed = is_completed
    if (status !== undefined) updateData.status = status

    let { data, error } = await supabase
      .from('schedules')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user_id)
      .select()
      .single()

    // If status column doesn't exist, try without it
    if (error && error.message.includes('column "status" does not exist')) {
      console.log('Status column not found, updating without status')
      const updateDataWithoutStatus = { ...updateData }
      delete updateDataWithoutStatus.status
      
      const result = await supabase
        .from('schedules')
        .update(updateDataWithoutStatus)
        .eq('id', id)
        .eq('user_id', user_id)
        .select()
        .single()
      
      data = result.data
      error = result.error
    }

    if (error) throw error

    if (!data) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating schedule:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'ID and userId are required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting schedule:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
