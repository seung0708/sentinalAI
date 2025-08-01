import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/dashboard'
  
    if (token_hash && type) {
      const supabase = await createClient()
      const { error } = await supabase.auth.verifyOtp({ token_hash, type })
  
      if (!error) {
        return NextResponse.redirect(new URL(next, request.url))
      }
    }
  
    return NextResponse.redirect(new URL('/error', request.url))
}