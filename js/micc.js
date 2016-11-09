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

    this.fetchQueueStats = function (queueId, receiveStats) {
        if(!queueId) {
            console.log('Will not fetch because no queue id given.');
        } else {
            console.log('Fetching data for queue id:', queueId);

            $.ajax({
                type: 'GET',
                url: `${miccSdkBase}/queues/${queueId}/state`,
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                },
            })
            .done(function (queueData) {
                console.log('Received response:  ', queueData);
                receiveStats(queueData);
            });
        }
    };
};