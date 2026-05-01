import { NextResponse } from 'next/server';

const N8N_URL = 'https://n8n.danielpzk.com';
const N8N_API_KEY = process.env.N8N_API_KEY;

export async function GET() {
  try {
    const res = await fetch(`${N8N_URL}/api/v1/workflows`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY || '',
      },
    });
    const data = await res.json();

    // Transform to simplified format
    const workflows = (data.data || []).map((w: any) => ({
      id: w.id,
      name: w.name,
      active: w.active,
      updatedAt: w.updatedAt,
      triggerCount: w.triggerCount,
    }));

    const activeCount = workflows.filter((w: any) => w.active).length;

    return NextResponse.json({
      workflows,
      summary: {
        total: workflows.length,
        active: activeCount,
        inactive: workflows.length - activeCount,
      },
    });
  } catch (error) {
    console.error('n8n fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch n8n workflows' }, { status: 500 });
  }
}
