import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const partyActivityPath = path.join(process.cwd(), 'state', 'party_activity.json');
    const partyData = JSON.parse(fs.readFileSync(partyActivityPath, 'utf-8'));
    
    return NextResponse.json(partyData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load party data' }, { status: 500 });
  }
}
