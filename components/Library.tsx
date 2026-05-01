'use client';

import { useState, useEffect } from 'react';

interface KBdoc {
  id: number;
  document_name: string;
  asset_class: string | null;
  ai_summary: string;
}

interface Newsletter {
  id: number;
  name: string;
  content_type: string;
  file_url: string;
  uploaded_date: string;
}

export default function Library() {
  const [docs, setDocs] = useState<KBdoc[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [activeTab, setActiveTab] = useState<'knowledge' | 'news'>('knowledge');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<KBdoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers = {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZ3dlZ3JxcnhxdXFiamZqY3lnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5NDIwMywiZXhwIjoyMDg3NzcwMjAzfQ.46n16ytgbz5fKfOZ7ljevXuOzA3b1HykeMuAQCzBclo',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZ3dlZ3JxcnhxdXFiamZqY3lnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE5NDIwMywiZXhwIjoyMDg3NzcwMjAzfQ.46n16ytgbz5fKfOZ7ljevXuOzA3b1HykeMuAQCzBclo',
      };

      const [kbRes, nlRes] = await Promise.all([
        fetch('https://aigwegrqrxquqbjfjcyg.supabase.co/rest/v1/knowledge_base?select=id,document_name,asset_class,ai_summary&limit=30', { headers }),
        fetch('https://aigwegrqrxquqbjfjcyg.supabase.co/rest/v1/newsletters?select=*', { headers }),
      ]);

      const kbData = await kbRes.json();
      const nlData = await nlRes.json();

      setDocs(kbData);
      setNewsletters(nlData);
    } catch (e) {
      console.error('Library fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = docs.filter(d =>
    d.document_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.asset_class && d.asset_class.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredNewsletters = newsletters.filter(n =>
    n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-lg font-semibold text-white">The Library</h2>
        <input
          type="text"
          placeholder="Search archives..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-dusk-surface/50 border border-neon-purple/20 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-neon-purple focus:outline-none"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-smooth ${
            activeTab === 'knowledge' 
              ? 'bg-neon-purple/20 text-neon-cyan border border-neon-purple/30' 
              : 'bg-dusk-surface/50 text-slate-400 hover:text-white'
          }`}
        >
          📖 Knowledge Base ({docs.length})
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-smooth ${
            activeTab === 'news' 
              ? 'bg-neon-purple/20 text-neon-cyan border border-neon-purple/30' 
              : 'bg-dusk-surface/50 text-slate-400 hover:text-white'
          }`}
        >
          📰 Newsletters ({newsletters.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading archives...</div>
      ) : activeTab === 'knowledge' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredDocs.length === 0 ? (
            <p className="text-slate-500 col-span-2 text-center py-8">No documents found</p>
          ) : (
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`glass-card p-4 cursor-pointer transition-smooth hover:border-neon-purple/40 ${
                  selectedDoc?.id === doc.id ? 'border-neon-purple glow-purple' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-white text-sm">{doc.document_name}</h4>
                  {doc.asset_class && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-neon-pink/10 text-neon-pink">
                      {doc.asset_class}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{doc.ai_summary}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredNewsletters.length === 0 ? (
            <p className="text-slate-500 col-span-2 text-center py-8">No newsletters found</p>
          ) : (
            filteredNewsletters.map((nl) => (
              <div key={nl.id} className="glass-card p-4">
                <h4 className="font-medium text-white text-sm">{nl.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{nl.content_type}</p>
                <p className="text-xs text-slate-500 mt-2">Uploaded: {nl.uploaded_date}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Selected Doc Preview */}
      {selectedDoc && activeTab === 'knowledge' && (
        <div className="glass-card p-4 mt-4">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-white">{selectedDoc.document_name}</h3>
            <button
              onClick={() => setSelectedDoc(null)}
              className="text-slate-500 hover:text-white"
            >
              ✕
            </button>
          </div>
          {selectedDoc.asset_class && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-neon-pink/10 text-neon-pink mt-2 inline-block">
              {selectedDoc.asset_class}
            </span>
          )}
          <p className="text-sm text-slate-300 mt-3">{selectedDoc.ai_summary}</p>
        </div>
      )}
    </div>
  );
}