'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface NLVData {
  date: string;
  value: number;
  capital: number;
}

// Demo data for fallback
const demoNLV: NLVData[] = [
  { date: '2026-04-07', value: 164435, capital: 140000 },
  { date: '2026-04-08', value: 173761, capital: 140000 },
  { date: '2026-04-10', value: 174966, capital: 140000 },
  { date: '2026-04-14', value: 179401, capital: 140000 },
  { date: '2026-04-15', value: 182760, capital: 140000 },
  { date: '2026-04-16', value: 184023, capital: 140000 },
  { date: '2026-04-18', value: 188508, capital: 140000 },
  { date: '2026-04-22', value: 191509, capital: 140000 },
  { date: '2026-04-24', value: 188965, capital: 140000 },
  { date: '2026-04-25', value: 191920, capital: 140000 },
  { date: '2026-04-28', value: 190880, capital: 140000 },
  { date: '2026-04-29', value: 190093, capital: 140000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dusk-bg-light border border-neon-purple/40 p-3 rounded-lg shadow-lg">
        <p className="text-xs text-slate-400 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function InteractiveChart() {
  const [data, setData] = useState<NLVData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(
        'https://aigwegrqrxquqbjfjcyg.supabase.co/rest/v1/net_liquidation_history?select=date,net_liquidation_value,capital_invested&order=date.asc',
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZ3dlZ3JxcnhxdXFiamZqY3lnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5NDIwMywiZXhwIjoyMDg3NzcwMjAzfQ.46n16ytgbz5fKfOZ7ljevXuOzA3b1HykeMuAQCzBclo',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZ3dlZ3JxcnhxdXFiamZqY3lnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5NDIwMywiZXhwIjoyMDg3NzcwMjAzfQ.46n16ytgbz5fKfOZ7ljevXuOzA3b1HykeMuAQCzBclo',
          },
        }
      );
      
      const json = await res.json();
      const formatted = json.map((d: any) => ({
        date: d.date.slice(5), // MM-DD format
        value: d.net_liquidation_value,
        capital: d.capital_invested,
      }));
      setData(formatted);
    } catch (e) {
      console.error('Using demo data:', e);
      setData(demoNLV.map(d => ({ ...d, date: d.date.slice(5) })));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <span className="text-slate-500">Loading chart...</span>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a4a" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#2a2a4a' }}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#2a2a4a' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            name="Net Liquidation Value"
            stroke="#00f5ff" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#00f5ff', stroke: '#0f0f1a', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="capital" 
            name="Capital Invested"
            stroke="#8b5cf6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#0f0f1a', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}