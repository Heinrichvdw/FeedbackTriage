'use client';

import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import LogoIcon from './LogoIcon';

interface NavigationProps {
  currentPage?: 'home' | 'submit' | 'feedback';
}

export default function Navigation({ currentPage }: NavigationProps) {
  const linkClasses = (isActive: boolean) => 
    isActive
      ? 'px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium'
      : 'px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white font-medium';

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
          <LogoIcon className="w-8 h-8" />
          Feedback Triage
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className={linkClasses(currentPage === 'home')}>
            Home
          </Link>
          <Link href="/submit" className={linkClasses(currentPage === 'submit')}>
            Submit Feedback
          </Link>
          <Link href="/feedback" className={linkClasses(currentPage === 'feedback')}>
            View History
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}

