import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { TransactionRepository } from '../repositories/transaction.repository.js';
import { TransactionType } from '@prisma/client';
import {
  requireAdmin,
  requireAuth,
  checkRateLimit,
} from '../lib/auth-middleware.js';

export const getTransactions = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const request = getRequest();
    await requireAuth(request);

    const transactions = await TransactionRepository.findAll();
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
});

export const getTransactionSummary = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const request = getRequest();
    await requireAuth(request);

    const summary = await TransactionRepository.getSummary();
    return summary;
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    throw error;
  }
});

export const createTransaction = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) =>
    z
      .object({
        description: z.string().min(1, 'Description is required'),
        amount: z.number().positive('Amount must be positive'),
        type: z.nativeEnum(TransactionType),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    try {
      const request = getRequest();

      const ip = request.headers.get('x-forwarded-for') || 'anonymous';
      checkRateLimit(ip, 5);
      await requireAdmin(request);

      const transaction = await TransactionRepository.create(data);
      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  });

export const deleteTransaction = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown) =>
    z
      .object({
        id: z.string(),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    try {
      const request = getRequest();

      const ip = request.headers.get('x-forwarded-for') || 'anonymous';
      checkRateLimit(ip, 5);
      await requireAdmin(request);

      const transaction = await TransactionRepository.delete(data.id);
      return transaction;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  });

export const consolidateMonth = createServerFn({
  method: 'POST',
}).handler(async () => {
  try {
    const request = getRequest();

    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    checkRateLimit(ip, 2);
    await requireAdmin(request);

    const count = await TransactionRepository.consolidateMonth();
    return { count };
  } catch (error) {
    console.error('Error consolidating month:', error);
    throw error;
  }
});

export const getConsolidatedTransactions = createServerFn({
  method: 'GET',
}).handler(async () => {
  try {
    const request = getRequest();
    await requireAuth(request);

    const transactions = await TransactionRepository.getConsolidatedSummary();
    return transactions;
  } catch (error) {
    console.error('Error fetching consolidated transactions:', error);
    throw error;
  }
});