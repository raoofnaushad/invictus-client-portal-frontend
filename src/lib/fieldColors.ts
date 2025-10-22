// Shared field color management system using consistent design colors
const colorPalette = [
  "#1C1C1C", "#14CA74", "#95A4FC", "#B1E3FF", "#AEC7ED",
  "#9E768F", "#8A897C", "#E8AEB7", "#FFF2BB", "#E9BA91", 
  "#92BFFF", "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", 
  "#EF4444", "#06B6D4", "#8B5A2B", "#DC2626", "#7C3AED", "#059669", "#D97706"
];

// Predefined liability colors using SVG color scheme
export const liabilityColors = {
  'Mortgages': '#1C1C1C',
  'Credit Cards': '#14CA74', 
  'Business Loans': '#95A4FC',
  'Investment Loans': '#B1E3FF'
};

class FieldColorManager {
  private fieldColorMap: Record<string, string> = {};
  private usedColors: Set<string> = new Set();

  getFieldColor(fieldKey: string): string {
    // Return existing color if already assigned
    if (this.fieldColorMap[fieldKey]) {
      return this.fieldColorMap[fieldKey];
    }

    // Find first unused color
    const availableColor = colorPalette.find(color => !this.usedColors.has(color));
    const assignedColor = availableColor || colorPalette[Object.keys(this.fieldColorMap).length % colorPalette.length];

    // Assign and track the color
    this.fieldColorMap[fieldKey] = assignedColor;
    this.usedColors.add(assignedColor);

    return assignedColor;
  }

  // Reset the color assignments (useful for testing or starting fresh)
  reset() {
    this.fieldColorMap = {};
    this.usedColors = new Set();
  }
}

// Create a singleton instance to be shared across all components
export const fieldColorManager = new FieldColorManager();

// Convenience function for components to use
export const getFieldColor = (fieldKey: string): string => {
  return fieldColorManager.getFieldColor(fieldKey);
};