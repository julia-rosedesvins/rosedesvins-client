'use client';
import { useEffect } from 'react';

/**
 * Catches ChunkLoadError (stale JS chunks after a new deployment) and
 * performs a hard reload so the browser fetches fresh HTML + new chunk refs.
 * Only reloads once per session to avoid infinite loops if something else
 * is genuinely broken.
 */
export default function ChunkErrorRecovery() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const isChunkError =
        event.message?.includes('ChunkLoadError') ||
        event.message?.includes('Loading chunk') ||
        event.error?.name === 'ChunkLoadError';

      if (isChunkError) {
        const reloadKey = '__chunk_reload__';
        if (!sessionStorage.getItem(reloadKey)) {
          sessionStorage.setItem(reloadKey, '1');
          window.location.reload();
        }
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const isChunkError =
        reason?.name === 'ChunkLoadError' ||
        reason?.message?.includes('Loading chunk') ||
        reason?.message?.includes('ChunkLoadError');

      if (isChunkError) {
        const reloadKey = '__chunk_reload__';
        if (!sessionStorage.getItem(reloadKey)) {
          sessionStorage.setItem(reloadKey, '1');
          window.location.reload();
        }
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
