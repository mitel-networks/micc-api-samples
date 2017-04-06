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
        connectToEmployeeHub
    );
}

function connectToEmployeeHub(data) {
    var miccSignalr = new miccSignalr(data.miccServer, data.access_token);
    miccSignalr.start(function () {
        miccSignalr.addSelfMonitor();
        miccSignalr.employeeConversationChanged(onEmployeeConversationChanged);
        miccSignalr.employeeConversationRemoved(onEmployeeConversationRemoved);
    });    
}

function onEmployeeConversationChanged(conversations) {
    console.info('Received employeeConversationChanged:  ', conversations);

    for (var conversation of conversations) {
        updateEmployeeConversationRow(conversation);
    }
}

function updateEmployeeConversationRow(conversationData) {
    var matchingQueueRows = $(`[id='${conversationData.conversationId}']`);
    if(matchingQueueRows.length == 0) {
        matchingQueueRows = addConversationRow(conversationData.conversationId);
    }

    matchingQueueRows.each(function(i, conversationRow){
        var query = $(conversationRow);
        query.find('td.mediaType')
            .text(conversationData.mediaType);
        query.find('td.conversationDirection')
            .text(conversationData.direction);
        query.find('td.conversationState')
            .text(conversationData.conversationState);
        query.find('td.fromName')
            .text(conversationData.fromName);
        query.find('td.fromAddress')
            .text(conversationData.fromAddress);
        query.find('td.toName')
            .text(conversationData.toName);
        query.find('td.toAddress')
            .text(conversationData.toAddress);
        query.find('td.subject')
            .text(conversationData.subject);
    });
}

function onEmployeeConversationRemoved(conversationIds) {
    console.info('Received employeeConversationRemoved:  ', conversationIds);
    for (var conversationId of conversationIds) {
        deleteRow(conversationId);
    }
}

function addConversationRow(conversationId) {
    return $(`<tr id="${conversationId}" class="conversationRow">
            <td class="mediaType">?</td>
            <td class="conversationDirection">?</td>
            <td class="conversationState">?</td>
            <td class="fromName">?</td>
            <td class="fromAddress">?</td>
            <td class="toName">?</td>
            <td class="toAddress">?</td>
            <td class="subject">?</td>
        </tr>`)
        .appendTo('#conversationsTable > tbody:last-child');
}

function deleteRow(conversationId) {
    $(`[id='${conversationId}']`).remove();
}
