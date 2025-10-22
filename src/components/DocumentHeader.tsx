
import { Button } from "@/components/ui/button";

interface DocumentHeaderProps {
  title: string;
  currentPage: number;
  totalPages: number;
}

export const DocumentHeader = ({ title, currentPage, totalPages }: DocumentHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
        <div className="flex items-center space-x-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <span className="text-gray-400">⚙</span>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <span className="text-gray-400">⋯</span>
          </button>
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <span>Page {currentPage} of {totalPages}</span>
        <div className="flex ml-auto space-x-1">
          <button className="p-1 hover:bg-gray-100 rounded">
            <span>←</span>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
