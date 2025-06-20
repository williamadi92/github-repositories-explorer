import React, { useState, useEffect, useRef, useCallback } from "react";
import { User } from "../types/user";
import ChevronDown from "./icons/ChevronDown";
import ChevronUp from "./icons/ChevronUp";
import Star from "./icons/Star";

type Repository = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
};

type UserCardProps = {
  user: User;
};

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [expand, setExpand] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
  const PER_PAGE = 10;

  const handleToggleExpand = () => {
    setExpand((prev) => !prev);
  };

  const fetchRepos = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      try {
        const headers: Record<string, string> = {};

        if (GITHUB_TOKEN) {
          headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
        }

        const res = await fetch(
          `https://api.github.com/users/${user.login}/repos?page=${currentPage}&per_page=${PER_PAGE}`,
          {
            headers,
          }
        );
        if (res.status === 401) {
          setError("Unauthorized: GitHub token is invalid or expired.");
          setLoading(false);
          return;
        }

        if (res.status === 403) {
          setError(
            "Rate limit reached. Please try again later or use GitHub token."
          );
          setLoading(false);
          return;
        }

        if (!res.ok) {
          setError(`Errors: ${res.status} ${res.statusText}`);
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setRepos((prev) => [...prev, ...data]);
          setHasMore(data.length === PER_PAGE);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        setError("Something went wrong. Please try again later.");
        console.error("Failed to fetch repositories:", error);
      } finally {
        setLoading(false);
      }
    },
    [user.login, GITHUB_TOKEN]
  );

  useEffect(() => {
    if (expand && repos.length === 0) {
      setPage(1);
      setRepos([]);
      fetchRepos(1);
    }
  }, [expand, repos.length, fetchRepos]);

  const handleScroll = () => {
    if (!scrollRef.current || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRepos(nextPage);
    }
  };

  return (
    <React.Fragment>
      {error && <p className="text-red-600 mt-4">{error}</p>}
      <div className="bg-gray-200 p-2 mt-2 rounded">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={handleToggleExpand}
        >
          <div className="flex gap-4 items-center">
            <img
              src={user.avatar_url}
              alt={user.login}
              width="40"
              className="rounded-full"
            />
            <span>{user.login}</span>
          </div>
          {expand ? (
            <ChevronUp className="w-6 h-6 text-gray-600" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-600" />
          )}
        </div>
      </div>
      {expand && (
        <div
          className="mt-2 ml-8 max-h-60 overflow-y-scroll pr-2"
          onScroll={handleScroll}
          ref={scrollRef}
        >
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="mb-2 pb-2 bg-gray-300 min-h-16 p-2 flex justify-between items-start"
            >
              <div className="flex-1">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                >
                  {repo.name}
                </a>
                {repo.description && (
                  <p className="text-sm text-gray-700">{repo.description}</p>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-700">
                <Star className="w-4 h-4 fill-yellow-500" />
                <span>{repo.stargazers_count}</span>
              </div>
            </div>
          ))}
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {repos.length === 0 && !loading && (
            <p className="text-sm text-gray-500">No repositories.</p>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default UserCard;
