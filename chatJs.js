  "use strict";

 var person =''
   , user_id = ''
   , userExist = []
   , login_user = 1
   //, friend_socket_id = '';
   , socket = io.connect('http://localhost:3000');

socket.on('connect', function(data){});
   
 $("#logout").click(function() {

        socket.emit('removeUser', person);
 });

 socket.on('offlineUser', function(data) {
        // console.log(data);
        $('#'+data.id+'-online').remove(); 
      
  }); 



  socket.on('broadMe', function(data) {

     $("<p align='right'><span class='msg-emit'>"+data.msg+"</span></p>").appendTo($('.'+data.id));
     $('.'+data.id).scrollTop($('.'+data.id)[0].scrollHeight);

  }); 

  socket.on('broad', function(data) {

    register_popup(data.from_name, data.from_name, data.from_id, data.login_user_session_id);
    ///getConversationHistory(data.from_id, data.login_user_session_id);
    loadBrodData(data);
  }); 

  function loadBrodData(data) {

     $("<p align='left'><img style='padding:5px;' src='me.jpg' width='30' height='30'><span class='msg-broadcast-emit'>"+data.msg+"<span></p>").appendTo($('.'+data.from_id));
     $('.'+data.from_id).scrollTop($('.'+data.from_id)[0].scrollHeight);
  }

 socket.on('conversation_history', function(data){

           $.each(data.result, function(index, value ) {

           console.log(data.dataId.login_user_session_id+"=> "+data.dataId.friend_session_id)
            if(value.user_from == data.dataId.login_user_session_id && value.user_to == data.dataId.friend_session_id) {
             
               $("<p align='right'><span class='msg-emit'>"+value.msg+"</span></p>").appendTo($('.'+data.dataId.friend_socket_id));
               $('.'+data.id).scrollTop($('.'+data.dataId.friend_socket_id)[0].scrollHeight);

            }
            if(value.user_from == data.dataId.friend_session_id && value.user_to == data.dataId.login_user_session_id) {
             
              $("<p align='left'><img style='padding:5px;' src='me.jpg' width='30' height='30'><span class='msg-broadcast-emit'>"+value.msg+"<span></p>").appendTo($('.'+data.dataId.friend_socket_id));
              $('.'+data.dataId.friend_socket_id).scrollTop($('.'+data.dataId.friend_socket_id)[0].scrollHeight);

            }
    });


 });
  
//6USxvj4sqEIu99DdAAAC
//k2a_UGlq0RGhpzriAAAD
 
  socket.on('user entrance',function(users) {
        
    var len = users.length;
    for(var i=0; i<len; i++) {

      if (isThereUser(users[i].user_name) && person != users[i].user_name) {

          userExist.push(users[i].user_name);

        var addDiv = '<div class="sidebar-name" id='+users[i].id+"-online"+'>';
            addDiv = addDiv + '<a href="javascript:register_popup('+"'"+users[i].user_name+"'"+', '+"'"+users[i].user_name+"'"+', '+"'"+users[i].id+"'"+', '+"'"+users[i].session_id+"'"+');">';
            addDiv = addDiv + '<img width="30" height="30" src="me.jpg" />';                     
            addDiv = addDiv + '<span style="width: 170px;  display: inline-block;font-size:15px;">'+users[i].user_name+'</span>';
            addDiv = addDiv + '<i class="fa fa-circle" aria-hidden="true"></i></a></div>';
            
            $(".chat-sidebar").append(addDiv);
      } 

        if (person == users[i].user_name) 
            user_id = users[i].id;
    }   

  });

 socket.on('broadTyping', function(data) {

      $('#'+data.from_id+'-preloader').css('display', 'block');

 });

   socket.on('broadTypingLeft', function(data) {

      $('#'+data.from_id+'-preloader').css('display', 'none');
      
   });

 
  function isThereUser(val) {
     return (userExist.indexOf(val) == -1);
  }

     
  function getUserName() {

    person = prompt("Please enter your name");
    
    if(person == 'Sri')
      login_user = 2;

    if (person != null) 
        socket.emit('join', {name:person, session_id:login_user});
  }
 
  getUserName();

  function send_message(e, value, textBoxId) {

   
    if(e.which == 13 && value != '') {

      $('#'+textBoxId).val("");
       socket.emit('messages',  {id:textBoxId, user_name:$('#'+textBoxId).data('name'), msg:value, from_name:person,from_id:user_id, friend_session_id:$('#'+textBoxId).data('sessionid'), login_user_session_id:login_user});
    }
    
  }