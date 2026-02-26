import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
    try {
        // Simple connectivity test — tries to query the Supabase API
        const { data, error } = await supabase.from('clients').select('*').limit(1)

        if (error) {
            return NextResponse.json(
                { status: 'error', message: error.message, hint: error.hint },
                { status: 500 }
            )
        }

        return NextResponse.json({
            status: 'connected',
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
            rowsReturned: data?.length ?? 0,
            data,
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        return NextResponse.json(
            { status: 'error', message },
            { status: 500 }
        )
    }
}
