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

    // Fetch portfolio (current holdings)
    const portfolioRes = await fetch(`${SUPABASE_URL}/rest/v1/portfolio?select=*`, { headers });
    const portfolio = await portfolioRes.json();

    // Fetch NLV history
    const nlvRes = await fetch(`${SUPABASE_URL}/rest/v1/net_liquidation_history?select=*&order=date desc&limit=30`, { headers });
    const nlv = await nlvRes.json();

    // Fetch transactions
    const txnRes = await fetch(`${SUPABASE_URL}/rest/v1/transactions?select=*&order=transaction_date desc&limit=20`, { headers });
    const transactions = await txnRes.json();

    // Fetch valuations
    const valRes = await fetch(`${SUPABASE_URL}/rest/v1/valuations?select=*`, { headers });
    const valuations = await valRes.json();

    // Calculate totals
    const totalEquity = Array.isArray(portfolio) ? portfolio.reduce((sum: number, p: any) => sum + (p.equity || p.price * p.quantity || 0), 0) : 0;
    const currentNLV = Array.isArray(nlv) && nlv.length > 0 ? nlv[0].net_liquidation_value : totalEquity;
    const capitalInvested = Array.isArray(nlv) && nlv.length > 0 ? nlv[0].capital_invested || 0 : 0;

    return NextResponse.json({
      portfolio: portfolio || [],
      nlv_history: nlv || [],
      transactions: transactions || [],
      valuations: valuations || [],
      summary: {
        total_equity: totalEquity,
        current_nlv: currentNLV,
        capital_invested: capitalInvested,
        pnl: currentNLV - capitalInvested,
        last_updated: nlv?.[0]?.date || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio data' }, { status: 500 });
  }
}
