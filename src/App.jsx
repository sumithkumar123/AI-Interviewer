import React, { useState } from 'react';
import HomeView from './views/HomeView';
import IntervieweeView from './views/IntervieweeView';
import Dashboard from './components/interviewer/Dashboard';

const App = () => {
  const [view, setView] = useState('home');

  const renderContent = () => {
    switch (view) {
      case 'interviewee':
        return <IntervieweeView />;
      case 'interviewer':
        return <Dashboard />;
      default:
        return <HomeView setView={setView} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-white bg-slate-900 relative text-base">
      {/* Animated Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-purple-500 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[10%] left-[50%] w-[500px] h-[500px] bg-blue-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[25%] w-[500px] h-[500px] bg-pink-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* UPDATED: Increased background opacity to 70% and added a stronger shadow (shadow-xl) */}
      <header className="bg-slate-900/70 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => setView('home')}>
            AI Interview Assistant
          </h1>
          {view !== 'home' && (
            <button onClick={() => setView('home')} className="text-sm text-white/80 hover:underline">
              &larr; Back to Home
            </button>
          )}
        </div>
      </header>
      <main className="container mx-auto px-6 py-12">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;

