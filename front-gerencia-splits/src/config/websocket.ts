// src/config/websocket.ts

const getWebSocketUrl = () => {
  // Detecta se está rodando em modo desenvolvimento (Vite)
  if (import.meta.env.DEV) {
    // Modo desenvolvimento - acessa direto o backend
    return 'http://localhost:8080/ws';
  }

  // Modo produção (Docker) - usa o proxy
  return '/ws';
};

export const WEBSOCKET_URL = getWebSocketUrl();