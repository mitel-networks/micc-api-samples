function Micc(serverAddress) {
    var miccServerBase = `http://${serverAddress}`;
    var miccSdkBase = `${miccServerBase}/miccsdk/api/v1`;
    var miccAuthBase = `${miccServerBase}/authorizationserver`;
    var bearerToken = '';

    this.login = function (username, password) {
        console.log('Attempting to login user [%s] to server [%s]', username, miccAuthBase);
        var data = `grant_type=password&username=${username}&password=${password}`;

        $.ajax({
            type: "POST",
            url: `${miccAuthBase}/token`,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .done(function (data) {
            console.log('Login success.  Received data:  ', data);
            bearerToken = data.access_token;
        });
    };

    this.fetchQueueStats = function (queueId, receiveQueueStats) {
        if(!queueId) {
            console.log('Will not fetch because no queue id given.');
        } else {
            this.getRequest(`queues/${queueId}/state`, receiveQueueStats);
        }
    };

    this.getRequest = function(apiSubUrl, processResponse) {
        this.makeAjaxRequest(apiSubUrl, 'GET', null, processResponse);
    }

    this.postRequest = function(apiSubUrl, body, processResponse) {
        this.makeAjaxRequest(apiSubUrl, 'POST', body, processResponse);
    }

    this.makeAjaxRequest = function(apiSubUrl, method, body, processResponse) {
        var url = `${miccSdkBase}/${apiSubUrl}`;
        console.log(`Processing ${method} request to ${url}`);

        $.ajax({
            type: method,
            url: url,
            'content-type':'application/json',
            headers: {
                Authorization: `Bearer ${bearerToken}`
            },
            data: body
        })
        .done(function (receivedData) {
            console.log('Received response:  ', receivedData);
            processResponse(receivedData);
        });
    }
};