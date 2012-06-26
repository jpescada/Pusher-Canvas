<?php
//Start the session again so we can access the username and userid
session_start();

//create a userid to use in handshake
$_SESSION['userid'] = md5(time() + session_id());
 
//include the pusher publisher library
include_once 'lib/Pusher.php';
 
//These values are automatically POSTed by the Pusher client library
$socket_id = $_POST['socket_id'];
$channel_name = $_POST['channel_name'];
 
//You should put code here that makes sure this person has access to this channel
/*
if( $user->hasAccessTo($channel_name) == false ) {
   header('', true, 403);
   echo( "Not authorized" );
   exit();
}
*/
 
$pusher = new Pusher(
   '0c59a7c533bb03790a0e', //APP KEY
   '1c7b40a7465f8d6d3694', //APP SECRET
   '22815' //APP ID
);
 
//Any data you want to send about the person who is subscribing
$presence_data = array(
   //'colour' => $_SESSION['colour']
);
 
echo $pusher->presence_auth(
   $channel_name, //the name of the channel the user is subscribing to
   $socket_id, //the socket id received from the Pusher client library
   $_SESSION['userid'],  //a UNIQUE USER ID which identifies the user
   $presence_data //the data about the person
);
exit();
?>