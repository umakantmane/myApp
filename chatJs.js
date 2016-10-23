  "use strict";

 var person ='';
 var user_id = '';
  var socket = io.connect('http://localhost:3000');
    socket.on('connect', function(data) {
   
  });



 /* socket.on('messages', function(data) {
  alert(data);
  });*/

  socket.on('typing', function(data) {
    $("#typing").html(data +" typing");
  });

  socket.on('typingLeft', function(data) {
    setTimeout(function(){
    $("#typing").html("");
    },1500); 
  });

  socket.on('broad', function(data) {
    console.log(data);
    register_popup(data.from_name, data.from_name, data.from_id);
    //$('.'+data.from_id).append();
    $("<p>"+data.msg+"</p>").appendTo($('.'+data.from_id));
     $('.'+data.from_id).scrollTop($('.'+data.from_id)[0].scrollHeight);
    //$('.'+data.from_id).add("<p>"+data.msg+"</p>");
  }); 

  var chat_val = $('.input_calss');
  $('.input_calss').keypress(function(e){
   //alert(1);
   var key = e.which;
   
   if(key == 13) {
     socket.emit('messages',  chat_val.val());
     chat_val.val("");
   }
  });

     

  chat_val.keydown(function(e){
    var key = e.which;
   if(key != 13) {
    socket.emit('typing', "Manas");
  }
  });

  chat_val.on("keyup onblur", function(){
    socket.emit('typingLeft', "Manas");
  });

 
var person ='';

var userExist = [];

  socket.on('user entrance',function(user_name, users, my_id) {
        
     var len = users.length;
     console.log(person);
    for(var i=0; i<len; i++) {

      if (isThereUser(users[i].user_name) && person != users[i].user_name) {

            userExist.push(users[i].user_name);
          var addDiv = '<div class="sidebar-name">';
         addDiv = addDiv + '<a href="javascript:register_popup('+"'"+users[i].user_name+"'"+', '+"'"+users[i].user_name+"'"+', '+"'"+users[i].id+"'"+');">';
         addDiv = addDiv + '<img width="30" height="30" src="me.jpg" />';                     
          addDiv = addDiv + '<span>'+users[i].user_name+'</span>';
          addDiv = addDiv + '<i class="fa fa-circle" aria-hidden="true"></i></a></div>';
          $(".chat-sidebar").append(addDiv);
      } 

      if (person == users[i].user_name) {

            user_id = users[i].id;
      }
     
    }   

   }); 

 function isThereUser(val) {
    return (userExist.indexOf(val) == -1);
}

 function getUserName() {
   person = prompt("Please enter your name");
    if (person != null) {
       socket.emit('join', person);
     } 

 }
 
 getUserName();

 function send_message(e, value, textBoxId) {

   if(e.which == 13) {
   // console.log(textBoxId);
    //console.log($('#'+textBoxId).data('name'));
    $('#'+textBoxId).val("");
     socket.emit('messages',  {id:textBoxId, user_name:$('#'+textBoxId).data('name'), msg:value, from_name:person,from_id:user_id});
   }
  
  }