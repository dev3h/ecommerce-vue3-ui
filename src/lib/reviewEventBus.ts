// Event bus for review updates
class ReviewEventBus {
    private readonly events: Map<string, Function[]> = new Map()

    on(event: string, callback: Function) {
        if (!this.events.has(event)) {
            this.events.set(event, [])
        }
        this.events.get(event)!.push(callback)
    }

    off(event: string, callback: Function) {
        const callbacks = this.events.get(event)
        if (callbacks) {
            const index = callbacks.indexOf(callback)
            if (index > -1) {
                callbacks.splice(index, 1)
            }
        }
    }

    emit(event: string, ...args: any[]) {
        const callbacks = this.events.get(event)
        if (callbacks) {
            callbacks.forEach((callback) => callback(...args))
        }
    }
}

export const reviewEventBus = new ReviewEventBus()

// Event types
export const REVIEW_EVENTS = {
    REVIEW_CREATED: 'review:created',
    REVIEW_UPDATED: 'review:updated',
    REVIEW_DELETED: 'review:deleted',
} as const
