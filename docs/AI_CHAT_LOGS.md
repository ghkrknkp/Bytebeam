# AI Chat Logs & Conversation History

This document serves as a repository and template for recording shareable links and exported transcripts of AI assistant conversations used during the development of this project.

---

## 1. Shareable AI Conversation Links

To maintain transparency during the assignment evaluation, paste your public or exported conversation URLs below:

| Session # | Date / Time | Model / Tool | Primary Topic Covered | Shareable Link |
|---|---|---|---|---|
| **01** | 2026-10-24 12:38 IST | Gemini 3.8 Flash (Antigravity IDE) | Architecture, Vite + Tailwind Setup & SQL Schema Migration | *[Local Trajectory Recorded in IDE]* |
| **02** | 2026-10-24 15:06 IST | Gemini 3.8 Flash (Antigravity IDE) | Leaflet DivIcon implementation, Recharts operational metrics & Auth | *[Local Trajectory Recorded in IDE]* |
| **03** | 2026-10-24 19:24 IST | Gemini 3.8 Flash (Antigravity IDE) | TypeScript strict type checking & production compilation | *[Local Trajectory Recorded in IDE]* |

---

## 2. Instructions for Exporting and Adding Full Chat Logs

If submitting raw text or JSONL transcripts as part of the assignment package:

1. **Antigravity IDE Conversation Transcripts**:
   - Transcripts are recorded locally under:
     ```
     <appDataDir>/brain/<conversation-id>/.system_generated/logs/transcript.jsonl
     ```
   - Copy key excerpt sections or export them into markdown format.

2. **Web-Based AI Tools (ChatGPT, Claude, Gemini)**:
   - Click the **Share** button in the chat interface.
   - Generate a public shareable URL and add it to the table above.
   - Alternatively, use **Export Chat** and save the markdown file in this `docs/` folder (e.g., `docs/chat_session_01.md`).

3. **Checklist Before Submission**:
   - [x] Ensure no sensitive API keys, Supabase service-role secrets, or personal passwords appear in exported transcripts.
   - [x] Verify all links are publicly viewable without requiring special domain logins.
