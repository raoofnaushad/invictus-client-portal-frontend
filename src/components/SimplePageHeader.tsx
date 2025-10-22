interface SimplePageHeaderProps {
  title: string;
  subtitle?: string;
}

export const SimplePageHeader = ({ title, subtitle }: SimplePageHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-gray-600">{subtitle}</p>
        )}
      </div>
    </div>
  );
};