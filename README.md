# micc-api-samples
Repository for creating sample usages of the [MiCC](http://www.mitel.com/products/collaboration-software/micontact-center-business) API.

These samples should be used with the following mindset:
* that they can and will change without warning.
* should not be used as is but rather as a base for the aspect of the software being demoed.
* they should be taylored to the specifc needs of the demo.
* as with any demo, should be tested in that specific system and scenario at a proximate time to the demo.  *Do not temp the demo gods by winging it during a live presentation.*

If a sample appears to be misbehaving, the first place to check for problems is the browser console.

## queueNowStats.html
Basic demo of queue now statistics.

* All errors are written to the console.
* Login first with username and password.
* Add some queues by typing in the ID, reporting, or name.
* Delete added queues by clicking the appropriate X's.
* Start an update timer by entering a value and hitting Start.
* Stop the update timer by entering 0 and hitting Start.

## employeeDialer.html
Basic demo of outbound dialing.

* All errors are written to the console.
* Login first with username and password.
* Post login should display your user info and devices available to dial from.
* Write a number to dial and hit the dial button.
* The from device should dial accordingly.

## realtimeEmployeeInbox.html - STARTING STUB, NON-FUNCTIONAL
Basic demo of using signalr for listening to employee inbox updates

Prereqs:
* Running this demo requires knowledge of [npm](https://www.npmjs.com/).
* User must install npm then run npm install in the directory to pull external packages down.

Demo notes:
* All errors are written to the console.
* Login first with username and password.
* Post login should display any current employee inbox conversations.
* New conversations should appear in the grid.
* Updates should update the conversations in the grid.
* Removes (end, transfer, etc) should disappear from the grid.
