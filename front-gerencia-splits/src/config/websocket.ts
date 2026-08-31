// src/config/websocket.ts

const getWebSocketUrl = () => {
  // Desenvolvimento (Vite)
  if (import.meta.env.DEV) {
    // Conecta diretamente no Spring Boot
    return 'ws://localhost:8080/ws';
  }

  // Produção
  const protocol = window.location.protocol === 'https:'
    ? 'wss:'
    : 'ws:';

  return `${protocol}//${window.location.host}/ws`;
};

export const WEBSOCKET_URL = getWebSocketUrl();
