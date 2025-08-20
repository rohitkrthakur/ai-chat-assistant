# AI Chat Assistant

A chat-based AI assistant built with **Next.js**, **Vercel AI SDK**, and **Drizzle ORM**. The assistant can respond to user queries and fetch real-world data such as **weather** and **stock prices** using APIs. Chat history is persisted in the database and accessible upon login.

---

## Features

- **OAuth Authentication**: Login via Google & GitHub  
- **Protected Routes**: Only authenticated users can access the chat interface  
- **AI Chat with Tool Calling**:  
  - Weather information (`OpenWeatherMap`)  
  - Stock prices (`Alpha Vantage`)  
  - Default conversational responses  
- **Persistent Chat History**: Saved in **Neon DB** via **Drizzle ORM**  
- **Streaming Responses**: Real-time AI assistant responses using Vercel AI SDK  
- **SSR + CSR Mix**: Optimized rendering for fast load times  
- **Responsive UI**: Built with **shadcn/ui** components  

---

## Tech Stack

- **Frontend**: Next.js (TypeScript), React  
- **UI**: shadcn/ui, Tailwind CSS  
- **Backend**: Serverless functions via Next.js API routes  
- **Database**: Neon DB (PostgreSQL) with Drizzle ORM  
- **Authentication**: NextAuth.js (Google & GitHub OAuth)  
- **AI Integration**: Vercel AI SDK  
- **APIs**: OpenWeatherMap, Alpha Vantage  

---

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-chat-assistant.git
   cd ai-chat-assistant
