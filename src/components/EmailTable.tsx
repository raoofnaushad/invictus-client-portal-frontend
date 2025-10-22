import React, { useState } from "react";
import { ChevronDown, ChevronRight, Mail, MailOpen } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Email } from "@/types/email";
import { cn } from "@/lib/utils";

interface EmailTableProps {
  emails: Email[];
  filter: 'all' | 'received' | 'sent';
}

export const EmailTable = ({ emails, filter }: EmailTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const filteredEmails = emails.filter(email => {
    if (filter === 'all') return true;
    return email.status.toLowerCase() === filter;
  });

  const toggleExpanded = (emailId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(emailId)) {
      newExpanded.delete(emailId);
    } else {
      newExpanded.add(emailId);
    }
    setExpandedRows(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIndicatorColor = (status: string) => {
    switch (status) {
      case 'Received': return 'bg-green-500';
      case 'Sent': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50/50">
            <th className="text-left py-3 px-4 font-medium text-gray-500">Email</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Priority</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Assignee</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmails.map((email, index) => (
            <React.Fragment key={email.id}>
              <tr className={`border-b hover:bg-gray-50 ${index % 2 === 1 ? 'bg-gray-25' : 'bg-white'}`}>
                <td className="py-3 px-4">
                  <div className="flex items-start space-x-3">
                    <div className={cn(
                      "w-1 h-12 rounded",
                      getStatusIndicatorColor(email.status)
                    )} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <button
                          className="h-auto p-0"
                          onClick={() => toggleExpanded(email.id)}
                        >
                          {expandedRows.has(email.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        {email.isRead ? (
                          <MailOpen className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Mail className="h-4 w-4 text-primary" />
                        )}
                        <span className="font-medium text-sm">{email.subject}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className={getPriorityColor(email.priority)}>
                    {email.priority}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="secondary" className="bg-black text-white">
                    {email.assignee}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {email.dueDate}
                </td>
              </tr>
              
              {/* Expanded row content */}
              {expandedRows.has(email.id) && (
                <tr className="border-b bg-gray-50">
                  <td colSpan={4} className="py-4 px-4">
                    <div className="ml-12 space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Email Details</h4>
                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <span className="font-medium">From:</span> {email.from}
                          </div>
                          <div>
                            <span className="font-medium">To:</span> {email.to.join(', ')}
                          </div>
                          {email.cc && email.cc.length > 0 && (
                            <div>
                              <span className="font-medium">CC:</span> {email.cc.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Message</h4>
                        <div className="whitespace-pre-wrap text-sm text-gray-600">
                          {email.body}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};