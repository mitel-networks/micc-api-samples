var micc = new Micc('localhost');
var miccSignalr;

function login() {
    micc = new Micc($('#miccServer').val());
    micc.login(
        $('#username').val(),
        $('#password').val(),
        connectToQueueHub
    );
}

function connectToQueueHub(data) {
    miccSignalr = new MiccSignalR(data.miccServer, data.access_token);
    miccSignalr.start(function () {
        miccSignalr.createQueueHubProxy();
        miccSignalr.queueStateChanged(populateQueueStats);
        miccSignalr.queueConversationChanged(addQueueConversationRows);
        miccSignalr.queueConversationRemoved(removeQueueConversationRows);
    });
}

function populateQueueStats(queueData) {
    if (queueData === undefined || queueData === null) {
        console.error('populateQueueStats -', queueData);
    } else {
        var matchingQueueRows = $(`[id='${queueData.id}']`);
        if (!matchingQueueRows) {
            console.warn('No rows found for queue with id %s', queueData.id);
        } else {
            matchingQueueRows.each(function (i, queueRow) {
                var query = $(queueRow);
                query.attr('id', queueData.id);
                query.find('td.name').text(queueData.name);
                query.find('td.reporting').text(queueData.reporting);
                query.find('td.mediaType').text(queueData.mediaType);
            });
        }
    }
}

function populateQueueConversation(conversationData) {
    if (conversationData === undefined || conversationData === null) {
        console.error('populateQueueConversationStats -', conversationData);
    } else {
        var matchingConversationRows = $(`[id='${conversationData.conversationId}']`);
        if (!matchingConversationRows) {
            console.warn('No rows found for conversation with id %s', conversationData.conversationId);
        } else {
            matchingConversationRows.each(function (i, conversationRow) {
                var query = $(conversationRow);
                query.attr('id', conversationData.id);
                query.find('td.conversationId').text(conversationData.conversationId);
                query.find('td.mediaType').text(conversationData.mediaType);
                query.find('td.caseId').text(conversationData.caseId);
                query.find('td.fromName').text(conversationData.fromName);
                query.find('td.fromAddress').text(conversationData.fromAddress);
                query.find('td.toName').text(conversationData.toName);
                query.find('td.toAddress').text(conversationData.toAddress);
                query.find('td.subject').text(conversationData.subject);
                query.find('td.timeOfferedToSystem').text(conversationData.timeOfferedToSystem);
            });
        }
    }
}

function addQueueRow(searchTerm) {
    $('#queueId').val('');
    micc.getQueueStats(searchTerm, function (queueData) {
        var queueRow = $(`<tr id="${queueData.id}" class="queueRow">
            <td><button class="w3-btn w3-round-xxlarge w3-tiny w3-blue" title="Remove"
                onclick="deleteQueue(this, '${queueData.id}');">X</button></td>
            <td class="name">?</td>
            <td class="reporting">?</td>
            <td class="mediaType">?</td>
        </tr>`)
            .appendTo('#queuesTable > tbody:last-child');
        miccSignalr.addQueueStateMonitor([queueData.id]);
        miccSignalr.addQueueConversationsMonitor([queueData.id]);
        populateQueueStats(queueData);
        micc.getQueueConversations(queueData.id, function (queueConversations) {
            addQueueConversationRows(queueConversations._embedded.items);
        });
    });
}

function addQueueConversationRows(conversations) {
    conversations.forEach(function (conversation) {
        var matchingRows = $(`[id='${conversation.conversationId}']`);
        if (matchingRows && matchingRows.length > 0) {
            populateQueueConversation(conversation);
        } else {
            var conversationRow = $(`<tr id="${conversation.conversationId}" class="conversationRow">
                ${getConversationActionButtons(conversation)}
                <td class="${conversation.queueId}">${conversation.queueName}</td>            
                <td class="conversationId">?</td>
                <td class="mediaType">?</td>
                <td class="caseId">?</td>
                <td class="fromName">?</td>
                <td class="fromAddress">?</td>
                <td class="toName">?</td>
                <td class="toAddress">?</td>
                <td class="subject">?</td>
                <td class="timeOfferedToSystem">${conversation.timeOfferedToSystem}</td>
            </tr>`)
                .appendTo('#queueConversationsTable > tbody:last-child');
            populateQueueConversation(conversation);
        }
    });
}

function removeQueueConversationRows(conversationIds) {
    conversationIds.forEach(function (conversationId) {
        var matchingConversationsRows = $(`[id='${conversationId}']`);
        if (matchingConversationsRows) {
            matchingConversationsRows.each(function (i, conversationRow) {
                $(conversationRow).remove();
            });
        }
    });
}

function deleteQueue(button, id) {
    miccSignalr.removeQueueStateMonitor([id]);
    miccSignalr.removeQueueConversationsMonitor([id]);
    $(button).parent().parent().remove();
    $(`[class='${id}']`).each(function (i, conversationRow) {
        $(conversationRow).parent().remove();
    });
}

function getConversationActionButtons(conversation) {
    var html = '<td>';
    var actions = [];
    if (conversation) {
        html += getButtonHtml('Pick', conversation.conversationId, conversation.queueId);

        if (conversation.mediaType === 'Email') {
            html += getButtonHtml('Pick & Reply All', conversation.conversationId, conversation.queueId);
        } else if (conversation.mediaType !== 'Voice') {
            html += getButtonHtml('Pick & Reply', conversation.conversationId, conversation.queueId);
        }

        if (conversation.mediaType !== 'Voice' && conversation.mediaType !== 'Chat') {
            html += getButtonHtml('No Reply', conversation.conversationId, conversation.queueId);
            html += getButtonHtml('Junk', conversation.conversationId, conversation.queueId);
        }
    }
    html += `</td>`;
    return html;
}

function getButtonHtml(title, conversationId, queueId) {
    var icon;
    switch (title) {
        case 'Pick':
            icon = "fa fa-check";
            break;
        case 'Pick & Reply':
            icon = "fa fa-reply-all";
            break;
        case 'No Reply':
            icon = "fa fa-ban";
            break;
        case 'Junk':
            icon = "fa fa-archive";
            break;
        case 'Pick & Reply All':
            icon = "fa fa-reply-all";
            break;
    }

    return `<button title="${title}" class="w3-btn w3-round-xxlarge w3-tiny w3-blue" 
                onclick="performConversationAction('${conversationId}', '${queueId}', '${title}')">
                <i class="${icon}" aria-hidden="true"></i>
            </button>&nbsp;&nbsp;`;
}

function performConversationAction(conversationId, queueId, action) {
    if (action === 'Pick') {
        micc.pickQueueConversation(`${conversationId}`, `${queueId}`, function (responseData) {
            processResponse(conversationId, action, responseData);
        });
    } else if (action === 'Pick & Reply All') {
        var tags = JSON.stringify([{ key: 'emailAcceptType', value: "ReplyAll" }]);
        micc.pickAndAcceptQueueConversation(`${conversationId}`, `${queueId}`, 'me', `${tags}`, function (responseData) {
            processResponse(conversationId, action, responseData);
        });
    } else if (action === 'Pick & Reply') {
        micc.pickAndAcceptQueueConversation(`${conversationId}`, `${queueId}`, 'me', null, function (responseData) {
            processResponse(conversationId, action, responseData);
        });
    } else if (action === 'No Reply') {
        micc.noReplyQueueConversation(`${conversationId}`, `${queueId}`, function (responseData) {
            processResponse(conversationId, action, responseData);
        });
    } else if (action === 'Junk') {
        micc.junkQueueConversation(`${conversationId}`, `${queueId}`, function (responseData) {
            processResponse(conversationId, action, responseData);
        });
    }
}

function processResponse(conversationId, action, responseData) {
    console.log(`Response of '${action}' for ${conversationId}:  `, responseData);
}