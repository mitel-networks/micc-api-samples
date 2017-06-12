var micc = new Micc('localhost');
var agentGroups = null;
var agentIds = [];
var joinButton = {
    class: 'individual-button',
    eventHandler: 'join(this)',
    text: 'Join'
}
var leaveButton = {
    class: 'individual-button',
    eventHandler: 'leave(this)',
    text: 'Leave'
}
var joinAllButton = {
    class: 'group-button',
    eventHandler: 'joinAll(this)',
    text: 'Join All'
}
var leaveAllButton = {
    class: 'group-button',
    eventHandler: 'leaveAll(this)',
    text: 'Leave All'
}

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
    $('#agentGroupTable').find("tr:gt(0)").remove();
    if($('#miccServer').val()){
        micc = new Micc($('#miccServer').val());
    }
    micc.login(
        $('#username').val(),
        $('#password').val(),
        connectToAgentHub
    );
}

function connectToAgentHub(data) {
    var miccSignalr = new MiccSignalR(data.miccServer, data.access_token);
    miccSignalr.start(function () {
        miccSignalr.createAgentHubProxy();
        miccSignalr.addSelfMonitor();
        miccSignalr.agentStateChanged(onAgentStateChanged);
    });
    micc.getAgentGroupPresence('me', populateAgentGroupInfo);
}

function onAgentStateChanged(agentState) {
    if(this.agentIds.indexOf(agentState.id) !== -1 && this.agentGroups._embedded){
         this.agentGroups._embedded.items.forEach(agentGroup => {
            agentGroup.statuses.forEach(status => {
                if(status.id === agentState.id) {
                    if(agentState.presentInAgentGroups.indexOf(agentGroup.id) > -1){
                        status.status = 'Present';
                    } else{
                        status.status = 'NotPresent';
                    }
                }
            });
        });

        populateAgentGroupInfo(this.agentGroups);
    }
}

function populateAgentGroupInfo(agentGroups) {
    if(agentGroups._embedded) {
        this.agentGroups = agentGroups;
        agentGroups._embedded.items.forEach(agentGroup => {
            var matchingRow = $(`#${agentGroup.id}`);
            if(matchingRow.length == 0) {
                matchingRow = addRow(agentGroup);
            }

            var query = $(matchingRow);
            query.find('div.Name')
                .text(agentGroup.name);

            agentGroup.statuses.forEach(status => {
                if(this.agentIds.indexOf(status.id) === -1){
                    this.agentIds.push(status.id);
                }

                query.find('div.' + status.type)
                    .text(status.status);
            });
        });
    }
}

function join(button){
    joinLeave(button, 'Present');
}

function leave(button){
    joinLeave(button, 'NotPresent');
}

function joinLeave(button, presence) {
    if(this.agentGroups && this.agentGroups._embedded){
        var id = button.parentElement.parentElement.id;
        var type = $(button).siblings('div')[0].className;

        var employeeAgentGroupModel = {
            id: id
        };

        var agentGroupClone = jQuery.extend(true, {}, this.agentGroups);
        agentGroupClone._embedded.items.forEach(agentGroup => {
            if(agentGroup.id === id){
                employeeAgentGroupModel.name = agentGroup.name;
                employeeAgentGroupModel.reporting = agentGroup.reporting;
                agentGroup.statuses.forEach(status => {
                    if(status.type === type){
                        status.status = presence;
                    }
                });
                employeeAgentGroupModel.statuses = agentGroup.statuses;
            }
        });

        micc.putAgentGroupPresenceByGroupId(`me`, id, JSON.stringify(employeeAgentGroupModel), function processResponse(responseData) {
            console.log(`Response for agent group presence for ${id} for type ${type} with status ${presence}:  `, responseData);
        });
    }
}

function joinLeaveAll(button, presence) {
    if(this.agentGroups && this.agentGroups._embedded){
        var id = button.parentElement.parentElement.id;
        var agentGroupClone = jQuery.extend(true, {}, this.agentGroups);
        agentGroupClone._embedded.items.forEach(agentGroup => {
            if(agentGroup.id === id){
                agentGroup.statuses.forEach(status => {
                    status.status = presence;
                });
            }
        });

        micc.putAgentGroupPresence(`me`, JSON.stringify(agentGroupClone), function processResponse(responseData) {
            console.log(`Response for all agent group presence for ${id} with status ${presence}:  `, responseData);
        });
    }
}

function joinAll(button) {
    joinLeaveAll(button, 'Present');
}

function leaveAll(button) {
    joinLeaveAll(button, 'NotPresent');
}

function addRow(agentGroup) {
    var row = `<tr id="${agentGroup.id}" class="conversationRow">`;
    row += createRow('JoinAll', '', [joinAllButton]);
    row += createRow('LeaveAll', '', [leaveAllButton]);
    row += createRow('Name', '?', []);
    row += createRow('Voice', 'N/A', [joinButton, leaveButton]);
    row += createRow('Chat', 'N/A', [joinButton, leaveButton]);
    row += createRow('Email', 'N/A', [joinButton, leaveButton]);
    row += createRow('Sms', 'N/A', [joinButton, leaveButton]);
    row += createRow('OpenMedia', 'N/A', [joinButton, leaveButton]);
    row += '</tr>';

    return $(row).appendTo('#agentGroupTable > tbody:last-child');
}

function createRow(className, text, buttonList){
    var row = '<td><div class="';
    row += className + '">' + text + '</div>';
    buttonList.forEach(button => {
        row += '<button class="w3-btn-block w3-blue w3-round';
        if(button.class)
        {
            row += ' ' + button.class;
        }
        row += '"'
        if(button.eventHandler){
            row += ` onclick="${button.eventHandler};"`;
        }
        row += '>' + button.text + '</button>'
    });
    row += '</td>';
    return row;
}
 