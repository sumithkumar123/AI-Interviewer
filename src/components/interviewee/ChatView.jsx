import React, { useRef, useEffect } from 'react';
import { BotIcon, UserIcon, SendIcon } from '../common/Icons';

const ChatView = ({ candidate, messages, timer, isTyping, userInput, setUserInput, handleSendMessage }) => {
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col text-white" style={{ height: '80vh' }}>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold">Interview for {candidate.name || 'Candidate'}</h2>
                {timer !== null && (
                    <div className={`text-lg font-bold px-4 py-1 rounded-full transition-colors ${timer <= 10 ? 'text-red-400 bg-red-500/20 animate-pulse' : 'text-white/80 bg-white/10'}`}>
                        {timer}s
                    </div>
                )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && (
                            <div className="bg-gradient-to-br from-blue-500 to-violet-600 rounded-full p-2 shadow-lg">
                                <BotIcon />
                            </div>
                        )}
                        <div className={`max-w-lg p-3 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-white/20 rounded-br-none' : 'bg-gradient-to-br from-blue-500 to-violet-600 rounded-bl-none'}`}>
                            <p className="leading-relaxed">{msg.text}</p>
                        </div>
                        {msg.sender === 'user' && (
                            <div className="bg-white/20 text-white/70 rounded-full p-2 shadow-lg">
                                <UserIcon />
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-start gap-3.5">
                        <div className="bg-gradient-to-br from-blue-500 to-violet-600 rounded-full p-2 shadow-lg"> <BotIcon /> </div>
                        <div className="max-w-lg p-3 rounded-2xl shadow-md bg-gradient-to-br from-blue-500 to-violet-600 rounded-bl-none">
                            <div className="flex items-center justify-center space-x-1">
                                <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10">
                <div className="relative">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isTyping && timer !== null && handleSendMessage()}
                        placeholder="Type your answer here..."
                        className="w-full p-3 pl-4 pr-16 bg-white/10 rounded-xl border border-transparent focus:ring-2 focus:ring-white/50 focus:outline-none placeholder:text-white/50"
                        disabled={isTyping || timer === null}
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-white/20 text-white p-2 rounded-lg font-semibold hover:bg-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        disabled={isTyping || timer === null}
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatView;
