<?php
//Start the session again so we can access the username
session_start();
 
//include the pusher publisher library
include_once 'lib/Pusher.php';
 
$pusher = new Pusher(
   '0c59a7c533bb03790a0e', //APP KEY
   '1c7b40a7465f8d6d3694', //APP SECRET
   '22815' //APP ID
);
 
//get the message posted by our ajax call
$message = $_POST['message'];
 
//trim and filter it
$message = trim(filter_var($message, FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES));
 
//wrap it with the user's name when we display
$message = "{$message}";
 
//trigger the 'new_message' event in our channel, 'presence-nettuts'
$pusher->trigger(
   'presence-channel-one', //the channel
   'new_message', //the event
   array('message' => $message) //the data to send
);
 
//echo the success array for the ajax call
echo json_encode(array(
   'message' => $message,
   'success' => true
));
exit();
?>