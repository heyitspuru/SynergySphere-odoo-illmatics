
# HackThisIdea

<div align="center">
  <img src="public/hackconnect-logo.svg" alt="HackThisIdea Logo" width="120" height="120" />
  <h3 align="center">The Ultimate Hackathon Companion</h3>
  <p align="center">Connect with teammates, generate innovative ideas, and build winning projects.</p>
</div>

<p align="center">
  <a href="https://github.com/achalbajpai/hackthisidea/issues">Report Bug</a> • 
  <a href="https://github.com/achalbajpai/hackthisidea/issues">Request Feature</a>
</p>

## 📋 Overview

HackThisIdea is a comprehensive platform designed to enhance the hackathon experience. It helps participants find the perfect teammates, generate innovative project ideas, and track upcoming hackathon events.

## ✨ Features

-  **Team Builder** - Find teammates with complementary skills based on interests and abilities
-  **AI Idea Generator** - Generate innovative project ideas tailored to hackathon themes
-  **Event Tracker** - Discover upcoming hackathons and manage your schedule
-  **Resource Hub** - Access curated libraries, APIs, and templates to accelerate development
-  **Project Showcase** - Display your hackathon projects to get feedback and recognition

## 🚀 Technologies

-  **Frontend**: Next.js, React, TypeScript, Tailwind CSS
-  **Backend**: Next.js API Routes
-  **Database**: MongoDB
-  **AI**: Integration with Nebius API for idea generation
-  **Deployment**: Vercel (recommended)

## 🛠️ Getting Started

### Prerequisites

-  Node.js (v18 or newer)
-  npm or pnpm
-  MongoDB instance (local or Atlas)

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/achalbajpai/hackthisidea.git
   cd hackthisidea
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:

   ```
   MONGODB_URI=mongodb://localhost:27017/hackthisidea
   NEBIUS_API_KEY=your_nebius_api_key
   ```

4. Run the development server

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application

## 📊 Project Structure

```
hackthisidea/
├── app/                # Next.js app directory
│   ├── (landing)/      # Landing page routes
│   ├── api/            # API routes
│   ├── dashboard/      # Dashboard routes
│   └── ...
├── components/         # React components
│   ├── hackconnect/    # Main application components
│   ├── ui/             # UI components
│   └── ...
├── lib/                # Utility functions and shared code
│   ├── models/         # MongoDB models
│   └── mongodb.ts      # MongoDB connection
├── public/             # Static assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to help improve HackConnect.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

Project Link: [https://github.com/achalbajpai/hackthisidea](https://github.com/achalbajpai/hackthisidea)

---

<p align="center">Made with ❤️ for hackathon enthusiasts everywhere</p>
