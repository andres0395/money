import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { TransactionItem } from '../molecules/TransactionItem.js';
import { deleteTransaction } from '../../server/transactions.actions.js';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  date: Date | string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTransaction({ data: { id } });
      router.invalidate();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[rgba(23,58,64,0.15)] bg-[rgba(250,252,252,0.5)] py-16 text-center backdrop-blur-sm">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(79,184,178,0.1)] text-2xl">
          📝
        </div>
        <h3 className="text-lg font-semibold text-[var(--sea-ink)]">
          No transactions yet
        </h3>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          Add an income or expense to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          id={transaction.id}
          description={transaction.description}
          amount={transaction.amount}
          type={transaction.type}
          date={transaction.date}
          onDelete={handleDelete}
          isDeleting={deletingId === transaction.id}
        />
      ))}
    </div>
  );
};
