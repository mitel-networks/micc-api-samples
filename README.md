# micc-api-samples

This is a public repository for creating samples for use with [MiCC](http://www.mitel.com/products/collaboration-software/micontact-center-business) for the following areas:

* Examples of how to use our MiCCSDK APIs
* Sample dialog flow agents and wiki articles on how to get the most out of [MiCC](http://www.mitel.com/products/collaboration-software/micontact-center-business) CC Messenger

These samples should be used with the following mindset:

* that they can and will change without warning.
* should not be used as is but rather as a base for the aspect of the software being demoed.
* they should be tailored to the specifc needs of the demo.
* as with any demo, should be tested in that specific system and scenario at a proximate time to the demo.  *Do not tempt the demo gods by winging it during a live presentation.*

If a sample appears to be misbehaving, the first place to check for problems is the browser console.

## MiCCSdk Samples

Here are the currently available samples for the MiCCSDK:

* [Authentication](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSDK/authenticationToken) : Sample web page and scripts that demonstrate how to obtain an auth token from the MiCC Authorization Server, and then use the token to access MiCCSdk APIs
* [Agent Group Presence](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSDK/agentGroupPresence) : Basic demo of enabling/disabling all presence for agent groups
* [Agent Presence](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSDK/agentPresence): Basic demo of using signalr for listening to employee state updates
* [Contacts](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSDK/contacts): Basic demo of contact search, add and edit ***FOR MICCv9.0 AND ABOVE***
* [Employee Dialer](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSDK/employeeDialer): Basic demo of outbound dialing
* [Employee Inbox](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSDK/employeeInbox): Basic demo of using signalr for listening to employee inbox updates
* [Open Media](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSDK/openMediaAppearIn): Basic demo of open media conversation routing through integration with [whereby.com](https://whereby.com/)
* [Queue Conversation Control](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSDK/queueConversationControl): Basic demo of using signalr for performing different actions on conversation in queues
* [Queue Now Stats](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSDK/queueNowStats): Basic demo of queue now statistics

## MiCC SQL View Sample Queries

Sample sql queries are available for selected SQL views in the MiCC CCMData database.
* [AgentEventsByPeriod](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSqlViewSampleQueries/AgentEventStats)
* [AgentOutboundCallDetail](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSqlViewSampleQueries/AgentOutboundCallDetail)
* [AgentPerformanceByPeriodStats](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSqlViewSampleQueries/AgentPerformanceByPeriodStats)
* [CallAccountingTraceExtentionStats](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSqlViewSampleQueries/CallAccountingTraceExtensionStats)
* [CallAccountingTraceTrunkStats](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSqlViewSampleQueries/CallAccountingTraceTrunkStats)
* [QueuePerformanceByDNISStats](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSqlViewSampleQueries/QueuePerformanceByDNISStats)
* [QueuePerformanceByPeriodStats](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSqlViewSampleQueries/QueuePerformanceByPeriodStats)
* [QueueSpectrumByPeriodStats](https://github.com/mitel-networks/micc-api-samples/tree/master/MiCCSqlViewSampleQueries/QueueSpectrumByPeriodStats)

## MiCC CC Messenger

Contact Center Messenger is our new chat product which allows you to use Google Contact Center AI-powered Chatbots that converse naturally with customers and agent assist technology that listens to the conversation and delivers suggested articles to human agents in real-time.

* [Message content types](https://github.com/mitel-networks/micc-api-samples/wiki/Message-content-types): specification describes chat message custom content types. Message content types allow chat clients to display more than just plain text as inline chat messages, by including rich media types such as buttons, action cards, quick replies.
* [Chat Overlay Custom Themes](https://github.com/mitel-networks/micc-api-samples/wiki/Chat-Overlay-Custom-Themes): How to customize the look and feel of your chat overlay.
* [CC Messenger Metadata Example](https://github.com/mitel-networks/micc-api-samples/tree/master/CCAI%20CC%20Messenger/chatOverlayMetadata): Basic demo of using the CC Messenger chat overlay getCCMessengerMetaData callback function and how to push metadata into the conversation from the web page hosting the chat overlay.
* Sample Dialog Flow Agent - ***Coming Soon***
