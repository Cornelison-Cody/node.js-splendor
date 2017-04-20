var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'NodeConsole',
  description: 'The web server game console.',
  script: 'Z:\\Node.js\\main.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();