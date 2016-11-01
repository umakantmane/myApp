var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io')(server)
  , db = require('./config/db');

   var conn = db.getConnection();

   

   //var time = (new Date(Date.now())).toUTCString();

       
   //console.log(time);

const PORT = process.env.PORT || 3000;

/*
 * users is array, which holds the number of users, who join the scoket
*/

var users = [];

/*
 * Bellow connection is standard scoket.io event, which will establish the connection,
 * and keeps track off all users whoever join to the scoket
*/

 //var condition = [data.login_user_session_id, data.friend_session_id, data.friend_session_id, data.login_user_session_id];



io.on('connection', function(client){
   
    /*
     * join is event listener, which listen the frontend event, whenever new user join to this socket.is
     * it will push the new user to users array, creates the one socket unique id for this particular user
     * user entrance is  event emitter, which emit the event to front end saying that this particular user has joinded,
     * and show him as online available.
     * There are to user entrance events emmintng.
       1. one Self user and
       2. second for brodcast users    
    */

 
   /* var condition = [1,2,2,1];
    conn.query('SELECT * FROM conversation WHERE (user_from = ? AND user_to = ?) OR (user_from = ? AND user_to = ?)', [1, 2, 2,1], function(err, results) {
  

       client.emit('history', results);
      
    });*/

    client.on('join', function(data) {  
    //  user_name
      users.push({id:client.id,user_name:data.name, session_id:data.session_id});
      len=users.length;
      len--;
      client.emit('user entrance', users); 
      client.broadcast.emit('user entrance', users); 

    });

    client.on('removeUser', function(userData){

         var index = users.findIndex(x => x.user_name==userData);
         var offline_user = users[index];
         users.splice(index, 1);
         client.broadcast.emit('offlineUser', offline_user);

    });


    client.on('messages', function(data) {
   
      client.emit('broadMe',data);
      client.broadcast.to(data.id).emit('broad',data);
      var chat  = {user_from: parseInt(data.login_user_session_id), user_to:parseInt(data.friend_session_id), msg:data.msg, status:'delivered', time:Date.now()};
                      
      conn.query('INSERT INTO conversation SET ?', chat, function(err, result) {});            
    
    });    

    client.on("get_conversation", function(data){

            var condition = [data.login_user_session_id, data.friend_session_id, data.friend_session_id, data.login_user_session_id];
            conn.query('SELECT * FROM conversation WHERE (user_from = ? AND user_to = ?) OR (user_from = ? AND user_to = ?) ORDER BY time ASC', condition, function(err, results) {
              
                    client.emit('conversation_history', {result:results, dataId:data}); 
     });  
  });

    client.on('typing', function(data) {

        client.broadcast.to(data.to_id).emit('broadTyping',data);

    });

     client.on('isChatWindowOpen', function(data) {

        client.broadcast.to(data.to_id).emit('setChatWindowOpen', data);

    });


    client.on('typingLeft', function(data) {
    	   client.broadcast.to(data.to_id).emit('broadTypingLeft',data);
    });

});


server.listen(PORT, function(){
	console.log("server running on localhost:"+PORT);
});
