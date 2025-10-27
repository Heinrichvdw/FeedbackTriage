'use client';

import SubmitFeedback from '@/components/SubmitFeedback';
import Navigation from '@/components/Navigation';

export default function SubmitPage() {
  const handleSuccess = () => {
    // Success is handled by the SubmitFeedback component
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Navigation currentPage="submit" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Submit Feedback
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Share your feedback, feature requests, or report issues. Our AI will automatically analyze your submission.
          </p>
        </div>

        <SubmitFeedback onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

