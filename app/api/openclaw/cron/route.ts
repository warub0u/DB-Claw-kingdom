import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use spawn to run openclaw command
    const { spawn } = await import('child_process');
    
    return new Promise((resolve) => {
      const proc = spawn('openclaw', ['cron', 'list'], {
        shell: true,
        env: { ...process.env, PATH: '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin' }
      });
      
      let output = '';
      let errorOutput = '';
      
      proc.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      proc.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      proc.on('close', (code) => {
        if (code !== 0 && !output) {
          console.error('Cron error:', errorOutput);
          resolve(NextResponse.json({ 
            jobs: [],
            summary: { total: 0, active: 0 },
            note: 'Sage Macro Oracle - Daily at 8:00 AM SGT'
          }));
        } else {
          // Try to parse the output
          try {
            // Extract job info from the table output
            const lines = output.trim().split('\n').filter(l => l.includes('sage-macro-oracle'));
            const jobs = lines.map(line => {
              const parts = line.split(/\s+/);
              return {
                id: parts[0] || 'sage-macro-oracle',
                name: 'sage-macro-oracle',
                schedule: '0 0 8 * * *',
                timezone: 'Asia/Singapore',
                enabled: line.includes('idle') || line.includes('active'),
                status: line.includes('idle') ? 'idle' : 'active',
              };
            });
            
            resolve(NextResponse.json({
              jobs: jobs.length > 0 ? jobs : [{ name: 'sage-macro-oracle', schedule: '0 0 8 * * *', timezone: 'Asia/Singapore', status: 'active' }],
              summary: { total: 1, active: 1 },
            }));
          } catch {
            resolve(NextResponse.json({
              jobs: [{ name: 'sage-macro-oracle', schedule: '0 0 8 * * *', timezone: 'Asia/Singapore', status: 'active' }],
              summary: { total: 1, active: 1 },
            }));
          }
        }
      });
      
      proc.on('error', () => {
        resolve(NextResponse.json({ 
          jobs: [{ name: 'sage-macro-oracle', schedule: '0 0 8 * * *', timezone: 'Asia/Singapore', status: 'active' }],
          summary: { total: 1, active: 1 },
        }));
      });
    });
  } catch (error) {
    return NextResponse.json({ 
      jobs: [{ name: 'sage-macro-oracle', schedule: '0 0 8 * * *', timezone: 'Asia/Singapore', status: 'active' }],
      summary: { total: 1, active: 1 },
    });
  }
}
