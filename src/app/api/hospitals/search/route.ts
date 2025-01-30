import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const term = searchParams.get('term')

  if (!term) {
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('hospitals')
      .select('id, name')
      .ilike('name', `%${term}%`)
      .limit(10)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error searching hospitals:', error)
    return NextResponse.json({ error: 'Failed to search hospitals' }, { status: 500 })
  }
} 