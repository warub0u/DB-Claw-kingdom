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

    const kbRes = await fetch(`${SUPABASE_URL}/rest/v1/knowledge_base?select=id,document_name,asset_class,ai_summary,doc_type,resource_source&limit=50`, { headers });
    const knowledge_base = await kbRes.json();

    const watchlistRes = await fetch(`${SUPABASE_URL}/rest/v1/watchlist?select=*`, { headers });
    const watchlist = await watchlistRes.json();

    const valRes = await fetch(`${SUPABASE_URL}/rest/v1/valuations?select=*`, { headers });
    const valuations = await valRes.json();

    return NextResponse.json({
      knowledge_base: knowledge_base || [],
      watchlist: watchlist || [],
      valuations: valuations || [],
    });
  } catch (error) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch knowledge data' }, { status: 500 });
  }
}
