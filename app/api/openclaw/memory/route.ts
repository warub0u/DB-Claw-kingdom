import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const WORKSPACE = '/Users/dp/.openclaw/workspace';

export async function GET() {
  try {
    const files = ['SOUL.md', 'IDENTITY.md', 'AGENTS.md', 'USER.md', 'TOOLS.md', 'MEMORY.md'];
    const entries = [];

    for (const file of files) {
      const filePath = path.join(WORKSPACE, file);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const summary = content.substring(0, 200).replace(/[#*_\n]/g, ' ').trim() + '...';
        
        entries.push({
          type: file === 'SOUL.md' || file === 'IDENTITY.md' ? 'character' : 
                file === 'MEMORY.md' ? 'memory' : 'system',
          title: file.replace('.md', ''),
          content: summary,
          source: file,
          fullContent: content.slice(0, 5000),
        });
      } catch (e) {
        // File not found, skip
      }
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Memory fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch memory files' }, { status: 500 });
  }
}
