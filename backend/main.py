import os
from datetime import datetime
from zoneinfo import ZoneInfo

import requests
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://streamkick-six.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo_uri = os.getenv("MONGO_URI")

mongo_client = None
db = None

if mongo_uri:
    mongo_client = MongoClient(mongo_uri)
    db = mongo_client["streamkick_db"]


country_timezones = {
    # Asia
    "AF": "Asia/Kabul",
    "AM": "Asia/Yerevan",
    "AZ": "Asia/Baku",
    "BH": "Asia/Bahrain",
    "BD": "Asia/Dhaka",
    "BT": "Asia/Thimphu",
    "BN": "Asia/Brunei",
    "KH": "Asia/Phnom_Penh",
    "CN": "Asia/Shanghai",
    "CY": "Asia/Nicosia",
    "GE": "Asia/Tbilisi",
    "IN": "Asia/Kolkata",
    "ID": "Asia/Jakarta",
    "IR": "Asia/Tehran",
    "IQ": "Asia/Baghdad",
    "IL": "Asia/Jerusalem",
    "JP": "Asia/Tokyo",
    "JO": "Asia/Amman",
    "KZ": "Asia/Almaty",
    "KW": "Asia/Kuwait",
    "KG": "Asia/Bishkek",
    "LA": "Asia/Vientiane",
    "LB": "Asia/Beirut",
    "MY": "Asia/Kuala_Lumpur",
    "MV": "Indian/Maldives",
    "MN": "Asia/Ulaanbaatar",
    "MM": "Asia/Yangon",
    "NP": "Asia/Kathmandu",
    "KP": "Asia/Pyongyang",
    "OM": "Asia/Muscat",
    "PK": "Asia/Karachi",
    "PS": "Asia/Gaza",
    "PH": "Asia/Manila",
    "QA": "Asia/Qatar",
    "SA": "Asia/Riyadh",
    "SG": "Asia/Singapore",
    "KR": "Asia/Seoul",
    "LK": "Asia/Colombo",
    "SY": "Asia/Damascus",
    "TW": "Asia/Taipei",
    "TJ": "Asia/Dushanbe",
    "TH": "Asia/Bangkok",
    "TL": "Asia/Dili",
    "TM": "Asia/Ashgabat",
    "AE": "Asia/Dubai",
    "UZ": "Asia/Tashkent",
    "VN": "Asia/Ho_Chi_Minh",
    "YE": "Asia/Aden",

    # Europe
    "AL": "Europe/Tirane",
    "AD": "Europe/Andorra",
    "AT": "Europe/Vienna",
    "BY": "Europe/Minsk",
    "BE": "Europe/Brussels",
    "BA": "Europe/Sarajevo",
    "BG": "Europe/Sofia",
    "HR": "Europe/Zagreb",
    "CZ": "Europe/Prague",
    "DK": "Europe/Copenhagen",
    "EE": "Europe/Tallinn",
    "FI": "Europe/Helsinki",
    "FR": "Europe/Paris",
    "DE": "Europe/Berlin",
    "GR": "Europe/Athens",
    "HU": "Europe/Budapest",
    "IS": "Atlantic/Reykjavik",
    "IE": "Europe/Dublin",
    "IT": "Europe/Rome",
    "LV": "Europe/Riga",
    "LI": "Europe/Vaduz",
    "LT": "Europe/Vilnius",
    "LU": "Europe/Luxembourg",
    "MT": "Europe/Malta",
    "MD": "Europe/Chisinau",
    "MC": "Europe/Monaco",
    "ME": "Europe/Podgorica",
    "NL": "Europe/Amsterdam",
    "MK": "Europe/Skopje",
    "NO": "Europe/Oslo",
    "PL": "Europe/Warsaw",
    "PT": "Europe/Lisbon",
    "RO": "Europe/Bucharest",
    "RU": "Europe/Moscow",
    "SM": "Europe/San_Marino",
    "RS": "Europe/Belgrade",
    "SK": "Europe/Bratislava",
    "SI": "Europe/Ljubljana",
    "ES": "Europe/Madrid",
    "SE": "Europe/Stockholm",
    "CH": "Europe/Zurich",
    "TR": "Europe/Istanbul",
    "UA": "Europe/Kyiv",
    "UK": "Europe/London",
    "VA": "Europe/Vatican",

    # North America
    "AG": "America/Antigua",
    "BS": "America/Nassau",
    "BB": "America/Barbados",
    "BZ": "America/Belize",
    "CA": "America/Toronto",
    "CR": "America/Costa_Rica",
    "CU": "America/Havana",
    "DM": "America/Dominica",
    "DO": "America/Santo_Domingo",
    "SV": "America/El_Salvador",
    "GD": "America/Grenada",
    "GT": "America/Guatemala",
    "HT": "America/Port-au-Prince",
    "HN": "America/Tegucigalpa",
    "JM": "America/Jamaica",
    "MX": "America/Mexico_City",
    "NI": "America/Managua",
    "PA": "America/Panama",
    "KN": "America/St_Kitts",
    "LC": "America/St_Lucia",
    "VC": "America/St_Vincent",
    "TT": "America/Port_of_Spain",
    "US": "America/New_York",
}

country_regions = {
    # Asia
    "AF": "ASIA", "AM": "ASIA", "AZ": "ASIA", "BH": "ASIA", "BD": "ASIA",
    "BT": "ASIA", "BN": "ASIA", "KH": "ASIA", "CN": "ASIA", "CY": "ASIA",
    "GE": "ASIA", "IN": "ASIA", "ID": "ASIA", "IR": "ASIA", "IQ": "ASIA",
    "IL": "ASIA", "JP": "ASIA", "JO": "ASIA", "KZ": "ASIA", "KW": "ASIA",
    "KG": "ASIA", "LA": "ASIA", "LB": "ASIA", "MY": "ASIA", "MV": "ASIA",
    "MN": "ASIA", "MM": "ASIA", "NP": "ASIA", "KP": "ASIA", "OM": "ASIA",
    "PK": "ASIA", "PS": "ASIA", "PH": "ASIA", "QA": "ASIA", "SA": "ASIA",
    "SG": "ASIA", "KR": "ASIA", "LK": "ASIA", "SY": "ASIA", "TW": "ASIA",
    "TJ": "ASIA", "TH": "ASIA", "TL": "ASIA", "TM": "ASIA", "AE": "ASIA",
    "UZ": "ASIA", "VN": "ASIA", "YE": "ASIA",

    # Europe
    "AL": "EUROPE", "AD": "EUROPE", "AT": "EUROPE", "BY": "EUROPE",
    "BE": "EUROPE", "BA": "EUROPE", "BG": "EUROPE", "HR": "EUROPE",
    "CZ": "EUROPE", "DK": "EUROPE", "EE": "EUROPE", "FI": "EUROPE",
    "FR": "EUROPE", "DE": "EUROPE", "GR": "EUROPE", "HU": "EUROPE",
    "IS": "EUROPE", "IE": "EUROPE", "IT": "EUROPE", "LV": "EUROPE",
    "LI": "EUROPE", "LT": "EUROPE", "LU": "EUROPE", "MT": "EUROPE",
    "MD": "EUROPE", "MC": "EUROPE", "ME": "EUROPE", "NL": "EUROPE",
    "MK": "EUROPE", "NO": "EUROPE", "PL": "EUROPE", "PT": "EUROPE",
    "RO": "EUROPE", "RU": "EUROPE", "SM": "EUROPE", "RS": "EUROPE",
    "SK": "EUROPE", "SI": "EUROPE", "ES": "EUROPE", "SE": "EUROPE",
    "CH": "EUROPE", "TR": "EUROPE", "UA": "EUROPE", "UK": "EUROPE",
    "VA": "EUROPE",

    # North America
    "AG": "NORTH_AMERICA", "BS": "NORTH_AMERICA", "BB": "NORTH_AMERICA",
    "BZ": "NORTH_AMERICA", "CA": "NORTH_AMERICA", "CR": "NORTH_AMERICA",
    "CU": "NORTH_AMERICA", "DM": "NORTH_AMERICA", "DO": "NORTH_AMERICA",
    "SV": "NORTH_AMERICA", "GD": "NORTH_AMERICA", "GT": "NORTH_AMERICA",
    "HT": "NORTH_AMERICA", "HN": "NORTH_AMERICA", "JM": "NORTH_AMERICA",
    "MX": "NORTH_AMERICA", "NI": "NORTH_AMERICA", "PA": "NORTH_AMERICA",
    "KN": "NORTH_AMERICA", "LC": "NORTH_AMERICA", "VC": "NORTH_AMERICA",
    "TT": "NORTH_AMERICA", "US": "NORTH_AMERICA",
}

league_ids = {
    "Premier League": 39,
    "La Liga": 140,
    "Serie A": 135,
}

supported_league_ids = set(league_ids.values())

regional_streaming_providers = {
    "ASIA": {
        "Premier League": ["Regional Sports Broadcaster"],
        "La Liga": ["Regional Sports Broadcaster"],
        "Serie A": ["Regional Sports Broadcaster"],
    },
    "EUROPE": {
        "Premier League": ["Sky / DAZN / Regional Broadcaster"],
        "La Liga": ["DAZN / beIN / Regional Broadcaster"],
        "Serie A": ["DAZN / Sky / Regional Broadcaster"],
    },
    "NORTH_AMERICA": {
        "Premier League": ["Peacock / Fubo / Regional Broadcaster"],
        "La Liga": ["ESPN+ / TSN / Regional Broadcaster"],
        "Serie A": ["Paramount+ / Fubo / Regional Broadcaster"],
    },
    "GLOBAL": {
        "Premier League": ["Check official broadcaster"],
        "La Liga": ["Check official broadcaster"],
        "Serie A": ["Check official broadcaster"],
    },
}

country_specific_streaming_providers = {
    "IN": {
        "Premier League": ["Disney+ Hotstar"],
        "La Liga": ["FanCode"],
        "Serie A": ["JioCinema", "FanCode"],
    },
    "UK": {
        "Premier League": ["Sky Sports", "TNT Sports"],
        "La Liga": ["Premier Sports"],
        "Serie A": ["TNT Sports"],
    },
    "US": {
        "Premier League": ["Peacock", "NBC Sports"],
        "La Liga": ["ESPN+"],
        "Serie A": ["Paramount+"],
    },
    "CA": {
        "Premier League": ["Fubo Canada"],
        "La Liga": ["TSN", "RDS"],
        "Serie A": ["Fubo Canada"],
    },
    "DE": {
        "Premier League": ["Sky Sport", "WOW"],
        "La Liga": ["DAZN"],
        "Serie A": ["DAZN"],
    },
    "FR": {
        "Premier League": ["Canal+", "RMC Sport"],
        "La Liga": ["beIN Sports"],
        "Serie A": ["beIN Sports"],
    },
    "ES": {
        "Premier League": ["DAZN"],
        "La Liga": ["Movistar Plus+", "DAZN"],
        "Serie A": ["Movistar Plus+"],
    },
    "IT": {
        "Premier League": ["Sky Sport Italia"],
        "La Liga": ["DAZN"],
        "Serie A": ["DAZN", "Sky Sport Italia"],
    },
}


def convert_kickoff_time(kickoff_utc, country):
    country = country.upper()
    timezone_name = country_timezones.get(country, "Asia/Kolkata")

    utc_time = datetime.fromisoformat(kickoff_utc.replace("Z", "+00:00"))
    local_time = utc_time.astimezone(ZoneInfo(timezone_name))

    return local_time.strftime("%d %b %Y, %I:%M %p %Z")


def get_streaming_providers(league_name, country):
    country = country.upper()

    if country in country_specific_streaming_providers:
        return country_specific_streaming_providers[country].get(
            league_name,
            ["Check official broadcaster"],
        )

    region = country_regions.get(country, "GLOBAL")

    return regional_streaming_providers.get(
        region,
        regional_streaming_providers["GLOBAL"],
    ).get(
        league_name,
        ["Check official broadcaster"],
    )


def add_streaming_and_time(match, country):
    country = country.upper()

    return {
        **match,
        "country": country,
        "timezone": country_timezones.get(country, "Asia/Kolkata"),
        "kickoff_time": convert_kickoff_time(match["kickoff_utc"], country),
        "streaming_providers": get_streaming_providers(match["league"], country),
    }


def normalize_api_status(status_short):
    if status_short in ["1H", "2H", "HT", "ET", "BT", "P", "LIVE"]:
        return "Live"

    if status_short in ["FT", "AET", "PEN"]:
        return "Finished"

    return "Scheduled"


def normalize_api_fixture(item, country):
    fixture = item.get("fixture", {})
    teams = item.get("teams", {})
    league = item.get("league", {})

    kickoff_utc = fixture.get("date")
    status_short = fixture.get("status", {}).get("short", "NS")
    goals = item.get("goals", {})

    match = {
        "id": fixture.get("id"),
        "league": league.get("name", "Unknown League"),
        "league_id": league.get("id"),
        "home_team": teams.get("home", {}).get("name", "Unknown"),
        "away_team": teams.get("away", {}).get("name", "Unknown"),
        "home_logo": teams.get("home", {}).get("logo"),
        "away_logo": teams.get("away", {}).get("logo"),
        "kickoff_utc": kickoff_utc,
        "venue": fixture.get("venue", {}).get("name") or "TBD",
        "city": fixture.get("venue", {}).get("city") or "TBD",
        "status": normalize_api_status(status_short),
        "status_short": status_short,
        "elapsed": fixture.get("status", {}).get("elapsed"),
        "home_goals": goals.get("home"),
        "away_goals": goals.get("away"),
    }

    return add_streaming_and_time(match, country)


def get_api_headers():
    api_key = os.getenv("API_FOOTBALL_KEY")

    if not api_key:
        return None

    return {
        "x-apisports-key": api_key,
    }


def fetch_api_fixtures_for_league(
    league_name,
    country,
    season=2024,
    from_date="2024-08-16",
    to_date="2024-08-25",
):
    headers = get_api_headers()

    if headers is None:
        return {"error": "API key not found"}

    url = "https://v3.football.api-sports.io/fixtures"

    params = {
        "league": league_ids[league_name],
        "season": season,
        "from": from_date,
        "to": to_date,
    }

    response = requests.get(url, headers=headers, params=params)
    data = response.json()

    if data.get("errors"):
        return {"error": data.get("errors")}

    return [normalize_api_fixture(item, country) for item in data.get("response", [])]


def fetch_api_fixture_by_id(fixture_id, country):
    headers = get_api_headers()

    if headers is None:
        return {"error": "API key not found"}

    url = "https://v3.football.api-sports.io/fixtures"

    params = {
        "id": fixture_id,
    }

    response = requests.get(url, headers=headers, params=params)
    data = response.json()

    if data.get("errors"):
        return {"error": data.get("errors")}

    response_items = data.get("response", [])

    if not response_items:
        return {"error": "Fixture not found"}

    return normalize_api_fixture(response_items[0], country)


def fetch_live_matches(country):
    headers = get_api_headers()

    if headers is None:
        return {"error": "API key not found"}

    url = "https://v3.football.api-sports.io/fixtures"

    params = {
        "live": "all",
    }

    response = requests.get(url, headers=headers, params=params)
    data = response.json()

    if data.get("errors"):
        return {"error": data.get("errors")}

    live_matches = []

    for item in data.get("response", []):
        league = item.get("league", {})
        league_id = league.get("id")

        if league_id in supported_league_ids:
            live_matches.append(normalize_api_fixture(item, country))

    return live_matches


@app.get("/")
def home():
    return {"message": "Sports Aggregator API is working!"}


@app.get("/api-test")
def api_test():
    headers = get_api_headers()

    if headers is None:
        return {"error": "API key not found"}

    url = "https://v3.football.api-sports.io/status"

    response = requests.get(url, headers=headers)

    return response.json()


@app.get("/mongo-test")
def mongo_test():
    if mongo_client is None or db is None:
        return {"error": "MongoDB connection string not found"}

    try:
        mongo_client.admin.command("ping")
        return {
            "message": "MongoDB connection successful",
            "database": "streamkick_db",
        }
    except Exception as error:
        return {
            "error": "MongoDB connection failed",
            "details": str(error),
        }


@app.get("/api-fixtures")
def api_fixtures(
    country: str = "IN",
    league: str = "Premier League",
    from_date: str = "2024-08-16",
    to_date: str = "2024-08-25",
):
    if league not in league_ids:
        return {
            "error": "Unsupported league",
            "supported_leagues": list(league_ids.keys()),
        }

    return fetch_api_fixtures_for_league(
        league_name=league,
        country=country,
        from_date=from_date,
        to_date=to_date,
    )


@app.get("/api-fixture/{fixture_id}")
def api_fixture_detail(fixture_id: int, country: str = "IN"):
    return fetch_api_fixture_by_id(fixture_id, country)


@app.get("/api-live")
def api_live(country: str = "IN"):
    return fetch_live_matches(country)


@app.post("/save-fixtures")
def save_fixtures(
    country: str = "IN",
    league: str = "Premier League",
    from_date: str = "2024-08-16",
    to_date: str = "2024-08-25",
):
    if db is None:
        return {"error": "MongoDB is not connected"}

    if league not in league_ids:
        return {
            "error": "Unsupported league",
            "supported_leagues": list(league_ids.keys()),
        }

    fixtures = fetch_api_fixtures_for_league(
        league_name=league,
        country=country,
        from_date=from_date,
        to_date=to_date,
    )

    if isinstance(fixtures, dict) and fixtures.get("error"):
        return fixtures

    fixtures_collection = db["fixtures"]

    saved_count = 0
    updated_count = 0

    for fixture in fixtures:
        result = fixtures_collection.update_one(
            {
                "id": fixture["id"],
                "country": fixture["country"],
            },
            {
                "$set": {
                    **fixture,
                    "saved_at": datetime.utcnow().isoformat(),
                }
            },
            upsert=True,
        )

        if result.upserted_id:
            saved_count += 1
        else:
            updated_count += 1

    return {
        "message": "Fixtures saved to MongoDB",
        "league": league,
        "country": country,
        "from_date": from_date,
        "to_date": to_date,
        "saved_count": saved_count,
        "updated_count": updated_count,
        "total_fixtures": len(fixtures),
    }


@app.get("/db-fixtures")
def get_saved_fixtures(
    country: str = "IN",
    league: str = "Premier League",
    from_date: str = "2024-08-16",
    to_date: str = "2024-08-25",
):
    if db is None:
        return {"error": "MongoDB is not connected"}

    fixtures_collection = db["fixtures"]

    from_datetime = f"{from_date}T00:00:00"
    to_datetime = f"{to_date}T23:59:59"

    fixtures = list(
        fixtures_collection.find(
            {
                "country": country.upper(),
                "league": league,
                "kickoff_utc": {
                    "$gte": from_datetime,
                    "$lte": to_datetime,
                },
            },
            {
                "_id": 0,
            },
        ).sort("kickoff_utc", 1)
    )

    return fixtures


@app.get("/db-fixture/{fixture_id}")
def get_saved_fixture_detail(fixture_id: int, country: str = "IN"):
    if db is None:
        return {"error": "MongoDB is not connected"}

    fixtures_collection = db["fixtures"]

    fixture = fixtures_collection.find_one(
        {
            "id": fixture_id,
            "country": country.upper(),
        },
        {
            "_id": 0,
        },
    )

    if fixture is None:
        return {"error": "Fixture not found in MongoDB"}

    return fixture