"use client";

import { useState, useEffect, useRef } from "react";
import { Feedback } from "@/lib/types";
import Badge from "./Badge";
import FeedbackDetail from "./FeedbackDetail";

export default function FeedbackList() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [searchInput, setSearchInput] = useState<string>(""); // Immediate input value
  const [searchQuery, setSearchQuery] = useState<string>(""); // Debounced search query
  const [sentimentFilter, setSentimentFilter] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>(""); // Immediate tag input value
  const [tagQuery, setTagQuery] = useState<string>(""); // Debounced tag query
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const filtersRef = useRef({ searchQuery, sentimentFilter, tagQuery });

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (sentimentFilter) {
        params.append("sentiment", sentimentFilter);
      }
      if (tagQuery) {
        params.append("tag", tagQuery);
      }

      const response = await fetch(`/api/feedback?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const data = await response.json();
      setFeedback(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input with 3 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Debounce tag input with same delay as search
  useEffect(() => {
    const timer = setTimeout(() => {
      setTagQuery(tagInput);
    }, 1000);

    return () => clearTimeout(timer);
  }, [tagInput]);

  // Reset page to 1 when any filter changes
  useEffect(() => {
    const filtersChanged =
      filtersRef.current.searchQuery !== searchQuery ||
      filtersRef.current.sentimentFilter !== sentimentFilter ||
      filtersRef.current.tagQuery !== tagQuery;

    if (filtersChanged) {
      setPage(1);
    }

    filtersRef.current = { searchQuery, sentimentFilter, tagQuery };
  }, [searchQuery, sentimentFilter, tagQuery]);

  // Reset page to 1 when page size changes
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  // Fetch feedback whenever filters, page, or pageSize changes
  useEffect(() => {
    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sentimentFilter, tagQuery, page, pageSize]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Filters
        </h2>
        <div className="space-y-4">
          {/* Search input - full width */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search in feedback text or summary..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            />
            {searchInput && searchInput !== searchQuery && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Waiting for you to finish typing...
              </p>
            )}
          </div>

          {/* Other filters in grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sentiment"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Sentiment
              </label>
              <select
                id="sentiment"
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              >
                <option value="">All</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="tag"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tag
              </label>
              <input
                type="text"
                id="tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Filter by tag..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              />
              {tagInput && tagInput !== tagQuery && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Waiting for you to finish typing...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-gray-600 dark:text-gray-300">
          Loading feedback...
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : feedback.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-gray-600 dark:text-gray-300">
          No feedback found
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sentiment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {feedback.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                      {item.analysis.summary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant="sentiment">
                        {item.analysis.sentiment}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant="priority">{item.analysis.priority}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {item.analysis.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx}>{tag}</Badge>
                        ))}
                        {item.analysis.tags.length > 3 && (
                          <span className="text-gray-500 dark:text-gray-400">
                            +{item.analysis.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedFeedback(item)}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-wrap justify-between items-center gap-4 transition-colors">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="pageSize"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Items per page:
                </label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetail
          feedback={selectedFeedback}
          onClose={() => setSelectedFeedback(null)}
        />
      )}
    </div>
  );
}
