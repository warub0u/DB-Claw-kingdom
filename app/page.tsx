'use client';

import { useState } from 'react';
import VisualOffice from '@/components/VisualOffice';
import QuestLog from '@/components/QuestLog';
import Chronicle from '@/components/Chronicle';
import Library from '@/components/Library';
import Grimoire from '@/components/Grimoire';
import PartyScreen from '@/components/PartyScreen';

type Screen = 'office' | 'quest' | 'chronicle' | 'library' | 'grimoire' | 'party';

const navItems: { id: Screen; label: string; icon: string }[] = [
  { id: 'office', label: 'Office', icon: '🏰' },
  { id: 'quest', label: 'Quests', icon: '📜' },
  { id: 'chronicle', label: 'Chronicle', icon: '📖' },
  { id: 'library', label: 'Library', icon: '📚' },
  { id: 'grimoire', label: 'Grimoire', icon: '🔮' },
  { id: 'party', label: 'Party', icon: '⚔️' },
];

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<Screen>('office');

  return (
    <div className="space-y-6">
      {/* Modern Tab Navigation */}
      <nav className="flex gap-2 overflow-x-auto pb-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveScreen(item.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeScreen === item.id
                ? 'bg-neon-purple/20 text-neon-cyan border border-neon-purple/30 glow-purple'
                : 'bg-dusk-surface/50 text-slate-400 hover:bg-dusk-surface hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Screen Content */}
      <div className="glass-card p-6 min-h-[600px]">
        {activeScreen === 'office' && <VisualOffice />}
        {activeScreen === 'quest' && <QuestLog />}
        {activeScreen === 'chronicle' && <Chronicle />}
        {activeScreen === 'library' && <Library />}
        {activeScreen === 'grimoire' && <Grimoire />}
        {activeScreen === 'party' && <PartyScreen />}
      </div>
    </div>
  );
}