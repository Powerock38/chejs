export const TERRAIN_X_LENGTH = 8
export const TERRAIN_Y_LENGTH = 8

export let SQUARE_SIZE

export function refreshSquareSize() {
    if (window.innerWidth > window.innerHeight) {
        SQUARE_SIZE = Math.floor(window.innerHeight / TERRAIN_Y_LENGTH)
    } else {
        SQUARE_SIZE = Math.floor(window.innerWidth / TERRAIN_X_LENGTH)
    }
}
refreshSquareSize()

export const FACING = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3
}

export const COLOR = {
    BLACK: "#050505",
    WHITE: "#FDFDFD",
}

export const PIECE = {
    KING: 'k',
    QUEEN: 'q',
    ROOK: 'r',
    BISHOP: 'b',
    KNIGHT: 'n',
    PAWN: 'p',
}

export const PIECE_EMOJIS = {
    [PIECE.KING]: '♔',
    [PIECE.QUEEN]: '♕',
    [PIECE.ROOK]: '♖',
    [PIECE.BISHOP]: '♗',
    [PIECE.KNIGHT]: '♘',
    [PIECE.PAWN]: '♙',
}