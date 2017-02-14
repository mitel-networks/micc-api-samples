# openMediaAppearIn.html
Basic demo of open media conversation routing by glueing [appear.in](https://appear.in/)

* All errors are written to the console.
* Login first with username and password.
* Post login - click on the start chat button.
* An open media conversation is routed to an agent with targetUri = https://appear.in/${id}
* If the conversation is created successfully, the window should navigate to https://appear.in/${id} page - this means you have created and joined a video conferencing room on appear.in
* When the agent accepts the conversation the agent would join the same room i.e. https://appear.in/${id}. The two sides (customer and agent) could now communicate.

