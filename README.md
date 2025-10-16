# AI Schedule App

A modern AI-powered schedule management application built with Next.js, Supabase, and Google Gemini.

## Features

- 🤖 **AI-Powered Scheduling**: Create tasks using natural language commands
- 📋 **Visual Kanban Board**: Drag-and-drop task management interface
- 🔐 **Secure Authentication**: User authentication with Supabase Auth
- 🌙 **Dark/Light Mode**: Toggle between themes
- 📱 **Responsive Design**: Works perfectly on desktop and mobile
- ⚡ **Real-time Updates**: Live synchronization across devices
- 🎨 **Modern UI**: Clean, minimalist design with smooth animations

## Tech Stack

### Frontend
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **State Management**: React Context API, Zustand

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Real-time
- **AI Integration**: Google Gemini 2.0 Flash

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account and project
- Google AI API key

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-schedule-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

**Option A: Automated Setup (Recommended)**
```bash
npm run setup
```
This will guide you through entering your credentials and automatically create the `.env.local` file.

**Option B: Manual Setup**
Copy the example file and create your `.env.local`:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

### 4. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase/schema.sql`

This will create:
- `schedules` table with proper RLS policies
- Indexes for optimal performance
- Security policies for user data isolation

### 5. Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add it to your `.env.local` file

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication

1. Sign up for a new account or sign in
2. Email verification is required for new accounts

### Creating Tasks

#### Manual Creation
1. Click "Add New Task" in the dashboard
2. Fill in the title, description (optional), and due date
3. Click "Add Task"

#### AI-Powered Creation
1. Use the AI chat interface on the right side
2. Type natural language commands like:
   - "Schedule a meeting for tomorrow at 2 PM"
   - "Create a task to finish the project by Friday"
   - "Add a reminder to call mom tomorrow morning"

### Managing Tasks

- **Drag and Drop**: Move tasks between To Do, In Progress, and Completed columns
- **Edit**: Click the Edit button on any task to modify it
- **Complete**: Click the checkbox to mark tasks as complete
- **Delete**: Click the Delete button to remove tasks

## AI Commands Examples

- "Schedule a team meeting for tomorrow at 3 PM"
- "Create a task to review the quarterly report by Friday"
- "Add a reminder to submit the assignment next Monday at 9 AM"
- "Schedule multiple tasks: workout at 6 AM, breakfast at 8 AM, meeting at 10 AM"
- "Create a task to call the client next week"

## Project Structure

```
ai-schedule-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AddScheduleForm.tsx
│   ├── AIChatInterface.tsx
│   ├── LoginForm.tsx
│   ├── ScheduleItem.tsx
│   └── SimpleKanbanBoard.tsx
├── contexts/              # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── lib/                   # Utility libraries
│   ├── gemini.ts
│   └── supabase.ts
├── supabase/              # Database schema
│   └── schema.sql
└── README.md
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `GOOGLE_AI_API_KEY` | Google AI API key | Yes |

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Digital Ocean
- Railway

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs are validated and sanitized
- **Environment Variables**: Sensitive data is stored securely
- **HTTPS Required**: Production deployments require HTTPS

## Performance Optimizations

- **React.memo**: Component memoization for better performance
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Built-in Next.js image optimization
- **Database Indexes**: Optimized queries with proper indexes
- **Lazy Loading**: Components are loaded as needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Join our [Discord](https://discord.gg/your-invite) for community support

## Future Enhancements

- [ ] Email notifications for upcoming tasks
- [ ] Calendar view integration
- [ ] Task categories and labels
- [ ] Recurring tasks functionality
- [ ] Team collaboration features
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Export/Import functionality
