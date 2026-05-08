# StreamKick

StreamKick is a football match and streaming availability aggregator.

It helps users discover football fixtures, kickoff times in their local timezone, legal streaming providers, live score availability, match details, and saved fixture data using MongoDB.

---

## Live Deployment

Frontend:

```text
https://streamkick-six.vercel.app
```

Backend:

```text
https://streamkick-backend.onrender.com
```

GitHub Repository:

```text
https://github.com/Achint123-prog/streamkick
```

Backend health check:

```text
https://streamkick-backend.onrender.com/
```

MongoDB connection test:

```text
https://streamkick-backend.onrender.com/mongo-test
```

Sample deployed MongoDB fixtures route:

```text
https://streamkick-backend.onrender.com/db-fixtures?country=IN&league=Premier%20League&from_date=2024-08-16&to_date=2024-08-25
```

---

## Supported Leagues

The project currently supports:

- Premier League
- La Liga
- Serie A

---

## Features

- View real football fixture data using API-Football
- Save fixture data into MongoDB Atlas
- Read saved fixture data from MongoDB
- Browse fixtures by league
- Select date ranges
- Use quick date filters:
  - Opening Week
  - August 2024
  - September 2024
  - October 2024
- Search matches by team name, league, or match status
- Manually sync selected fixtures into MongoDB
- Reload saved fixtures from MongoDB
- View live scores section
- Handle empty live-score states correctly
- View MongoDB-based fixture detail pages
- See team logos
- See match score for finished matches
- See match status:
  - Scheduled
  - Live
  - Finished
- Convert kickoff time based on selected country
- Support countries across:
  - Asia
  - Europe
  - North America
- Show region-based streaming provider suggestions
- Display match venue and city
- Deploy frontend using Vercel
- Deploy backend using Render
- Use MongoDB Atlas as the cloud database

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel

### Backend

- Python
- FastAPI
- Uvicorn
- Requests
- python-dotenv
- PyMongo
- zoneinfo / tzdata
- Render

### Database

- MongoDB Atlas

### External API

- API-Football / API-SPORTS

---

## Project Structure

```text
sports-aggregator/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env
│   └── venv/
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   └── matches/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── .env.local
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Environment Variables

### Backend `.env`

Create a `.env` file inside the `backend` folder:

```env
API_FOOTBALL_KEY=your_api_key_here
MONGO_URI=your_mongodb_connection_string_here
```

Do not commit your real API key or MongoDB connection string to GitHub.

### Frontend `.env.local`

Create a `.env.local` file inside the `frontend` folder:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

For the deployed Vercel frontend, this environment variable should be:

```env
NEXT_PUBLIC_API_BASE_URL=https://streamkick-backend.onrender.com
```

---

## How to Run Locally

### 1. Start the Backend

```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Useful backend URLs:

```text
http://127.0.0.1:8000/docs
http://127.0.0.1:8000/api-test
http://127.0.0.1:8000/mongo-test
http://127.0.0.1:8000/api-live?country=IN
http://127.0.0.1:8000/db-fixtures?country=IN&league=Premier%20League&from_date=2024-08-16&to_date=2024-08-25
http://127.0.0.1:8000/db-fixture/1208021?country=IN
```

---

### 2. Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

---

## API Endpoints

### Health / Root

```http
GET /
```

Example response:

```json
{
  "message": "Sports Aggregator API is working!"
}
```

---

### API Account Test

```http
GET /api-test
```

This checks whether the API-Football key is working.

---

### MongoDB Connection Test

```http
GET /mongo-test
```

This checks whether the backend can connect to MongoDB Atlas.

Expected success response:

```json
{
  "message": "MongoDB connection successful",
  "database": "streamkick_db"
}
```

---

## API-Football Fixture Endpoints

### Get Fixtures Directly From API-Football

```http
GET /api-fixtures
```

Example:

```http
GET /api-fixtures?country=IN&league=Premier%20League&from_date=2024-08-16&to_date=2024-08-25
```

This fetches data directly from API-Football.

---

### Get One Fixture Directly From API-Football

```http
GET /api-fixture/{fixture_id}
```

Example:

```http
GET /api-fixture/1208021?country=IN
```

---

### Get Live Matches

```http
GET /api-live
```

Example:

```http
GET /api-live?country=IN
```

If no supported matches are live, this returns:

```json
[]
```

---

## MongoDB Fixture Endpoints

### Save Fixtures Into MongoDB

```http
POST /save-fixtures
```

Example:

```http
POST /save-fixtures?country=IN&league=Premier%20League&from_date=2024-08-16&to_date=2024-08-25
```

This endpoint:

1. Fetches fixtures from API-Football
2. Normalizes the data
3. Adds timezone and streaming provider information
4. Saves the fixtures into MongoDB
5. Updates existing fixtures instead of creating duplicates

Example response:

```json
{
  "message": "Fixtures saved to MongoDB",
  "league": "Premier League",
  "country": "IN",
  "from_date": "2024-08-16",
  "to_date": "2024-08-25",
  "saved_count": 0,
  "updated_count": 20,
  "total_fixtures": 20
}
```

---

### Get Saved Fixtures From MongoDB

```http
GET /db-fixtures
```

Example:

```http
GET /db-fixtures?country=IN&league=Premier%20League&from_date=2024-08-16&to_date=2024-08-25
```

This reads saved fixture data from MongoDB instead of calling API-Football again.

---

### Get One Saved Fixture From MongoDB

```http
GET /db-fixture/{fixture_id}
```

Example:

```http
GET /db-fixture/1208021?country=IN
```

This powers the fixture detail page.

---

## MongoDB Workflow

The current project flow is:

```text
API-Football
→ FastAPI backend
→ MongoDB Atlas
→ Next.js frontend
```

The frontend reads saved fixture data from MongoDB using:

```text
GET /db-fixtures
```

The match detail page reads saved match details from MongoDB using:

```text
GET /db-fixture/{fixture_id}
```

The app also includes a frontend button:

```text
Sync selected fixtures to MongoDB
```

This button calls:

```text
POST /save-fixtures
```

and then reloads the saved fixtures from MongoDB.

---

## Deployment Workflow

The project is deployed using:

```text
Frontend → Vercel
Backend → Render
Database → MongoDB Atlas
Repository → GitHub
```

### Deployed Frontend

```text
https://streamkick-six.vercel.app
```

### Deployed Backend

```text
https://streamkick-backend.onrender.com
```

### GitHub Repository

```text
https://github.com/Achint123-prog/streamkick
```

---

## Deployment Notes

### Render Backend Settings

Render backend settings:

```text
Name: streamkick-backend
Language: Python 3
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Render environment variables:

```text
API_FOOTBALL_KEY
MONGO_URI
PYTHON_VERSION=3.11.11
```

`PYTHON_VERSION=3.11.11` was used to avoid MongoDB TLS issues that occurred with a newer Python version.

---

### Vercel Frontend Settings

Vercel frontend settings:

```text
Root Directory: frontend
Framework: Next.js
```

Vercel environment variable:

```text
NEXT_PUBLIC_API_BASE_URL=https://streamkick-backend.onrender.com
```

---

### MongoDB Atlas Network Access

For the deployed Render backend to connect to MongoDB Atlas, MongoDB Network Access must allow Render.

For the demo deployment, the access list includes:

```text
0.0.0.0/0
```

This allows access from anywhere.

For production, this should be restricted more carefully.

---

## Supported Leagues and API IDs

| League | API-Football ID |
|---|---:|
| Premier League | 39 |
| La Liga | 140 |
| Serie A | 135 |

---

## Timezone Support

The backend stores fixture kickoff time in UTC.

Then it converts the time based on the selected country.

Examples:

| Country | Timezone |
|---|---|
| India | Asia/Kolkata |
| United Kingdom | Europe/London |
| United States | America/New_York |
| Japan | Asia/Tokyo |
| Germany | Europe/Berlin |
| Mexico | America/Mexico_City |
| Canada | America/Toronto |

The project supports many countries across:

- Asia
- Europe
- North America

---

## Streaming Provider Logic

Exact streaming rights change by country and season.

For this MVP:

- Some major countries use specific provider mappings
- Other countries use regional fallback providers

Examples:

| Country | Example Providers |
|---|---|
| India | Disney+ Hotstar, FanCode, JioCinema |
| UK | Sky Sports, TNT Sports |
| US | Peacock, ESPN+, Paramount+ |
| Canada | Fubo Canada, TSN |
| Germany | Sky Sport, WOW, DAZN |
| France | Canal+, RMC Sport, beIN Sports |
| Italy | DAZN, Sky Sport Italia |

---

## Live Scores

The backend uses API-Football’s live fixtures endpoint.

The frontend has a Live Scores section.

If there are no Premier League, La Liga, or Serie A matches live at the moment, the app displays:

```text
No Premier League, La Liga, or Serie A matches are live right now.
```

This is expected behavior.

---

## Important Note About Free API Plan

The API-Football free plan may limit access to:

- Current seasons
- Certain live data
- Some query parameters
- Daily request count

For this MVP, the project uses accessible 2024 fixture data because the free plan may restrict newer season data.

MongoDB helps reduce repeated API calls by storing fixture data after it is synced once.

---

## Why MongoDB Was Added

MongoDB was added to improve the project architecture.

Instead of calling API-Football every time the frontend loads, the backend can save fixture data into MongoDB and serve saved data to the frontend.

Benefits:

- Reduces API-Football request usage
- Improves speed after data is saved
- Makes the app more deployment-ready
- Allows future user features like favorites and recommendations
- Allows cached fixture data to be reused
- Creates a real database-backed full-stack architecture

---

## Recommendation System

The earlier MVP included a simple rule-based recommendation idea.

Current real API + MongoDB version focuses on:

- Fixture browsing
- Live score handling
- Match detail pages
- MongoDB fixture storage
- Region/timezone support

Future recommendation logic can use:

- Same league
- Same teams
- Similar kickoff time
- User favorite teams
- User country
- Article keywords
- Previously viewed matches
- Stored MongoDB fixture history

---

## Demo Explanation

StreamKick is a full-stack football streaming availability aggregator.

The user can select a league, country, and date range. The frontend then fetches saved fixture data from the backend. The backend reads the data from MongoDB Atlas. Each fixture includes match teams, score, kickoff time, timezone conversion, venue, status, and legal streaming provider suggestions.

The project uses API-Football to fetch real football data. Instead of calling the API every time, fixtures are synced into MongoDB. This reduces API usage and makes the application faster and more production-ready.

The deployed version uses Vercel for the frontend, Render for the backend, and MongoDB Atlas for the database.

---

## Future Improvements

- Add MongoDB collections for:
  - users
  - favorite teams
  - providers
  - articles
  - recommendations
- Add user login
- Add favorite teams
- Add personalized recommendations
- Add real sports news API
- Add article recommendations
- Add automatic scheduled fixture syncing
- Add caching to reduce API calls further
- Add Docker
- Add cron job for scheduled fixture refresh
- Add Redis caching
- Add ML-based recommendations
- Improve streaming provider accuracy using an official provider API
- Add better error messages on the deployed frontend
- Add custom domain
- Restrict MongoDB network access more securely for production

---

## Resume Title

StreamKick — Football Match & Streaming Availability Aggregator

---

## Resume Description

Built and deployed a full-stack football streaming availability aggregator using FastAPI, Next.js, TypeScript, Tailwind CSS, MongoDB Atlas, Render, Vercel, and API-Football. Implemented real fixture syncing, MongoDB-backed fixture storage, saved fixture detail pages, timezone-based kickoff conversion across Asia, Europe, and North America, live score handling, team logos and scores, date range filters, search, country-based streaming provider suggestions, and a responsive frontend interface.

---

## Skills Demonstrated

- Full-stack development
- REST API design
- FastAPI backend development
- Next.js frontend development
- TypeScript
- Tailwind CSS
- MongoDB Atlas
- PyMongo
- API integration
- Data normalization
- Database storage
- Timezone conversion
- Live score handling
- Environment variable management
- CORS handling
- UI state management
- Frontend-backend integration
- Git and GitHub
- Render backend deployment
- Vercel frontend deployment
- Portfolio-grade project structuring