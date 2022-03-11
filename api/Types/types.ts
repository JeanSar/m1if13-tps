export interface Position {
    x: number,
    y: number
}

export interface Aventurier {
    image: string,
    position: Position,
    ttl: number
}

export interface User {
    aventurier: Aventurier,
    isAdmin: boolean
}