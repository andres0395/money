import { authClient } from "../../lib/auth-client.js"
import { LogOut } from "lucide-react"

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
          <span className="text-xs font-bold text-(--text-main) leading-none">{session.user.name}</span>
          <span className="text-[10px] font-medium text-(--text-muted) uppercase tracking-wider">
            {(session.user as any).role || 'VIEWER'}
          </span>
        </div>
        
        <div className="flex items-center gap-2 island-shell p-1.5 rounded-full border-(--border-glass)">

          <button
            onClick={() => {
              void authClient.signOut()
            }}
            className="p-1.5 hover:text-(--danger) transition-colors text-(--text-muted)"
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

