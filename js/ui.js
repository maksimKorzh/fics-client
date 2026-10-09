window.fics.connect();

var userName = "";
let playerColor = null;
let boardFlipped = false;
let lastFen = null;

const output = document.getElementById('output');
const input = document.getElementById('input');

function style12ToFEN(input) {  // use command: set style 12
    const fields = input.trim().split(/\s+/);
    if (fields[0] !== "<12>" || fields.length < 22) throw new Error("Invalid or incomplete FICS style-12 message");
    const board = fields.slice(1, 9);
    const fenBoard = board.map(rank => {
        let result = "";
        let empty = 0;
        for (const piece of rank) {
            if (piece === "-") empty++;
            else {
                if (empty > 0) {
                    result += empty;
                    empty = 0;
                } result += piece;
            }
        } if (empty > 0) result += empty;
    return result;
    }).join("/");
    const sideToMove = fields[9].toLowerCase() === "b" ? "b" : "w";
    const castlingRights = fields[10];
    const enPassantFile = Number(fields[11]);
    const halfmoveClock = Number(fields[14]);
    const fullmoveNumber = Number(fields[15]);
    let castling = "";
    if (castlingRights & 1) castling += "K";
    if (castlingRights & 2) castling += "Q";
    if (castlingRights & 4) castling += "k";
    if (castlingRights & 8) castling += "q";
    if (!castling) castling = "-";
    let enPassant = "-";
    if (enPassantFile >= 0 && enPassantFile <= 7) {
        const rank = sideToMove === "w" ? "6" : "3";
        enPassant = "abcdefgh"[enPassantFile] + rank;
    } return `${fenBoard} ${sideToMove} ${castling} ${enPassant} ${halfmoveClock} ${fullmoveNumber}`;
}

// Starting FICS session as
// <12> rnbqkbnr pppppppp -------- -------- -------- -------- PPPPPPPP RNBQKBNR W -1 1 1 1 1 0 15 GuestDSDZ GuestWWCD -1 10 0 39 39 600 600 1 none (0:00) none 1 0 0
// fics% Game 15: GuestDSDZ (++++) GuestWWCD (++++) unrated blitz 10 0

/*window.fics.onData((data) => {
    output.textContent += data;
    output.scrollTop = output.scrollHeight;
    if (data.includes("<12>")) {
        const input = data.split("\u0007\n");
        const position = input.find(i => i.trimStart().startsWith("<12>"));
        if (position) {
            let fen = style12ToFEN(position.trim());
            

            const [, white, black] = input.match(/Game \d+:\s+(\S+)\s+\([^)]*\)\s+(\S+)\s+\([^)]*\)/) || [];
            const color = userName === white ? "white"
                        : userName === black ? "black"
                        : "unknown";
            console.log(color);
            
            board.position(fen, false);
            window.fics.sendCommand("time");
        }
    } else if (data.includes("Starting FICS session as ")) {
        window.fics.sendCommand("set style 12");
        userName = data.split("Starting FICS session as ")[1];
        console.log("logged in as", userName);
    }
});*/

window.fics.onData((data) => {
    output.textContent += data;
    output.scrollTop = output.scrollHeight;

    if (data.includes("Starting FICS session as ")) {
        userName = data
            .split("Starting FICS session as ")[1]
            .trim()
            .split(/\s/)[0]
            .split("(U)")[0];

        console.log("logged in as", userName);
        window.fics.sendCommand("set style 12");
        return;
    }

    // Determine the player's color from the game announcement.
    const gameMatch = data.match(
        /Game \d+:\s+(\S+)\s+\([^)]*\)\s+(\S+)\s+\([^)]*\)/
    );

    if (gameMatch && userName) {
        const [, white, black] = gameMatch;

        playerColor =
            userName === white ? "white" :
            userName === black ? "black" :
            null;

        if (playerColor && !boardFlipped) {
            if (playerColor === "black") {
                board.flip();
            }
            boardFlipped = true;
        }
    }

    if (data.includes("<12>")) {
        const input = data.split("\u0007\n");
        const position = input.find(
            i => i.trimStart().startsWith("<12>")
        );

        if (!position) return;

        const fields = position.trim().split(/\s+/);
        const sideToMove = fields[9]; // W or B

        // Only update the board when it's the opponent's turn.
        if (
            playerColor &&
            sideToMove &&
            sideToMove.toLowerCase() !== playerColor[0]
        ) {
            const fen = style12ToFEN(position.trim());

            if (fen !== lastFen) {
                board.position(fen, false);
                lastFen = fen;
            }
        }

        window.fics.sendCommand("time");
    }
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value;
        window.fics.sendCommand(cmd);
        input.value = '';
        let terminal = document.getElementById('output');
        terminal.scrollTop = terminal.scrollHeight;
    }
});