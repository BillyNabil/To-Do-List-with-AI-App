# AI Schedule App - Technical Specification

## Overview

AI Schedule App adalah aplikasi web manajemen jadwal modern yang ditenagai oleh AI, dibangun dengan Next.js, Supabase, dan Google Gemini. Aplikasi ini memungkinkan pengguna membuat dan mengelola jadwal mereka menggunakan perintah bahasa alami.

## Ringkasan Aplikasi

### Deskripsi Singkat
Aplikasi penjadwalan pintar yang menggunakan AI untuk memahami perintah bahasa alami dan mengubahnya menjadi jadwal terstruktur. Pengguna dapat menambah, mengedit, dan mengelola tugas mereka melalui antarmuka yang modern dan responsif.

### Fitur Utama
- **AI-Powered Scheduling**: Pembuatan tugas menggunakan bahasa alami
- **User Authentication**: Sistem autentikasi yang aman dengan Supabase
- **Modern UI**: Desain minimalis dengan toggle dark/light mode
- **Real-time Updates**: Sinkronisasi langsung antar perangkat
- **Responsive Design**: Berjalan sempurna di desktop dan mobile
- **Kanban Board**: Manajemen tugas visual dengan drag-and-drop
- **CRUD Operations**: Manajemen jadwal lengkap (Create, Read, Update, Delete)

## Arsitektur Teknis

### Teknologi Stack

#### Frontend
- **Framework**: Next.js terbaru + shadcn 
- **Styling**: Tailwind CSS 4.1.14
- **Icons**: Heroicons & Headless UI
- **Drag & Drop**: @dnd-kit/core
- **State Management**: React Context API + Zustand
- tambahkan framework animasi yang lightweight namun bagus

#### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Real-time
- **API**: Next.js API Routes
- **AI Integration**: Google Gemini 2.0 Flash

#### Infrastructure
- **Deployment**: Vercel (recommended)
- **Environment**: Node.js 18+
- **Package Manager**: npm





### Tabel: schedules

```sql
CREATE TABLE public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

#### Field Descriptions:
- **id**: UUID primary key, auto-generated
- **user_id**: Foreign key ke auth.users, untuk isolasi data pengguna
- **title**: Judul tugas (wajib)
- **description**: Deskripsi detail tugas (opsional)
- **due_date**: Tenggat waktu tugas (opsional)
- **is_completed**: Status penyelesaian tugas
- **created_at**: Timestamp pembuatan record

### Security Policies
- **Row Level Security (RLS)**: Diaktifkan untuk isolasi data
- **user_can_read_own_schedules**: Pengguna hanya bisa lihat jadwalnya
- **user_can_create_own_schedules**: Pengguna hanya bisa buat jadwal untuk dirinya
- **user_can_update_own_schedules**: Pengguna hanya bisa update jadwalnya
- **user_can_delete_own_schedules**: Pengguna hanya bisa hapus jadwalnya

### Indexes
- `idx_schedules_user_id`: Untuk query berdasarkan user
- `idx_schedules_created_at`: Untuk sorting berdasarkan waktu
- `idx_schedules_due_date`: Untuk query berdasarkan tenggat waktu
- `idx_schedules_is_completed`: Untuk filter status

## API Endpoints

### POST /api/parse-schedule

**Deskripsi**: Parse perintah bahasa alami menjadi data jadwal terstruktur menggunakan Google Gemini.

**Request**:
```json
{
  "message": "Schedule a meeting for tomorrow at 2 PM"
}
```

**Response (Single Task)**:
```json
{
  "title": "Team meeting",
  "description": null,
  "due_date": "2025-10-17T14:00:00.000Z"
}
```

**Response (Multiple Tasks)**:
```json
[
  {
    "title": "Team standup",
    "description": null,
    "due_date": "2025-10-13T09:00:00.000Z"
  },
  {
    "title": "Client meeting",
    "description": null,
    "due_date": "2025-10-14T14:00:00.000Z"
  }
]
```

**Error Response**:
```json
{
  "error": "Could not understand the request format"
}
```

#### AI Processing Rules:
1. Parse multiple tasks jika ada dalam satu pesan
2. Handle relative dates (tomorrow, next week, etc.)
3. Default time: 9:00 AM jika tidak disebutkan
4. Default date: hari ini jika tidak disebutkan
5. Return JSON response yang valid
6. ISO 8601 format untuk dates

## Component Architecture

### Authentication Flow
1. **AuthContext**: Mengelola state autentikasi global
2. **Login/Register Pages**: Form untuk user authentication
3. **Protected Routes**: Middleware untuk halaman yang memerlukan login
4. **Session Management**: Supabase auth untuk session handling

### Theme Management
1. **ThemeContext**: State management untuk tema
2. **ThemeToggle**: Component untuk switch tema
3. **SSR Handling**: Prevent hydration mismatch dengan `mounted` state
4. **Persistence**: Theme preference di localStorage

### Schedule Management
1. **SimpleKanbanBoard**: Main component untuk task management
2. **ScheduleItem**: Individual task component
3. **AddScheduleForm**: Manual task creation form
4. **Real-time Updates**: Supabase subscriptions untuk live sync

### AI Integration
1. **AIChatInterface**: Chat interface untuk AI commands
2. **AIChatPopup**: Floating chat widget
3. **Parse API**: Backend endpoint untuk AI processing
4. **Natural Language Processing**: Google Gemini 2.0 Flash

## State Management

### AuthContext
```javascript
{
  user: Object | null,
  loading: Boolean,
  signUp: Function,
  signIn: Function,
  signOut: Function
}
```

### ThemeContext
```javascript
{
  theme: 'light' | 'dark',
  toggleTheme: Function,
  mounted: Boolean (SSR helper)
}
```

### Local Component States
- **schedules**: Array of schedule objects
- **loading**: Loading states untuk async operations
- **refreshKey**: Key untuk force re-render components

## Security Considerations

### Authentication & Authorization
- Supabase Auth untuk user management
- Row Level Security (RLS) untuk data isolation
- JWT tokens untuk session management
- Environment variables untuk API keys

### Data Protection
- User data isolation dengan RLS policies
- Input validation untuk AI parsing
- Rate limiting untuk API endpoints
- CORS configuration untuk API security

### API Security
- Environment variables untuk sensitive data
- Input sanitization untuk prevent injection
- Error handling untuk prevent information leakage
- HTTPS requirement untuk production

## Performance Optimizations

### Frontend
- React.memo untuk component memoization
- useMemo dan useCallback untuk optimization
- Lazy loading untuk components
- Image optimization dengan Next.js
- Code splitting untuk bundle optimization

### Backend
- Database indexes untuk query optimization
- Connection pooling dengan Supabase
- Caching untuk AI responses
- CDN untuk static assets

### Real-time Performance
- Debounced updates untuk prevent excessive re-renders
- Optimistic updates untuk better UX
- Subscription management untuk prevent memory leaks

## Deployment & Infrastructure

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI Configuration
GOOGLE_AI_API_KEY=your_gemini_api_key
```

### Build Configuration
- Next.js production build optimization
- Tailwind CSS purging untuk minimal CSS
- Asset optimization dan compression
- Environment-specific configurations

### Deployment Platforms
- **Vercel**: Recommended untuk Next.js apps
- **Netlify**: Alternative deployment option
- **AWS**: Untuk enterprise scale
- **Docker**: Untuk containerized deployment

## Development Workflow

### Local Development
```bash
npm install
npm run dev
```

### Code Quality
- ESLint untuk code linting
- Prettier untuk code formatting
- Git hooks untuk pre-commit checks
- TypeScript untuk type safety (future enhancement)

### Testing Strategy
- Unit tests untuk components
- Integration tests untuk API endpoints
- E2E tests untuk user flows
- Performance testing untuk optimization

## Future Enhancements

### Planned Features
- [ ] Email notifications untuk upcoming tasks
- [ ] Calendar view integration
- [ ] Task categories dan labels
- [ ] Recurring tasks functionality
- [ ] Team collaboration features
- [ ] Mobile app development
- [ ] Analytics dashboard
- [ ] Export/Import functionality

### Technical Improvements
- [ ] TypeScript migration
- [ ] Advanced error boundaries
- [ ] Service worker untuk offline support
- [ ] Webhook integration
- [ ] Advanced AI features
- [ ] Performance monitoring
- [ ] A/B testing framework

## Monitoring & Analytics

### Application Monitoring
- Error tracking dengan Sentry (future)
- Performance monitoring dengan Vercel Analytics
- User behavior analytics
- API response time monitoring

### Business Metrics
- User engagement tracking
- Feature usage analytics
- Conversion funnels
- Retention rates

## Support & Maintenance

### Troubleshooting
- Environment variable validation
- Database connection checks
- API key verification
- Browser console error analysis

### Regular Maintenance
- Dependency updates
- Security patches
- Performance optimization
- Database cleanup tasks

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Maintainer**: AI Schedule App Development Team
