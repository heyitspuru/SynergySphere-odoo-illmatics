# 🚀 SynergySphere - Advanced Team Collaboration Platform

**Odoo Hackathon Problem Statement 2 | Team: illmatics**  
*Puru Raj Dhama • Om Thakare • Achal Bajpai*

## 🎯 Overview

An intelligent team collaboration platform that acts as a central nervous system for teams - helping them stay organized, communicate effectively, and work proactively rather than reactively.

**Key Pain Points Solved**: Scattered information, unclear progress, resource confusion, deadline surprises, and communication gaps.

## ✨ Features

- 🔐 **Authentication**: Secure user registration and login
- 📊 **Project Management**: Create and manage team projects  
- ✅ **Smart Tasks**: Assign tasks with status tracking and deadlines
- 👥 **Team Collaboration**: Member management and role-based access
- 💬 **Communication**: Project-based threaded discussions
- 📱 **Mobile-First**: Responsive design for desktop and mobile
- 📈 **Progress Tracking**: Visual task and project status overview

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API, MongoDB, Mongoose
- **Auth**: NextAuth.js with JWT sessions

## 🚀 Quick Start

1. **Prerequisites**: Node.js 18+, pnpm, MongoDB, Git

2. **Setup**:
   ```bash
   git clone https://github.com/heyitspuru/SynergySphere-odoo-illmatics.git
   cd SynergySphere-odoo-illmatics
   pnpm install
   ```

3. **Environment**: Copy `.env.example` to `.env.local` and configure:
   ```env
   MONGODB_URI=mongodb://localhost:27017/synergysphere
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   ```

4. **Run**:
   ```bash
   pnpm dev
   ```
   Visit: [http://localhost:3000](http://localhost:3000)

## 🔧 Development

```bash
pnpm dev      # Development server
pnpm build    # Build for production  
pnpm start    # Start production server
```

## 🚨 Common Issues

- **MongoDB Connection**: Ensure MongoDB is running (`mongosh` to test)
- **Build Errors**: Use `pnpm dev` for development mode
- **Auth Issues**: Check `NEXTAUTH_SECRET` in `.env.local`

## 🚀 Roadmap

- AI-powered task prioritization and workload balancing
- Proactive deadline risk detection
- Real-time collaboration analytics  
- Advanced notifications and file sharing
- Mobile PWA support

---

**Made with ❤️ by Team illmatics for Odoo Hackathon**
