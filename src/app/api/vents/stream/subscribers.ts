// In-memory SSE subscriber management

type VentCallback = (vent: unknown) => void;
const subscribers = new Map<string, VentCallback>();

export function subscribe(cb: VentCallback): string {
  const id = crypto.randomUUID();
  subscribers.set(id, cb);
  return id;
}

export function unsubscribe(id: string) {
  subscribers.delete(id);
}

export function pushVentToSubscribers(vent: unknown) {
  subscribers.forEach((cb) => {
    try {
      cb(vent);
    } catch {
      // Ignore failed pushes
    }
  });
}
