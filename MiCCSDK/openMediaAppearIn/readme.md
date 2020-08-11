# openMediaWhereBy.html

Basic demo of open media conversation routing through integration with [whereby.com](https://whereby.com/).
Note: you will need to setup a free accoun on whereby.com before proceeding.

* All errors are written to the console.
* Login first with username and password.
* Post login - click on the start chat button.
* An open media conversation is routed to an agent with targetUri = <https://whereby.com/${id}>
* If the conversation is created successfully, the window should navigate to <https://whereby.com/${id}> page - this means you have created and joined a video conferencing room on whereby.com
* When the agent accepts the conversation the agent would join the same room i.e. <https://whereby.com/${id}>. The two sides (customer and agent) could now communicate.
