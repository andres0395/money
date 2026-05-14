import { Button } from '../atoms/Button.js';
import { TrendingUp, TrendingDown, Trash2 } from 'lucide-react';

interface TransactionItemProps {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: Date | string;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const TransactionItem = ({
  id,
  description,
  amount,
  type,
  date,
  onDelete,
  isDeleting = false,
}: TransactionItemProps) => {
  const isIncome = type === 'INCOME';

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group flex items-center justify-between rounded-2xl border border-[var(--border-glass)] bg-[var(--surface-glass)] p-4 transition-all hover:bg-[var(--surface-glass-hover)] hover:border-[var(--border-glass)]">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${isIncome ? 'bg-[rgba(16,185,129,0.1)] text-[var(--success)]' : 'bg-[rgba(239,68,68,0.1)] text-[var(--danger)]'}`}>
          {isIncome ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[var(--text-main)]">{description}</span>
          <span className="text-xs text-[var(--text-muted)] font-medium">{formattedDate}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <span className={`text-lg font-bold ${isIncome ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
          {isIncome ? '+' : '-'}{formattedAmount}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10"
          onClick={() => onDelete(id)}
          disabled={isDeleting}
          isLoading={isDeleting}
        >
          {!isDeleting && <Trash2 size={16} />}
        </Button>
      </div>
    </div>
  );
};
