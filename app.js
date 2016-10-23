var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;


var users=[];


io.on('connection', function(client){
    client.on('join', function(user_name) {
       
       console.log(users.length);
       //if (users.length > 0)
      
     
      users.push({id:client.id,user_name:user_name});
      len=users.length;
      len--;
      client.emit('user entrance',user_name,users,users[len].id); 
      client.broadcast.emit('user entrance',user_name,users,users[len].id); 

    });


    client.on('messages', function(data) {

          console.log(data);
          // client.emit('broad', {msg:data.msg,id:data.id,name:data.name});
    	   //client.broadcast.emit('broad',data);
       client.broadcast.to(data.id).emit('broad',data);
    });    
    client.on('typing', function(data) {
          // client.emit('typing', data);
    	   client.broadcast.emit('typing', data);
    });
    client.on('typingLeft', function(data) {
          // client.emit('typing', data);
    	   client.broadcast.emit('typingLeft', data);
    });
});

server.listen(PORT, function(){
	console.log("server running on localhost:"+PORT);
});



/*var io = require('socket.io').listen(80);

io.sockets.on('connection', function (socket) {
  socket.on('join', function (data) {
    socket.join(data.email); // We are using room of socket io
  });
});*/