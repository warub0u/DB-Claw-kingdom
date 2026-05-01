'use client';

import { useState, useEffect } from 'react';

interface Quest {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  dueDate?: string;
}

interface Activity {
  id: string;
  agent: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'move' | 'complete' | 'start' | 'comment';
}


// Activity feed - like the original's right sidebar

export default function QuestLog() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'pending'>('all');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [questList, setQuestList] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/state/quests.json')
      .then(res => res.json())
      .then(data => {
        if (data.quests) setQuestList(data.quests);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredQuests = questList.filter(q => filter === 'all' || q.status === filter);

  const stats = {
    total: questList.length,
    active: questList.filter(q => q.status === 'active').length,
    completed: questList.filter(q => q.status === 'completed').length,
    pending: questList.filter(q => q.status === 'pending').length,
  };

  const getAgentIcon = (agent: string) => {
    if (agent.includes('Sage')) return '🔮';
    if (agent.includes('Bard')) return '🎭';
    if (agent.includes('Artificer')) return '⚙️';
    if (agent.includes('Chief')) return '🛡️';
    return '👤';
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">📜 Quest Log</h2>
        <p className="text-sm text-slate-400">Major objectives & milestones</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-white">{stats.total}</p>
          <p className="text-[10px] text-slate-500">Total</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-neon-cyan">{stats.active}</p>
          <p className="text-[10px] text-slate-500">Active</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-neon-gold">{stats.completed}</p>
          <p className="text-[10px] text-slate-500">Done</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg font-bold text-slate-500">{stats.pending}</p>
          <p className="text-[10px] text-slate-500">Pending</p>
        </div>
      </div>

      {/* Two Column Layout: Quests (Left) + Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Quest List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'completed', 'pending'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-smooth ${
                  filter === f 
                    ? 'bg-neon-purple/20 text-neon-cyan border border-neon-purple/30' 
                    : 'bg-dusk-surface/50 text-slate-400 hover:text-white'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Quest List */}
          <div className="space-y-2">
            {filteredQuests.map((quest) => (
              <div
                key={quest.id}
                onClick={() => setSelectedQuest(quest)}
                className={`glass-card p-4 cursor-pointer transition-smooth hover:border-neon-purple/40 ${
                  selectedQuest?.id === quest.id ? 'border-neon-purple glow-purple' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">{quest.status === 'completed' ? '✅' : quest.status === 'active' ? '🔄' : '⏳'}</span>
                    <div>
                      <h4 className="font-medium text-white text-sm">{quest.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{quest.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      quest.priority === 'high' ? 'bg-neon-pink/10 text-neon-pink' :
                      quest.priority === 'medium' ? 'bg-neon-gold/10 text-neon-gold' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {quest.priority.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-500">{quest.assignee}</span>
                  </div>
                </div>
                {quest.dueDate && quest.status === 'active' && (
                  <p className="text-xs text-neon-pink mt-2">Due: {quest.dueDate}</p>
                )}
              </div>
            ))}
          </div>

          {/* Selected Quest Detail */}
          {selectedQuest && (
            <div className="glass-card p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-white">{selectedQuest.title}</h3>
                <button onClick={() => setSelectedQuest(null)} className="text-slate-500 hover:text-white">✕</button>
              </div>
              <p className="text-sm text-slate-300 mt-2">{selectedQuest.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-slate-500">Status</p>
                  <p className="text-white">{selectedQuest.status}</p>
                </div>
                <div>
                  <p className="text-slate-500">Priority</p>
                  <p className="text-white">{selectedQuest.priority}</p>
                </div>
                <div>
                  <p className="text-slate-500">Assignee</p>
                  <p className="text-white">{selectedQuest.assignee}</p>
                </div>
                {selectedQuest.dueDate && (
                  <div>
                    <p className="text-slate-500">Due Date</p>
                    <p className="text-white">{selectedQuest.dueDate}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Activity Feed (like original) */}
        <div className="glass-card p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-neon-cyan">⚡ ACTIVITY</h3>
            <span className="text-xs text-neon-green animate-pulse">Live</span>
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2 text-xs">
                <span className="text-slate-600 shrink-0">{activity.timestamp}</span>
                <span>{getAgentIcon(activity.agent)}</span>
                <span className="text-white">{activity.agent}</span>
                <span className="text-slate-400">{activity.action}</span>
                <span className="text-neon-cyan">{activity.target}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}