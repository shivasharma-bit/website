const BASE_WS = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/v1')
  .replace('http://', 'ws://')
  .replace('https://', 'wss://');

export type WSEvent =
  | { event: 'message.new';      data: { threadId: string; message: any } }
  | { event: 'message.read';     data: { threadId: string; readBy: string } }
  | { event: 'thread.typing';    data: { threadId: string; userId: string } }
  | { event: 'notification.new'; data: any };

type Handler = (evt: WSEvent) => void;

class WebSocketService {
  private ws:       WebSocket | null = null;
  private handlers: Handler[]        = [];
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    this.ws = new WebSocket(`${BASE_WS}/ws?token=${token}`);

    this.ws.onmessage = (e) => {
      try {
        const evt: WSEvent = JSON.parse(e.data);
        this.handlers.forEach(h => h(evt));
      } catch {}
    };

    this.ws.onclose = () => {
      // Retry after 3 seconds
      this.retryTimer = setTimeout(() => {
        const t = localStorage.getItem('forge_access_token');
        if (t) this.connect(t);
      }, 3000);
    };

    this.ws.onerror = () => this.ws?.close();
  }

  disconnect() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.ws?.close();
    this.ws = null;
  }

  send(payload: object) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload));
    }
  }

  sendTyping(threadId: string) {
    this.send({ event: 'thread.typing', threadId });
  }

  on(handler: Handler) {
    this.handlers.push(handler);
    return () => { this.handlers = this.handlers.filter(h => h !== handler); };
  }
}

export const wsService = new WebSocketService();
