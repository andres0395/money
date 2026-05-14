import { authClient } from "../../lib/auth-client.js"
import { LogOut, User } from "lucide-react"

export default function BetterAuthHeader() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="h-9 w-9 rounded-full bg-neutral-100/10 animate-pulse" />
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-bold text-[var(--text-main)] leading-none">{session.user.name}</span>
          <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
            {(session.user as any).role || 'VIEWER'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 island-shell p-1.5 rounded-full border-[var(--border-glass)]">
          <div className="h-8 w-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] border border-[var(--primary)]/30">
            {session.user.image ? (
              <img src={session.user.image} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              <User size={16} />
            )}
          </div>
          
          <button
            onClick={() => {
              void authClient.signOut()
            }}
            className="p-1.5 hover:text-[var(--danger)] transition-colors text-[var(--text-muted)]"
            title="Cerrar sesión"
            style={{ background: 'none', border: 'none' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    )
  }

  return null // Don't show anything if not logged in, the page will show LoginPage
}

