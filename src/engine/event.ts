interface GameEvent {
    id: string;
    timestamp: number;
    data: any;
}

interface GameEventListener {
    on_event: (event: GameEvent) => void
}

const create_event: (id: string, timestamp: number, data?: any) => GameEvent = (id, timestamp, data) => ({
    id,
    timestamp,
    data: data || null
})