import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IlliquidInvestment } from "@/types/illiquidInvestment";
import { IlliquidInvestmentHeader } from "@/components/IlliquidInvestmentHeader";
import { IlliquidInvestmentSummaryCard } from "@/components/IlliquidInvestmentSummaryCard";
import { IlliquidInvestmentTransactionsSection } from "@/components/IlliquidInvestmentTransactionsSection";
import { IlliquidInvestmentApiService } from "@/services/illiquidInvestmentApi";

const IlliquidInvestmentDetailsPage = () => {
  const { investmentId } = useParams();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const [investment, setInvestment] = useState<IlliquidInvestment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (investmentId) {
      fetchInvestment(investmentId);
    }
  }, [investmentId]);

  const fetchInvestment = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await IlliquidInvestmentApiService.getIlliquidInvestment(id);
      setInvestment(data);
      if (!data) {
        setError("Investment not found");
      }
    } catch (error) {
      console.error('Failed to fetch investment:', error);
      setError("Failed to load investment details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-muted-foreground">Loading investment details...</div>
        </div>
      </div>
    );
  }

  if (error || !investment) {
    return (
      <div className="p-6">
        <IlliquidInvestmentHeader
          fundName=""
          onBackClick={() => navigate('/illiquid-investments')}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {error === "Investment not found" ? "Investment Not Found" : "Error Loading Investment"}
          </h1>
          <p className="text-gray-600 mt-2">
            {error === "Investment not found" 
              ? "The requested investment could not be found." 
              : "There was an error loading the investment details. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <IlliquidInvestmentHeader
        fundName={investment.fundName}
        onBackClick={() => navigate('/illiquid-investments')}
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <IlliquidInvestmentSummaryCard investment={investment} />

      <IlliquidInvestmentTransactionsSection investmentId={investment.id} />
    </div>
  );
};

export default IlliquidInvestmentDetailsPage;