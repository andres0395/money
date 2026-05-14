import { prisma } from '../db.js';
import { TransactionType } from '@prisma/client';

export type CreateTransactionData = {
  description: string;
  amount: number;
  type: TransactionType;
  date?: Date;
};

export class TransactionRepository {
  static async findAll() {
    return prisma.transaction.findMany({
      orderBy: { date: 'desc' },
    });
  }

  static async create(data: CreateTransactionData) {
    return prisma.transaction.create({
      data,
    });
  }

  static async delete(id: string) {
    return prisma.transaction.delete({
      where: { id },
    });
  }

  static async getSummary() {
    const transactions = await prisma.transaction.findMany({
      select: {
        amount: true,
        type: true,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const t of transactions) {
      if (t.type === TransactionType.INCOME) {
        totalIncome += t.amount;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      } else if (t.type === TransactionType.EXPENSE) {
        totalExpense += t.amount;
      }
    }

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }

  static async consolidateMonth() {
    return prisma.$transaction(async (tx) => {
      const transactions = await tx.transaction.findMany();

      if (transactions.length === 0) {
        return 0;
      }

      // Map transactions to consolidated transactions
      const consolidatedData = transactions.map((t) => ({
        description: t.description,
        amount: t.amount,
        type: t.type,
        date: t.date,
      }));

      // Create all in ConsolidatedTransaction
      await Promise.all(
        consolidatedData.map((data) =>
          tx.consolidatedTransaction.create({
            data,
          })
        )
      );

      // Delete all from Transaction

      await tx.transaction.deleteMany();

      return transactions.length;
    });
  }

  static async getConsolidatedSummary() {
    return prisma.consolidatedTransaction.findMany({
      orderBy: { date: 'desc' },
    });
  }
}


