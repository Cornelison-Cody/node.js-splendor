var cp = require('child_process')
    , child = cp.fork("./console.js")

console.log(child.killed)
child.on('close', function (data) {
    console.log(child.killed)
})

