import React from 'react';

const WelcomeModal = ({ onResume, onStartOver, name }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full text-white">
            <h2 className="text-2xl font-bold mb-4">Welcome Back, {name}!</h2>
            <p className="mb-6 opacity-80">It looks like you have an interview in progress.</p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={onResume}
                    className="bg-white/20 text-white px-6 py-2 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                    Resume Interview
                </button>
                <button
                    onClick={onStartOver}
                    className="bg-black/20 text-white px-6 py-2 rounded-xl hover:bg-black/30 transition-all duration-300 border border-white/20"
                >
                    Start Over
                </button>
            </div>
        </div>
    </div>
);

export default WelcomeModal;
