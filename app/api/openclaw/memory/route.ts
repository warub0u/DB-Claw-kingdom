import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const WORKSPACE = '/Users/dp/.openclaw/workspace';
const BUTLERS_QUEST = '/Users/dp/butlers-quest';

export async function GET() {
  try {
    const workspaceFiles = ['SOUL.md', 'IDENTITY.md', 'AGENTS.md', 'USER.md', 'TOOLS.md', 'MEMORY.md'];
    const entries = [];

    // Read workspace files (character docs)
    for (const file of workspaceFiles) {
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

    // Read Sage agent file
    const sagePath = path.join(BUTLERS_QUEST, 'agents', 'sage.md');
    try {
      const sageContent = fs.readFileSync(sagePath, 'utf8');
      entries.push({
        type: 'agent',
        title: 'The Sage (Agent)',
        content: sageContent.substring(0, 300).replace(/[#*_\n]/g, ' ').trim() + '...',
        source: 'agents/sage.md',
        fullContent: sageContent.slice(0, 8000),
      });
    } catch (e) {
      // Sage file not found
    }

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Memory fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch memory files' }, { status: 500 });
  }
}
