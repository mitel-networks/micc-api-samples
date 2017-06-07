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
        query.find('td.Name')
            .text(a.name);

        a.statuses.forEach(s => {
            if(this.agentIds.indexOf(s.id) === -1){
                this.agentIds.push(s.id);
            }

            query.find('td.' + s.type)
                .text(s.status);
        });
    });
}

function joinAll(button) {
    var id = button.parentElement.parentElement.id;
    var agentGroupClone = jQuery.extend(true, {}, this.agentGroups);
    agentGroupClone._embedded.items.forEach(a => {
        if(a.id === id){
            a.statuses.forEach(s => {
                s.status = 'Present';
            });
        }
    });
    micc.putAgentGroupPresence(`me`, JSON.stringify(agentGroupClone), function processResponse(responseData) {
        console.log(`Response for join all agent group presence for ${id}:  `, responseData);
    });
}

function leaveAll(button) {
    var id = button.parentElement.parentElement.id;
    var agentGroupClone = jQuery.extend(true, {}, this.agentGroups);
    agentGroupClone._embedded.items.forEach(a => {
        if(a.id === id){
            a.statuses.forEach(s => {
                s.status = 'NotPresent';
            });
        }
    });
    micc.putAgentGroupPresence(`me`, JSON.stringify(agentGroupClone), function processResponse(responseData) {
        console.log(`Response for leave all agent group presence for ${id}:  `, responseData);
    });
}

function addRow(agentGroup) {
    return $(`<tr id="${agentGroup.id}" class="conversationRow">
    <td class="JoinAll"><button class="w3-btn-block w3-blue w3-round" onclick="joinAll(this);">Join All</button></td>
    <td class="LeaveAll"><button class="w3-btn-block w3-blue w3-round" onclick="leaveAll(this);">Leave All</button></td>
    <td class="Name">?</td>
    <td class="Voice">N/A</td>
    <td class="Chat">N/A</td>
    <td class="Email">N/A</td>
    <td class="Sms">N/A</td>
    <td class="OpenMedia">N/A</td>
    </tr>`)
    .appendTo('#agentGroupTable > tbody:last-child');
}
