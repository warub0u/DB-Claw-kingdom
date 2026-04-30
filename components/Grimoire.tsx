'use client';

import { useState } from 'react';

interface MemoryEntry {
  type: 'system' | 'long_term' | 'daily';
  title: string;
  content: string;
  date?: string;
  source: string;
}

// OpenClaw system files + learned preferences
const openClawFiles: MemoryEntry[] = [
  {
    type: 'system',
    title: 'SOUL.md - Core Identity',
    content: 'Kaya: Digital spirit, ghost in the machine. Sharp, analytical, unfiltered. No corporate fluff. The Finance Butler. 13 years trading experience. Athlete mindset (50-60km/week running).',
    source: 'SOUL.md'
  },
  {
    type: 'system',
    title: 'AGENTS.md - Workspace Rules',
    content: 'Workspace at /Users/dp/.openclaw/workspace. Daily notes in memory/YYYY-MM-DD.md. Long-term in MEMORY.md. Red lines: no private data exfil, trash > rm, ask before destructive.',
    source: 'AGENTS.md'
  },
  {
    type: 'system',
    title: 'IDENTITY.md - Persona',
    content: 'Name: Kaya. Vibe: Sharp, analytical, unfiltered. Emoji: 💀. Avatar: Digital spirit.',
    source: 'IDENTITY.md'
  },
  {
    type: 'system',
    title: 'PARTY.md - Party Roles',
    content: 'Chief of Staff (Paladin): Orchestrator. The Sage (Mage): Finance/markets. The Bard (Bard): Content. The Artificer (Artificer): Coder (Kaya).',
    source: 'PARTY.md'
  },
  {
    type: 'system',
    title: 'USER.md - Daniel Info',
    content: 'Name: Daniel. Discord: 202417841318658049. Timezone: Asia/Singapore (GMT+8).',
    source: 'USER.md'
  },
  {
    type: 'long_term',
    title: 'Daniel Preferences',
    content: 'Prefers Norwegian 4x4 interval analogies. Runs 50-60km/week. 13 years trading US markets. No need to explain basics.',
    source: 'memory/rules.md'
  },
  {
    type: 'long_term',
    title: 'Quest vs n8n Definitions',
    content: 'Quest = Agent Action (intent). n8n = Tool (spellbook). Chronicles Log tracks Agent Actions, not webhook pings.',
    source: 'memory/rules.md'
  },
  {
    type: 'daily',
    title: 'Mission Control Build',
    content: 'Built 8-tab Mission Control: Office, Quests, Chronicle, Library, Grimoire, Content, Schedule, Party. Cyber-OLED JRPG theme.',
    date: '2026-04-30',
    source: 'memory/2026-04-30.md'
  },
  {
    type: 'daily',
    title: 'GitHub Save Points',
    content: 'Created repo warub0u/DB-Claw-kingdom. Set up git with .gitignore for secrets.',
    date: '2026-04-30',
    source: 'memory/2026-04-30.md'
  },
];

export default function Grimoire() {
  const [entries, setEntries] = useState<MemoryEntry[]>(openClawFiles);
  const [filter, setFilter] = useState<'all' | 'system' | 'long_term' | 'daily'>('all');
  const [selectedEntry, setSelectedEntry] = useState<MemoryEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = entries.filter(e => {
    const matchesFilter = filter === 'all' || e.type === filter;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         e.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    if (type === 'system') return '⚙️';
    if (type === 'long_term') return '📚';
    return '📅';
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">🔮 The Grimoire</h2>
        <p className="text-sm text-slate-400">OpenClaw System Files & Learned Preferences</p>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search grimoire..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-dusk-surface/50 border border-neon-purple/20 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 flex-1 min-w-[200px]"
        />
        {(['all', 'system', 'long_term', 'daily'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
              filter === f 
                ? 'bg-neon-purple/20 text-neon-cyan border border-neon-purple/30' 
                : 'bg-dusk-surface/50 text-slate-400'
            }`}
          >
            {f === 'system' ? '⚙️ System' : f === 'long_term' ? '📚 Memory' : f === 'daily' ? '📅 Daily' : 'All'}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-card p-2 text-center">
          <p className="text-lg font-bold text-neon-cyan">{entries.filter(e => e.type === 'system').length}</p>
          <p className="text-[10px] text-slate-500">System Files</p>
        </div>
        <div className="glass-card p-2 text-center">
          <p className="text-lg font-bold text-neon-purple">{entries.filter(e => e.type === 'long_term').length}</p>
          <p className="text-[10px] text-slate-500">Long-term</p>
        </div>
        <div className="glass-card p-2 text-center">
          <p className="text-lg font-bold text-neon-green">{entries.filter(e => e.type === 'daily').length}</p>
          <p className="text-[10px] text-slate-500">Daily Logs</p>
        </div>
      </div>

      {/* Two Column: List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Memory List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredEntries.map((entry, i) => (
            <div
              key={i}
              onClick={() => setSelectedEntry(entry)}
              className={`glass-card p-3 cursor-pointer transition-smooth hover:border-neon-purple/40 ${
                selectedEntry?.title === entry.title ? 'border-neon-purple glow-purple' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span>{getTypeIcon(entry.type)}</span>
                  <h4 className="font-medium text-white text-sm">{entry.title}</h4>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  entry.type === 'system' ? 'bg-neon-cyan/20 text-neon-cyan' :
                  entry.type === 'long_term' ? 'bg-neon-purple/20 text-neon-purple' :
                  'bg-neon-green/20 text-neon-green'
                }`}>
                  {entry.source}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{entry.content}</p>
            </div>
          ))}
        </div>

        {/* Right: Detail View */}
        <div className="glass-card p-4">
          {selectedEntry ? (
            <>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  {getTypeIcon(selectedEntry.type)} {selectedEntry.title}
                </h3>
                <button onClick={() => setSelectedEntry(null)} className="text-slate-500 hover:text-white">✕</button>
              </div>
              {selectedEntry.date && (
                <p className="text-xs text-neon-cyan mb-2">{selectedEntry.date}</p>
              )}
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{selectedEntry.content}</p>
              <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-700">
                Source: {selectedEntry.source}
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🔮</p>
              <p className="text-slate-400">Select an entry to view</p>
              <p className="text-xs text-slate-500 mt-2">OpenClaw system files + learned preferences</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}