import { useState } from 'react'
import { authClient } from '../lib/auth-client.js'
import { TrendingUp, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })
      if (result.error) {
        setError('Email o contraseña incorrectos.')
      }
    } catch {
      setError('Error al iniciar sesión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col gap-8 animate-fade-in">

        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center island-shell" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}>
            <TrendingUp size={28} color="white" />
          </div>
          <div>
            <h1 className="display-title text-3xl font-extrabold text-[var(--text-main)]">
              FinanceTracker
            </h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Gestiona tus finanzas personales
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="island-shell p-8 flex flex-col gap-6">
          <div>
            <h2 className="display-title text-xl font-bold text-[var(--text-main)]">
              Iniciar Sesión
            </h2>
            <p className="text-[var(--text-muted)] text-sm mt-1">
              Ingresa con tu cuenta para continuar
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)] text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-muted)]">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 text-sm"
                  style={{ borderRadius: '12px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-muted)]">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 text-sm"
                  style={{ borderRadius: '12px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                  style={{ background: 'none', border: 'none', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200"
              style={{
                background: loading
                  ? 'var(--surface-glass)'
                  : 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                boxShadow: loading ? 'none' : '0 4px 15px var(--glow-primary)',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-[var(--text-muted)]">
          Acceso restringido · Solo usuarios autorizados
        </p>
      </div>
    </main>
  )
}
