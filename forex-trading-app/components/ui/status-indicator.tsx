import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusType = 'online' | 'warning' | 'error' | 'connecting';

interface StatusIndicatorProps {
  status: StatusType;
  message: string;
  details?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  message,
  details,
  className
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'connecting':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
      case 'connecting':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700';
    }
  };

  return (
    <div className={cn(
      "flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm",
      getStatusColor(),
      className
    )}>
      {getStatusIcon()}
      <div>
        <span className="font-medium">{message}</span>
        {details && <p className="text-xs opacity-75 mt-1">{details}</p>}
      </div>
    </div>
  );
};
