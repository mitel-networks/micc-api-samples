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
        $('#password').val()
    );
}

var timerInterval;
function setRefreshInterval() {
    clearInterval(timerInterval);
    var refreshInterval = $('#refreshInterval').val() * 1000;
    if(refreshInterval < 1) {
        console.info('Stopping refresh', refreshInterval);
    } else {
        timerInterval = setInterval(function () {
            console.info('Refreshing queue info');
            $('tr.queueRow').each(function(i, queueRow) {
                populateQueueStats(queueRow);
            });
        }, refreshInterval);
    }
}

function populateQueueStats(queueRow) {
    var queueId = $(queueRow).attr('id');

    micc.getQueueStats(queueId, function(queueData) {
        var matchingQueueRows = $(`[id='${queueId}']`);
        if(!matchingQueueRows) {
            console.warn('No rows found for id %s', queueId);
        } else {
            matchingQueueRows.each(function(i, queueRow){
                var query = $(queueRow);
                query.attr('id', queueData.id);
                query.find('td.name')
                    .text(queueData.name);
                query.find('td.reporting')
                    .text(queueData.reporting);
                query.find('td.mediaType')
                    .text(queueData.mediaType);
                query.find('td.waitingConversations')
                    .text(queueData.waitingConversations);
                query.find('td.longestWaitingConversationDuration')
                    .text(queueData.longestWaitingConversationDuration);
                query.find('td.estimatedWaitTimeForNewConversations')
                    .text(queueData.estimatedWaitTimeForNewConversations);
                query.find('td.serviceLevelPercentageToday')
                    .text(queueData.serviceLevelPercentageToday);
                query.find('td.offeredConversationsToday')
                    .text(queueData.offeredConversationsToday);
                query.find('td.answeredConversationsToday')
                    .text(queueData.answeredConversationsToday);
            });
        }
    });
}

function addQueueRow(queueId) {
    var queueRow = $(`<tr id="${queueId}" class="queueRow">
            <td><button class="w3-btn w3-round-xxlarge w3-tiny w3-blue" onclick="deleteRow(this);">X</button></td>
            <td class="name">?</td>
            <td class="reporting">?</td>
            <td class="mediaType">?</td>
            <td class="waitingConversations">?</td>
            <td class="longestWaitingConversationDuration">?</td>
            <td class="estimatedWaitTimeForNewConversations">?</td>
            <td class="serviceLevelPercentageToday">?</td>
            <td class="offeredConversationsToday">?</td>
            <td class="answeredConversationsToday">?</td>
        </tr>`)
        .appendTo('#queueStatsTable > tbody:last-child');
    $('#queueId').val('');
    populateQueueStats(queueRow);
}

function deleteRow(button) {
    $(button).parent().parent().remove();
}
