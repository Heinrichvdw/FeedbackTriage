import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'sentiment' | 'priority';
  color?: string;
}

export default function Badge({ children, variant = 'default', color }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';

  if (color) {
    return (
      <span className={`${baseClasses} ${color}`}>
        {children}
      </span>
    );
  }

  let classes = '';
  if (variant === 'sentiment') {
    if (children === 'positive') {
      classes = 'bg-green-100 text-green-800';
    } else if (children === 'negative') {
      classes = 'bg-red-100 text-red-800';
    } else {
      classes = 'bg-gray-100 text-gray-800';
    }
  } else if (variant === 'priority') {
    if (children === 'P0') {
      classes = 'bg-red-100 text-red-800';
    } else if (children === 'P1') {
      classes = 'bg-orange-100 text-orange-800';
    } else if (children === 'P2') {
      classes = 'bg-yellow-100 text-yellow-800';
    } else {
      classes = 'bg-blue-100 text-blue-800';
    }
  } else {
    classes = 'bg-indigo-100 text-indigo-800';
  }

  return (
    <span className={`${baseClasses} ${classes}`}>
      {children}
    </span>
  );
}

