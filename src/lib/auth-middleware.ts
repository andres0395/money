import { auth } from './auth.js';

export async function getSession(request?: Request) {
  if (!request) {
    return null;
  }

  return await auth.api.getSession({
    headers: request.headers,
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
 * Simple in-memory rate limiter.
 * In a real production environment, use Redis (Upstash) for persistence across instances.
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
