import { createFileRoute } from '@tanstack/react-router'
import { getConsolidatedTransactions } from '../server/transactions.actions.js'
import { useState } from 'react'
import { ChevronDown, Calendar, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { authClient } from '../lib/auth-client.js'
import { LoginPage } from '../components/LoginPage.js'

export const Route = createFileRoute('/history')({
  component: History,
  loader: async () => {
    try {
      return await getConsolidatedTransactions()
    } catch {
      return []
    }
  },
})

function History() {
  const transactionsData = Route.useLoaderData()
  const { data: session, isPending } = authClient.useSession()
  const transactions = Array.isArray(transactionsData) ? transactionsData : []
  const [expandedMonths, setExpandedMonths] = useState<string[]>([])

  if (isPending) {
    return <div className="p-8 text-center text-(--text-muted)">Cargando...</div>
  }

  if (!session?.user) {
    return <LoginPage />
  }


  // Group by month
  const grouped = transactions.reduce((acc: any, t: any) => {
    if (!t.date) return acc
    const d = new Date(t.date)
    const month = d.toLocaleString('es-ES', { month: 'long' })
    const year = d.getFullYear()
    const key = `${month} ${year}`

    if (!acc[key]) {
      acc[key] = {
        name: key,
        totalIncome: 0,
        totalExpense: 0,
        items: []
      }
    }

    if (t.type === 'INCOME') acc[key].totalIncome += t.amount
    else acc[key].totalExpense += t.amount

    acc[key].items.push(t)
    return acc
  }, {})

  const months = Object.values(grouped)


  const toggleMonth = (name: string) => {
    setExpandedMonths(prev =>
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    )
  }

  return (
    <main className="page-wrap px-4 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-(--primary)/10 text-(--primary) text-xs font-bold uppercase tracking-widest">
              Histórico
            </span>
          </div>
          <h1 className="display-title text-5xl font-extrabold text-(--text-main) tracking-tight">
            Tus <span className="text-(--primary)">Consolidaciones</span>
          </h1>
          <p className="text-lg text-(--text-muted) font-medium max-w-2xl">
            Revisa tus movimientos de meses anteriores que han sido archivados.
          </p>
        </div>

        <div className="flex flex-col gap-6 animate-fade-in [animation-delay:200ms]">
          {months.length === 0 ? (
            <div className="island-shell rounded-3xl p-16 text-center border border-dashed border-(--border-glass)">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-(--surface-glass) flex items-center justify-center text-(--text-muted)">
                  <Calendar size={32} />
                </div>
                <div>
                  <p className="text-xl font-bold text-(--text-main)">No hay datos históricos</p>
                  <p className="text-(--text-muted)">Consolida tu primer mes para ver el historial aquí.</p>
                </div>
              </div>
            </div>
          ) : (
            months.map((month: any) => (
              <div key={month.name} className="island-shell rounded-3xl overflow-hidden border border-(--border-glass) transition-all duration-300 hover:shadow-2xl hover:shadow-(--primary)/5">
                <button
                  onClick={() => toggleMonth(month.name)}
                  className="w-full flex flex-col sm:flex-row items-center justify-between p-8 hover:(--surface-glass-hover) transition-all text-left gap-6"
                >
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="h-14 w-14 rounded-2xl bg-(--primary)/10 flex items-center justify-center text-(--primary) shadow-inner">
                      <Calendar size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-(--text-main) capitalize tracking-tight">
                        {month.name}
                      </h3>
                      <p className="text-sm text-(--text-muted) font-bold">
                        {month.items.length} movimientos
                      </p>
                      <p className="text-sm text-(--text-muted) font-bold">
                        Balance ${(month.totalIncome - month.totalExpense).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-(--success) opacity-80 mb-1">Ingresos</p>
                        <p className="text-lg font-black text-(--text-main)">
                          ${month.totalIncome.toLocaleString()}
                        </p>
                      </div>
                      <div className="w-px h-8 bg-(--border-glass)" />
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-(--danger) opacity-80 mb-1">Gastos</p>
                        <p className="text-lg font-black text-(--text-main)">
                          ${month.totalExpense.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className={`p-2 rounded-xl bg-(--surface-glass) text-(--text-muted) transition-transform duration-300 ${expandedMonths.includes(month.name) ? 'rotate-180' : ''}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </button>

                {expandedMonths.includes(month.name) && (
                  <div className="border-t border-(--border-glass) bg-[rgba(5,5,5,0.4)] p-8 animate-slide-down">
                    <div className="flex flex-col gap-3">
                      {month.items.map((t: any) => (
                        <div key={t.id} className="flex items-center justify-between p-5 rounded-2xl bg-(--surface-glass) border border-(--border-glass) hover:border-(--primary)/30 transition-colors group">
                          <div className="flex items-center gap-5">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${t.type === 'INCOME' ? 'bg-(--success)/10 text-(--success)' : 'bg-(--danger)/10 text-(--danger)'}`}>
                              {t.type === 'INCOME' ? (
                                <ArrowUpCircle size={20} />
                              ) : (
                                <ArrowDownCircle size={20} />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-(--text-main) text-lg">{t.description}</p> 
                              <p className="text-xs text-(--text-muted) font-bold uppercase tracking-wider">
                                {new Date(t.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                              </p>
                            </div>
                          </div>
                          <p className={`text-xl font-black ${t.type === 'INCOME' ? 'text-(--success)' : 'text-(--danger)'}`}>
                            {t.type === 'INCOME' ? '+' : '-'}${t.amount.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
