import React from 'react';

const HomeView = ({ setView }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl hover:-translate-y-1 transition-transform duration-300">
                <h2 className="text-2xl font-semibold mb-4">For Interviewees</h2>
                <p className="opacity-80 mb-6">
                    Ready to showcase your skills? Upload your resume to begin an automated interview tailored for a Full Stack role.
                </p>
                <button
                    onClick={() => setView('interviewee')}
                    className="bg-white/90 text-black w-full px-6 py-3 rounded-md font-semibold hover:bg-white transition-colors">
                    Start as Interviewee
                </button>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl hover:-translate-y-1 transition-transform duration-300">
                <h2 className="text-2xl font-semibold mb-4">For Interviewers</h2>
                <p className="opacity-80 mb-6">
                    Access the dashboard to review candidate submissions, view scores, and read AI-generated summaries.
                </p>
                <button
                    onClick={() => setView('interviewer')}
                    className="bg-white/20 text-white w-full px-6 py-3 rounded-md font-semibold hover:bg-white/30 transition-colors border border-white/30">
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default HomeView;
