
import StatsCard from "@/components/StatsCard";
import { CardValues } from "@/types/dashboard";

interface DashboardStatsCardsProps {
  cardValues: CardValues;
  selectedFilter: string | null;
  onCardClick: (cardType: string) => void;
}

const DashboardStatsCards = ({ cardValues, selectedFilter, onCardClick }: DashboardStatsCardsProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 mx-8 mt-2.5 mb-4">
      <StatsCard 
        title="Total Net Worth"
        amount={`$${Math.round(cardValues.total.netWorth / 1000000)}M`}
        percentChange={13.8}
        variant="highlighted"
        onClick={() => onCardClick('Total')}
        isSelected={selectedFilter === 'Total'}
      />
      <StatsCard 
        title="Managed by WATAR"
        amount={`$${Math.round(cardValues.watar.netWorth / 1000000)}M`}
        percentChange={13.8}
        onClick={() => onCardClick('WATAR')}
        isSelected={selectedFilter === 'WATAR'}
      />
      <StatsCard 
        title="Externally Managed"
        amount={`$${Math.round(cardValues.external.netWorth / 1000000)}M`}
        percentChange={13.8}
        onClick={() => onCardClick('External')}
        isSelected={selectedFilter === 'External'}
      />
      <StatsCard 
        title="Unmanaged"
        amount={`$${Math.round(cardValues.unmanaged.netWorth / 1000000)}M`}
        percentChange={-9.1}
        onClick={() => onCardClick('Unmanaged')}
        isSelected={selectedFilter === 'Unmanaged'}
      />
    </div>
  );
};

export default DashboardStatsCards;
