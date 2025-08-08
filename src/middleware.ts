import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const currentUrl = new URL(context.request.url);

  // Compute the canonical target in one pass to avoid multiple hops
  let shouldRedirect = false;
  const targetUrl = new URL(currentUrl);

  // 1) Enforce HTTPS (except for localhost)
  if (targetUrl.protocol === 'http:' && targetUrl.hostname !== 'localhost') {
    targetUrl.protocol = 'https:';
    shouldRedirect = true;
  }

  // 2) Ensure trailing slash for non-root, non-file paths
  const isFileRequest = targetUrl.pathname.includes('.') || targetUrl.pathname === '';
  if (!isFileRequest && targetUrl.pathname !== '/' && !targetUrl.pathname.endsWith('/')) {
    targetUrl.pathname = `${targetUrl.pathname}/`;
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    return Response.redirect(targetUrl.toString(), 301);
  }

  // Proceed and optionally set security headers
  const response = await next();
  try {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  } catch (_) {
    // Ignore if headers are immutable in this environment
  }
  return response;
});