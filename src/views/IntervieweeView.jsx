import React, { useState, useEffect, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { fetchNextQuestionAPI, generateSummaryAPI } from '../api/gemini';
import WelcomeModal from '../components/common/WelcomeModal';
import ChatView from '../components/interviewee/ChatView';
import SummaryView from '../components/interviewee/SummaryView';

const initialCandidateState = {
    id: null, name: '', email: '', phone: '', resume: null,
    answers: [], questions: [], score: null, summary: '',
    interviewInProgress: false,
};

const IntervieweeView = () => {
  const [candidate, setCandidate] = useLocalStorage('candidate', initialCandidateState);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isPdfjsLoaded, setIsPdfjsLoaded] = useState(false);
  const [view, setView] = useState('loading');
  const fileInputRef = useRef(null);
  const [tempDetails, setTempDetails] = useState({ name: '', email: '', phone: ''});
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [timer, setTimer] = useState(null);

  const currentQuestionIndex = candidate.answers.length;

  // Effect for timer
  useEffect(() => {
    if (timer === null) return;
    if (timer === 0) {
        handleSendMessage(true);
        return;
    }
    const intervalId = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  // Effect to load pdf.js
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      setIsPdfjsLoaded(true);
    };
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  // Effect to determine initial view on mount
  useEffect(() => {
    const hasStarted = candidate.resume !== null && candidate.interviewInProgress;
    const isFinished = candidate.score !== null;
    if (hasStarted && !isFinished) {
      setShowWelcomeModal(true);
      setView('interview');
      const restoredMessages = [];
      candidate.questions.forEach((q, i) => {
        restoredMessages.push({ sender: 'ai', text: q });
        if(candidate.answers[i]) restoredMessages.push({ sender: 'user', text: candidate.answers[i]});
      });
      setMessages(restoredMessages);
    } else if (isFinished) {
      setView('completed');
    } else {
      setView('upload');
    }
  }, []);

  // The main interview flow controller
  useEffect(() => {
    if (view !== 'interview') return;
    if (candidate.questions.length === currentQuestionIndex && currentQuestionIndex < 6) {
        startOrContinueQuestionFlow();
    } else if (currentQuestionIndex === 6 && candidate.score === null) {
        endInterview();
    }
  }, [candidate.answers, view]);

  const startOrContinueQuestionFlow = async () => {
    if (currentQuestionIndex === 0) {
        setMessages([{ sender: 'ai', text: `Hello ${candidate.name}. Welcome. Let's begin.` }]);
        setTimeout(() => fetchNextQuestion(), 1200);
    } else {
        setTimeout(() => fetchNextQuestion(), 800);
    }
  };
    
  const endInterview = async () => {
    setIsTyping(true);
    setMessages(prev => [...prev, { sender: 'ai', text: "Interview complete! Analyzing answers..." }]);
    try {
        const { score, summary } = await generateSummaryAPI(candidate.questions, candidate.answers);
        const finalCandidateData = { ...candidate, score, summary, interviewInProgress: false };
        setCandidate(finalCandidateData);

        const allCandidates = JSON.parse(localStorage.getItem('allCandidates') || '[]');
        const existingIndex = allCandidates.findIndex(c => c.id === finalCandidateData.id);
        if (existingIndex > -1) allCandidates[existingIndex] = finalCandidateData;
        else allCandidates.push(finalCandidateData);
        localStorage.setItem('allCandidates', JSON.stringify(allCandidates));

        setView('completed');
    } catch (error) {
        console.error("Error generating summary:", error);
        setMessages(prev => [...prev, { sender: 'ai', text: "Error generating your score." }]);
    } finally {
        setIsTyping(false);
    }
  };

  const fetchNextQuestion = async () => {
    setIsTyping(true);
    const difficultyLevels = ['Easy', 'Easy', 'Medium', 'Medium', 'Hard', 'Hard'];
    const timers = { 'Easy': 20, 'Medium': 60, 'Hard': 120 };
    const difficulty = difficultyLevels[currentQuestionIndex];
    try {
        const questionText = await fetchNextQuestionAPI(difficulty);
        const formattedQuestion = `Question ${currentQuestionIndex + 1}/6: ${questionText}`;
        setCandidate(prev => ({ ...prev, questions: [...prev.questions, formattedQuestion] }));
        setMessages(prev => [...prev, { sender: 'ai', text: formattedQuestion }]);
        setTimer(timers[difficulty]);
    } catch(error) {
        console.error("Error fetching question:", error);
        setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having an issue." }]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleSendMessage = (isAutoSubmit = false) => {
    const text = isAutoSubmit ? (userInput || "Time's up! No answer provided.") : userInput;
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setUserInput('');
    setTimer(null);
    setCandidate(prev => ({ ...prev, answers: [...prev.answers, text] }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') return;
    setCandidate({ ...initialCandidateState, id: `cand_${new Date().getTime()}`, resume: file.name, interviewInProgress: true });

    const reader = new FileReader();
    reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await window.pdfjsLib.getDocument(typedArray).promise;
        let textContent = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map(s => s.str).join(' ');
        }
        const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/g;
        const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
        const nameRegex = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/;
        setTempDetails({
            name: (textContent.match(nameRegex) || [''])[0].trim(),
            email: (textContent.match(emailRegex) || [''])[0],
            phone: (textContent.match(phoneRegex) || [''])[0]
        });
        setView('confirmDetails');
    };
    reader.readAsArrayBuffer(file);
  };
  
  const handleStartOver = () => {
    const allCandidates = JSON.parse(localStorage.getItem('allCandidates') || '[]').filter(c => c.id !== candidate.id);
    localStorage.setItem('allCandidates', JSON.stringify(allCandidates));
    setCandidate(initialCandidateState);
    setMessages([]);
    setTimer(null);
    setShowWelcomeModal(false);
    setView('upload');
  };

  // --- Render Logic ---
  if (showWelcomeModal) {
    return <WelcomeModal onResume={() => setShowWelcomeModal(false)} onStartOver={handleStartOver} name={candidate.name || 'Candidate'} />;
  }
  
  switch(view) {
    case 'loading':
      return <div className="flex justify-center items-center h-screen"><p className="text-lg text-white/80">Loading...</p></div>;
    case 'completed':
      return <SummaryView candidate={candidate} />;
    case 'interview':
      return <ChatView {...{ candidate, messages, timer, isTyping, userInput, setUserInput, handleSendMessage }} />;
    case 'confirmDetails':
       return (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl max-w-lg mx-auto text-white">
              <h2 className="text-2xl font-semibold mb-2">Confirm Your Details</h2>
              <p className="opacity-80 mb-6">Please confirm or correct the extracted information.</p>
              <div className="space-y-4">
                  <input type="text" placeholder="Full Name" value={tempDetails.name} onChange={e => setTempDetails({...tempDetails, name: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50"/>
                  <input type="email" placeholder="Email" value={tempDetails.email} onChange={e => setTempDetails({...tempDetails, email: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50"/>
                  <input type="tel" placeholder="Phone" value={tempDetails.phone} onChange={e => setTempDetails({...tempDetails, phone: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50"/>
              </div>
              <button onClick={() => { setCandidate(p => ({...p, ...tempDetails})); setView('interview'); }} disabled={!tempDetails.name || !tempDetails.email || !tempDetails.phone} className="mt-6 w-full bg-white/90 text-black px-8 py-3 rounded-lg font-semibold hover:bg-white transition-colors disabled:bg-white/40 disabled:cursor-not-allowed">
                Confirm and Start
              </button>
          </div>
      );
    case 'upload':
    default:
      return (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl text-center text-white">
            <h2 className="text-3xl font-bold mb-4">AI Interview Assistant</h2>
            <p className="opacity-80 mb-6">Upload your resume (PDF) to begin your automated interview.</p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
            <button onClick={() => fileInputRef.current.click()} className="bg-white/90 text-black px-8 py-3 rounded-lg font-semibold hover:bg-white transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!isPdfjsLoaded}>
                {isPdfjsLoaded ? 'Upload Resume' : 'Loading PDF Reader...'}
            </button>
        </div>
      );
  }
};

export default IntervieweeView;
