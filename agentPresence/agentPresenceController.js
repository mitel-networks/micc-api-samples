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
    micc.getEmployeeStats('me', populateEmployeeInfo);
    micc.getEmployeeBusyReasonCodes('me', populateBusyReasonCodes);

    var miccSignalr = new MiccSignalR(data.miccServer, data.access_token);
    miccSignalr.start(function () {
        var hub = miccSignalr.createEmployeeHubProxy();
        miccSignalr.addSelfMonitor();
        miccSignalr.employeeStateChanged(populateEmployeeInfo);
    });
}

function populateEmployeeInfo(employeeStats) {
    $('#employeeName').text(`${employeeStats.lastName}, ${employeeStats.firstName}`);
    $('#employeeReporting').text(`Reporting: ${employeeStats.reporting}`);
    processPresence(employeeStats.presence);
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
    micc.putEmployeeState(`me`, `{
        'state': '${newState}',
        'reason': '${reasonCode}'
    }`, function processResponse(responseData) {
            console.log(`Response for set presence ${newState}-${reasonCode}:  `, responseData);
        });
}

function showReasonCodes(state) {
    $("#presenceStates").css("display", "none");
    $("#dndCodes").css("display", state === 'DND' ? "block" : "none");
    $("#busyCodes").css("display", state === 'Busy' ? "block" : "none");
}

function populateBusyReasonCodes(data) {
    $("#busyCodes ul").empty();
    $("#dndCodes ul").empty();
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