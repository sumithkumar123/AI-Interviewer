import React, { useState, useEffect } from 'react';

const Dashboard = () => {
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState('score'); // 'score', 'name'

    useEffect(() => {
        const allCandidates = JSON.parse(localStorage.getItem('allCandidates') || '[]');
        setCandidates(allCandidates);
    }, []);

    const filteredAndSortedCandidates = candidates
        .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortKey === 'score') {
                return b.score - a.score; // Highest score first
            }
            if (sortKey === 'name') {
                return a.name.localeCompare(b.name);
            }
            return 0;
        });
    
    if (selectedCandidate) {
        return (
             <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto text-white">
                <button onClick={() => setSelectedCandidate(null)} className="text-sm text-white/80 hover:underline mb-6">
                    &larr; Back to Dashboard
                </button>
                 <div className="border-b border-white/20 pb-4 mb-4">
                    <h2 className="text-3xl font-bold">{selectedCandidate.name}</h2>
                    <p className="text-white/70">{selectedCandidate.email} | {selectedCandidate.phone}</p>
                    <div className="mt-2 text-2xl font-bold">Score: {selectedCandidate.score}/100</div>
                 </div>
                 <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">✨ AI Summary</h3>
                    <p className="bg-black/20 p-4 rounded-md text-white/80">{selectedCandidate.summary}</p>
                 </div>
                 <div>
                    <h3 className="text-xl font-semibold mb-2">Full Transcript</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-black/20 rounded-md">
                        {selectedCandidate.questions.map((q, i) => (
                            <div key={i} className="pb-2 border-b border-white/10 last:border-b-0">
                                <p className="font-semibold text-white/90">Q: {q}</p>
                                <p className="text-white/70 mt-1">A: {selectedCandidate.answers[i]}</p>
                            </div>
                        ))}
                    </div>
                 </div>
             </div>
        )
    }

    return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl text-white">
            <h2 className="text-2xl font-semibold mb-4">Candidates Dashboard</h2>
            
            <div className="flex justify-between items-center mb-4 gap-4">
                <input 
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-2 bg-white/5 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <select 
                    value={sortKey} 
                    onChange={e => setSortKey(e.target.value)}
                    className="p-2 bg-slate-900/80 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                    <option value="score">Sort by Score</option>
                    <option value="name">Sort by Name</option>
                </select>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="border-b border-white/20">
                        <tr>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Score</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Summary</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedCandidates.length > 0 ? filteredAndSortedCandidates.map(c => (
                            <tr key={c.id} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                                <td className="py-3 px-4">{c.name}</td>
                                <td className="py-3 px-4">
                                    <span className="font-bold">{c.score}/100</span>
                                </td>
                                <td className="py-3 px-4 text-sm text-white/70 truncate" style={{maxWidth: '300px'}}>{c.summary}</td>
                                <td className="py-3 px-4">
                                    <button onClick={() => setSelectedCandidate(c)} className="bg-white/20 text-white text-sm px-3 py-1 rounded-md hover:bg-white/30 transition-colors">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        )) : (
                             <tr>
                                <td colSpan="4" className="text-center py-8 text-white/60">No candidates found.</td>
                             </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    )
};

export default Dashboard;
