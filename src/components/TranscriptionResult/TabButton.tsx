import React from 'react';
import { Loader2, LucideIcon } from 'lucide-react';

interface TabButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isLoading?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({
  icon: Icon,
  label,
  isActive,
  isLoading,
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-100 text-blue-700'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {isLoading ? (
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
    ) : (
      <Icon className="w-4 h-4 mr-2" />
    )}
    {label}
  </button>
);