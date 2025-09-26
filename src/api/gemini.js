const API_KEY = process.env.REACT_APP_GEMINI_API_KEY
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

const callGeminiAPI = async (payload) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }
    return response.json();
};

export const fetchNextQuestionAPI = async (difficulty) => {
    const systemPrompt = "You are a friendly but professional interviewer for a full-stack developer role with a focus on React and Node.js. Ask the candidate a single, concise interview question. Do not ask for code, just concepts. Do not greet them or add any pleasantries, just ask the question.";
    const userQuery = `Ask one ${difficulty} question.`;
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
    };
    const result = await callGeminiAPI(payload);
    return result.candidates[0].content.parts[0].text;
};

export const generateSummaryAPI = async (questions, answers) => {
    const interviewTranscript = questions.map((q, i) => `Question: ${q}\nAnswer: ${answers[i]}`).join('\n\n');
    const systemPrompt = "You are a senior technical recruiter evaluating a candidate for a full-stack developer role (React/Node.js). Analyze the following interview transcript. Provide a final score out of 100 and a concise, professional summary of the candidate's performance, highlighting strengths and weaknesses. Format your response as a JSON object with two keys: 'score' (a number) and 'summary' (a string).";
    const userQuery = `Transcript:\n${interviewTranscript}`;
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" },
    };
    const result = await callGeminiAPI(payload);
    return JSON.parse(result.candidates[0].content.parts[0].text);
};
