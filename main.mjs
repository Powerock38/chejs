import { Pawn, Rook, Bishop, Knight, Queen, King } from './pieces.mjs'
import { SQUARE_SIZE, COLOR, TERRAIN_X_LENGTH, TERRAIN_Y_LENGTH, PIECE, refreshSquareSize } from './constants.mjs';

const canvas = document.querySelector("#canvas")
const CTX = canvas.getContext("2d")

/*
+------------->x
|
|      N
|    W   E
|      S
|
V
y
*/


export const TERRAIN = [
    [new Rook(0, 0, COLOR.BLACK), new Knight(1, 0, COLOR.BLACK), new Bishop(2, 0, COLOR.BLACK), new Queen(3, 0, COLOR.BLACK), new King(4, 0, COLOR.BLACK), new Bishop(5, 0, COLOR.BLACK), new Knight(6, 0, COLOR.BLACK), new Rook(7, 0, COLOR.BLACK)],
    [new Pawn(0, 1, COLOR.BLACK), new Pawn(1, 1, COLOR.BLACK), new Pawn(2, 1, COLOR.BLACK), new Pawn(3, 1, COLOR.BLACK), new Pawn(4, 1, COLOR.BLACK), new Pawn(5, 1, COLOR.BLACK), new Pawn(6, 1, COLOR.BLACK), new Pawn(7, 1, COLOR.BLACK)],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [new Pawn(0, 6, COLOR.WHITE), new Pawn(1, 6, COLOR.WHITE), new Pawn(2, 6, COLOR.WHITE), new Pawn(3, 6, COLOR.WHITE), new Pawn(4, 6, COLOR.WHITE), new Pawn(5, 6, COLOR.WHITE), new Pawn(6, 6, COLOR.WHITE), new Pawn(7, 6, COLOR.WHITE)],
    [new Rook(0, 7, COLOR.WHITE), new Knight(1, 7, COLOR.WHITE), new Bishop(2, 7, COLOR.WHITE), new Queen(3, 7, COLOR.WHITE), new King(4, 7, COLOR.WHITE), new Bishop(5, 7, COLOR.WHITE), new Knight(6, 7, COLOR.WHITE), new Rook(7, 7, COLOR.WHITE)],
]

function getMoves(piece) {
    return piece.moves(TERRAIN).filter(move => !TERRAIN[move.y][move.x] || TERRAIN[move.y][move.x].color !== piece.color)
}

function draw(drawMoves = []) {
    CTX.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < TERRAIN.length; i++) {
        for (let j = 0; j < TERRAIN[i].length; j++) {
            CTX.fillStyle = i % 2 === j % 2 ? "#E0E0E0" : "#C4C6C4"
            CTX.fillRect(j * SQUARE_SIZE, i * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE)
        }
    }

    for (const move of drawMoves) {
        CTX.fillStyle = '#00ff00'
        CTX.beginPath()
        CTX.arc(move.x * SQUARE_SIZE + SQUARE_SIZE / 2, move.y * SQUARE_SIZE + SQUARE_SIZE / 2, SQUARE_SIZE / 2, 0, 2 * Math.PI)
        CTX.fill()
    }

    if (SELECTED) {
        CTX.fillStyle = "#0000ff"
        CTX.beginPath()
        CTX.arc(SELECTED.x * SQUARE_SIZE + SQUARE_SIZE / 2, SELECTED.y * SQUARE_SIZE + SQUARE_SIZE / 2, SQUARE_SIZE / 2, 0, 2 * Math.PI)
        CTX.fill()
    }

    for (let i = 0; i < TERRAIN.length; i++) {
        for (let j = 0; j < TERRAIN[i].length; j++) {
            if (TERRAIN[i][j]) {
                TERRAIN[i][j].draw(CTX)
            }
        }
    }
}

let SELECTED = null
let TURN = COLOR.WHITE

canvas.addEventListener('click', (e) => {
    const x = Math.floor(e.offsetX / SQUARE_SIZE)
    const y = Math.floor(e.offsetY / SQUARE_SIZE)

    if (SELECTED === TERRAIN[y][x]) {
        SELECTED = null
        draw()
    } else if (TERRAIN[y][x] && TERRAIN[y][x].color === TURN) {
        SELECTED = TERRAIN[y][x]
        draw(getMoves(SELECTED))
    } else if (SELECTED) {
        if (getMoves(SELECTED).some(move => move.x === x && move.y === y)) {
            SELECTED.move(TERRAIN, x, y)
            SELECTED = null
            TURN = TURN === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE
            draw()

            if (checkMate()) alert("CHECKMATE!")
        }
    }

    console.log(SELECTED, TURN)
})

function checkMate() {
    for (const color of [COLOR.WHITE, COLOR.BLACK]) {
        const king = TERRAIN.flat().find(piece => piece && piece.type === PIECE.KING && piece.color === color)

        for (const piece of TERRAIN.flat()) {
            if (piece && piece.color !== color) {
                for (const move of getMoves(piece)) {
                    if (move.x === king.x && move.y === king.y) {
                        return true
                    }
                }
            }
        }
    }

    return false
}

function resize() {
    refreshSquareSize()
    canvas.width = SQUARE_SIZE * TERRAIN_X_LENGTH
    canvas.height = SQUARE_SIZE * TERRAIN_Y_LENGTH
    draw()
}

window.addEventListener("resize", resize)
resize()
