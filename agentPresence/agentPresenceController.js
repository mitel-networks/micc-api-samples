var micc = new Micc('localhost');

function login() {
    micc = new Micc($('#miccServer').val());
    micc.login(
        $('#username').val(),
        $('#password').val(),
        connectToEmployeeHub
    );
}

function connectToEmployeeHub(data) {
    populateEmployeeInfo();   
    micc.getEmployeeBusyReasonCodes('me', populateBusyReasonCodes);

    var singlarConnection = $.hubConnection(`${data.miccServer}/miccsdk/`, {
        qs: `sessionid=Bearer ${data.access_token}`
    });
    singlarConnection.logging = true;
    singlarConnection.error(function (error) {
        console.error('Connection error:  ', error);
    });
    singlarConnection.stateChanged(function (state) {
        console.info('Connection state changed:  ', state);
    });

    singlarConnection.start()
        .done(function () {
            console.info(`Connection established with ID=${singlarConnection.id}`);

            var hub = singlarConnection.createHubProxy('employeeHub');
            hub.invoke('addSelfMonitor');
            hub.on('employeeStateChanged', function onEmployeeStateChanged(employeeState) {
                console.info('Received employeeStateChanged:  ', employeeState);
                processPresence(employeeState.presence);
            });
        })
        .fail(function () {
            console.error('Connection failed');
        });
}

function populateEmployeeInfo() {
    micc.getEmployeeStats('me', function (employeeStats) {
        $('#employeeName').text(`${employeeStats.lastName}, ${employeeStats.firstName}`);
        $('#employeeReporting').text(`Reporting: ${employeeStats.reporting}`);
        processPresence(employeeStats.presence);
    });
}

function processPresence(presence) {
    var html = '';

    $('#employeeState').text(`Employee State: ${presence.aggregate.acdState}`);    
    if (presence.email) {
        html += `<strong>Email</strong>: ${presence.email.acdState}</small>&nbsp;&nbsp;`
    }
    if (presence.chat) {
        html += `<strong>Chat</strong>: ${presence.chat.acdState}&nbsp;&nbsp;`
    }
    if (presence.sms) {
        html += `<strong>SMS</strong>: ${presence.sms.acdState}&nbsp;&nbsp;`
    }
    if (presence.openMedia) {
        html += `<strong>Open Media</strong>: ${presence.openMedia.acdState}&nbsp;&nbsp;`
    }
    if (presence.voice) {
        for (var voicePresence of presence.voice) {
            html += `<strong>Voice</strong>: ${voicePresence.acdState}&nbsp;&nbsp;`
        }
    }

    $('#agentStats').html(html);    
}

function setPresence(newState, reasonCode) {
    if (newState === 'Busy') {
        $("#presenceStates").css("display", "none");
        $("#dndCodes").css("display", "none");
        $("#busyCodes").css("display", "block");
    }
    if (newState === 'DND') {
        $("#presenceStates").css("display", "none");
        $("#busyCodes").css("display", "none");
        $("#dndCodes").css("display", "block");
    }

    micc.putEmployeeState(`me`, `{
        'state': '${newState}',
        'reason': '${reasonCode}'
    }`, function processResponse(responseData) {
        console.log(`Response for set presence ${newState}-${reasonCode}:  `, responseData);
    });
}

function populateBusyReasonCodes(data) {
    for (var reasonCode of data._embedded.items) {
        if (reasonCode.type === 'Busy') {
            $("#busyCodes ul").append(`<li><a href="#" onclick="setPresence('Busy', '${reasonCode.id}')">${reasonCode.name}</a></li>`);
        }
        if (reasonCode.type === 'Dnd') {
            $("#dndCodes ul").append(`<li><a href="#" onclick="setPresence('DoNotDisturb', '${reasonCode.id}')">${reasonCode.name}</a></li>`);
        }
    }
}

function showPresenceList() {
    $("#presenceStates").css("display", "block");
    $("#dndCodes").css("display", "none");
    $("#busyCodes").css("display", "none");
}