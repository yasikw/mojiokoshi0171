export interface TodoItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface ExtractedSchedule {
  tasks: TodoItem[];
  error?: string;
}