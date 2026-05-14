import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { Button } from '../atoms/Button.js';
import { Input } from '../atoms/Input.js';
import { Select } from '../atoms/Select.js';
import { createTransaction } from '../../server/transactions.actions.js';

export const TransactionForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    setIsSubmitting(true);
    try {
      await createTransaction({
        data: {
          description,
          amount: parseFloat(amount),
          type,
        },
      });
      setDescription('');
      setAmount('');
      setType('EXPENSE');
      router.invalidate();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="island-shell p-8 animate-fade-in sticky top-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-main)] display-title">
          Nueva Transacción
        </h2>
        <p className="text-sm text-[var(--text-muted)] font-medium mt-1">
          Registra tus movimientos financieros
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Input
          label="Descripción"
          type="text"
          placeholder="Ej. Alquiler, Sueldo, Café"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="bg-[rgba(255,255,255,0.02)]"
        />
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <Input
              label="Monto"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="flex-1">
            <Select
              label="Categoría"
              value={type}
              onChange={(e) => setType(e.target.value as 'INCOME' | 'EXPENSE')}
              options={[
                { value: 'EXPENSE', label: 'Egreso' },
                { value: 'INCOME', label: 'Ingreso' },
              ]}
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || !description || !amount}
          className="mt-4 w-full"
          size="lg"
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrar Movimiento'}
        </Button>
      </form>
    </div>
  );
};
