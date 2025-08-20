# MyLegos 🧱

A modern, lightweight web application for managing your personal LEGO set collection with real-time data fetching from the Rebrickable API.

![MyLegos Demo](https://img.shields.io/badge/Status-MVP%20Complete-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)

## ✨ Features

- **Minimal Storage**: Only LEGO set numbers stored locally, all display data fetched in real-time
- **API Integration**: Powered by Rebrickable API for accurate LEGO set information
- **Real-time Search**: Instant search by set number or name
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern Tech Stack**: Next.js 14, TypeScript, Prisma, Mantine UI, React Query
- **Add Sets**: Simple modal with API validation before adding
- **Delete Sets**: Remove sets from collection with confirmation
- **Sort & Filter**: Multiple sorting options (date, name, year, set number)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Vercel Postgres database (configured)
- Rebrickable API key

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd mylegos
   npm install
   ```

2. **Set up environment variables:**
   Create `.env.local` with:
   ```env
   DATABASE_URL=your_vercel_postgres_url
   REBRICKABLE_API_KEY=your_rebrickable_api_key
   ```

3. **Initialize database:**
   ```bash
   npm run db:push
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📱 Usage

### Adding LEGO Sets

1. Click the **"Add Set"** button in the header
2. Enter a LEGO set number (e.g., `21034`, `75192`, `10280`)
3. The system validates the set against the Rebrickable API
4. Preview the set details and confirm to add to your collection

### Searching and Filtering

- Use the search bar to find sets by number or name
- Sort by date added, set name, year, or set number
- Toggle between ascending/descending order

### Importing Existing Collection

If you have an existing collection in CSV format:

```bash
npm run import:csv path/to/your/sets.csv
```

The CSV should have one of these column headers:
- `setNumber`
- `set_number` 
- `Set Number`

## 🛠 Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Mantine UI v7** for components
- **TailwindCSS** for utility styling
- **React Query** for API state management
- **Zustand** for local state (if needed)

### Backend & Data
- **Next.js API Routes** for server logic
- **Vercel Postgres** for database
- **Prisma ORM** for database operations
- **Rebrickable API** for LEGO set data

### Database Schema

```sql
CREATE TABLE sets (
  id SERIAL PRIMARY KEY,
  set_number VARCHAR(20) UNIQUE NOT NULL,
  date_added TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🌐 API Endpoints

- `GET /api/sets` - Fetch all sets with LEGO data
- `POST /api/sets` - Add new set to collection
- `DELETE /api/sets/[id]` - Remove set from collection
- `POST /api/sets/validate` - Validate set number with Rebrickable API

## 📋 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run db:push      # Push database schema changes
npm run db:generate  # Generate Prisma client
npm run import:csv   # Import sets from CSV file
```

## 🎨 Design Philosophy

### LEGO-Inspired Colors
- **Red**: `#E3000B` (Primary brand color)
- **Blue**: `#0055BF` (Secondary actions)
- **Yellow**: `#FFD700` (Accents and highlights)

### Responsive Grid
- Mobile: 1 column
- Tablet: 2-3 columns
- Desktop: 4-5 columns
- Large screens: 5+ columns

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Vercel Postgres connection string | Yes |
| `REBRICKABLE_API_KEY` | API key from Rebrickable | Yes |

### Rebrickable API

- **Rate Limit**: 1000 requests/day (free tier)
- **Caching**: 5-minute client-side cache
- **Endpoints Used**: `/lego/sets/{set_number}/`

## 🚢 Deployment on Vercel

### Automatic Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables in Vercel Dashboard**
   - Navigate to Project Settings → Environment Variables
   - Add these required variables:

   | Variable Name | Value | Environment |
   |---------------|-------|-------------|
   | `DATABASE_URL` | Your Postgres connection string | Production |
   | `REBRICKABLE_API_KEY` | Your Rebrickable API key | Production |

4. **Set up Database**
   - Create a Vercel Postgres database in your project
   - Copy the connection string to your environment variables
   - Deploy will automatically run database migrations

### Manual Steps Required on Vercel

#### 1. Database Setup
- **Create Vercel Postgres Database**: In your Vercel project dashboard, go to Storage → Create Database → Postgres
- **Copy Connection String**: Use the connection string in your environment variables
- **Database Schema**: Will be automatically deployed with your first deployment

#### 2. Environment Variables Configuration
In your Vercel project dashboard:
- Navigate to **Settings** → **Environment Variables**
- Add these required variables:
  - `DATABASE_URL`: Your Vercel Postgres connection string
  - `REBRICKABLE_API_KEY`: Your API key from rebrickable.com

#### 3. Domain Configuration (Optional)
- Go to **Settings** → **Domains**
- Add your custom domain if desired
- Vercel provides a free `*.vercel.app` domain automatically

#### 4. Function Configuration (Automatic)
- API routes are automatically configured for serverless functions
- Maximum execution time: 30 seconds (configured in `vercel.json`)

### Manual Vercel CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add REBRICKABLE_API_KEY

# Deploy with environment variables
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues & Future Enhancements

### Potential Improvements
- [ ] Collection analytics and statistics
- [ ] Export collection to PDF/CSV
- [ ] Wishlist functionality
- [ ] Multi-user support with authentication
- [ ] Collection value tracking
- [ ] Social sharing features

### Performance Optimizations
- [x] Image optimization with Next.js Image component
- [x] API response caching with React Query
- [x] Database indexing for fast lookups
- [ ] Server-side rendering for initial page load

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Rebrickable](https://rebrickable.com) for the comprehensive LEGO database API
- [Mantine](https://mantine.dev) for the beautiful UI components
- [Vercel](https://vercel.com) for hosting and database services

---

**Built with ❤️ for LEGO enthusiasts**
