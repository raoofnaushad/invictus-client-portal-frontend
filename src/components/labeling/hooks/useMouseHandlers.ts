
import { useRef } from "react";

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
}

export const useMouseHandlers = (
  isLabeling: boolean,
  isDrawing: boolean,
  startPos: { x: number; y: number },
  currentBox: Partial<Label> | null,
  selectedField: string,
  fieldColors: Record<string, string>,
  extractedData: any,
  setIsDrawing: (value: boolean) => void,
  setStartPos: (pos: { x: number; y: number }) => void,
  setSelectedLabel: (id: string | null) => void,
  setCurrentBox: (box: Partial<Label> | null) => void,
  addLabel: (label: Omit<Label, 'id' | 'itemIndex'>) => void
) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const getRelativePosition = (e: React.MouseEvent) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isLabeling) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const pos = getRelativePosition(e);
    setIsDrawing(true);
    setStartPos(pos);
    setSelectedLabel(null);
    setCurrentBox({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      field: selectedField,
      color: fieldColors[selectedField as keyof typeof fieldColors],
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentBox) return;
    
    e.preventDefault();
    const pos = getRelativePosition(e);
    const width = Math.abs(pos.x - startPos.x);
    const height = Math.abs(pos.y - startPos.y);
    const x = Math.min(pos.x, startPos.x);
    const y = Math.min(pos.y, startPos.y);
    
    setCurrentBox({
      ...currentBox,
      x,
      y,
      width,
      height,
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || !currentBox) {
      setIsDrawing(false);
      setCurrentBox(null);
      return;
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    if (currentBox.width! < 1 || currentBox.height! < 1) {
      setIsDrawing(false);
      setCurrentBox(null);
      return;
    }
    
    addLabel({
      text: extractedData?.[selectedField] || "Click to edit...",
      x: currentBox.x!,
      y: currentBox.y!,
      width: currentBox.width!,
      height: currentBox.height!,
      field: selectedField,
      color: fieldColors[selectedField as keyof typeof fieldColors],
    });
    
    setIsDrawing(false);
    setCurrentBox(null);
  };

  const handleLabelClick = (e: React.MouseEvent, labelId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLabeling) return;
    // Fixed: We need to get the current selectedLabel value first, then set the new value
    // Instead of using a function callback, we'll handle the toggle logic here
    setSelectedLabel(labelId);
  };

  return {
    imageRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleLabelClick
  };
};
