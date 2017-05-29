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
        return;
    }
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
            query.find('td.waitingConversations').text(queueData.waitingConversations);
            query.find('td.longestWaiting').text(queueData.longestWaitingConversationDuration);
            query.find('td.ewt').text(queueData.estimatedWaitTimeForNewConversations);
            query.find('td.serviceLevel').text(queueData.serviceLevelPercentageToday);
            query.find('td.offered').text(queueData.offeredConversationsToday);
            query.find('td.answered').text(queueData.answeredConversationsToday);
        });
    }
}

function populateQueueConversationStats(conversationData) {
    if (conversationData === undefined || conversationData === null) {
        console.error('populateQueueConversationStats -', conversationData);
        return;
    }
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

function addQueueRow(searchTerm) {
    $('#queueId').val('');
    micc.getQueueStats(searchTerm, function (queueData) {
        var queueRow = $(`<tr id="${queueData.id}" class="queueRow">
            <td><button class="w3-btn w3-round-xxlarge w3-tiny w3-blue" title="Remove"
                onclick="deleteQueue(this, '${queueData.id}');">X</button></td>
            <td class="name">?</td>
            <td class="reporting">?</td>
            <td class="mediaType">?</td>
            <td class="waitingConversations">?</td>
            <td class="longestWaiting">?</td>
            <td class="ewt">?</td>
            <td class="serviceLevel">?</td>
            <td class="offered">?</td>
            <td class="answered">?</td>cls
        </tr>`)
            .appendTo('#queueStatsTable > tbody:last-child');
        miccSignalr.addQueueStateMonitor([queueData.id]);
        miccSignalr.addQueueConversationsMonitor([queueData.id]);
        populateQueueStats(queueData);
        micc.getQueueConversations(queueData.id, function (queueConversations) {
            addQueueConversationRows(queueConversations._embedded.items);
        });
    });
}

function addQueueConversationRows(conversations) {
    for (var i = 0; i < conversations.length; i++) {
        var conversation = conversations[i];
        var matchingRows = $(`[id='${conversation.conversationId}']`);
        if (matchingRows && matchingRows.length > 0) {
            populateQueueConversationStats(conversation);
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
            populateQueueConversationStats(conversation);
        }
    }
}

function removeQueueConversationRows(conversations) {
    for (var i = 0; i < conversations.length; i++) {
        var matchingConversationsRows = $(`[id='${conversations[i]}']`);
        if (matchingConversationsRows) {
            matchingConversationsRows.each(function (i, conversationRow) {
                var query = $(conversationRow);
                query.remove();
            });
        }
    }
}

function deleteQueue(button, id) {
    miccSignalr.removeQueueStateMonitor([id]);
    miccSignalr.removeQueueConversationsMonitor([id]);
    // remove queue row
    $(button).parent().parent().remove();
    // remove queue conversations rows
    var matchingQueueConversationsRows = $(`[class='${id}']`);
    if (!matchingQueueConversationsRows) {
        console.info('No conversations found for queue with id %s', id);
    } else {
        matchingQueueConversationsRows.each(function (i, conversationRow) {
            $(conversationRow).parent().remove();
        });
    }
}

function getConversationActionButtons(conversation) {
    var html = '<td>';
    if (conversation) {
        // Pick
        html += `<button title="Pick" class="w3-btn w3-round-xxlarge w3-tiny w3-blue" 
                        onclick="micc.pickQueueConversation('${conversation.conversationId}', '${conversation.queueId}')">
                        <i class="fa fa-check" aria-hidden="true"></i>
                    </button>&nbsp;&nbsp;`;

        if (conversation.mediaType !== 'Voice') {
            // pick and accept
            html += `<button title="Pick & Reply All" class="w3-btn w3-round-xxlarge w3-tiny w3-blue" 
                        onclick="micc.pickAndAcceptQueueConversation('${conversation.conversationId}', 
                            '${conversation.queueId}', 'me', true);">
                        <i class="fa fa-reply-all" aria-hidden="true"></i>
                    </button>&nbsp;&nbsp;`;

            if (conversation.mediaType === 'Email' || conversation.mediaType === 'Sms' ||
                conversation.mediaType === 'OpenMedia') {
                    // no reply
                    html += `<button title="No Reply" class="w3-btn w3-round-xxlarge w3-tiny w3-blue" 
                        onclick="micc.NoReplyQueueConversation('${conversation.conversationId}', '${conversation.queueId}')">
                        <i class="fa fa-ban" aria-hidden="true"></i>
                    </button>&nbsp;&nbsp;`;
                    // Junk
                    html += `<button title="Junk" class="w3-btn w3-round-xxlarge w3-tiny w3-blue" 
                        onclick="micc.JunkQueueConversation('${conversation.conversationId}', '${conversation.queueId}')">
                        <i class="fa fa-archive" aria-hidden="true"></i>
                    </button>&nbsp;&nbsp;`;
            }
        }
        html += `</td>`;
    }
    return html;
}