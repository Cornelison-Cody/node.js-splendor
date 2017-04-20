var mod = require('./module');
var viewer = require('./viewer');

// TURN OPTIONS
exports.playerInteraction = function (data, socket) {
    switch (data.action) {
        case 'buyCard':
            if(mod.game.player[data.player].canAfford(data.card)) {
                mod.game.buyCards(data.player, data.deck, data.card);
                viewer.moveCard(socket, data.card);
            }
            else {
                viewer.cantAffordCard(socket);
            }
            break;
        case 'takeTokens':
            if(mod.takeTokens(data.player, data.option, data.c1, data.c2, data.c3)) {
                viewer.getTokens(socket);
            }
            else {
                viewer.invalidTokens(socket);
            }

            break;
        case 'reserveCard':
    }
};