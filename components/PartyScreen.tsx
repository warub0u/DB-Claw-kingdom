'use client';

import { useState, useEffect } from 'react';

interface PartyMember {
  name: string;
  role: string;
  class: string;
  classIcon: string;
  level: number;
  status: 'active' | 'idle';
  quest: string;
  weapon: string;
}

const partyData: PartyMember[] = [
  {
    name: 'Chief of Staff',
    role: 'Paladin',
    class: 'Strategic lead. Orchestrates the party, delegates quests, and consolidates reports.',
    classIcon: '🛡️',
    level: 13,
    status: 'active',
    quest: 'Orchestrating multi-workflow execution',
    weapon: 'Executive Brief Sword',
  },
  {
    name: 'The Sage',
    role: 'Mage',
    class: 'Master of US/SG markets, stocks, and options. Casts visualization spells.',
    classIcon: '🔮',
    level: 13,
    status: 'active',
    quest: 'Intrinsic value calculations, PMCC strategies',
    weapon: 'Crystal Ball (Recharts)',
  },
  {
    name: 'The Bard',
    role: 'Bard',
    class: 'Translates research into impactful, aesthetically inclined content.',
    classIcon: '🎭',
    level: 5,
    status: 'active',
    quest: 'Newsletter generation, video scriptwriting',
    weapon: 'Pen of Inspiration',
  },
  {
    name: 'The Artificer',
    role: 'Artificer',
    class: 'System Architect. Maintains Next.js frontend, Supabase DB, and n8n automation.',
    classIcon: '⚙️',
    level: 1,
    status: 'active',
    quest: 'Building Mission Control dashboard',
    weapon: 'Keyboard of Debugging',
  },
];

export default function PartyScreen() {
  const [selectedMember, setSelectedMember] = useState<PartyMember | null>(null);
  const [nlv, setNlv] = useState<number>(190092);
  const [capital] = useState(140000);
  const [cashPct, setCashPct] = useState(15); // Mock: 15% cash

  // Calculate HP (Portfolio Health) - based on ROI
  const roi = ((nlv - capital) / capital) * 100;
  const hpPct = Math.min(100, Math.max(0, 50 + (roi / 2))); // Base 50%, scales with ROI

  useEffect(() => {
    // Fetch live NLV
    const fetchNLV = async () => {
      try {
        const res = await fetch('https://aigwegrqrxquqbjfjcyg.supabase.co/rest/v1/net_liquidation_history?select=net_liquidation_value&order=date.desc&limit=1', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZ3dlZ3JxcnhxdXFiamZqY3lnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5NDIwMywiZXhwIjoyMDg3NzcwMjAzfQ.46n16ytgbz5fKfOZ7ljevXuOzA3b1HykeMuAQCzBclo',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZ3dlZ3JxcnhxdXFiamZqY3lnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5NDIwMywiZXhwIjoyMDg3NzcwMjAzfQ.46n16ytgbz5fKfOZ7ljevXuOzA3b1HykeMuAQCzBclo',
          }
        });
        const data = await res.json();
        if (data && data[0]) {
          setNlv(data[0].net_liquidation_value);
        }
      } catch (e) {
        console.error('NLV fetch error:', e);
      }
    };
    fetchNLV();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-white">The Party</h2>
        <p className="text-sm text-slate-400">Your agent crew</p>
      </div>

      {/* Party Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partyData.map((member, i) => (
          <div
            key={i}
            onClick={() => setSelectedMember(member)}
            className={`glass-card p-5 cursor-pointer transition-smooth hover:border-neon-purple/40 ${
              selectedMember?.name === member.name ? 'border-neon-purple glow-purple' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{member.classIcon}</span>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{member.name}</h3>
                    <p className="text-sm text-neon-purple">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">LVL</p>
                    <p className="text-xl font-bold text-neon-gold">{member.level}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan">
                    {member.status === 'active' ? '● Active' : '○ Idle'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Member Details */}
      {selectedMember && (
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white mb-4">{selectedMember.classIcon} {selectedMember.name}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Class</p>
              <p className="text-white">{selectedMember.role}</p>
            </div>
            <div>
              <p className="text-slate-500">Level</p>
              <p className="text-white">{selectedMember.level}</p>
            </div>
            <div>
              <p className="text-slate-500">Current Quest</p>
              <p className="text-white">{selectedMember.quest}</p>
            </div>
            <div>
              <p className="text-slate-500">Weapon</p>
              <p className="text-white">{selectedMember.weapon}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neon-purple/20">
            <p className="text-slate-500 text-xs">Description</p>
            <p className="text-sm text-slate-300 mt-1">{selectedMember.class}</p>
          </div>
        </div>
      )}

      {/* HP/MP Bars - Portfolio Health - CSS Version */}
      <div className="glass-card p-5">
        <h3 className="font-medium text-white mb-4">⚔️ Party Status</h3>
        
        {/* HP Bar - Portfolio Health */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">HP (Portfolio Health)</span>
            <span className="text-neon-green font-medium">{hpPct.toFixed(0)}%</span>
          </div>
          <div className="h-4 bg-dusk-surface/50 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-neon-green/60 to-neon-green transition-all duration-500"
              style={{ width: `${hpPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">NLV: ${nlv.toLocaleString()} / ${capital.toLocaleString()}</p>
        </div>

        {/* MP Bar - Cash/Resources */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">MP (Cash Reserves)</span>
            <span className="text-neon-cyan font-medium">{cashPct}%</span>
          </div>
          <div className="h-4 bg-dusk-surface/50 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-neon-cyan/60 to-neon-cyan transition-all duration-500"
              style={{ width: `${cashPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Available for new positions</p>
        </div>
      </div>

      {/* Party Summary */}
      <div className="glass-card p-5">
        <h3 className="font-medium text-white mb-4">Party Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-neon-cyan">4</p>
            <p className="text-xs text-slate-500">Members</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neon-cyan">4</p>
            <p className="text-xs text-slate-500">Active</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-neon-gold">32</p>
            <p className="text-xs text-slate-500">Combined Level</p>
          </div>
        </div>
      </div>
    </div>
  );
}