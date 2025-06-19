import React, { useState, useRef, useEffect, FormEvent } from "react";
import UserCard from "./UserCard";
import { User } from "../types/user";

const GitHubUserSearch: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submittedQuery, setSubmittedQuery] = useState<string>("");
  const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchUsers = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setQuery(query.trim());
    const res = await fetch(
      `https://api.github.com/search/users?q=${query.trim()}&page=1&per_page=5`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
        },
      }
    );

    setSubmittedQuery(query);
    const data = await res.json();
    setUsers(data.items);
    setLoading(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchUsers();
  };

  return (
    <div className="max-w-lg mx-auto pb-6">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          id="search"
          type="text"
          value={query}
          placeholder="Enter username"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 mt-4"
          maxLength={35}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="w-full px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 mt-4">
          Search
        </button>
      </form>

      {loading && (
        <div className="flex gap-2 justify-center mt-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      )}

      {submittedQuery && (
        <p className="mt-4 text-gray-600">
          Showing {users.length} users for "{submittedQuery}"
        </p>
      )}

      <div>
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default GitHubUserSearch;
