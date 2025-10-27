'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import LogoIcon from '@/components/LogoIcon';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Navigation currentPage="home" />
      <main>
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <LogoIcon className="w-16 h-16" />
              <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100">
                Feedback Triage
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              AI-Powered Feedback Management System
            </p>
          </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8 transition-colors">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Welcome to Feedback Triage
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            An intelligent feedback management system that helps you organize, analyze, and prioritize user feedback using artificial intelligence.
          </p>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-indigo-600 dark:text-indigo-300 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Submit Feedback</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Users can submit feedback with optional contact information
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-indigo-600 dark:text-indigo-300 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">AI Analysis</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI automatically analyzes feedback for sentiment, priority, tags, and recommended actions
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-3">
                <span className="text-indigo-600 dark:text-indigo-300 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Smart Triage</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Review and filter feedback by sentiment, tags, priority, and more
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/submit"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Submit Feedback</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Share your feedback, feature requests, or report issues. Our AI will analyze and categorize it automatically.
            </p>
          </Link>

          <Link 
            href="/feedback"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">View History</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Browse and filter all submitted feedback. Analyze trends and prioritize actions based on AI insights.
            </p>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">🎯 Smart Categorization</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Automatic tagging and classification of feedback for easy organization
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">😊 Sentiment Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Understand user sentiment with AI-powered positive, neutral, or negative detection
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">⚡ Priority Ranking</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Automatic priority assignment from P0 (critical) to P3 (low) for effective triage
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">🔍 Advanced Filtering</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Filter feedback by sentiment, tags, priority, or date for quick access
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">📊 Detailed Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get AI-generated summaries and recommended next actions for each feedback
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">🚀 Fast & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Built with Next.js and PostgreSQL for high performance and scalability
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Powered by OpenAI GPT-3.5 Turbo | Built with Next.js and TypeScript</p>
        </div>
      </div>
      </main>
    </div>
  );
}
