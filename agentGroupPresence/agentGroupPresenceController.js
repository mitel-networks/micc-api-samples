var micc = new Micc('localhost');
var agentGroups = null;
var agentIds = [];

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
    if(this.agentIds.indexOf(agentState.id) === -1){
        return;
    }

    this.agentGroups._embedded.items.forEach(a => {
        a.statuses.forEach(s => {
            if(s.id === agentState.id) {
                if(agentState.presentInAgentGroups.indexOf(a.id) > -1){
                    s.status = 'Present';
                } else{
                    s.status = 'NotPresent';
                }
            }
        });
    });

    populateAgentGroupInfo(this.agentGroups);
}

function populateAgentGroupInfo(agentGroups) {
    this.agentGroups = agentGroups;
    agentGroups._embedded.items.forEach(a => {
        var matchingRow = $(`#${a.id}`);
        if(matchingRow.length == 0) {
            matchingRow = addRow(a);
        }

        var query = $(matchingRow);
        query.find('div.Name')
            .text(a.name);

        a.statuses.forEach(s => {
            if(this.agentIds.indexOf(s.id) === -1){
                this.agentIds.push(s.id);
            }

            query.find('div.' + s.type)
                .text(s.status);
        });
    });
}

function join(button){
    joinLeave(button, 'Present');
}

function leave(button){
    joinLeave(button, 'NotPresent');
}

function joinLeave(button, status) {
    var id = button.parentElement.parentElement.id;
    var type = $(button).siblings('div')[0].className;

    var employeeAgentGroupModel = {};
    employeeAgentGroupModel.id = id;

    var agentGroupClone = jQuery.extend(true, {}, this.agentGroups);
    agentGroupClone._embedded.items.forEach(a => {
        if(a.id === id){
            employeeAgentGroupModel.name = a.name;
            employeeAgentGroupModel.reporting = a.reporting;
            a.statuses.forEach(s => {
                if(s.type === type){
                    s.status = status;
                }
            });
            employeeAgentGroupModel.statuses = a.statuses;
        }
    });
    micc.putAgentGroupPresenceByGroupId(`me`, id, JSON.stringify(employeeAgentGroupModel), function processResponse(responseData) {
        console.log(`Response for agent group presence for ${id} for type ${type} with status ${status}:  `, responseData);
    });
}

function joinLeaveAll(button, status) {
    var id = button.parentElement.parentElement.id;
    var agentGroupClone = jQuery.extend(true, {}, this.agentGroups);
    agentGroupClone._embedded.items.forEach(a => {
        if(a.id === id){
            a.statuses.forEach(s => {
                s.status = status;
            });
        }
    });
    micc.putAgentGroupPresence(`me`, JSON.stringify(agentGroupClone), function processResponse(responseData) {
        console.log(`Response for all agent group presence for ${id} with status ${status}:  `, responseData);
    });
}

function joinAll(button) {
    joinLeaveAll(button, 'Present');
}

function leaveAll(button) {
    joinLeaveAll(button, 'NotPresent');
}

function addRow(agentGroup) {
    return $(`<tr id="${agentGroup.id}" class="conversationRow">
    <td class="JoinAll"><button class="group-button w3-btn-block w3-blue w3-round" onclick="joinAll(this);">Join All</button></td>
    <td class="LeaveAll"><button class="group-button w3-btn-block w3-blue w3-round" onclick="leaveAll(this);">Leave All</button></td>
    <td><div class="Name">?</div></td>
    <td><div class="Voice">N/A</div><button class="individual-button w3-btn-block w3-blue w3-round" onclick="join(this);">Join</button><button class="individual-button w3-btn-block w3-blue w3-round" onclick="leave(this);">Leave</button></td>
    <td><div class="Chat">N/A</div><button class="individual-button w3-btn-block w3-blue w3-round" onclick="join(this);">Join</button><button class="individual-button w3-btn-block w3-blue w3-round" onclick="leave(this);">Leave</button></td>
    <td><div class="Email">N/A</div><button class="individual-button w3-btn-block w3-blue w3-round" onclick="join(this);">Join</button><button class="individual-button w3-btn-block w3-blue w3-round" onclick="leave(this);">Leave</button></td>
    <td><div class="Sms">N/A</div><button class="individual-button w3-btn-block w3-blue w3-round" onclick="join(this);">Join</button><button class="individual-button w3-btn-block w3-blue w3-round" onclick="leave(this);">Leave</button></td>
    <td><div class="OpenMedia">N/A</div><button class="individual-button w3-btn-block w3-blue w3-round" onclick="join(this);">Join</button><button class="individual-button w3-btn-block w3-blue w3-round" onclick="leave(this);">Leave</button></td>
    </tr>`)
    .appendTo('#agentGroupTable > tbody:last-child');
}
