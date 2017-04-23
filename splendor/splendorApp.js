// New App
var gameClass = require('./gameClasses.js');

// SERVER SETUP
var port = 2644
var express = require('express');
var app = express();
var serv = require('http').Server(app);
var path = require('path');

// WEB-SERVER ONLY ALLOWS ./CLIENT FOLDER
app.get('/' ,function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use(express.static(path.join(__dirname, 'client')));

// PORT TO START SERVER ON
serv.listen(port);
console.log("Splendor server started on port: " + port);

var GAMES = {};
var LOBBY = {};
var SOCKET_COUNT = 0;
var SOCKET_LIST = {};
// var splendor = new gameClass.game();
var colorName = [   "Red",  "Blue", "Brown",    "Green",    "Purple",    "Yellow"];

var createPlayer = function (socket) {
    socket.game.playerList[socket.id] = new gameClass.player(socket.name);
};

var createGame = function (socket, gameName) {
    if (typeof(GAMES[gameName]) == "undefined"){
        GAMES[gameName] = new gameClass.game(gameName);
    }
    for (playerSocket in LOBBY[gameName]){
        GAMES[gameName].socketList.push(playerSocket.id);
    }
   socket.game = GAMES[gameName];
   createPlayer(socket);
   for (var others in LOBBY[gameName]) {
       LOBBY[gameName][others].emit('gameData', GAMES[gameName]);
   }
};

var clickCard = function (game, socket, card) {
    if(game.playerList[socket.id].isActivePlayer) {
        socket.emit('cLog', "You clicked on card" + card.id);
        if(game.playerList[socket.id].canAfford(card)) {
            game.buyCard(game.playerList[socket.id], card.id);
            for (var token in card.cost) {
                updateTokens(game, token);
            }
            updateCards(game, card.id, game.inPlay.slice(-1)[0]);
            console.log("Player: " + game.playerList[socket.id].name);
            console.log("   Points: " + game.playerList[socket.id].points);
            for( var i = 0; i < 5; ++i) {
                console.log("   Cards " + colorName[i] + ": " + game.playerList[socket.id].gems[i][1]);
            }
        }
        else { socket.emit('cLog', "Can't afford card"); }
    } else { socket.emit('cLog', "Not Active Player") }
};

var updateCards = function (game, oldCard, newCard) {
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('removeCard', oldCard);
        socket.emit('createCard', newCard);
    }
};

var clickToken = function (game, socketID, tokenColor) {
    game.removeTokens(tokenColor, 1);
    game.playerList[socketID].addTokens(tokenColor, 1);
    updateTokens(game, tokenColor);
    console.log('Player: ' + game.playerList[socketID].name);
    for (var gem in game.playerList[socketID].gems) {
        console.log('   ' + colorName[gem] + ': ' + game.playerList[socketID].gems[gem][0]);
    }
};

var updateTokens = function (game, tokenColor) {
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        socket.emit('updateToken', tokenColor, game.token[tokenColor]);
    }
};
///////////////////
//Lobby Functions//
var joinLobby = function (socket, gameName) {
    if (typeof (LOBBY[gameName]) == "undefined") {
        LOBBY[gameName] = [];
    }
    LOBBY[gameName][socket.id] = socket;
    console.log('enterLobby');
    socket.emit('startGameReceived');
    socket.lobbyName = gameName;

    for ( var client in LOBBY[gameName]) {
        console.log('lobby ' + gameName + ' Names: '  + LOBBY[gameName][client].name);
    }
        lobyUpdate(gameName); //send playernames to client.
};

var leaveLobby = function (socket, gameName) {
    for (var client in LOBBY[gameName]) {
        client.emit('leftLobby', socket.name);
    }
};

var lobyUpdate = function (gameName){
    var players = [];
    for (var player in LOBBY[gameName]) {
        players.push(LOBBY[gameName][player].name);
    }
     for (client in LOBBY[gameName]) {
         LOBBY[gameName][client].emit('lobbyUpdate', players);
     }
//   socket.emit('lobbyUpdate', players);
};

var removeFromLobby = function (socket) {
    if (socket.id == null || socket.id == "undefined") {}
    else { delete LOBBY[socket.lobbyName][socket.id]; }
    leaveLobby(socket, socket.lobbyName);
};



var io = require('socket.io') (serv,{});
io.sockets.on('connection', function (socket) {
    socket.id = SOCKET_COUNT++;
    SOCKET_LIST[socket.id] = socket;

    socket.on('startGame', function(gameName) {
        createGame(socket, gameName);
    });
    
    socket.on('disconnect', function () {
        // removeFromLobby(socket);
        delete SOCKET_LIST[socket.id];
        // console.log(socket.name + ' Disconnected');
    });

    socket.on('signIn', function (name) {
        socket.emit('signInResponse');
        socket.name = name;
    });

    socket.on('cardClicked', function (card) {
        clickCard(socket.game, socket, card);
    });

    socket.on('tokenClicked', function (tokenColor) {
        clickToken(socket.game, socket.id, tokenColor);
    });
    
    socket.on('leaveLobby', function (gameName){
        
    });

    socket.on('enterLobby',function (gameName) {
       joinLobby(socket, gameName);
    });

    <!-- All scripts need to go in here with the socket.on or socket.emit -->

});