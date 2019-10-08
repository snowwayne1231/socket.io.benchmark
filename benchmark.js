// var profile = require('v8-profiler');
var io = require('socket.io-client');

var testingObject = {
  type: 'get_opening',

}

var testString = JSON.stringify(testingObject);

function user(host, port) {
  var socket = io.connect('http://' + host + ':' + port, {'force new connection': true, 'origins': '*'});
  var nexted = true;
  var self = this;
  // console.log('new user!');

  socket.on('connect', function() {
    
    if (nexted) {
      next();
      nexted = false;
    }

  });

  socket.on('disconnect', function(error) {
    var now = new Date().getTime();
    console.log('disconnect :: ', error, now, socket.id);
  });

  socket.on('message', function(message) {
    // console.log('on message', message);
    // socket.emit('message', testString);
    self.tmp = 1;

  });

  self.socket = socket;
  self.tmp = 1;
};

var argvIndex = 2;

var users = parseInt(process.argv[argvIndex++]);
var host = process.argv[argvIndex++] ? process.argv[argvIndex - 1]  : 'localhost';
var port = process.argv[argvIndex++] ? process.argv[argvIndex - 1]  : '80';
var i = 0;

var sockets = [];
var connection_start_time = new Date().getTime();
var connection_user_finish_time = 0;

function next() {
  if (i++ < users) {
    sockets.push(new user(host, port));
    
  } else {

    connection_user_finish_time = new Date().getTime();
    var spend_time_of_users_connecting = connection_user_finish_time - connection_start_time;
    console.log(`total user connected spend time: ${spend_time_of_users_connecting / 1000}s`);
    // console.log('all sockets:', sockets.map(s => s.socket.id));
  }
}

next();

var emitTime = 0;

var _timer = setInterval(() => {
  
  if (sockets.length == users) {
    if (sockets.findIndex(s => s.tmp == 0) >= 0) {
      

    } else {

      if (emitTime == 0) {

      } else {
        var now = new Date().getTime();
        var spend = (now - emitTime) / 1000;
        console.log(`Spending time of all round emited : ${spend}s`);
      }
      emitTime = new Date().getTime();
      sockets.map(s => {
        s.tmp = 0;
        s.socket.emit('message', testString);
      });
    }
  }
}, 100);
