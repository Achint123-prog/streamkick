"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

type Match = {
  id: number;
  league: string;
  home_team: string;
  away_team: string;
  kickoff_utc: string;
  kickoff_time: string;
  venue: string;
  status: string;
  country: string;
  timezone: string;
  streaming_providers: string[];
  home_goals?: number | null;
  away_goals?: number | null;
  elapsed?: number | null;
};

type SyncResult = {
  message?: string;
  league?: string;
  country?: string;
  from_date?: string;
  to_date?: string;
  saved_count?: number;
  updated_count?: number;
  total_fixtures?: number;
  error?: string;
};

const countryGroups = [
  {
    label: "Asia",
    countries: [
      ["AF", "Afghanistan"],
      ["AM", "Armenia"],
      ["AZ", "Azerbaijan"],
      ["BH", "Bahrain"],
      ["BD", "Bangladesh"],
      ["BT", "Bhutan"],
      ["BN", "Brunei"],
      ["KH", "Cambodia"],
      ["CN", "China"],
      ["CY", "Cyprus"],
      ["GE", "Georgia"],
      ["IN", "India"],
      ["ID", "Indonesia"],
      ["IR", "Iran"],
      ["IQ", "Iraq"],
      ["IL", "Israel"],
      ["JP", "Japan"],
      ["JO", "Jordan"],
      ["KZ", "Kazakhstan"],
      ["KW", "Kuwait"],
      ["KG", "Kyrgyzstan"],
      ["LA", "Laos"],
      ["LB", "Lebanon"],
      ["MY", "Malaysia"],
      ["MV", "Maldives"],
      ["MN", "Mongolia"],
      ["MM", "Myanmar"],
      ["NP", "Nepal"],
      ["KP", "North Korea"],
      ["OM", "Oman"],
      ["PK", "Pakistan"],
      ["PS", "Palestine"],
      ["PH", "Philippines"],
      ["QA", "Qatar"],
      ["SA", "Saudi Arabia"],
      ["SG", "Singapore"],
      ["KR", "South Korea"],
      ["LK", "Sri Lanka"],
      ["SY", "Syria"],
      ["TW", "Taiwan"],
      ["TJ", "Tajikistan"],
      ["TH", "Thailand"],
      ["TL", "Timor-Leste"],
      ["TM", "Turkmenistan"],
      ["AE", "United Arab Emirates"],
      ["UZ", "Uzbekistan"],
      ["VN", "Vietnam"],
      ["YE", "Yemen"],
    ],
  },
  {
    label: "Europe",
    countries: [
      ["AL", "Albania"],
      ["AD", "Andorra"],
      ["AT", "Austria"],
      ["BY", "Belarus"],
      ["BE", "Belgium"],
      ["BA", "Bosnia and Herzegovina"],
      ["BG", "Bulgaria"],
      ["HR", "Croatia"],
      ["CZ", "Czech Republic"],
      ["DK", "Denmark"],
      ["EE", "Estonia"],
      ["FI", "Finland"],
      ["FR", "France"],
      ["DE", "Germany"],
      ["GR", "Greece"],
      ["HU", "Hungary"],
      ["IS", "Iceland"],
      ["IE", "Ireland"],
      ["IT", "Italy"],
      ["LV", "Latvia"],
      ["LI", "Liechtenstein"],
      ["LT", "Lithuania"],
      ["LU", "Luxembourg"],
      ["MT", "Malta"],
      ["MD", "Moldova"],
      ["MC", "Monaco"],
      ["ME", "Montenegro"],
      ["NL", "Netherlands"],
      ["MK", "North Macedonia"],
      ["NO", "Norway"],
      ["PL", "Poland"],
      ["PT", "Portugal"],
      ["RO", "Romania"],
      ["RU", "Russia"],
      ["SM", "San Marino"],
      ["RS", "Serbia"],
      ["SK", "Slovakia"],
      ["SI", "Slovenia"],
      ["ES", "Spain"],
      ["SE", "Sweden"],
      ["CH", "Switzerland"],
      ["TR", "Turkey"],
      ["UA", "Ukraine"],
      ["UK", "United Kingdom"],
      ["VA", "Vatican City"],
    ],
  },
  {
    label: "North America",
    countries: [
      ["AG", "Antigua and Barbuda"],
      ["BS", "Bahamas"],
      ["BB", "Barbados"],
      ["BZ", "Belize"],
      ["CA", "Canada"],
      ["CR", "Costa Rica"],
      ["CU", "Cuba"],
      ["DM", "Dominica"],
      ["DO", "Dominican Republic"],
      ["SV", "El Salvador"],
      ["GD", "Grenada"],
      ["GT", "Guatemala"],
      ["HT", "Haiti"],
      ["HN", "Honduras"],
      ["JM", "Jamaica"],
      ["MX", "Mexico"],
      ["NI", "Nicaragua"],
      ["PA", "Panama"],
      ["KN", "Saint Kitts and Nevis"],
      ["LC", "Saint Lucia"],
      ["VC", "Saint Vincent and the Grenadines"],
      ["TT", "Trinidad and Tobago"],
      ["US", "United States"],
    ],
  },
];

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [liveMatches, setLiveMatches] = useState<Match[]>([]);

  const [loading, setLoading] = useState(true);
  const [liveLoading, setLiveLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  const [selectedLeague, setSelectedLeague] = useState("Premier League");
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [searchText, setSearchText] = useState("");

  const [fromDate, setFromDate] = useState("2024-08-16");
  const [toDate, setToDate] = useState("2024-08-25");

  function loadSavedFixtures() {
    setLoading(true);

    fetch(
      `${API_BASE_URL}/db-fixtures?country=${selectedCountry}&league=${encodeURIComponent(
        selectedLeague
      )}&from_date=${fromDate}&to_date=${toDate}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          console.error("MongoDB returned error:", data);
          setMatches([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching MongoDB matches:", error);
        setMatches([]);
        setLoading(false);
      });
  }

  function syncFixturesToMongoDB() {
    setSyncing(true);
    setSyncResult(null);

    fetch(
      `${API_BASE_URL}/save-fixtures?country=${selectedCountry}&league=${encodeURIComponent(
        selectedLeague
      )}&from_date=${fromDate}&to_date=${toDate}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setSyncResult(data);
        setSyncing(false);
        loadSavedFixtures();
      })
      .catch((error) => {
        console.error("Error syncing fixtures:", error);
        setSyncResult({
          error: "Could not sync fixtures to MongoDB.",
        });
        setSyncing(false);
      });
  }

  useEffect(() => {
    loadSavedFixtures();
  }, [selectedCountry, selectedLeague, fromDate, toDate]);

  useEffect(() => {
    setLiveLoading(true);

    fetch(`${API_BASE_URL}/api-live?country=${selectedCountry}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLiveMatches(data);
        } else {
          console.error("Live API returned error:", data);
          setLiveMatches([]);
        }

        setLiveLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching live matches:", error);
        setLiveMatches([]);
        setLiveLoading(false);
      });
  }, [selectedCountry]);

  const leagues = ["Premier League", "La Liga", "Serie A"];

  const quickRanges = [
    { label: "Opening Week", from: "2024-08-16", to: "2024-08-25" },
    { label: "August 2024", from: "2024-08-01", to: "2024-08-31" },
    { label: "September 2024", from: "2024-09-01", to: "2024-09-30" },
    { label: "October 2024", from: "2024-10-01", to: "2024-10-31" },
  ];

  const selectedCountryName =
    countryGroups
      .flatMap((group) => group.countries)
      .find(([code]) => code === selectedCountry)?.[1] || selectedCountry;

  const filteredMatches = matches.filter((match) => {
    const search = searchText.toLowerCase();

    return (
      match.home_team.toLowerCase().includes(search) ||
      match.away_team.toLowerCase().includes(search) ||
      match.league.toLowerCase().includes(search) ||
      match.status.toLowerCase().includes(search)
    );
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Stream<span className="text-green-400">Kick</span>
            </h2>
            <p className="text-xs text-gray-500">
              Football streaming availability aggregator
            </p>
          </div>

          <div className="hidden gap-6 text-sm text-gray-300 md:flex">
            <a href="#live" className="hover:text-green-400">
              Live Scores
            </a>
            <a href="/" className="hover:text-green-400">
              Fixtures
            </a>
            <a href="#providers" className="hover:text-green-400">
              Providers
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
            StreamKick
          </p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
            Find football matches and where to watch them legally.
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-gray-300">
            Browse saved football fixtures from MongoDB with timezone conversion
            across Asia, Europe, and North America.
          </p>
        </div>

        <section
          id="live"
          className="mb-10 rounded-3xl border border-red-500/20 bg-red-500/5 p-6"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-400">
                Live Scores
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                Live Premier League, La Liga, and Serie A matches
              </h2>
            </div>

            <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
              LIVE
            </span>
          </div>

          {liveLoading ? (
            <p className="text-gray-300">Checking live matches...</p>
          ) : liveMatches.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-gray-300">
              No Premier League, La Liga, or Serie A matches are live right now.
              This section will show live scores when supported matches are in
              progress.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {liveMatches.map((match) => (
                <a
                  key={match.id}
                  href={`/matches/${match.id}?country=${selectedCountry}`}
                  className="rounded-2xl border border-red-400/30 bg-black/40 p-5 hover:border-red-400"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs text-red-300">
                      {match.league}
                    </span>
                    <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                      {match.elapsed ? `${match.elapsed}'` : "Live"}
                    </span>
                  </div>

                  <p className="font-semibold">
                    {match.home_team} vs {match.away_team}
                  </p>

                  <p className="mt-3 text-3xl font-bold">
                    {match.home_goals ?? 0} - {match.away_goals ?? 0}
                  </p>

                  <p className="mt-3 text-sm text-gray-400">
                    {match.kickoff_time}
                  </p>
                </a>
              ))}
            </div>
          )}
        </section>

        <div className="mb-5 flex gap-3">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by team, league, or status..."
            className="w-full rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-green-400"
          />

          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="rounded-2xl border border-white/20 px-5 py-4 text-sm font-semibold text-white hover:border-green-400 hover:text-green-400"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-gray-400">
              From date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-black px-5 py-3 text-white outline-none focus:border-green-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">To date</label>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-black px-5 py-3 text-white outline-none focus:border-green-400"
            />
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          {quickRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => {
                setFromDate(range.from);
                setToDate(range.to);
              }}
              className={
                fromDate === range.from && toDate === range.to
                  ? "rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-black"
                  : "rounded-full border border-white/20 px-4 py-2 text-sm text-white hover:border-green-400 hover:text-green-400"
              }
            >
              {range.label}
            </button>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          {leagues.map((league) => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={
                selectedLeague === league
                  ? "rounded-full bg-green-500 px-5 py-2 font-semibold text-black"
                  : "rounded-full border border-white/20 px-5 py-2 text-white"
              }
            >
              {league}
            </button>
          ))}

          <select
            value={selectedCountry}
            onChange={(event) => setSelectedCountry(event.target.value)}
            className="max-w-full rounded-full border border-white/20 bg-black px-5 py-2 text-white"
          >
            {countryGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.countries.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <button
            onClick={syncFixturesToMongoDB}
            disabled={syncing}
            className={
              syncing
                ? "rounded-xl bg-gray-700 px-5 py-3 font-semibold text-gray-300"
                : "rounded-xl bg-green-500 px-5 py-3 font-semibold text-black hover:bg-green-400"
            }
          >
            {syncing ? "Syncing fixtures..." : "Sync selected fixtures to MongoDB"}
          </button>

          <button
            onClick={loadSavedFixtures}
            className="rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:border-green-400 hover:text-green-400"
          >
            Reload saved fixtures
          </button>
        </div>

        {syncResult && (
          <div
            className={
              syncResult.error
                ? "mb-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
                : "mb-5 rounded-2xl border border-green-400/30 bg-green-500/10 p-4 text-sm text-green-200"
            }
          >
            {syncResult.error ? (
              <p>{syncResult.error}</p>
            ) : (
              <p>
                Synced to MongoDB. Saved:{" "}
                <span className="font-semibold">{syncResult.saved_count}</span>,
                Updated:{" "}
                <span className="font-semibold">{syncResult.updated_count}</span>,
                Total:{" "}
                <span className="font-semibold">{syncResult.total_fixtures}</span>
              </p>
            )}
          </div>
        )}

        <div
          id="real-api"
          className="mb-5 rounded-2xl border border-green-400/20 bg-green-400/5 p-4 text-sm text-gray-300"
        >
          Showing saved fixture data from MongoDB. Your selected date range is{" "}
          <span className="font-semibold text-green-400">{fromDate}</span> to{" "}
          <span className="font-semibold text-green-400">{toDate}</span>.
        </div>

        <p className="mb-5 text-sm text-gray-400">
          League:{" "}
          <span className="font-semibold text-green-400">
            {selectedLeague}
          </span>{" "}
          | Country:{" "}
          <span className="font-semibold text-green-400">
            {selectedCountryName}
          </span>{" "}
          | Matches found:{" "}
          <span className="font-semibold text-green-400">
            {filteredMatches.length}
          </span>
        </p>

        {loading ? (
          <p className="text-gray-300">Loading saved fixtures from MongoDB...</p>
        ) : filteredMatches.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-gray-300">
            No saved matches found in MongoDB for this league, country, and date
            range. Click “Sync selected fixtures to MongoDB” or change the
            filters.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-green-300">
                    {match.league}
                  </span>

                  <span
                    className={
                      match.status === "Live"
                        ? "rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white"
                        : match.status === "Finished"
                        ? "rounded-full bg-gray-700 px-3 py-1 text-xs font-semibold text-white"
                        : "rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300"
                    }
                  >
                    {match.status}
                  </span>
                </div>

                <h2 className="text-2xl font-bold">
                  {match.home_team}
                  <span className="mx-2 text-green-400">vs</span>
                  {match.away_team}
                </h2>

                {match.home_goals !== null &&
                  match.home_goals !== undefined &&
                  match.away_goals !== null &&
                  match.away_goals !== undefined && (
                    <p className="mt-4 text-3xl font-bold">
                      {match.home_goals} - {match.away_goals}
                    </p>
                  )}

                <div className="mt-5 space-y-3 text-sm text-gray-300">
                  <p>
                    <span className="text-gray-500">Kickoff:</span>{" "}
                    {match.kickoff_time}
                  </p>

                  <p>
                    <span className="text-gray-500">Venue:</span> {match.venue}
                  </p>

                  <p>
                    <span className="text-gray-500">Timezone:</span>{" "}
                    {match.timezone}
                  </p>
                </div>

                <div id="providers" className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-white">
                    Watch on
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {match.streaming_providers.map((provider) => (
                      <span
                        key={provider}
                        className="rounded-full bg-green-400/10 px-3 py-1 text-sm text-green-300"
                      >
                        {provider}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={`/matches/${match.id}?country=${selectedCountry}&league=${encodeURIComponent(
                    selectedLeague
                  )}`}
                  className="mt-6 block w-full rounded-xl bg-white px-4 py-3 text-center font-semibold text-black hover:bg-green-400"
                >
                  View Match Details
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}