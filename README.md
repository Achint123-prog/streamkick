# StreamKick

StreamKick is a football match and streaming availability aggregator.

It helps users discover football fixtures, kickoff times in their local timezone, legal streaming providers, live score availability, match details, and saved fixture data using MongoDB.

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
- Search matches by:
  - Team name
  - League
  - Match status
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
- Use FastAPI backend
- Use Next.js frontend
- Use Tailwind CSS for UI

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Uvicorn
- Requests
- python-dotenv
- PyMongo
- zoneinfo / tzdata

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
│   ├── .env
│   └── venv/
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   └── matches/
│   │       └── [id]/
│   │           └── page.tsx
│   └── package.json
│
└── README.md