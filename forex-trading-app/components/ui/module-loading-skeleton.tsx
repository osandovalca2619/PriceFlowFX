import React from 'react';

export const ModuleLoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex space-x-2">
          <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}