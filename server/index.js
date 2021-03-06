var http = require('http');
var express = require('express');
var Io = require('socket.io');
var Game = require('./game');
var User = require('./user');


var app = strapApp(express());
var game = new Game().start();
var server = http.createServer();


app.use('/', express.static('../client/dist/production'));

server.on('request', app);

Io(server)
    .on('connection', function(socket){
        var user = new User({
            socket: socket,
        });
        game.addUser(user);
        socket.on('disconnect', function(){
            game.removeUser(user);
        });
    });

server.listen(9090);


function strapApp(app){
    var cors = require('cors');
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(cors());
    return app;
}

