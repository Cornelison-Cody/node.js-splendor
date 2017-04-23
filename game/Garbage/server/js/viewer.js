exports.cantAffordCard = function (socket) {
    socket.emit('cantAffordCard', function () {

    })
};

exports.moveCard = function (socket, card) {
    socket.emit('moveCard', function () {
        return card;
    })
};

exports.getTokens = function (socket) {
    socket.emit('getTokens', function () {

    })
};

exports.invalidTokens = function (socket) {
    socket.emit('invalidTokens', function () {

    })
};