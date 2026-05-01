'use client';

import { useState, useEffect } from 'react';

interface MarketBrief {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'analysis';
  status: 'draft' | 'review' | 'published';
  created: string;
  author: string;
  summary: string;
}

interface BardActivity {
  id: string;
  action: string;
  target: string;
  timestamp: string;
}

// Sample data - in production, fetch from Supabase newsletters table
const marketBriefs: MarketBrief[] = [
  { id: 'b1', title: 'Morning Market Brief', type: 'daily', status: 'published', created: '2026-04-30 08:00', author: 'The Bard', summary: 'NLV update, top movers, IV analysis' },
  { id: 'b2', title: 'Weekly Options Alpha', type: 'weekly', status: 'review', created: '2026-04-29 18:00', author: 'The Bard', summary: 'IV rankings, PMCC setups, Greeks analysis' },
  { id: 'b3', title: 'The Turnaround Play: NKE', type: 'analysis', status: 'draft', created: '2026-04-30 12:00', author: 'The Bard', summary: 'Nike turnaround thesis, margin of safety' },
  { id: 'b4', title: 'META Valuation Update', type: 'analysis', status: 'published', created: '2026-04-28 09:00', author: 'The Bard', summary: '40% MoS, bear vs bull IV scenarios' },
];

const bardActivity: BardActivity[] = [
  { id: 'a1', action: 'generated', target: 'Morning Market Brief', timestamp: '08:00' },
  { id: 'a2', action: 'consulted', target: "Sage's valuation data", timestamp: '07:55' },
  { id: 'a3', action: 'submitted', target: 'Weekly Options Alpha for review', timestamp: '18:00' },
  { id: 'a4', action: 'researched', target: 'Nike turnaround thesis', timestamp: '12:00' },
];

export default function BardWorkshop() {
  const [briefs, setBriefs] = useState<MarketBrief[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try Supabase API first, fall back to local JSON
    fetch('/api/supabase/newsletters')
      .then(res => res.json())
      .then(data => {
        if (data.newsletters && data.newsletters.length > 0) {
          const mapped = data.newsletters.map((n: any) => ({
            id: n.id,
            title: n.title,
            type: 'analysis',
            status: n.status?.toLowerCase() || 'draft',
            created: n.publish_date || n.created_at,
            author: 'The Bard',
            summary: n.content_body?.substring(0, 100) || '',
          }));
          setBriefs(mapped);
        } else {
          return fetch('/state/daily_brief.json');
        }
      })
      .then(res => res?.json())
      .then(data => {
        if (data?.briefs && briefs.length === 0) setBriefs(data.briefs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly' | 'analysis'>('all');
  const [selectedBrief, setSelectedBrief] = useState<MarketBrief | null>(null);

  const filteredBriefs = briefs.filter(b => filter === 'all' || b.type === filter);

  const stats = {
    total: briefs.length,
    published: briefs.filter(b => b.status === 'published').length,
    draft: briefs.filter(b => b.status === 'draft').length,
    review: briefs.filter(b => b.status === 'review').length,
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">🎭 Bard's Workshop</h2>
        <p className="text-sm text-slate-400">Market Briefs & Newsletter Generation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-white">{stats.total}</p>
          <p className="text-[10px] text-slate-500">Total</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-neon-green">{stats.published}</p>
          <p className="text-[10px] text-slate-500">Published</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-neon-gold">{stats.review}</p>
          <p className="text-[10px] text-slate-500">In Review</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-slate-500">{stats.draft}</p>
          <p className="text-[10px] text-slate-500">Drafts</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Briefs List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'daily', 'weekly', 'analysis'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                  filter === f 
                    ? 'bg-neon-purple/20 text-neon-cyan border border-neon-purple/30' 
                    : 'bg-dusk-surface/50 text-slate-400'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Briefs */}
          <div className="space-y-2">
            {filteredBriefs.map((brief) => (
              <div
                key={brief.id}
                onClick={() => setSelectedBrief(brief)}
                className={`glass-card p-4 cursor-pointer transition-smooth hover:border-neon-purple/40 ${
                  selectedBrief?.id === brief.id ? 'border-neon-purple glow-purple' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white text-sm">{brief.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        brief.status === 'published' ? 'bg-neon-green/20 text-neon-green' :
                        brief.status === 'review' ? 'bg-neon-gold/20 text-neon-gold' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {brief.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{brief.summary}</p>
                    <p className="text-[10px] text-slate-500 mt-2">{brief.created} • {brief.author}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    brief.type === 'daily' ? 'bg-neon-cyan/20 text-neon-cyan' :
                    brief.type === 'weekly' ? 'bg-neon-purple/20 text-neon-purple' :
                    'bg-neon-pink/20 text-neon-pink'
                  }`}>
                    {brief.type}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Brief Detail */}
          {selectedBrief && (
            <div className="glass-card p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white">{selectedBrief.title}</h3>
                <button onClick={() => setSelectedBrief(null)} className="text-slate-500 hover:text-white">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Type</p>
                  <p className="text-white capitalize">{selectedBrief.type}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <p className="text-white capitalize">{selectedBrief.status}</p>
                </div>
                <div>
                  <p className="text-slate-500">Created</p>
                  <p className="text-white">{selectedBrief.created}</p>
                </div>
                <div>
                  <p className="text-slate-500">Author</p>
                  <p className="text-white">{selectedBrief.author}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700">
                <p className="text-slate-500 text-xs">Summary</p>
                <p className="text-sm text-slate-300 mt-1">{selectedBrief.summary}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Bard Activity */}
        <div className="glass-card p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-neon-pink">🎭 Bard's Activity</h3>
            <span className="text-xs text-neon-cyan">Live</span>
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {bardActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2 text-xs">
                <span className="text-slate-600 shrink-0">{activity.timestamp}</span>
                <span>🎭</span>
                <div>
                  <span className="text-white">The Bard </span>
                  <span className="text-slate-400">{activity.action} </span>
                  <span className="text-neon-cyan">{activity.target}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Templates */}
          <div className="mt-4 pt-3 border-t border-slate-700">
            <h4 className="text-xs font-medium text-slate-400 mb-2">📝 Quick Templates</h4>
            <div className="space-y-1">
              <button className="text-xs text-left w-full p-2 rounded bg-dusk-surface/30 text-slate-400 hover:text-white hover:bg-dusk-surface/50">
                + Morning Market Brief
              </button>
              <button className="text-xs text-left w-full p-2 rounded bg-dusk-surface/30 text-slate-400 hover:text-white hover:bg-dusk-surface/50">
                + Options Alpha Report
              </button>
              <button className="text-xs text-left w-full p-2 rounded bg-dusk-surface/30 text-slate-400 hover:text-white hover:bg-dusk-surface/50">
                + Turnaround Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}