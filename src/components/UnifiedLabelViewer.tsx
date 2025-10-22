import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getFieldColor } from "@/lib/fieldColors";

interface Label {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  field: string;
  color: string;
  itemIndex?: number;
  type: "document" | "lineItem";
}

interface UnifiedLabelViewerProps {
  imageUrl: string;
  documentLabels: Label[];
  lineItemLabels: Label[];
  onDocumentLabelUpdate: (labelId: string, newBbox: { x: number; y: number; width: number; height: number }) => void;
  onLineItemLabelUpdate: (labelId: string, newBbox: { x: number; y: number; width: number; height: number }) => void;
  onEditLabel?: (labelId: string, field: string, type: "document" | "lineItem") => void;
  editLabelId?: string | null;
}

export const UnifiedLabelViewer = ({
  imageUrl,
  documentLabels,
  lineItemLabels,
  onDocumentLabelUpdate,
  onLineItemLabelUpdate,
  onEditLabel,
  editLabelId
}: UnifiedLabelViewerProps) => {
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Effect to handle external edit requests
  useEffect(() => {
    if (editLabelId) {
      setEditingLabel(editLabelId);
      setCurrentBox(null);
    }
  }, [editLabelId]);


  const allLabels = [
    ...documentLabels.map(label => ({ ...label, type: "document" as const, color: getFieldColor(label.field) })),
    ...lineItemLabels.map(label => ({ ...label, type: "lineItem" as const, color: getFieldColor(label.field) }))
  ];

  const getRelativePosition = (e: React.MouseEvent) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const handleEditClick = (labelId: string) => {
    setEditingLabel(labelId);
    setCurrentBox(null);
    
    // Notify parent component if callback provided
    if (onEditLabel) {
      const label = allLabels.find(l => l.id === labelId);
      if (label) {
        onEditLabel(labelId, label.field, label.type);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editingLabel) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const pos = getRelativePosition(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentBox({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentBox || !editingLabel) return;
    
    e.preventDefault();
    const pos = getRelativePosition(e);
    const width = Math.abs(pos.x - startPos.x);
    const height = Math.abs(pos.y - startPos.y);
    const x = Math.min(pos.x, startPos.x);
    const y = Math.min(pos.y, startPos.y);
    
    setCurrentBox({ x, y, width, height });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || !currentBox || !editingLabel) {
      setIsDrawing(false);
      setCurrentBox(null);
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    if (currentBox.width < 1 || currentBox.height < 1) {
      setIsDrawing(false);
      setCurrentBox(null);
      return;
    }
    
    // Update the label with new bbox
    const editingLabelObj = allLabels.find(label => label.id === editingLabel);
    if (editingLabelObj) {
      if (editingLabelObj.type === "document") {
        onDocumentLabelUpdate(editingLabel, currentBox);
      } else {
        onLineItemLabelUpdate(editingLabel, currentBox);
      }
    }
    
    setIsDrawing(false);
    setCurrentBox(null);
    setEditingLabel(null);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 h-full bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full h-full overflow-hidden">
        <div className="relative h-full">
          <img 
            ref={imageRef}
            src={imageUrl}
            alt="Financial Account Summary"
            className={cn(
              "w-full h-full object-contain rounded-lg",
              editingLabel && "cursor-crosshair"
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              if (isDrawing) {
                setIsDrawing(false);
                setCurrentBox(null);
              }
            }}
            draggable={false}
          />
          
          {/* Existing Labels - Hide the one being edited when drawing */}
          {allLabels.map((label) => {
            // Hide the label being edited when actively drawing a new box
            const shouldHide = editingLabel === label.id && isDrawing && currentBox;
            if (shouldHide) return null;
            
            return (
              <div
                key={label.id}
                className={cn(
                  "absolute border-2",
                  editingLabel === label.id ? "border-dashed border-red-500 bg-red-100/30" : "border-solid"
                )}
                style={{
                  left: `${label.x}%`,
                  top: `${label.y}%`,
                  width: `${label.width}%`,
                  height: `${label.height}%`,
                  borderColor: editingLabel === label.id ? "#ef4444" : label.color,
                  backgroundColor: editingLabel === label.id ? "#fef2f2" : `${label.color}20`,
                }}
              />
            );
          })}

          {/* Current Drawing Box */}
          {currentBox && currentBox.width > 0 && currentBox.height > 0 && editingLabel && (
            <div
              className="absolute border-2 border-dashed border-blue-500 bg-blue-100/30 pointer-events-none"
              style={{
                left: `${currentBox.x}%`,
                top: `${currentBox.y}%`,
                width: `${currentBox.width}%`,
                height: `${currentBox.height}%`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};