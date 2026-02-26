import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
    const { error } = await supabase
        .from('overview_snapshots')
        .insert({
            client_id: 'acme-corp',
            date: new Date().toISOString().split('T')[0],
            total_traffic: 99999,
            total_conversions: 999,
            revenue: 999999,
            blended_roas: 9.9,
            karma_growth: 9999
        })

    if (error) {
        return NextResponse.json({ error })
    }

    return NextResponse.json({ success: true })
}
