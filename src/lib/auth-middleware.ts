import { auth } from './auth.js';
import { getRequest } from '@tanstack/react-start/server';

export async function getSession(request?: Request) {
  const req = request || getRequest()

  return await auth.api.getSession({
    headers: req.headers,
  });
}

export async function requireAdmin(request?: Request) {
  const session = await getSession(request);
  if (!session || (session.user as any).role !== 'ADMIN') {
    throw new Error('Acceso denegado: Se requieren permisos de administrador');
  }
  return session;
}

export async function requireAuth(request?: Request) {
  const session = await getSession(request);
  if (!session) {
    throw new Error('Acceso denegado: Debes iniciar sesión');
  }
  return session;
}

/**
 * NOTA: En Netlify (Serverless), este Map se borrará constantemente entre peticiones.
 * Considera migrar esto a Upstash/Redis en el futuro.
 */
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const data = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - data.lastReset > windowMs) {
    data.count = 1;
    data.lastReset = now;
  } else {
    data.count++;
  }

  rateLimitMap.set(ip, data);

  if (data.count > limit) {
    throw new Error('Demasiadas peticiones. Por favor, intenta de nuevo más tarde.');
  }
}