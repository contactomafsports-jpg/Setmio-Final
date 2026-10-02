import { NextResponse } from 'next/server';

const allowedActions = new Set(['list_availability', 'create_booking', 'cancel_booking']);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const action = typeof payload?.action === 'string' ? payload.action : '';
    const clubSlug = typeof payload?.clubSlug === 'string' ? payload.clubSlug : '';
    if (!clubSlug || !allowedActions.has(action)) return NextResponse.json({ error: 'Solicitud no válida' }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 });

    const headers = { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' };
    if (action === 'list_availability') {
      const date = typeof payload.date === 'string' ? payload.date : new Date().toISOString().slice(0, 10);
      const response = await fetch(`${supabaseUrl}/rest/v1/bookings?tenant_slug=eq.${encodeURIComponent(clubSlug)}&start_time=gte.${encodeURIComponent(date)}&select=id,court_id,start_time,end_time,status`, { headers, cache: 'no-store' });
      return NextResponse.json(await response.json(), { status: response.status });
    }

    const bookingId = typeof payload.bookingId === 'string' ? payload.bookingId : '';
    if (action === 'cancel_booking' && !bookingId) return NextResponse.json({ error: 'bookingId requerido' }, { status: 400 });
    const response = action === 'cancel_booking'
      ? await fetch(`${supabaseUrl}/rest/v1/bookings?id=eq.${encodeURIComponent(bookingId)}&tenant_slug=eq.${encodeURIComponent(clubSlug)}`, { method: 'PATCH', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify({ status: 'canceled' }) })
      : await fetch(`${supabaseUrl}/rest/v1/bookings`, { method: 'POST', headers: { ...headers, Prefer: 'return=representation' }, body: JSON.stringify({ ...payload.booking, tenant_slug: clubSlug }) });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 });
  }
}
