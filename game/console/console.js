////////////////////
//Setup app manager/
console.log("createing dependencies")
var port = 3000
    , fork = require('child_process').fork
    , spawn = require('child_process').spawn
    , exec = require('child_process').exec
    , execFile = require('child_process').execFile
    , NODE_CHILD = {}
    , express = require('express')
    , path = require('path')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server)
    , myProcess = process
    , NODE_CHILD_RUNNING = false
console.log("starting console on port: " + port)
server.listen(port);
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/client/index.html')
})
app.use(express.static(path.join(__dirname, 'client')));
io.on("connection", function (socket) {
    //////////////////////
    //Actions from client/
    socket.on("Start Splendor", function () {
        if (NODE_CHILD == 'undefined' || !NODE_CHILD_RUNNING) {
            NODE_CHILD = execFile('node', ['Z:Node.js/Splendor/splendorApp.js']);
            NODE_CHILD_RUNNING = true
            NODE_CHILD.stdout.on('data', function (data) {
                //                console.log(data)
                io.sockets.emit('stdout', data)
            })
            NODE_CHILD.stderr.on('data', function (data) {
                io.sockets.emit('stderr', data)
            })
            NODE_CHILD.on('close', function (data) {
                io.sockets.emit('close', data)
            })
            NODE_CHILD.on('error', function (err) {
                io.sockets.emit('error', data)
            })
        }
        else {
            io.sockets.emit('stderr', "The server is already running.")
        }
    })
    socket.on('Kill Splendor', function () {
        //        console.log("socket.on('Kill Splendor')")
        NODE_CHILD.kill()
        NODE_CHILD_RUNNING = false
        if (NODE_CHILD != 'undefined') {
            if (NODE_CHILD_RUNNING == false) {
                io.sockets.emit('close', "Ended by Mangement Console")
            }else{
                io.sockets.emit('stderr',"NODE_CHILD is defined, but is still running")
            }
        }
        else {
            io.sockets.emit('stderr', "NODE_CHILD is undefined")
        }
        //        console.log("killed" + ": ")
        //        console.log(NODE_CHILD['killed'])
    })
    socket.on('Restart Console', function () {
        console.log("Restarting Console")
        myProcess.exit(1)
    })
    socket.on('Kill Console', function () {
        console.log("Killing Console")
        myProcess.exit(0)
    })
});
//////////////////////////////
//Handles actions from client/
function webApp(socket) {
    var fork = require('child_process').fork
    var NODE_CHILD = [];
    //////////////////////
    //Actions from client/
    socket.on("Start Splendor", function () {
        NODE_CHILD.push(fork('./splendorApp.js'));
    })
}