import { Task, Request, TaskStatus, RequestStatus } from "@/types/activity";

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Meeting Notes Approval - Ramlah Holding",
    description: "We have initiated a bank transfer for USD 10000 to WP PCC Limited- BBF Cell against Capital Call. Please find the necessary details regarding the transfer attached for your review and approval.",
    status: "Todo",
    priority: "High",
    assignee: "Muhammad Saqib",
    dueDate: "2025-04-16T20:09:00Z",
    relatedTo: "SPV 12345",
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2025-03-15T10:00:00Z"
  },
  {
    id: "2", 
    title: "Approval Required - Oasis Bank Transfer USD 10000 to WP PCC Limited- BBF Cell",
    description: "We have initiated a bank transfer for USD 10000 to WP PCC Limited- BBF Cell against Capital Call. Please find the necessary details regarding the transfer attached for your review and approval.",
    status: "In Progress",
    priority: "High",
    assignee: "James Anderson",
    dueDate: "2025-04-16T20:09:00Z",
    createdAt: "2025-03-15T09:00:00Z",
    updatedAt: "2025-03-15T09:00:00Z"
  },
  {
    id: "3",
    title: "Approval Required - Oasis Bank Transfer USD 10000 to WP PCC Limited- BBF Cell",
    description: "We have initiated a bank transfer for USD 10000 to WP PCC Limited- BBF Cell against Capital Call. Please find the necessary details regarding the transfer attached for your review and approval.",
    status: "Done",
    priority: "Medium",
    assignee: "Michael Carter",
    dueDate: "2025-04-16T20:09:00Z",
    createdAt: "2025-03-15T08:00:00Z",
    updatedAt: "2025-03-15T08:00:00Z"
  },
  {
    id: "4",
    title: "Approval Required - Oasis Bank Transfer USD 10000 to WP PCC Limited- BBF Cell",
    description: "We have initiated a bank transfer for USD 10000 to WP PCC Limited- BBF Cell against Capital Call. Please find the necessary details regarding the transfer attached for your review and approval.",
    status: "Overdue",
    priority: "Low",
    assignee: "Muhammad Saqib",
    dueDate: "2025-04-16T20:09:00Z",
    createdAt: "2025-03-15T07:00:00Z",
    updatedAt: "2025-03-15T07:00:00Z"
  }
];

// Mock data for requests
const mockRequests: Request[] = [
  {
    id: "1",
    title: "Hedge Funds commitment request",
    description: "This notice pertains to a capital call request issued by Hedge Funds, requesting committed funds from investors...",
    status: "Sent",
    priority: "High",
    assignee: "Muhammad Saqib",
    dueDate: "2025-04-16T20:09:00Z",
    category: "Capital Call",
    createdAt: "2025-03-15T10:00:00Z",
    updatedAt: "2025-03-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Transfer of Assets - Hedge Funds",
    description: "This notice pertains to a capital call request issued by Hedge Funds, requesting committed funds from investors...",
    status: "In Progress",
    priority: "High",
    assignee: "James Anderson", 
    dueDate: "2025-04-16T20:09:00Z",
    category: "Asset Transfer",
    createdAt: "2025-03-15T09:00:00Z",
    updatedAt: "2025-03-15T09:00:00Z"
  },
  {
    id: "3",
    title: "KYC Documentation Request for Hedge Funds",
    description: "This notice pertains to a capital call request issued by Hedge Funds, requesting committed funds from investors...",
    status: "Rejected",
    priority: "High",
    assignee: "",
    dueDate: "2025-04-16T20:09:00Z",
    category: "Documentation",
    createdAt: "2025-03-15T08:00:00Z",
    updatedAt: "2025-03-15T08:00:00Z"
  },
  {
    id: "4",
    title: "Document Signing Request for Hedge Funds",
    description: "You are requested to review and sign the attached document(s) as part of our standard process. Please...",
    status: "Completed",
    priority: "High",
    assignee: "James Anderson",
    dueDate: "2025-04-16T20:09:00Z",
    category: "Documentation",
    createdAt: "2025-03-15T07:00:00Z",
    updatedAt: "2025-03-15T07:00:00Z"
  }
];

// Generate additional tasks for kanban columns
const generateKanbanTasks = (): Record<string, Task[]> => {
  const statuses: TaskStatus[] = ['New', 'In Progress', 'Completed', 'Cancelled', 'On Hold'];
  const kanbanTasks: Record<string, Task[]> = {};
  
  statuses.forEach(status => {
    kanbanTasks[status] = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
      id: `${status.toLowerCase()}-${i + 1}`,
      title: `Task Name - Lorem Ipsum`,
      description: `Description - Lorem Ipsum is simply dummy text of the printing and typesetting industry`,
      status,
      priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as any,
      assignee: ['Smith', 'John Doe'][Math.floor(Math.random() * 2)],
      dueDate: "2025-05-28T00:00:00Z",
      createdAt: "2025-03-15T10:00:00Z",
      updatedAt: "2025-03-15T10:00:00Z"
    }));
  });
  
  return kanbanTasks;
};

export class ActivityApiService {
  static async getTasks(): Promise<Task[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTasks;
  }
  
  static async getRequests(): Promise<Request[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockRequests;
  }
  
  static async getKanbanTasks(): Promise<Record<string, Task[]>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateKanbanTasks();
  }
  
  static async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();
    }
    
    return task!;
  }
  
  static async createTask(taskData: Partial<Task>): Promise<Task> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || 'New',
      priority: taskData.priority || 'Medium',
      assignee: taskData.assignee || '',
      dueDate: taskData.dueDate || new Date().toISOString(),
      relatedTo: taskData.relatedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockTasks.push(newTask);
    return newTask;
  }
  
  static async createRequest(requestData: Partial<Request>): Promise<Request> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newRequest: Request = {
      id: Date.now().toString(),
      title: requestData.title || '',
      description: requestData.description || '',
      status: requestData.status || 'Sent',
      priority: requestData.priority || 'Medium',
      assignee: requestData.assignee || '',
      dueDate: requestData.dueDate || new Date().toISOString(),
      category: requestData.category,
      relatedTo: requestData.relatedTo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockRequests.push(newRequest);
    return newRequest;
  }

  static async deleteTask(taskId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockTasks.findIndex(t => t.id === taskId);
    if (index > -1) {
      mockTasks.splice(index, 1);
    }
  }

  static async deleteRequest(requestId: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockRequests.findIndex(r => r.id === requestId);
    if (index > -1) {
      mockRequests.splice(index, 1);
    }
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const task = mockTasks.find(t => t.id === taskId);
    if (task) {
      Object.assign(task, updates, { updatedAt: new Date().toISOString() });
    }
    
    return task!;
  }

  static async updateRequest(requestId: string, updates: Partial<Request>): Promise<Request> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const request = mockRequests.find(r => r.id === requestId);
    if (request) {
      Object.assign(request, updates, { updatedAt: new Date().toISOString() });
    }
    
    return request!;
  }
}