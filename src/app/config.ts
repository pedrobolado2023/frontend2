// Configuração dinâmica da URL do Backend baseada no host atual
export const API_URL = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.hostname}:3001`
  : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001");
