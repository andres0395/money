import type { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon?: ReactNode;
  variant?: 'default' | 'income' | 'expense' | 'balance';
}

export const SummaryCard = ({ title, amount, icon, variant = 'default' }: SummaryCardProps) => {
  const isPositive = amount >= 0;
  
  const variantGradients = {
    default: 'from-[rgba(255,255,255,0.05)] to-transparent',
    income: 'from-[rgba(16,185,129,0.1)] to-transparent border-[rgba(16,185,129,0.2)]',
    expense: 'from-[rgba(239,68,68,0.1)] to-transparent border-[rgba(239,68,68,0.2)]',
    balance: isPositive 
      ? 'from-[rgba(139,92,246,0.1)] to-transparent border-[rgba(139,92,246,0.2)]'
      : 'from-[rgba(239,68,68,0.1)] to-transparent border-[rgba(239,68,68,0.2)]',
  };

  const textColors = {
    default: 'text-[var(--text-main)]',
    income: 'text-[var(--success)]',
    expense: 'text-[var(--danger)]',
    balance: isPositive ? 'text-[var(--primary)]' : 'text-[var(--danger)]',
  };

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Math.abs(amount));

  return (
    <div className={`island-shell flex flex-col gap-3 p-8 animate-fade-in bg-gradient-to-br ${variantGradients[variant]}`}>
      <div className="flex items-center justify-between text-[var(--text-muted)]">
        <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
        {icon && <div className="p-2 rounded-xl bg-white/5">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-1">
        <p className={`text-4xl font-extrabold tracking-tight ${textColors[variant]} display-title`}>
          {variant === 'balance' && !isPositive ? '-' : ''}{formattedAmount}
        </p>
      </div>
    </div>
  );
};
