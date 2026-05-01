'use server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getEnvVar(key: string): string {
  // Try env var first
  if (process.env[key]) return process.env[key]!;
  // Try .env.local
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(new RegExp(`^${key}=(.+)$`, 'm'));
    return match ? match[1] : '';
  } catch {
    return '';
  }
}

const SUPABASE_URL = 'https://aigwegrqrxquqbjfjcyg.supabase.co';
const SUPABASE_KEY = getEnvVar('SUPABASE_SERVICE_ROLE_SECRET');

export async function GET() {
  if (!SUPABASE_KEY) {
    return NextResponse.json({ error: 'Missing secret' }, { status: 500 });
  }

  try {
    const headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
    };

    // Fetch portfolio
    const portfolioRes = await fetch(`${SUPABASE_URL}/rest/v1/portfolio?select=*`, { headers });
    const portfolio = await portfolioRes.json();

    // Calculate from portfolio data
    let totalEquity = 0;
    let capitalInvested = 0;

    if (Array.isArray(portfolio)) {
      for (const p of portfolio) {
        if (p.status !== 'Closed') {
          const value = p.current_price && p.quantity 
            ? p.current_price * p.quantity 
            : p.option_value || 0;
          totalEquity += value;
          
          if (p.capital_invested) {
            capitalInvested += p.capital_invested;
          } else if (p.buy_price && p.quantity && p.buy_price > 0) {
            capitalInvested += p.buy_price * p.quantity;
          }
        }
      }
    }

    // Get latest NLV from history if available
    let currentNLV = totalEquity;
    try {
      const nlvRes = await fetch(`${SUPABASE_URL}/rest/v1/net_liquidation_history?select=net_liquidation_value&order=recorded_at.desc&limit=1`, { headers });
      const nlv = await nlvRes.json();
      if (nlv?.[0]?.net_liquidation_value) {
        currentNLV = nlv[0].net_liquidation_value;
      }
    } catch {}

    return NextResponse.json({
      portfolio,
      summary: {
        total_equity: totalEquity,
        current_nlv: currentNLV,
        capital_invested: capitalInvested,
        pnl: currentNLV - capitalInvested,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
