import React, { useState, useMemo } from 'react';
import { TodoItem } from '../types/todo';
import { formatDate } from '../services/todoExtractor';
import { CheckCircle2, Circle, AlertCircle, Clock, User, ArrowUpDown, Flag } from 'lucide-react';

interface TodoListProps {
  tasks: TodoItem[];
  onToggleComplete: (id: string) => void;
}

type SortField = 'dueDate' | 'priority' | 'assignee';
type SortDirection = 'asc' | 'desc';

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

const priorityConfig = {
  high: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    icon: <Flag className="w-4 h-4 text-red-600" />,
    label: '最重要',
    badge: 'bg-red-100 text-red-800'
  },
  medium: {
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    icon: <Flag className="w-4 h-4 text-yellow-600" />,
    label: '重要',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  low: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    icon: <Flag className="w-4 h-4 text-blue-600" />,
    label: '通常',
    badge: 'bg-blue-100 text-blue-800'
  }
};

export const TodoList: React.FC<TodoListProps> = ({ tasks, onToggleComplete }) => {
  const [sortField, setSortField] = useState<SortField>('priority');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'priority':
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'assignee':
          comparison = (a.assignee || '').localeCompare(b.assignee || '');
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tasks, sortField, sortDirection]);

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 italic py-8">
        タスクが見つかりませんでした
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => handleSort('priority')}
          className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
            sortField === 'priority' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
          } hover:bg-blue-50`}
        >
          <Flag className="w-4 h-4 mr-1" />
          重要度
          <ArrowUpDown className="w-3 h-3 ml-1" />
        </button>
        <button
          onClick={() => handleSort('dueDate')}
          className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
            sortField === 'dueDate' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
          } hover:bg-blue-50`}
        >
          <Clock className="w-4 h-4 mr-1" />
          期日
          <ArrowUpDown className="w-3 h-3 ml-1" />
        </button>
        <button
          onClick={() => handleSort('assignee')}
          className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${
            sortField === 'assignee' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
          } hover:bg-blue-50`}
        >
          <User className="w-4 h-4 mr-1" />
          担当者
          <ArrowUpDown className="w-3 h-3 ml-1" />
        </button>
      </div>

      <div className="space-y-3">
        {sortedTasks.map((task) => {
          const priority = priorityConfig[task.priority];
          return (
            <div
              key={task.id}
              className={`flex items-start p-4 rounded-lg shadow-sm border ${
                task.completed 
                  ? 'border-green-200 bg-green-50' 
                  : `border-l-4 ${priority.borderColor} ${priority.bgColor}`
              }`}
            >
              <button
                onClick={() => onToggleComplete(task.id)}
                className="flex-shrink-0 mt-1"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <div className="ml-3 flex-grow">
                <div className="flex items-center justify-between">
                  <p className={`text-gray-800 font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                    {task.task}
                  </p>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${priority.badge}`}>
                    {priority.label}
                  </span>
                </div>
                
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{task.assignee || '未定'}</span>
                  </div>
                  
                  <div className="flex items-center">
                    {priority.icon}
                    <span className={`ml-1 ${priority.color}`}>
                      {priority.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};