# 🚀 SynergySphere - Advanced Team Collaboration Platform

SynergySphere is a modern team collaboration platform built with Next.js, TypeScript, MongoDB, and NextAuth.js. It provides project management, task tracking, team communication, and real-time collaboration features.

## ✨ Features

- **🔐 Authentication**: Secure user registration and login
- **📊 Project Management**: Create, manage, and track team projects
- **✅ Task Management**: Assign and track tasks with status updates
- **👥 Team Collaboration**: Invite members and manage project teams
- **💬 Communication**: Project-based messaging and discussions
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **🎨 Modern UI**: Built with Tailwind CSS and shadcn/ui components

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js with JWT sessions
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB with Mongoose ODM
- **Icons**: Lucide React

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **pnpm** (recommended) or npm - [Install pnpm](https://pnpm.io/installation)
3. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use MongoDB Atlas (cloud)
4. **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/heyitspuru/SynergySphere-odoo-illmatics.git
cd SynergySphere-odoo-illmatics
```

### 2. Install Dependencies

Using pnpm (recommended):

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

### 3. Set Up MongoDB

#### Option A: Local MongoDB Installation

1. **Download and Install MongoDB Community Server**:

   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download MongoDB Community Server for your OS
   - Follow installation instructions for your platform

2. **Start MongoDB Service**:

   **Windows:**

   ```bash
   # Start MongoDB as a Windows service (usually starts automatically after installation)
   net start MongoDB

   # Or run manually
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
   ```

   **macOS:**

   ```bash
   # If installed via Homebrew
   brew services start mongodb/brew/mongodb-community

   # Or run manually
   mongod --config /usr/local/etc/mongod.conf
   ```

   **Linux:**

   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod  # To start on boot
   ```

3. **Verify MongoDB is Running**:
   ```bash
   # Connect to MongoDB shell
   mongosh
   # or
   mongo
   ```

#### Option B: MongoDB Atlas (Cloud - Easier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string from Atlas dashboard
5. Replace the local MongoDB URI in your `.env.local` file

### 4. Environment Configuration

1. **Copy the environment example file**:

   ```bash
   cp .env.example .env.local
   ```

2. **Update `.env.local` with your configuration**:

   ```env
   # For Local MongoDB
   MONGODB_URI=mongodb://localhost:27017/synergysphere

   # For MongoDB Atlas (replace with your connection string)
   # MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/synergysphere?retryWrites=true&w=majority

   # Authentication (generate a random secret)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

   # Email (optional - for future email notifications)
   EMAIL_SERVER=smtp://username:password@smtp.example.com:587
   EMAIL_FROM=noreply@synergysphere.com
   ```

   **🔑 Generate a secure NEXTAUTH_SECRET**:

   ```bash
   # Generate a random secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### 5. Build and Run the Application

1. **Build the application**:

   ```bash
   pnpm build
   # or
   npm run build
   ```

2. **Start the development server**:

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Using SynergySphere

### First Steps

1. **Register a New Account**:

   - Go to [http://localhost:3000](http://localhost:3000)
   - Click "Sign Up" or navigate to `/auth/register`
   - Create your account with name, email, and password

2. **Login**:

   - Use your credentials to log in at `/auth/login`
   - You'll be redirected to the dashboard

3. **Create Your First Project**:

   - From the dashboard, click "New Project"
   - Fill in project name, description
   - Add team members by email (they need to register first)

4. **Manage Tasks**:
   - Go to your project detail page
   - Create tasks, assign them to team members
   - Track progress and update task statuses

### Key Features Usage

#### 📊 Dashboard

- View all your projects at a glance
- See project statistics and progress
- Quick access to create new projects
- Overview of tasks assigned to you

#### 📁 Projects

- **Create Projects**: Set up new team projects
- **Manage Teams**: Add/remove team members
- **Track Progress**: Monitor project completion
- **Filter & Search**: Find projects quickly

#### ✅ Tasks (API Ready)

- **Create Tasks**: Add tasks to projects
- **Assign Tasks**: Assign to team members
- **Track Status**: Todo, In Progress, Done
- **Set Priorities**: High, Medium, Low
- **Due Dates**: Set task deadlines

#### 👥 Team Collaboration

- **Project Members**: Manage team access
- **Role Management**: Owner, Admin, Member roles
- **Communication**: Project-based messaging (models ready)

## 🗄 Database Schema

The application uses the following main collections:

- **users**: User accounts, profiles, and authentication
- **projects**: Team projects with member management
- **tasks**: Project tasks with assignments and status
- **messages**: Project communications and discussions

## 🔧 Development

### Available Scripts

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

### Project Structure

```
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── projects/          # Project management
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── synergysphere/    # Custom components
├── lib/                   # Utilities and configurations
│   ├── models/           # MongoDB models
│   ├── auth.ts           # NextAuth configuration
│   └── mongodb.ts        # Database connection
└── public/               # Static assets
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:

   ```
   Error: connect ECONNREFUSED 127.0.0.1:27017
   ```

   - Make sure MongoDB is running
   - Check your MONGODB_URI in `.env.local`
   - For Windows, try starting MongoDB service

2. **Build Errors**:

   ```bash
   # Clear Next.js cache
   rm -rf .next
   pnpm dev
   ```

3. **Authentication Issues**:

   - Make sure NEXTAUTH_SECRET is set in `.env.local`
   - Check NEXTAUTH_URL matches your development URL

4. **Port Already in Use**:
   ```bash
   # Use different port
   pnpm dev -p 3001
   ```

### MongoDB Setup Help

**Windows MongoDB Setup**:

1. Download MongoDB Community Server
2. Run installer with default settings
3. MongoDB Compass (GUI) is included
4. Service should start automatically

**Verify MongoDB is Working**:

```bash
# Connect to MongoDB
mongosh

# In MongoDB shell
show dbs
use synergysphere
show collections
```

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot find module './models/User'" Error

**Problem**: TypeScript cannot resolve the User model import
**Solution**:

```bash
# Restart TypeScript service and development server
pnpm dev
```

#### 2. MongoDB Connection Issues

**Problem**: `MongoNetworkError` or connection timeouts
**Solutions**:

- Verify MongoDB is running: `mongosh` (should connect successfully)
- Check `.env.local` file has correct `MONGODB_URI`
- For MongoDB Atlas: Ensure your IP is whitelisted
- For local MongoDB: Start the service (`mongod` command)

#### 3. Build Failures with Webpack

**Problem**: `TypeError: Cannot read properties of undefined (reading 'length')` during build
**Solution**:

```bash
# Use development mode instead
pnpm dev

# Or clean and reinstall
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

#### 4. Port Already in Use

**Problem**: `Port 3000 is already in use`
**Solution**: Next.js will automatically use the next available port (e.g., 3001)

#### 5. Authentication Errors

**Problem**: NextAuth session issues
**Solutions**:

- Ensure `NEXTAUTH_SECRET` is set in `.env.local`
- Generate a new secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Check `NEXTAUTH_URL` matches your development URL

### Development Status ✅

The application successfully runs in **development mode**:

- ✅ Development server starts without errors
- ✅ Pages compile successfully (885+ modules)
- ✅ MongoDB connection configured
- ✅ Authentication system ready
- ⚠️ Production build requires optimization (use `pnpm dev` for now)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help setting up or using SynergySphere:

1. Check the troubleshooting section above
2. Create an issue on GitHub
3. Contact the development team

## 🚀 What's Next?

Future features planned:

- Real-time task board (Kanban interface)
- File attachments and document sharing
- Advanced notifications system
- Project analytics and reporting
- Mobile PWA support
- Real-time chat and messaging

---

**Happy Collaborating with SynergySphere! 🎉**

<p align="center">Made with ❤️ for hackathon enthusiasts everywhere</p>
