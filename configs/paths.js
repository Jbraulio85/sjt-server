import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = join(__dirname, '..');

/** Vercel (y similares): FS del despliegue es de solo lectura; solo /tmp es escribible. */
export const useEphemeralUploads = Boolean(process.env.VERCEL);

export const uploadsDir = (...segments) => {
  const relative = join(...segments);
  if (useEphemeralUploads) {
    return join('/tmp', 'sjt-server', relative);
  }
  return join(SERVER_ROOT, relative);
};

/** Solo lectura: archivos versionados en el repo (p. ej. default-avatar). */
export const repoAssetsDir = (...segments) => join(SERVER_ROOT, ...segments);
