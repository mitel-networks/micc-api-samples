function Micc() {
    var miccServerBase = 'http://127.0.0.1';
    var miccSdkBase = miccServerBase + '/miccsdk/api/v1';
    var miccAuthBase = miccServerBase + '/authorizationserver';
    var bearerToken = '';

    this.login = function (username, password) {
        console.log('Attempting login with %s/%s', username, password);
        var data = `grant_type=password&username=${username}&password=${password}`;

        $.ajax({
            type: "POST",
            url: miccAuthBase + "/token",
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        })
        .done(function (data) {
            console.log('Login success.  Received data %j', data);
            bearerToken = data.access_token;
        });
    };

    this.fetchQueueStats = function (queueId, receiveStats) {
        if(!queueId) {
            console.log('Will not fetch because no queue id given.');
        } else {
            console.log('Fetching data for queue id:', queueId);
/*
            $.ajax({
                type: 'GET',
                url: `${miccSdkBase},/queues/${queueId}/state`,
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                },
            })
            .done(function (queueData) {
                console.log('Received response:  %j', queueData);
                receiveStats(queueData);
            });
*/
            receiveStats({
                name:'test queue',
                reporting:queueId,
                mediaType:'open media',
                waitingConversations: 1,
                longestWaitingConversationsDuration: '00:31:23',
                estimatedWaitTimeForNewConversations: '00:10:23',
                serviceLevelPercentageToday: 63,
                offeredConversationsToday: 23,
                answeredConversationsToday: 22,
            });
        }
    };
};