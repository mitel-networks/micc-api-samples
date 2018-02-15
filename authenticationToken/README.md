# MiCCSdkAuthSample
Sample web page and scripts that demonstrate how to obtain an auth token from the MiCC Authorization Server, and then use the token to access MiCCSdk APIs

Demo Notes: 

*Copy the entire MiCCSDkAuthSample folder to the machine where you have installed MiCC.
*Create a website for it in IIS (creating it under the default website will be fine) 
*Set authenticationSample.html as the default document if desired.
*To run the User Authentication sample, enter yoru MiCC server IP address, along with a valid username and password for your MiCC installation, then click "Get Authentication Token".  The token will be displayed in the "Auth Token" box to the right. You can see the claims associated with the token by clicking "Get Identity claims".
*The Client Authentication samples shown on this page will need some minor modifications in order to be used in your own application.  First, add a client id and client secret to the MiContactCenter\WebSites\AuthorizationServer\Configuration\clients.config file on the MiCC server.  The client id is your application's name, and the client secret is a GUID that you generate. Once those have been added to the config file, you can use them as shown in the sample code to obtain auth tokens for your app.
*Keep in mind that certain requests to the MiCCSdk API have security role requirements. When accessing the API with a token derived from username/password, please make sure that the user has the permissions that are required for the API request.                       
*Errors will be displayed in the browser console


