import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getEnvVar(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'));
    return match ? match[1] : undefined;
  } catch {
    return undefined;
  }
}

const SUPABASE_URL = 'https://aigwegrqrxquqbjfjcyg.supabase.co';
const SUPABASE_KEY = getEnvVar('SUPABASE_SERVICE_ROLE_SECRET');

export async function GET() {
  if (!SUPABASE_KEY) {
    return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_SECRET' }, { status: 500 });
  }

  try {
    const headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/newsletters?select=*&order=publish_date desc&limit=20`, { headers });
    const newsletters = await res.json();

    const published = newsletters?.filter((n: any) => n.status === 'Published') || [];
    const drafts = newsletters?.filter((n: any) => n.status === 'Draft') || [];

    return NextResponse.json({
      newsletters: newsletters || [],
      summary: {
        total: newsletters?.length || 0,
        published: published.length,
        drafts: drafts.length,
      },
    });
  } catch (error) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch newsletters' }, { status: 500 });
  }
}
