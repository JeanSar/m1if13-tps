export interface Position {
    x: number,
    y: number
}

export interface Limites {
    limite_NO: Position,
    limite_NE: Position,
    limite_SE: Position,
    limite_SO: Position
}

export interface Aventurier {
    id: string,
    image: string,
    position: Position,
    ttl: number
}

export interface User {
    aventurier: Aventurier,
    isAdmin: boolean
}

export interface Tresor {
    id: string,
    position: Position,
    composition: string | "allReadyOpen"
}

export interface Georesource {
    id: string,
    url: string,
    position: Position,
    role: "player" | "admin",
    ttl: number,
    treasures: Tresor[]
}

export function convertToGeoResource (users: User[], treasures: Tresor[], id: string): Georesource | undefined {
    const user = users.find(e => e.aventurier.id === id);
    if(user === undefined) {
        return undefined;
    }
    return {
        id: user.aventurier.id,
        url: user.aventurier.image,
        position: user.aventurier.position,
        role: user.isAdmin ? "admin" : "player",
        ttl: user.aventurier.ttl,
        treasures: treasures
    }
}