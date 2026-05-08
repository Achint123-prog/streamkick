"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

type Match = {
  id: number;
  league: string;
  league_id?: number;
  home_team: string;
  away_team: string;
  home_logo?: string;
  away_logo?: string;
  kickoff_utc: string;
  kickoff_time: string;
  venue: string;
  city?: string;
  status: string;
  status_short?: string;
  elapsed?: number | null;
  home_goals?: number | null;
  away_goals?: number | null;
  country: string;
  timezone: string;
  streaming_providers: string[];
  saved_at?: string;
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={
        status === "Live"
          ? "rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white"
          : status === "Finished"
          ? "rounded-full bg-gray-700 px-4 py-2 text-sm font-semibold text-white"
          : "rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300"
      }
    >
      {status}
    </span>
  );
}

export default function MatchDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id;
  const country = searchParams.get("country") || "IN";

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`${API_BASE_URL}/db-fixture/${id}?country=${country}`)
      .then((response) => response.json())
      .then((data) => {
        setMatch(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching MongoDB fixture detail:", error);
        setLoading(false);
      });
  }, [id, country]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        Loading saved fixture details from MongoDB...
      </main>
    );
  }

  if (!match || "error" in match) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        Match not found in MongoDB.
      </main>
    );
  }

  const hasScore =
    match.home_goals !== null &&
    match.home_goals !== undefined &&
    match.away_goals !== null &&
    match.away_goals !== undefined;

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="/">
            <h2 className="text-2xl font-bold tracking-tight">
              Stream<span className="text-green-400">Kick</span>
            </h2>
            <p className="text-xs text-gray-500">
              Football streaming availability aggregator
            </p>
          </a>

          <a href="/" className="text-sm text-gray-300 hover:text-green-400">
            All Matches
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <a href="/" className="text-green-400 hover:underline">
          ← Back to all matches
        </a>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-400">
                {match.league}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Saved fixture detail from MongoDB
              </p>
            </div>

            <StatusBadge status={match.status} />
          </div>

          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
            <div className="text-center md:text-left">
              {match.home_logo && (
                <img
                  src={match.home_logo}
                  alt={match.home_team}
                  className="mx-auto mb-4 h-20 w-20 object-contain md:mx-0"
                />
              )}
              <h1 className="text-3xl font-bold md:text-5xl">
                {match.home_team}
              </h1>
            </div>

            <div className="text-center">
              {hasScore ? (
                <div className="rounded-3xl bg-black/50 px-8 py-5 text-5xl font-bold">
                  {match.home_goals} - {match.away_goals}
                </div>
              ) : (
                <div className="text-5xl font-bold text-green-400">vs</div>
              )}
            </div>

            <div className="text-center md:text-right">
              {match.away_logo && (
                <img
                  src={match.away_logo}
                  alt={match.away_team}
                  className="mx-auto mb-4 h-20 w-20 object-contain md:ml-auto md:mr-0"
                />
              )}
              <h1 className="text-3xl font-bold md:text-5xl">
                {match.away_team}
              </h1>
            </div>
          </div>

          <p className="mt-8 text-gray-400">
            Streaming availability for{" "}
            <span className="font-semibold text-green-400">
              {match.country}
            </span>
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-black/40 p-5">
              <p className="text-sm text-gray-500">Kickoff Time</p>
              <p className="mt-2 text-xl font-semibold">
                {match.kickoff_time}
              </p>
              <p className="mt-1 text-sm text-gray-400">{match.timezone}</p>
            </div>

            <div className="rounded-2xl bg-black/40 p-5">
              <p className="text-sm text-gray-500">Venue</p>
              <p className="mt-2 text-xl font-semibold">{match.venue}</p>
              {match.city && (
                <p className="mt-1 text-sm text-gray-400">{match.city}</p>
              )}
            </div>

            <div className="rounded-2xl bg-black/40 p-5">
              <p className="text-sm text-gray-500">Status</p>
              <p className="mt-2 text-xl font-semibold">{match.status}</p>

              {match.status_short && (
                <p className="mt-1 text-sm text-gray-400">
                  API status: {match.status_short}
                </p>
              )}

              {match.elapsed !== null && match.elapsed !== undefined && (
                <p className="mt-1 text-sm text-gray-400">
                  Match minute: {match.elapsed}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-black/40 p-5">
            <p className="mb-3 text-sm text-gray-500">Legal Streaming</p>

            <div className="flex flex-wrap gap-3">
              {match.streaming_providers.length > 0 ? (
                match.streaming_providers.map((provider) => (
                  <span
                    key={provider}
                    className="rounded-full bg-green-400/10 px-4 py-2 text-green-300"
                  >
                    {provider}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-400">
                  No provider information saved.
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-black/40 p-5">
            <p className="mb-3 text-sm text-gray-500">Stored Data</p>

            <div className="grid gap-3 text-sm text-gray-300 md:grid-cols-2">
              <p>
                <span className="text-gray-500">Fixture ID:</span> {match.id}
              </p>

              {match.league_id && (
                <p>
                  <span className="text-gray-500">League ID:</span>{" "}
                  {match.league_id}
                </p>
              )}

              <p>
                <span className="text-gray-500">UTC Kickoff:</span>{" "}
                {match.kickoff_utc}
              </p>

              {match.saved_at && (
                <p>
                  <span className="text-gray-500">Saved at:</span>{" "}
                  {match.saved_at}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-black/40 p-5">
            <p className="mb-3 text-sm text-gray-500">Related Articles</p>

            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 p-4">
                {match.home_team} vs {match.away_team} match report and key
                moments
              </div>

              <div className="rounded-xl border border-white/10 p-4">
                Latest news from {match.league}
              </div>

              <div className="rounded-xl border border-white/10 p-4">
                Where to watch {match.home_team} vs {match.away_team} legally
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}