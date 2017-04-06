function MiccSignalR(miccServerBase, accessToken) {
    var miccSdkBase = `${miccServerBase}/miccsdk`;
    var singlarConnection = $.hubConnection(miccSdkBase, {
        qs: `sessionid=Bearer ${accessToken}`
    });

    // hubs
    var employeeHub;

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

    this.createEmployeeHubProxy = function () {
        if (!employeeHub) {
            employeeHub = singlarConnection.createHubProxy('employeeHub');
        }
    }

    this.employeeStateChanged = function (callback) {
        this.createEmployeeHubProxy();
        employeeHub.on('employeeStateChanged', function onCallback(args) {
            console.info(`Received response for employeeStateChanged: ${args}`);
            callback(args);
        });
    }

    this.employeeConversationChanged = function (callback) {
        this.createEmployeeHubProxy();
        employeeHub.on('employeeConversationChanged', function onCallback(args) {
            console.info(`Received response for employeeConversationChanged: ${args}`);
            callback(args);
        });
    }

    this.employeeConversationRemoved = function (callback) {
        this.createEmployeeHubProxy();
        employeeHub.on('employeeConversationRemoved', function onCallback(args) {
            console.info(`Received response for employeeConversationRemoved: ${args}`);
            callback(args);
        });
    }

    this.addSelfMonitor = function () {
        this.createEmployeeHubProxy();
        employeeHub.invoke('addSelfMonitor');
    }
}