function MiccSignalR(miccServerBase, accessToken) {
    var miccSdkBase = `${miccServerBase}/miccsdk`;
    var singlarConnection = $.hubConnection(miccSdkBase, {
        qs: `sessionid=Bearer ${accessToken}`
    });

    singlarConnection.logging = true;

    this.onError = function (processError) {
        singlarConnection.error(function (error) {
            console.error('Connection error:  ', error);
            processError(error);
        });
    }

    this.onStateChanged = function (processStateChange) {
        singlarConnection.stateChanged(function (state) {
            console.info('Connection state changed:  ', state);
            processStateChange(state);
        });
    }

    this.start = function (successCallback, failCallback) {
        singlarConnection.start().done(function () {
            console.info(`Connection established with ID=${singlarConnection.id}`);
            successCallback();
        }).fail(function () {
            console.error('Connection failed');
            failCallback();
        });
    }

    this.invokeHubMethod = function (hub, methodName) {
        hub.invoke(methodName);
    }

    this.onClientMethod = function (hub, methoddName, callback) {
        hub.on(methoddName, function onCallback(args) {
            console.info(`Received response for ${methoddName}:${args}`);
            callback(args);
        });
    }

    // Employee hub proxy
    this.createEmployeeHubProxy = function () {
        return singlarConnection.createHubProxy('employeeHub');
    }
}