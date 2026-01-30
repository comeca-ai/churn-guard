import { useParams, useNavigate } from "react-router-dom";
import {
  CustomerHeader,
  RiskTimelineChart,
  DriversCard,
  MetricsCard,
  ActionsCard,
} from "@/components/customer";
import {
  mockCustomers,
  mockRiskScoreHistory,
  mockDrivers,
  mockCustomerMetrics,
  mockActions,
} from "@/data/mockData";

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the customer by ID (mock data)
  const customer = mockCustomers.find((c) => c.id === id) || mockCustomers[0];
  const customerActions = mockActions.filter((a) => a.customerId === customer.id);

  const handleOpenAssistant = () => {
    navigate(`/assistant?customer=${customer.id}`);
  };

  const handleNewAction = () => {
    navigate(`/actions?new=true&customer=${customer.id}`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <CustomerHeader
        name={customer.name}
        riskLevel={customer.riskLevel}
        riskScore={customer.riskScore}
        mrr={customer.mrr}
        ownerName={customer.ownerName}
        onOpenAssistant={handleOpenAssistant}
        onNewAction={handleNewAction}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RiskTimelineChart data={mockRiskScoreHistory} />
        <DriversCard drivers={mockDrivers} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MetricsCard metrics={mockCustomerMetrics} />
        <ActionsCard actions={customerActions} onNewAction={handleNewAction} />
      </div>
    </div>
  );
}
