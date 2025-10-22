import { FileText, Clock } from "lucide-react";

export const PendingDocumentMessage = () => {
  return (
    <div className="flex-1 bg-muted/20 flex flex-col items-center justify-center text-center p-8">
      <div className="relative mb-6">
        <div className="w-20 h-24 border-2 border-muted-foreground/20 rounded-sm flex items-center justify-center bg-background/50">
          <FileText className="w-10 h-10 text-muted-foreground/40" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
          <Clock className="w-3 h-3 text-white" />
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Document Not Processed
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
        The document you requested does not exist. Please check that the URL is correct or make sure it's available.
      </p>
    </div>
  );
};