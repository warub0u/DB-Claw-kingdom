'use client';

import { useState, useEffect } from 'react';
import InteractiveChart from './InteractiveChart';

interface PartyMember {
  name: string;
  role: string;
  class: string;
  status: 'active' | 'idle' | 'sleeping';
  quest: string;
  icon: string;
  spriteIdle: string;
  spriteAction: string;
  animation: 'idle' | 'action';
  lastAction?: string;
  lastActionTime?: string;
  errorCount?: number;
}

// Party members with new sprites
const partyMembers: PartyMember[] = [
  { name: 'Chief of Staff', role: 'Paladin', class: '🛡️', status: 'active', quest: 'Orchestrating workflows', icon: '🛡️', spriteIdle: '/sprites/party/full/paladin_200.gif', spriteAction: '/sprites/party/full/paladin_200.gif', animation: 'idle', lastAction: 'Consolidated morning reports', lastActionTime: '09:00', errorCount: 0 },
  { name: 'The Sage', role: 'Mage', class: '🔮', status: 'active', quest: 'Calculating IV', icon: '🔮', spriteIdle: '/sprites/party/full/wizard_200.gif', spriteAction: '/sprites/party/full/wizard_200.gif', animation: 'action', lastAction: 'IV calculations complete', lastActionTime: '08:30', errorCount: 1 },
  { name: 'The Bard', role: 'Bard', class: '🎭', status: 'active', quest: 'Generating content', icon: '🎭', spriteIdle: '/sprites/party/full/bard_200.gif', spriteAction: '/sprites/party/full/bard_200.gif', animation: 'idle', lastAction: 'Newsletter draft ready', lastActionTime: '07:45', errorCount: 0 },
  { name: 'The Artificer', role: 'Artificer', class: '⚙️', status: 'active', quest: 'Building dashboard', icon: '⚙️', spriteIdle: '/sprites/party/full/artificer_200.gif', spriteAction: '/sprites/party/full/artificer_200.gif', animation: 'idle', lastAction: 'Neon Dusk theme applied', lastActionTime: '01:30', errorCount: 0 },
];

const partyActivityLog = [
  { member: 'Chief of Staff', action: 'Consolidated morning reports', time: '2026-04-30 09:00', status: 'active' },
  { member: 'The Sage', action: 'Calculated IV for GOOGL, META, MSFT', time: '2026-04-30 08:30', status: 'active' },
  { member: 'The Bard', action: 'Generated daily newsletter draft', time: '2026-04-30 07:45', status: 'active' },
  { member: 'The Artificer', action: 'Built Mission Control dashboard', time: '2026-04-30 01:30', status: 'active' },
  { member: 'The Sage', action: 'Error: Valuation API timeout', time: '2026-04-29 06:00', status: 'error', error: true },
  { member: 'The Bard', action: 'Published newsletter', time: '2026-04-28 18:00', status: 'completed' },
  { member: 'Chief of Staff', action: 'Orchestrated 13 workflows', time: '2026-04-28 12:00', status: 'active' },
];

export default function VisualOffice() {
  const [currentNLV, setCurrentNLV] = useState<number>(190093);
  const [capital] = useState(140000);
  const roi = ((currentNLV - capital) / capital * 100).toFixed(1);

  const getSpriteUrl = (member: PartyMember) => {
    if (member.animation === 'action') return member.spriteAction;
    return member.spriteIdle;
  };

  const getAnimationClass = (anim: string) => {
    if (anim === 'action') return 'sprite-casting';
    return 'sprite-idle';
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Net Liquidation</p>
          <p className="text-2xl font-bold text-white">
            ${currentNLV.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Capital Deployed</p>
          <p className="text-2xl font-bold text-white">${capital.toLocaleString()}</p>
        </div>
        <div className="glass-card p-5 border-neon-cyan/30 glow-cyan">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total ROI</p>
          <p className="text-2xl font-bold text-neon-cyan">+{roi}%</p>
        </div>
      </div>

      {/* JRPG Sprite Grid - The Guild Hall with Dungeon Background */}
      <div className="glass-card p-5 relative overflow-hidden">
        {/* Dungeon floor tiles background */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ 
            backgroundImage: 'url(/assets/dungeon/sprBrick.png)',
            backgroundSize: '64px 64px',
            backgroundRepeat: 'repeat',
            opacity: 0.5
          }} 
        />
        {/* Catacombs props overlay */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ 
            backgroundImage: 'url(/assets/dungeon/sprPropsCatacombs.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
          }} 
        />
        
        <h3 className="text-sm font-medium text-white mb-4 relative z-10 drop-shadow-md">⚔️ The Guild Hall - Party Members</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {partyMembers.map((member, i) => (
            <div key={i} className="bg-black/40 rounded-xl p-4 text-center border border-slate-700">
              {/* Large Sprite */}
              <div className="relative h-32 flex items-center justify-center mb-2">
                <img 
                  src={getSpriteUrl(member)} 
                  alt={member.name}
                  className="w-32 h-32 object-contain drop-shadow-2xl"
                  style={{ imageRendering: 'pixelated' }}
                />
                {/* Status glow */}
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-2 rounded-full blur-md ${
                  member.status === 'active' ? 'bg-neon-green' : 'bg-slate-500'
                }`} />
                <span className={`absolute top-0 right-0 w-3 h-3 rounded-full ${
                  member.status === 'active' ? 'bg-neon-green pulse-glow' : 'bg-slate-500'
                }`} />
                {/* Action effect */}
                {member.animation === 'action' && (
                  <span className="absolute inset-0 rounded-full animate-ping bg-neon-purple/40" />
                )}
              </div>
              <p className="text-sm font-bold text-white">{member.name}</p>
              <p className="text-xs text-slate-400">{member.role}</p>
              <div className="mt-2 pt-2 border-t border-slate-700/50">
                <p className="text-[10px] text-neon-cyan">{member.quest}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Line Chart */}
      <div className="glass-card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-white">Net Liquidation vs Capital</h3>
          <span className="text-xs text-slate-500">Hover for details</span>
        </div>
        <InteractiveChart />
      </div>

      {/* Party Activity Feed */}
      <div className="glass-card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-white">⚔️ Party Activity Log</h3>
          <span className="text-xs text-neon-cyan">Live</span>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {partyActivityLog.map((activity, i) => (
            <div 
              key={i} 
              className={`flex items-center gap-3 p-2 rounded-lg ${
                activity.error ? 'bg-neon-pink/10 border-l-2 border-neon-pink' : 'bg-dusk-surface/30'
              }`}
            >
              <span className="text-xs text-slate-500 w-20 shrink-0">{activity.time}</span>
              <span className="text-sm text-slate-300 flex-1">{activity.action}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activity.status === 'active' ? 'bg-neon-cyan/20 text-neon-cyan' :
                activity.status === 'error' ? 'bg-neon-pink/20 text-neon-pink' :
                'bg-neon-purple/20 text-neon-purple'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}