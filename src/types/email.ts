export interface Email {
  id: string;
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  excerpt: string;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  dueDate: string;
  status: 'Received' | 'Sent';
  isRead: boolean;
  createdAt: string;
}

export interface CreateEmailData {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  relatedTo?: string;
}