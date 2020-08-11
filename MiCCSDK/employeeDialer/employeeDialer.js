var micc = new Micc('localhost');

function toggleAccordion(elementId) {
    var accordian = document.getElementById(elementId);
    const showClass = ' w3-show';
    if(accordian.className.indexOf(showClass) == -1) {
        accordian.className += showClass;
    } else {
        accordian.className = accordian.className.replace(showClass, '');
    }
}

function login() {
    micc = new Micc($('#miccServer').val());
    micc.login(
        $('#username').val(),
        $('#password').val(),
        populateEmployeeInfo
    );
}

function populateEmployeeInfo() {
    micc.getEmployeeStats('me', function (employeeStats) {
        $('#employeeName').text(`${employeeStats.lastName}, ${employeeStats.firstName}`);
        $('#employeeReporting').text(employeeStats.reporting);

        var voiceDevices = employeeStats.presence.voice;
        console.log('Voice devices:  ', voiceDevices);

        $('#voiceDeviceSelector').empty();
        for(var voiceDevice of voiceDevices) {
            $('#voiceDeviceSelector')
                .append($('<option>', {
                    value : voiceDevice.reporting,
                    text: voiceDevice.reporting
                }));
        }
    });
}

function dial() {
    var toNumber = $('#toNumber').val();
    var fromNumber = $('#voiceDeviceSelector').val();

    micc.postEmployeeConversation('me', `{
        "type":"Voice",
        "from":"${fromNumber}",
        "to":"${toNumber}"
    }`, function(responseData) {
        console.log('Response from POST conversation:  ', responseData);
    });
}