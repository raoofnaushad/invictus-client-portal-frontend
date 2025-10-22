import { Email } from "@/types/email";

export const mockEmails: Email[] = [
  {
    id: "1",
    subject: "2FA activation SMS code",
    from: "noreply@hedgefunds.com",
    to: ["muhammad.saqib@company.com"],
    body: "Dear Muhammad,\n\nThis notice pertains to a capital call request issued by Hedge Funds, requesting committed funds from investors. Please review the attached documentation and confirm your participation by the specified deadline.\n\nBest regards,\nHedge Funds Team",
    excerpt: "This notice pertains to a capital call request issued by Hedge Funds, requesting committed funds from inve...",
    priority: "High",
    assignee: "Muhammad Saqib",
    dueDate: "Wed, April 16, 2025, 8:09 PM",
    status: "Received",
    isRead: false,
    createdAt: "2025-04-16T20:09:00Z"
  },
  {
    id: "2",
    subject: "Account Opening Confirmation",
    from: "accounts@hedgefunds.com",
    to: ["james.anderson@company.com"],
    body: "Dear James,\n\nThis notice pertains to a capital call request issued by Hedge Funds, requesting committed funds from investors. Your account has been successfully opened and verified.\n\nPlease find the account details attached. If you have any questions, please don't hesitate to contact our support team.\n\nBest regards,\nAccounts Team",
    excerpt: "This notice pertains to a capital call request issued by Hedge Funds, requesting committed funds from inve...",
    priority: "High",
    assignee: "James Anderson",
    dueDate: "Wed, April 16, 2025, 8:09 PM",
    status: "Received",
    isRead: true,
    createdAt: "2025-04-16T20:09:00Z"
  },
  {
    id: "3",
    subject: "Capital call approval confirmation",
    from: "approvals@hedgefunds.com",
    to: ["michael.carter@company.com"],
    body: "Dear Michael,\n\nWe have initiated a bank transfer for USD 10000 to WP PCC Limited- BBF Cell against Capital Call. Please review and confirm the transaction details.\n\nThe transfer will be processed within 2-3 business days. You will receive a confirmation email once the transfer is complete.\n\nBest regards,\nApprovals Team",
    excerpt: "We have initiated a bank transfer for USD 10000 to WP PCC Limited- BBF Cell against Capital Call. Please...",
    priority: "Medium",
    assignee: "Michael Carter",
    dueDate: "Wed, April 16, 2025, 8:09 PM",
    status: "Received",
    isRead: false,
    createdAt: "2025-04-16T20:09:00Z"
  },
  {
    id: "4",
    subject: "Client's commitment confirmation to the Internal team",
    from: "internal@hedgefunds.com",
    to: ["muhammad.saqib@company.com"],
    body: "Dear Muhammad,\n\nWe have initiated a bank transfer for USD 10000 to WP PCC Limited- BBF Cell against Capital Call. This confirms the client's commitment to the internal investment team.\n\nPlease ensure all documentation is properly filed and the client is notified of the successful transaction.\n\nBest regards,\nInternal Team",
    excerpt: "We have initiated a bank transfer for USD 10000 to WP PCC Limited- BBF Cell against Capital Call. Please...",
    priority: "Low",
    assignee: "Muhammad Saqib",
    dueDate: "Wed, April 16, 2025, 8:09 PM",
    status: "Received",
    isRead: true,
    createdAt: "2025-04-16T20:09:00Z"
  }
];