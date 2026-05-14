import { SummaryCard } from '../molecules/SummaryCard.js';
import { ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react';

interface DashboardSummaryProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const DashboardSummary = ({
  totalIncome,
  totalExpense,
  balance,
}: DashboardSummaryProps) => {
  return (
    <div className="summary-grid">
      <SummaryCard
        title="Ingresos Totales"
        amount={totalIncome}
        variant="income"
        icon={<ArrowUpCircle className="text-[var(--success)]" />}
      />
      <SummaryCard
        title="Gastos Totales"
        amount={totalExpense}
        variant="expense"
        icon={<ArrowDownCircle className="text-[var(--danger)]" />}
      />
      <SummaryCard
        title="Balance Neto"
        amount={balance}
        variant="balance"
        icon={<Wallet className="text-[var(--primary)]" />}
      />
    </div>
  );
};
