'use client';

import { useState, useEffect } from 'react';

interface MemoryEntry {
  type: 'long_term' | 'daily';
  title: string;
  content: string;
  date?: string;
  source?: string;
}

// Sample memory data - in production, read from memory.md + memory/*.md
const sampleMemory: MemoryEntry[] = [
  { 
    type: 'long_term', 
    title: 'Daniel Preferences', 
    content: 'Daniel prefers Norwegian 4x4 interval analogies in finance content. He runs 50-60km/week. He has 13 years trading experience.',
    source: 'MEMORY.md'
  },
  { 
    type: 'long_term', 
    title: 'Party Role Definitions', 
    content: 'Paladin = Chief of Staff (orchestrator), Mage = Sage (finance), Bard = Content, Artificer = Kaya (coder)',
    source: 'PARTY.md'
  },
  { 
    type: 'daily', 
    title: 'Mission Control Setup', 
    content: 'Connected Supabase (9 tables), n8n (13 workflows), GitHub repo created. HP/MP bars added to Party Roster.',
    date: '2026-04-30',
    source: 'memory/2026-04-30.md'
  },
  { 
    type: 'daily', 
    title: 'Chronicle Refactor', 
    content: 'Refactored Chronicle to track Agent Actions (Quests), not just n8n pings. Format: > [Agent] completed [Quest]',
    date: '2026-04-30',
    source: 'memory/2026-04-30.md'
  },
  { 
    type: 'daily', 
    title: 'Guild Hall Architecture', 
    content: 'Defined 4 JRPG views: Guild Hall, Party Roster, Quest Schedule, Grand Archives. Cyber-OLED JRPG theme.',
    date: '2026-04-30',
    source: 'memory/2026-04-30.md'
  },
];

export default function Grimoire() {
  const [entries, setEntries] = useState<MemoryEntry[]>(sampleMemory);
  const [filter, setFilter] = useState<'all' | 'long_term' | 'daily'>('all');
  const [selectedEntry, setSelectedEntry] = useState<MemoryEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = entries.filter(e => {
    const matchesFilter = filter === 'all' || e.type === filter;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         e.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">🔮 The Grimoire</h2>
        <p className="text-sm text-slate-400">Internal Memory - Learned Preferences & Daily Logs</p>
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
        {(['all', 'long_term', 'daily'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
              filter === f 
                ? 'bg-neon-purple/20 text-neon-cyan border border-neon-purple/30' 
                : 'bg-dusk-surface/50 text-slate-400'
            }`}
          >
            {f === 'long_term' ? '📚 Long-term' : f === 'daily' ? '📅 Daily' : 'All'}
          </button>
        ))}
      </div>

      {/* Two Column: List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Memory List */}
        <div className="space-y-2">
          {filteredEntries.map((entry, i) => (
            <div
              key={i}
              onClick={() => setSelectedEntry(entry)}
              className={`glass-card p-3 cursor-pointer transition-smooth hover:border-neon-purple/40 ${
                selectedEntry?.title === entry.title ? 'border-neon-purple glow-purple' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-white text-sm">{entry.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{entry.content}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  entry.type === 'long_term' ? 'bg-neon-purple/20 text-neon-purple' : 'bg-neon-cyan/20 text-neon-cyan'
                }`}>
                  {entry.type === 'long_term' ? '📚' : '📅'}
                </span>
              </div>
              {entry.source && (
                <p className="text-[10px] text-slate-500 mt-2">Source: {entry.source}</p>
              )}
            </div>
          ))}
        </div>

        {/* Right: Detail View */}
        <div className="glass-card p-4">
          {selectedEntry ? (
            <>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  {selectedEntry.type === 'long_term' ? '📚' : '📅'} {selectedEntry.title}
                </h3>
                <button onClick={() => setSelectedEntry(null)} className="text-slate-500 hover:text-white">✕</button>
              </div>
              {selectedEntry.date && (
                <p className="text-xs text-neon-cyan mb-2">{selectedEntry.date}</p>
              )}
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{selectedEntry.content}</p>
              {selectedEntry.source && (
                <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-700">Source: {selectedEntry.source}</p>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🔮</p>
              <p className="text-slate-400">Select an entry to view</p>
              <p className="text-xs text-slate-500 mt-2">The Grimoire learns your preferences over time</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-neon-purple">{entries.filter(e => e.type === 'long_term').length}</p>
          <p className="text-[10px] text-slate-500">Long-term Memories</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-neon-cyan">{entries.filter(e => e.type === 'daily').length}</p>
          <p className="text-[10px] text-slate-500">Daily Logs</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-white">{entries.length}</p>
          <p className="text-[10px] text-slate-500">Total Entries</p>
        </div>
      </div>
    </div>
  );
}