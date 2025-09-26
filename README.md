# AI-Powered Interview Assistant

This is a React application that serves as an AI-powered assistant for conducting technical interviews for a Full Stack (React/Node.js) role.

## Features

- **For Interviewees**:
  - Upload a PDF resume.
  - The application extracts Name, Email, and Phone, and allows for confirmation.
  - A timed interview with 6 AI-generated questions (Easy, Medium, Hard).
  - At the end, receive a final score and a summary of your performance.
  - Progress is saved locally, so you can resume an unfinished interview.

- **For Interviewers**:
  - A dashboard listing all candidates who have completed the interview.
  - Sort candidates by score or name, and search by name or email.
  - View detailed interview transcripts and AI-generated summaries for each candidate.

## Tech Stack

- **React**: Core UI framework.
- **Tailwind CSS**: For all styling and a premium, modern UI.
- **Google Gemini API**: Powers question generation, scoring, and summarization.
- **pdf.js**: For parsing uploaded PDF resumes.
- **Local Storage**: For persisting interview state.

## Getting Started

### Prerequisites

- Node.js and npm (or yarn) installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd ai-interview-assistant
    ```

2.  **Set up environment variables:**
    - Copy `.env.example` to `.env.local`
    - Add your Google Gemini API key: `REACT_APP_GEMINI_API_KEY=your_api_key_here`

3.  **Install dependencies:**
    ```sh
    npm install
    ```

4.  **Run the application:**
    ```sh
    npm start
    ```

The application will be running on `http://localhost:3000`.
