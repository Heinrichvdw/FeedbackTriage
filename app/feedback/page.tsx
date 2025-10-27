'use client';

import FeedbackList from '@/components/FeedbackList';
import Navigation from '@/components/Navigation';

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Navigation currentPage="feedback" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Feedback History
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and manage all submitted feedback. Use filters to find specific items.
          </p>
        </div>

        <FeedbackList />
      </div>
    </div>
  );
}

