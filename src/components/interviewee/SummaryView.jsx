import React from 'react';
import { StarIcon } from '../common/Icons';

const SummaryView = ({ candidate }) => {
    return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl text-center max-w-2xl mx-auto text-white">
            <StarIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Interview Complete!</h2>
            <p className="opacity-80 mb-6">Thank you for your time, {candidate.name}. Here is your result.</p>
            <div className="bg-white/10 p-6 rounded-xl mb-6">
                <p className="text-lg font-semibold opacity-90">Final Score</p>
                <p className="text-6xl font-bold my-2">{candidate.score}/100</p>
            </div>
            <div className="text-left bg-black/10 p-6 rounded-xl">
                <p className="text-lg font-semibold opacity-90 mb-2">✨ AI Summary</p>
                <p className="opacity-80 whitespace-pre-wrap">{candidate.summary}</p>
            </div>
        </div>
    );
};

export default SummaryView;
