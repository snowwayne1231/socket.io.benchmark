// var profile = require('v8-profiler');
var io = require('socket.io-client');

var testingObject = {
  type: 'get_opening',

}

var testString = JSON.stringify(testingObject);

function user(host, port) {
  var socket = io.connect('http://' + host + ':' + port, {'force new connection': true});
  // console.log('new user!');

  socket.on('connect', function() {
    
    socket.emit('message', testString);

    socket.on('message', function(message) {
      // console.log('on message', message);
      socket.emit('message', testString);

    });

    next();

  });

  
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
    // setTimeout(next, newUserTimeout);
  } else {
    console.log('total user length: ', users, i);
    connection_user_finish_time = new Date().getTime();
    var spend_time_of_users_connecting = connection_user_finish_time - connection_start_time;
    console.log(`total user connected spend time: ${spend_time_of_users_connecting / 1000}s`);
  }
}

next();
