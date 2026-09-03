// src/config/websocket.ts

const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:'
    ? 'wss:'
    : 'ws:';

  return `${protocol}//${window.location.hostname}:8080/ws`;
};

export const WEBSOCKET_URL = getWebSocketUrl();
