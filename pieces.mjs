import { FACING, PIECE, TERRAIN_X_LENGTH, TERRAIN_Y_LENGTH, COLOR, SQUARE_SIZE, PIECE_EMOJIS } from './constants.mjs';

class Piece {
    constructor(x, y, color, type) {
        this.x = x
        this.y = y
        this.color = color
        this.type = type
        this.facing = color === COLOR.WHITE ? FACING.NORTH : FACING.SOUTH
        this.hasMoved = false
    }

    draw(ctx) {
        ctx.fillStyle = this.color
        ctx.font = (SQUARE_SIZE / 2) + "px Arial"
        ctx.fillText(PIECE_EMOJIS[this.type], this.x * SQUARE_SIZE + SQUARE_SIZE / 4, this.y * SQUARE_SIZE + SQUARE_SIZE / 1.5)
    }

    move(terrain, x, y) {
        if (terrain[y][x] && terrain[y][x].color === this.color) return console.error("Cannot move to occupied square")
        terrain[this.y][this.x] = null
        terrain[y][x] = this
        this.x = x
        this.y = y
        this.hasMoved = true
    }
}

class Pawn extends Piece {

    static moves(x, y, terrain, facing, hasMoved) {
        const moves = []
        const unit = facing === FACING.NORTH ? -1 : 1

        if (!terrain[y + unit][x])
            moves.push({ x, y: y + unit })

        if (terrain[y + unit][x - 1] && terrain[y + unit][x - 1].color !== this.color)
            moves.push({ x: x - 1, y: y + unit })

        if (terrain[y + unit][x + 1] && terrain[y + unit][x + 1].color !== this.color)
            moves.push({ x: x + 1, y: y + unit })

        if (!hasMoved)
            moves.push({ x, y: y + 2 * unit })

        return moves.filter(move => move.y >= 0 && move.y < TERRAIN_Y_LENGTH)
    }

    constructor(x, y, color) {
        super(x, y, color, PIECE.PAWN)
    }

    moves(terrain) {
        return Pawn.moves(this.x, this.y, terrain, this.facing, this.hasMoved)
    }

}

class Rook extends Piece {

    static moves(x, y, terrain) {
        const moves = []
        for (let x_ = x + 1; x_ < TERRAIN_X_LENGTH; x_++) {
            moves.push({ x: x_, y })
            if (terrain[y][x_]) break
        }
        for (let x_ = x - 1; x_ >= 0; x_--) {
            moves.push({ x: x_, y })
            if (terrain[y][x_]) break
        }
        for (let y_ = y + 1; y_ < TERRAIN_Y_LENGTH; y_++) {
            moves.push({ x, y: y_ })
            if (terrain[y_][x]) break
        }
        for (let y_ = y - 1; y_ >= 0; y_--) {
            moves.push({ x, y: y_ })
            if (terrain[y_][x]) break
        }
        return moves
    }

    constructor(x, y, color) {
        super(x, y, color, PIECE.ROOK)
    }

    moves(terrain) {
        return Rook.moves(this.x, this.y, terrain)
    }
}


class Bishop extends Piece {

    static moves(x, y, terrain) {
        const moves = []
        for (let x_ = x + 1, y_ = y + 1; x_ < TERRAIN_X_LENGTH && y_ < TERRAIN_Y_LENGTH; x_++, y_++) {
            moves.push({ x: x_, y: y_ })
            if (terrain[y_][x_]) break
        }
        for (let x_ = x - 1, y_ = y + 1; x_ >= 0 && y_ < TERRAIN_Y_LENGTH; x_--, y_++) {
            moves.push({ x: x_, y: y_ })
            if (terrain[y_][x_]) break
        }
        for (let x_ = x + 1, y_ = y - 1; x_ < TERRAIN_X_LENGTH && y_ >= 0; x_++, y_--) {
            moves.push({ x: x_, y: y_ })
            if (terrain[y_][x_]) break
        }
        for (let x_ = x - 1, y_ = y - 1; x_ >= 0 && y_ >= 0; x_--, y_--) {
            moves.push({ x: x_, y: y_ })
            if (terrain[y_][x_]) break
        }
        return moves
    }

    constructor(x, y, color) {
        super(x, y, color, PIECE.BISHOP)
    }

    moves(terrain) {
        return Bishop.moves(this.x, this.y, terrain)
    }
}

class Knight extends Piece {

    static moves(x, y) {
        const moves = []
        moves.push({ x: x + 1, y: y + 2 })
        moves.push({ x: x + 2, y: y + 1 })
        moves.push({ x: x + 2, y: y - 1 })
        moves.push({ x: x + 1, y: y - 2 })
        moves.push({ x: x - 1, y: y - 2 })
        moves.push({ x: x - 2, y: y - 1 })
        moves.push({ x: x - 2, y: y + 1 })
        moves.push({ x: x - 1, y: y + 2 })
        return moves.filter(move => move.x >= 0 && move.x < TERRAIN_X_LENGTH && move.y >= 0 && move.y < TERRAIN_Y_LENGTH)
    }

    constructor(x, y, color) {
        super(x, y, color, PIECE.KNIGHT)
    }

    moves() {
        return Knight.moves(this.x, this.y)
    }
}

class Queen extends Piece {
    constructor(x, y, color) {
        super(x, y, color, PIECE.QUEEN)
    }

    moves(terrain) {
        return Rook.moves(this.x, this.y, terrain).concat(Bishop.moves(this.x, this.y, terrain))
    }
}

class King extends Piece {

    static moves(x, y) {
        const moves = []
        moves.push({ x: x + 1, y: y + 1 })
        moves.push({ x: x + 1, y })
        moves.push({ x: x + 1, y: y - 1 })
        moves.push({ x, y: y + 1 })
        moves.push({ x, y: y - 1 })
        moves.push({ x: x - 1, y: y + 1 })
        moves.push({ x: x - 1, y })
        moves.push({ x: x - 1, y: y - 1 })
        return moves.filter(move => move.x >= 0 && move.x < TERRAIN_X_LENGTH && move.y >= 0 && move.y < TERRAIN_Y_LENGTH)
    }

    constructor(x, y, color) {
        super(x, y, color, PIECE.KING)
    }

    moves() {
        return King.moves(this.x, this.y)
    }
}

export { Pawn, Rook, Bishop, Knight, Queen, King }