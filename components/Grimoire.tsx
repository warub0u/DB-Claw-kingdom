'use client';

import { useState, useEffect } from 'react';

interface MemoryEntry {
  type: 'system' | 'long_term' | 'daily' | 'agent' | 'character' | 'memory';
  title: string;
  content: string;
  date?: string;
  source: string;
  fullContent?: string;
}

export default function Grimoire() {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/openclaw/memory')
      .then(res => res.json())
      .then(data => {
        if (data.entries && data.entries.length > 0) {
          setEntries(data.entries);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const [filter, setFilter] = useState<'all' | 'system' | 'long_term' | 'daily' | 'agent'>('all');
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
    if (type === 'agent') return '🔮';
    return '📅';
  };

  const getTypeFilter = (type: string) => {
    if (type === 'system') return '⚙️ System';
    if (type === 'long_term') return '📚 Memory';
    if (type === 'agent') return '🔮 Agent';
    return '📅 Daily';
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">🔮 The Grimoire</h2>
        <p className="text-sm text-slate-400">OpenClaw System Files, Agents & Learned Preferences</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search grimoire..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-dusk-surface/50 border border-neon-purple/20 rounded-lg px-3 py-1.5 text-sm text-white placeholder-slate-500 flex-1 min-w-[200px]"
        />
        {(['all', 'system', 'long_term', 'daily', 'agent'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
              filter === f 
                ? 'bg-neon-purple/20 text-neon-cyan border border-neon-purple/30' 
                : 'bg-dusk-surface/50 text-slate-400'
            }`}
          >
            {getTypeFilter(f)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
        <div className="glass-card p-2 text-center">
          <p className="text-lg font-bold text-neon-blue">{entries.filter(e => e.type === 'agent').length}</p>
          <p className="text-[10px] text-slate-500">Agents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                  entry.type === 'agent' ? 'bg-neon-blue/20 text-neon-blue' :
                  'bg-neon-green/20 text-neon-green'
                }`}>
                  {entry.source}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{entry.content}</p>
            </div>
          ))}
        </div>

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
              <p className="text-sm text-slate-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                {selectedEntry.fullContent || selectedEntry.content}
              </p>
              <p className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-700">
                Source: {selectedEntry.source}
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">🔮</p>
              <p className="text-slate-400">Select an entry to view</p>
              <p className="text-xs text-slate-500 mt-2">OpenClaw system files + agent configs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
