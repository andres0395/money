import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getTransactions, getTransactionSummary, consolidateMonth } from '../server/transactions.actions.js'
import { DashboardSummary } from '../components/organisms/DashboardSummary.js'
import { TransactionForm } from '../components/organisms/TransactionForm.js'
import { TransactionList } from '../components/organisms/TransactionList.js'
import { Button } from '../components/atoms/Button.js'
import { ArchiveRestore } from 'lucide-react'
import { authClient } from '../lib/auth-client.js'
import { LoginPage } from '../components/LoginPage.js'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    try {
      const [transactions, summary] = await Promise.all([
        getTransactions(),
        getTransactionSummary(),
      ]);
      return { transactions, summary, authenticated: true };
    } catch {
      // If auth fails, return empty data and let the client handle the redirect
      return { transactions: [], summary: { totalIncome: 0, totalExpense: 0, balance: 0 }, authenticated: false };
    }
  },
})

function Home() {
  const { transactions, summary } = Route.useLoaderData()
  const router = useRouter()
  const { data: session } = authClient.useSession()

  // Show login if not authenticated
  if (!session?.user) {
    return <LoginPage />
  }

  const handleConsolidate = async () => {
    if (
      confirm(
        '¿Estás seguro de que deseas consolidar el mes? Esto moverá todas las transacciones actuales al histórico y limpiará el dashboard.'
      )
    ) {
      try {
        await consolidateMonth()
        router.invalidate()
      } catch (error) {
        alert('Error al consolidar el mes')
      }
    }
  }


  return (
    <main className="page-wrap px-4 pb-16 pt-12">
      <section className="flex flex-col gap-12">

        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-bold uppercase tracking-widest">
                Finanzas Personales
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleConsolidate}
              className="flex items-center gap-2 border border-[var(--border)] hover:border-[var(--primary)]"
            >
              <ArchiveRestore size={16} />
              Consolidar Mes
            </Button>
          </div>
          <h1 className="display-title text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--text-main)]">
            Tu Dashboard <span className="text-[var(--primary)]">Financiero</span>
          </h1>
          <p className="text-lg text-[var(--text-muted)] font-medium max-w-2xl">
            Monitorea tus ingresos, controla tus gastos y alcanza tus metas de ahorro con una interfaz diseñada para la claridad.
          </p>
        </div>


        <DashboardSummary
          totalIncome={summary.totalIncome}
          totalExpense={summary.totalExpense}
          balance={summary.balance}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <TransactionForm />
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6 animate-fade-in [animation-delay:200ms]">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-bold text-[var(--text-main)] display-title">
                Transacciones Recientes
              </h2>
              <span className="text-sm text-[var(--text-muted)] font-bold">
                {transactions.length} movimientos
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <TransactionList transactions={transactions} />
            </div>
          </div>
        </div>

      </section>
    </main>
  )
}
