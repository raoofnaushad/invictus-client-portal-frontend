export type TaskStatus = 'New' | 'In Progress' | 'Completed' | 'Cancelled' | 'On Hold' | 'Todo' | 'Done' | 'Overdue';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type RequestStatus = 'Sent' | 'In Progress' | 'Rejected' | 'Completed' | 'Received';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  relatedTo?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  status: RequestStatus;
  priority: TaskPriority;
  assignee: string;
  dueDate: string;
  category?: string;
  relatedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityFilters {
  status?: TaskStatus[] | RequestStatus[];
  priority?: TaskPriority[];
  assignee?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}