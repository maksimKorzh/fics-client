var board = null;
var game = new Chess();

function onDragStart (source, piece, position, orientation) {
    if (game.game_over()) return false
}

function onDrop (source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    }); window.fics.sendCommand(source + target);
    if (move === null) return 'snapback';
}

function onSnapEnd () {
    board.position(game.fen(), false);
    window.fics.sendCommand("time");
}

var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    /*appearSpeed: "fast",
    moveSpeed: "fast",
    snapbackSpeed: "fast",
    snapSpeed: "fast",
    trashSpeed: "fast"*/
};

board = Chessboard('chessboard', config);

window.addEventListener("resize", () => {
    board.resize();
});