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
    var connection = $.hubConnection(`${data.miccServer}/miccsdk/`, {
         qs: `sessionid=Bearer ${data.access_token}`
    });
    connection.logging = true;
    connection.error(function(error) {
        console.error('Connection error:  ', error);
    });
    connection.stateChanged(function(state) {
        console.info('Connection state changed:  ', state);
    });

    connection.start()
        .done(function() {
            console.info(`Connection established with ID=${connection.id}`);

            var hub = connection.createHubProxy('employeeHub');
            hub.invoke('addConversationMonitor');
            hub.on('employeeConversationChanged', onEmployeeConversationChanged);
            hub.on('employeeConversationRemoved', onEmployeeConversationRemoved);
        })
        .fail(function() {
            console.error('Connection failed');
        });
}

function onEmployeeConversationChanged(conversationData) {
    console.info('Received employeeConversationChanged:  ', conversationData);

    var matchingQueueRows = $(`[id='${conversationData.conversationId}']`);
    if(!matchingQueueRows) {
        matchingQueueRows = addConversationRow(conversationData.conversationId);
    } else {
        matchingQueueRows.each(function(i, conversationRow){
            var query = $(conversationRow);
            query.find('td.mediaType')
                .text(conversationData.mediaType);
            query.find('td.conversationState')
                .text(conversationRow.conversationState);
            query.find('td.fromAddress')
                .text(conversationRow.fromAddress);
            query.find('td.fromName')
                .text(conversationRow.fromName);
            query.find('td.toAddress')
                .text(conversationData.toAddress);
            query.find('td.toName')
                .text(conversationData.toName);
            query.find('td.subject')
                .text(conversationData.subject);
            query.find('td.conversationType')
                .text(conversationData.conversationType);
            query.find('td.conversationDirection')
                .text(conversationData.conversationDirection);
        });
    }
}

function onEmployeeConversationRemoved(conversationId) {
    console.info('Received employeeConversationRemoved:  ', conversationId);
    deleteRow(conversationId);
}

function addConversationRow(conversationId) {
    return $(`<tr id="${conversationId}" class="conversationRow">
            <td class="mediaType">?</td>
            <td class="conversationState">?</td>
            <td class="fromAddress">?</td>
            <td class="fromName">?</td>
            <td class="toAddress">?</td>
            <td class="toName">?</td>
            <td class="subject">?</td>
            <td class="conversationType">?</td>
            <td class="conversationDirection">?</td>
        </tr>`)
        .appendTo('#conversationsTable > tbody:last-child');
}

function deleteRow(conversationId) {
    $(`[id='${conversationId}']`).remove();
}
