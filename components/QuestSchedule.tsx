'use client';

import { useState, useEffect } from 'react';

interface QuestCompletion {
  id: string;
  quest: string;
  agent: string;
  completedAt: string; // Date + time
  status: 'completed' | 'in_progress';
  xpGained: number;
}

interface ScheduledQuest {
  id: string;
  quest: string;
  agent: string;
  scheduledFor: string; // Date + time
  recurrence: 'daily' | 'weekly' | 'one-time';
}

// Quest completions by party members - this is the main view!
const questCompletions: QuestCompletion[] = [
  { id: 'c1', quest: 'Chronicle Refactor', agent: 'The Artificer', completedAt: '2026-04-30 13:04', status: 'completed', xpGained: 150 },
  { id: 'c2', quest: 'HP/MP Bars Implementation', agent: 'The Artificer', completedAt: '2026-04-30 12:50', status: 'completed', xpGained: 100 },
  { id: 'c3', quest: 'GitHub Save Points Setup', agent: 'The Artificer', completedAt: '2026-04-30 12:30', status: 'completed', xpGained: 100 },
  { id: 'c4', quest: 'Mission Control SPEC', agent: 'The Artificer', completedAt: '2026-04-30 11:45', status: 'completed', xpGained: 75 },
  { id: 'c5', quest: 'Supabase Wake', agent: 'The Chief of Staff', completedAt: '2026-04-30 11:19', status: 'completed', xpGained: 50 },
  { id: 'c6', quest: 'Daily Market Brief', agent: 'The Sage', completedAt: '2026-04-30 08:00', status: 'completed', xpGained: 75 },
  { id: 'c7', quest: 'Portfolio NLV Chart', agent: 'The Sage', completedAt: '2026-04-29 18:00', status: 'completed', xpGained: 100 },
  { id: 'c8', quest: 'Party Role Definitions', agent: 'The Chief of Staff', completedAt: '2026-04-28 12:00', status: 'completed', xpGained: 50 },
];

const scheduledQuests: ScheduledQuest[] = [
  { id: 's1', quest: 'Morning Market Brief', agent: 'The Sage', scheduledFor: '2026-05-01 08:00', recurrence: 'daily' },
  { id: 's2', quest: 'Daily Digest Generation', agent: 'The Bard', scheduledFor: '2026-05-01 09:00', recurrence: 'daily' },
  { id: 's3', quest: 'Weekly Options Alpha', agent: 'The Bard', scheduledFor: '2026-05-04 18:00', recurrence: 'weekly' },
  { id: 's4', quest: 'Portfolio Review', agent: 'The Sage', scheduledFor: '2026-05-01 17:00', recurrence: 'daily' },
  { id: 's5', quest: 'Knowledge Base Sync', agent: 'The Artificer', scheduledFor: '2026-05-01 00:00', recurrence: 'daily' },
];

export default function QuestSchedule() {
  const [view, setView] = useState<'completed' | 'scheduled'>('completed');
  const [completedQuests, setCompletedQuests] = useState<QuestCompletion[]>([]);
  const [scheduledQuests, setScheduledQuests] = useState<ScheduledQuest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/state/scheduled_quests.json')
      .then(res => res.json())
      .then(data => {
        setCompletedQuests(data.completed || []);
        setScheduledQuests(data.scheduled || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getAgentIcon = (agent: string) => {
    if (agent.includes('Sage')) return '🔮';
    if (agent.includes('Bard')) return '🎭';
    if (agent.includes('Artificer')) return '⚙️';
    if (agent.includes('Chief')) return '🛡️';
    return '👤';
  };

  const questCompletions = completedQuests;
  const questScheduled = scheduledQuests;

  // Stats
  const totalXP = questCompletions.reduce((sum: number, q: QuestCompletion) => sum + (q.xpGained || 0), 0);
  const agentStats = {
    artificer: questCompletions.filter((q: QuestCompletion) => q.agent === 'The Artificer').reduce((sum: number, q: QuestCompletion) => sum + (q.xpGained || 0), 0),
    sage: questCompletions.filter((q: QuestCompletion) => q.agent === 'The Sage').reduce((sum: number, q: QuestCompletion) => sum + (q.xpGained || 0), 0),
    bard: questCompletions.filter((q: QuestCompletion) => q.agent === 'The Bard').reduce((sum: number, q: QuestCompletion) => sum + (q.xpGained || 0), 0),
    chief: questCompletions.filter((q: QuestCompletion) => q.agent === 'The Chief of Staff').reduce((sum: number, q: QuestCompletion) => sum + (q.xpGained || 0), 0),
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">📅 Quest Schedule</h2>
        <p className="text-sm text-slate-400">Character Quest Completions & Upcoming</p>
      </div>

      {/* Stats: XP by Agent */}
      <div className="grid grid-cols-4 gap-2">
        <div className="glass-card p-3 text-center">
          <p className="text-lg">⚙️</p>
          <p className="text-lg font-bold text-neon-cyan">{agentStats.artificer}</p>
          <p className="text-[10px] text-slate-500">Artificer XP</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg">🔮</p>
          <p className="text-lg font-bold text-neon-purple">{agentStats.sage}</p>
          <p className="text-[10px] text-slate-500">Sage XP</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg">🎭</p>
          <p className="text-lg font-bold text-neon-pink">{agentStats.bard}</p>
          <p className="text-[10px] text-slate-500">Bard XP</p>
        </div>
        <div className="glass-card p-3 text-center">
          <p className="text-lg">🛡️</p>
          <p className="text-lg font-bold text-neon-gold">{agentStats.chief}</p>
          <p className="text-[10px] text-slate-500">Chief XP</p>
        </div>
      </div>

      {/* Toggle: Completed vs Scheduled */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('completed')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
            view === 'completed' 
              ? 'bg-neon-purple/20 text-neon-cyan border border-neon-purple/30' 
              : 'bg-dusk-surface/50 text-slate-400'
          }`}
        >
          ✅ Completed ({questCompletions.length})
        </button>
        <button
          onClick={() => setView('scheduled')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
            view === 'scheduled' 
              ? 'bg-neon-purple/20 text-neon-cyan border border-neon-purple/30' 
              : 'bg-dusk-surface/50 text-slate-400'
          }`}
        >
          📅 Scheduled ({scheduledQuests.length})
        </button>
      </div>

      {view === 'completed' ? (
        // Quest Completions Timeline
        <div className="space-y-2">
          {questCompletions.map((completion) => (
            <div key={completion.id} className="glass-card p-3 flex items-center gap-3">
              <span className="text-xl">{getAgentIcon(completion.agent)}</span>
              <div className="flex-1">
                <p className="text-sm text-white">
                  <span className="text-neon-green">✓</span> {completion.quest}
                </p>
                <p className="text-xs text-slate-500">{completion.completedAt}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-neon-gold">+{completion.xpGained} XP</p>
                <p className="text-[10px] text-slate-500">{completion.agent}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Scheduled Quests
        <div className="space-y-2">
          {questScheduled.map((sq) => (
            <div key={sq.id} className="glass-card p-3 flex items-center gap-3">
              <span className="text-xl">{getAgentIcon(sq.agent)}</span>
              <div className="flex-1">
                <p className="text-sm text-white">{sq.quest}</p>
                <p className="text-xs text-slate-500">
                  {sq.scheduledFor} • {sq.recurrence}
                </p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                sq.recurrence === 'daily' ? 'bg-neon-cyan/20 text-neon-cyan' :
                sq.recurrence === 'weekly' ? 'bg-neon-purple/20 text-neon-purple' :
                'bg-slate-700 text-slate-400'
              }`}>
                {sq.recurrence}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Total XP Earned */}
      <div className="glass-card p-4 text-center">
        <p className="text-xs text-slate-500">Total Party XP</p>
        <p className="text-2xl font-bold text-neon-gold">{totalXP} XP</p>
      </div>
    </div>
  );
}