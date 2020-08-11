const axios = require("axios");

'use strict';

/**
 * Webhook service to handle Dialogflow fulfillment requests
 *
 * @param {Object} request Dialogflow WebhookRequest 
 * @param {Object} response Dialogflow WebhookEesponse
 * 
 */
exports.mitelSampleAgentFulfillment = (request, response) => {
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    let intent;
    try {
        intent = request.body.queryResult.intent.displayName;
    } catch (error) {
        response.status(400).end();
        return;
    }

    console.log(intent);

    if (intent.startsWith('Knowledge.KnowledgeBase')) {
        // handle all KB answers here so we don't have to know unique identity
        handleKBAnswer(request, response);
    } else {
        switch (intent) {
            case 'Mitel Welcome':
                handleMitelWelcome(request, response);
                break;
            case 'Forgot Password - email known':
                handleForgotPassword(request, response);
                break;
            case 'Forgot Password - email not known':
                handleForgotPassword(request, response);
                break;
            case 'Agent Transfer Event':
                handleAgentTransferEvent(request, response);
                break;
            default:
                console.log('Unrecognised Intent: ' + intent + '.');
                response.json({});
        }
    }
};

function handleMitelWelcome(request, response) {
    let responseJson = {};
    let welcomeContext = getContext(request, 'mitel-welcome');
    console.log(welcomeContext);
    let bodyString = `Hello, my name is MiBot and I am here to help you with any issues or questions you might have about MiTeam Meetings.`
    if (welcomeContext) {
        addContext(request, responseJson, 'mitel-welcome-saved', 99, welcomeContext.parameters);
        if (welcomeContext.parameters.initial_Email && welcomeContext.parameters.initial_Email.length > 0) {
            // we got the customers email in the welcome event, remember that
            addContext(request, responseJson, 'customer-email', 99, { email: welcomeContext.parameters.initial_Email });
            bodyString = `Hello, ${welcomeContext.parameters.CustomerName_name} my name is MiBot and I am here to help you with any issues or questions you might have about MiTeam Meetings.`
        }
    }
    bodyString += `\nI can help you reset you password, answer questions and if I get stuck i'll pass you over to a real person to help.`
    bodyString += `\nIf you just want to reset your password then just click the button, otherwise please tell me how I can help.`

    let buttons = [];
    let resetButton = { title: 'Reset my password', action: 'post-message', payload: 'Reset my password' };
    buttons.push(resetButton);
    let obj = {
        bodyContentType: 'text/html',
        headerImageUrl: "https://www.mitel.com/-/media/mitel/images/products/miteam-meetings-video-thumb.png",
        body: bodyString,
        buttons: buttons
    };

    const mitelCustomPayloadJson = {
        contentType: 'application/vnd.mitel.action-card',
        body: JSON.stringify(obj),
        fallbackText: bodyString
    };
    addPayloadFulfillmentMessage(responseJson, mitelCustomPayloadJson);
    console.log(JSON.stringify(responseJson));
    response.json(responseJson);
} 

async function handleForgotPassword(request, response) {
    let responseJson = {};
    let emailContext = getContext(request, 'customer-email');
    let email = '';
    if (emailContext) {
        // we got the email in the welcome event
        email = emailContext.parameters.email;
    } else {
        // we got here by filling the email slot
        email = request.body.queryResult.parameters.email;
    }

    console.log(email);

    const accountId = process.env['ACCOUNT_ID'];

    let adminResponse =
        await put(`https://admin.api.mitel.io/2017-09-01/users/${email}/password`,
            { email: email, action: "forgot", accountId: accountId } );

    console.log(adminResponse.status);
    if (adminResponse.status === 404) {
        // email address was not foubd, lets trigger an agent transfer
        setFollowupEvent(responseJson, 'agent-transfer');
        addContext(request, responseJson, 'adminResponse', 5, { status: adminResponse.status });
    } else if (adminResponse.status === 200) {
        addTextFulfillmentMessage(responseJson, `Great, I found you!\n\nI've sent an email to '${email}' with instructions on how to reset your password.`);
        addTextFulfillmentMessage(responseJson, 'Is there anything else I can help you with today?');
        addContext(request, responseJson, 'anything-else', 5, {});
    } else {
        // should never happen, agent transfer
        setFollowupEvent(responseJson, 'agent-transfer');
        addContext(request, responseJson, 'adminResponse', 5, { status: adminResponse.status });
    }
    
    console.log(JSON.stringify(responseJson));
    response.json(responseJson);
} 

function handleKBAnswer(request, response) {
    let responseJson = {};
    addContext(request, responseJson, 'kb-answer', 5, {})
    console.log(JSON.stringify(responseJson));
    response.json(responseJson); 
} 

function handleAgentTransferEvent(request, response) {
    let responseJson = {};
    let adminResponse = getContext(request, 'adminResponse');
    if (adminResponse && adminResponse.parameters) {
        if (adminResponse.parameters.status === 404) {
            // email address was not found, lets trigger an agent transfer
            addTextFulfillmentMessage(responseJson, `I'm sorry, I am not finding that email address`);
            addTextFulfillmentMessage(responseJson, 'Let me transer you to a real person to help');
        } else {
            // should never happen, agent transfer
            addTextFulfillmentMessage(responseJson, `Something went very wrong here.... `);
            addTextFulfillmentMessage(responseJson, 'Let me transer you to a real person to help');
        }
    }
    console.log(JSON.stringify(responseJson));
    response.json(responseJson); 
} 

function addTextFulfillmentMessage(responseJson, text) {
    if (!responseJson.hasOwnProperty('fulfillmentMessages')) {
        responseJson.fulfillmentMessages = [];
    }

    let message = { "text": { "text": [text] } };
    responseJson.fulfillmentMessages.push(message);
}

function addPayloadFulfillmentMessage(responseJson, payload) {
    if (!responseJson.hasOwnProperty('fulfillmentMessages')) {
        responseJson.fulfillmentMessages = [];
    }

    {
        let payloadObj = {};
        payloadObj.payload = {};
        payloadObj.payload.PLATFORM_UNSPECIFIED = payload;
        payloadObj.payload.platform = 0; // PLATFORM_UNSPECIFIED
        responseJson.fulfillmentMessages.push(payloadObj);
    }

    {
        let payloadObj = {};
        payloadObj.payload = {};
        payloadObj.payload.mitelCloudLink = payload;
        payloadObj.payload.platform = 0; // PLATFORM_UNSPECIFIED
        responseJson.fulfillmentMessages.push(payloadObj);
    }
}

function addContext(request, responseJson, name, lifespan, parametersObj) {
    if (!responseJson.hasOwnProperty('outputContexts')) {
        responseJson.outputContexts = [];
    }

    {
        let contextObj = {};
        contextObj.name = `${request.body.session}/contexts/${name}`;
        contextObj.lifespanCount = lifespan;
        contextObj.parameters = parametersObj;
        responseJson.outputContexts.push(contextObj);
    }
}

function deleteContext(request, responseJson, name) {
    if (!responseJson.hasOwnProperty('outputContexts')) {
        responseJson.outputContexts = [];
    }

    {
        let contextObj = {};
        contextObj.name = `${request.body.session}/contexts/${name}`;
        // delete context by setting lifespan to zero
        contextObj.lifespanCount = 0;
        responseJson.outputContexts.push(contextObj);
    }
}

function deleteAllContexts(request, responseJson) {
    if (request.body.queryResult.hasOwnProperty('outputContexts')) {
        for (const obj of request.body.queryResult.outputContexts) {
            let contextObj = obj;
            // delete context by setting lifespan to zero
            contextObj.lifespanCount = 0;
            responseJson.outputContexts.push(contextObj);
        }
    }
}

function getContext(request, name) {
    if (request.body.queryResult.hasOwnProperty('outputContexts')) {
        for (const obj of request.body.queryResult.outputContexts) {
            if (obj.name === `${request.body.session}/contexts/${name}`) {
                return obj;
            }
        }
    }
    return undefined;
}

function setFollowupEvent(responseJson, eventName) {
    let event = { name: eventName };
    responseJson.followupEventInput = event;
}

async function put(url, body) {
    console.log(JSON.stringify(body));

    try {
        let response = await axios.put(url, body);
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.headers);
        console.log(response.config);
        console.log(JSON.stringify(response.data));
        return response;
    }
    catch (error) {
        console.log(error);
        return error.response;
    }
}
