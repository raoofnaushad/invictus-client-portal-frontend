import { useState } from "react";
import { Filter, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmailTable } from "@/components/EmailTable";
import { CreateEmailModal } from "@/components/CreateEmailModal";
import { mockEmails } from "@/data/emailData";
import { CreateEmailData } from "@/types/email";

const ActivityEmailPage = () => {
  const [filter, setFilter] = useState<'all' | 'received' | 'sent'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [emails, setEmails] = useState(mockEmails);

  const handleCreateEmail = (data: CreateEmailData) => {
    // In a real app, this would make an API call
    console.log('Creating email:', data);
    // Add the new email to the list (mock functionality)
    const newEmail = {
      id: Date.now().toString(),
      subject: data.subject,
      from: data.from,
      to: data.to,
      cc: data.cc,
      bcc: data.bcc,
      body: data.body,
      excerpt: data.body.substring(0, 100) + "...",
      priority: 'Medium' as const,
      assignee: 'Current User',
      dueDate: new Date().toLocaleDateString(),
      status: 'Sent' as const,
      isRead: true,
      createdAt: new Date().toISOString()
    };
    setEmails(prev => [newEmail, ...prev]);
  };

  const receivedCount = emails.filter(email => email.status === 'Received').length;
  const sentCount = emails.filter(email => email.status === 'Sent').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Email</h1>
            <p className="text-gray-600">Manage your email communications</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2 bg-black text-white hover:bg-black/90"
            >
              <Plus className="h-4 w-4" />
              Create Email
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Received</span>
            <Badge variant="secondary" className="ml-1">
              {receivedCount}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium">Sent</span>
            <Badge variant="secondary" className="ml-1">
              {sentCount}
            </Badge>
          </div>
        </div>

        {isFilterOpen && (
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter by:</span>
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={filter === 'received' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('received')}
              >
                Received
              </Button>
              <Button 
                variant={filter === 'sent' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('sent')}
              >
                Sent
              </Button>
            </div>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <EmailTable emails={emails} filter={filter} />
          </CardContent>
        </Card>

        <CreateEmailModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateEmail}
        />
      </div>
    </div>
  );
};

export default ActivityEmailPage;