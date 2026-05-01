'use client';

import { useState, useEffect } from 'react';

// Agent Action - represents a Quest, not an n8n execution
interface AgentAction {
  id: string;
  agent: string;
  action: string;
  quest: string;
  target?: string;
  status: 'completed' | 'in_progress' | 'error';
  timestamp: string;
}

// Chronicle format: "> [Agent] [action] and completed the [Quest] Quest."

export default function Chronicle() {
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress' | 'error'>('all');

  const filteredActions = actions.filter(a => filter === 'all' || a.status === filter);

  useEffect(() => {
    fetch('/state/party_activity.json')
      .then(res => res.json())
      .then(data => {
        if (data.activities) {
          const mapped: AgentAction[] = data.activities.map((a: any, i: number) => ({
            id: String(i),
            agent: a.agent,
            action: a.action,
            quest: a.quest || 'General Task',
            target: a.notes,
            status: a.status === 'complete' ? 'completed' : a.status === 'in_progress' ? 'in_progress' : 'error',
            timestamp: new Date(a.timestamp).toLocaleString('en-US', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          }));
          setActions(mapped);
        }
        setLoading(false);
      })
      .catch(() => {
        setActions([]);
        setLoading(false);
      });
  }, []);

  const getAgentIcon = (agent: string) => {
    if (agent.includes('Sage')) return '🔮';
    if (agent.includes('Bard')) return '🎭';
    if (agent.includes('Artificer')) return '⚙️';
    return '🛡️';
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">📖 The Chronicle</h2>
        <p className="text-sm text-slate-400">Agent Actions (Quests) - Not just n8n pings</p>
      </div>

      {/* Terminal-style Chronicles Log */}
      <div className="glass-card p-4 font-mono">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-neon-cyan">&gt; CHRONICLES LOG</h3>
          <span className="text-xs text-slate-500">Live</span>
        </div>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {filteredActions.slice(0, 10).map((action) => (
            <div key={action.id} className="text-xs text-slate-400">
              <span className="text-slate-600">[{action.timestamp}]</span>{' '}
              <span className="text-neon-green">{action.agent}</span>{' '}
              {action.action}{' '}
              {action.target && <span className="text-neon-cyan">{action.target}</span>}.{' '}
              <span className={action.status === 'completed' ? 'text-neon-green' : action.status === 'error' ? 'text-neon-pink' : 'text-neon-gold'}>
                [{action.quest}]
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'completed', 'in_progress', 'error'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
              filter === f 
                ? 'bg-neon-purple/20 text-neon-cyan border border-neon-purple/30' 
                : 'bg-dusk-surface/50 text-slate-400'
            }`}
          >
            {f === 'all' ? 'All Actions' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Agent Actions List */}
      <div className="space-y-2">
        {filteredActions.map((action) => (
          <div key={action.id} className="glass-card p-3 flex items-center gap-3">
            <span className="text-lg">{getAgentIcon(action.agent)}</span>
            <div className="flex-1">
              <p className="text-sm text-white">
                {action.agent} <span className="text-slate-400">{action.action}</span>{' '}
                {action.target && <span className="text-neon-cyan">{action.target}</span>}
              </p>
              <p className="text-xs text-slate-500">
                Completed <span className="text-neon-green">[{action.quest}]</span> Quest
              </p>
            </div>
            <span className="text-xs text-slate-500">{action.timestamp}</span>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-500">Loading chronicle...</div>
      ) : actions.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-4xl mb-3">📖</p>
          <p className="text-slate-400">No actions recorded yet</p>
          <p className="text-xs text-slate-500 mt-2">Agent Actions (Quests) will appear here</p>
        </div>
      ) : null}

      {/* Party Timeline */}
      <div className="glass-card p-4">
        <h3 className="font-medium text-white mb-3">⚔️ Party Timeline (Quests)</h3>
        <div className="space-y-2 text-sm">
          {actions.slice(0, 5).map((action) => (
            <div key={action.id} className="flex gap-3">
              <span className="text-slate-500 shrink-0">{action.timestamp}</span>
              <span className="text-white">{action.agent}: </span>
              <span className="text-slate-300">{action.action}</span>
              <span className="text-neon-green">[{action.quest}]</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}