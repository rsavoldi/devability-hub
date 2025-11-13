// A simple event emitter for handling global errors
// This avoids complex context providers for a simple notification system.

type EventMap = {
    'permission-error': (error: FirestorePermissionError) => void;
};

type EventName = keyof EventMap;

class EventEmitter<T extends EventMap> {
    private listeners: { [K in keyof T]?: Array<T[K]> } = {};

    on<E extends EventName>(event: E, listener: T[E]): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event]!.push(listener);
    }

    off<E extends EventName>(event: E, listener: T[E]): void {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event] = this.listeners[event]!.filter(l => l !== listener);
    }

    emit<E extends EventName>(event: E, ...args: Parameters<T[E]>): void {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event]!.forEach(listener => listener(...args));
    }
}

export const errorEmitter = new EventEmitter<EventMap>();

// Custom Error for Firestore Permission Denied
export class FirestorePermissionError extends Error {
    public operation: 'read' | 'write' | 'delete';
    public firestoreRef: any; // Firestore DocumentReference or CollectionReference
    public requestResource: any; // The data that was being sent

    constructor(
        operation: 'read' | 'write' | 'delete',
        firestoreRef: any,
        requestResource: any,
        message: string
    ) {
        super(message);
        this.name = 'FirestorePermissionError';
        this.operation = operation;
        this.firestoreRef = {
            path: firestoreRef.path,
            type: firestoreRef.type,
        };
        this.requestResource = requestResource;

        // This is for environments that support it (like V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FirestorePermissionError);
        }
    }
}
