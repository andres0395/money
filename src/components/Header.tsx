import { Link } from '@tanstack/react-router'
import BetterAuthHeader from '../integrations/better-auth/header-user.tsx'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-glass)] bg-[rgba(5,5,5,0.8)] px-4 backdrop-blur-xl">
      <nav className="page-wrap flex items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-3 no-underline group"
          >
            <div className="h-10 w-10 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:scale-110 transition-transform">
              <span className="text-white text-xl font-black">C</span>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[var(--text-main)] display-title hidden sm:block">
              Control de Gastos
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <Link
              to="/"
              className="nav-link"
              activeProps={{ className: 'nav-link active' }}
            >
              Dashboard
            </Link>
            <Link
              to="/history"
              className="nav-link"
              activeProps={{ className: 'nav-link active' }}
            >
              Historial
            </Link>
          </div>

        </div>

        <div className="flex items-center gap-4">
          <BetterAuthHeader />
        </div>
      </nav>
    </header>
  )
}
