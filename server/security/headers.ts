import { Request, Response, NextFunction } from 'express';

export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // Prevent Express fingerprinting
  res.removeHeader('X-Powered-By');

  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Cross-site scripting filter
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions policy (restrict device hardware access)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), payment=()');

  // Prevent IE from executing downloads in site's context
  res.setHeader('X-Download-Options', 'noopen');

  // Prevent DNS prefetching
  res.setHeader('X-DNS-Prefetch-Control', 'off');

  // Content Security Policy crafted to protect against script injection while supporting Vite and Unsplash images
  // Uses frame-ancestors * to allow embedding inside Google AI Studio's preview iframe
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.unsplash.com https://*.google.com https://*.googleapis.com https://*.gstatic.com",
    "connect-src 'self' https: wss: ws:",
    "frame-ancestors *",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  res.setHeader('Content-Security-Policy', csp);

  // Cache control for API responses to prevent sensitive data caching
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  next();
}
