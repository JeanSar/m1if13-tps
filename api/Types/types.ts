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
    position: Position,
    composition: string | "allReadyOpen"
}

export interface Ressource {
    id: string,
    imageUrl: string,
    position: Position,
    role: string,
    ttl: number,
    treasures: Tresor[]
}

const ressources: Ressource[] = [];

export {ressources}