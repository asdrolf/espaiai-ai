import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { request, url } = context;
  
  // Force HTTPS in production
  if (url.protocol === 'http:' && url.hostname !== 'localhost') {
    const httpsUrl = new URL(url);
    httpsUrl.protocol = 'https:';
    return Response.redirect(httpsUrl.toString(), 301);
  }
  
  // Handle trailing slash redirects
  // Astro's trailingSlash: "always" should handle this, but adding as backup
  if (!url.pathname.endsWith('/') && !url.pathname.includes('.') && url.pathname !== '/') {
    const redirectUrl = new URL(url);
    redirectUrl.pathname += '/';
    return Response.redirect(redirectUrl.toString(), 301);
  }
  
  // Continue to the next middleware or route handler
  return next();
}); 