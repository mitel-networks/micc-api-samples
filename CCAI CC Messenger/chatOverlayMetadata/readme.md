# chatMetadata.html

Basic demo of using the CC Messenger chat overlay getCCMessengerMetaData callback function and how to push metadata into the conversation from the web
page hosting the chat overlay.

Prereqs:

* User must have the following configued:
  * Cloudlink account setup
  * Chat overlay configured
  * MiCC Business server configured for CC Messenger
  * MiCC Busines CC Messenger chat overlay has been configured and the overlay script pasted into the chatMetadata.html file (replace the /*Paste your chat overlay script here*/ )

Demo notes:

* All errors are written to the console.
* The getCCMessengerMetaData function is called as soon as the chat begins or if the chat is already in progress, if the hosted chat page is refreshed or reloaded
* The key value pairs ented will show up in the chat property bag variable or assigned to a variable in MiCC B which has the exact same name as the key 
