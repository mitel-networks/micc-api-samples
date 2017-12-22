function Micc(serverAddress) {
    var miccServerBase = `http://${serverAddress}`;
    var miccSdkBase = `${miccServerBase}/miccsdk/api/v1`;
    var miccAuthBase = `${miccServerBase}/authorizationserver`;
    var bearerToken = '';

    this.login = function (username, password, processResponse) {
        console.log('Attempting to login user [%s] to server [%s]', username, miccAuthBase);
        var data = `grant_type=password&username=${username}&password=${password}`;

        $.ajax({
            type: "POST",
            url: `${miccAuthBase}/token`,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
        }).done(function (data) {
            console.log('Login success.  Received data:  ', data);
            bearerToken = data.access_token;
            if (processResponse) {
                data.miccServer = miccServerBase;
                processResponse(data);
            }
        });
    };

    this.getEmployeeStats = function (employeeId, receiveEmployeeStats) {
        if (!employeeId) {
            console.log('Will not fetch because no employee id given.');
        } else {
            this.getRequest(`employees/${employeeId}/state`, receiveEmployeeStats);
        }
    };

    this.getQueueStats = function (queueId, receiveQueueStats) {
        if (!queueId) {
            console.log('Will not fetch because no queue id given.');
        } else {
            this.getRequest(`queues/${queueId}/state`, receiveQueueStats);
        }
    };

    this.getQueueConversations = function (queueId, receiveQueueConversations) {
        if (!queueId) {
            console.log('Will not fetch because no queue id given.');
        } else {
            this.getRequest(`queues/${queueId}/conversations`, receiveQueueConversations);
        }
    };

    this.getEmployeeBusyReasonCodes = function (employeeId, receiveEmployeeBusyCodes) {
        if (!employeeId) {
            console.log('Will not fetch because no employee id given.');
        } else {
            this.getRequest(`employees/${employeeId}/busyreasoncodes`, receiveEmployeeBusyCodes);
        }
    };

    this.getAgentGroupPresence = function (employeeId, receiveAgentGroupPresence) {
        if (!employeeId) {
            console.log('Will not fetch because no employee id given.');
        } else {
            this.getRequest(`employees/${employeeId}/agentgrouppresence`, receiveAgentGroupPresence);
        }
    };

    this.postEmployeeConversation = function (employeeId, body, processResponse) {
        if (!employeeId) {
            console.log('Will not fetch because no employee id given.');
        } else {
            this.postRequest(`employees/${employeeId}/conversations`, body, processResponse);
        }
    }

    this.putEmployeeConversation = function (employeeId, conversationId, body, processResponse) {
        if (!employeeId) {
            console.log('Will not fetch because no employee id given.');
        } else {
            this.putRequest(`employees/${employeeId}/conversations/${conversationId}`, body, processResponse);
        }
    }

    this.putEmployeeState = function (employeeId, body, processResponse) {
        if (!employeeId) {
            console.log('Will not fetch because no employee id given.');
        } else {
            this.putRequest(`employees/${employeeId}/state`, body, processResponse);
        }
    }
    
    this.putAgentGroupPresence = function (employeeId, body, processResponse) {
        if (!employeeId) {
            console.log('Will not fetch because no employee id given.');
        } else {
            this.putRequest(`employees/${employeeId}/agentgrouppresence`, body, processResponse);
        }
    }

    this.putAgentGroupPresenceByGroupId = function (employeeId, groupId, body, processResponse) {
        if (!employeeId) {
            console.log('Will not fetch because no employee id given.');
        } else if (!groupId) {
            console.log('Will not fetch because no group id given.');
        } else {
            this.putRequest(`employees/${employeeId}/agentgrouppresence/${groupId}`, body, processResponse);
        }
    }

    this.postOpenMedia = function (body, processResponse) {
        this.postRequest(`openmedia`, body, processResponse);
    }

    this.putQueueConversation = function (queueId, conversationId, body, processResponse) {
        if (!queueId) {
            console.log('Will not perform action because no queue id given.');
        } else if (!conversationId) {
            console.log('Will not perform action because no conversation id given.');
        } else {
            this.putRequest(`queues/${queueId}/conversations/${conversationId}`, body, processResponse);
        }
    }

    this.pickQueueConversation = function (conversationId, queueId, processResponse) {
        this.putQueueConversation(queueId, conversationId, `{
            conversationAction: 'Pick',
            id: '${conversationId}'
            }`, processResponse);
    }

    this.acceptConversation = function (conversationId, employeeId, tags, processResponse) {
        this.putEmployeeConversation(employeeId, conversationId, `{
            conversationAction: 'Accept',
            id: '${conversationId}',
            tags: ${JSON.stringify(tags)}
            }`, processResponse);
    }

    this.noReplyQueueConversation = function (conversationId, queueId, processResponse) {
        this.putQueueConversation(queueId, conversationId, `{
            conversationAction: 'NoReply',
            id: '${conversationId}'
            }`, processResponse);
    }

    this.junkQueueConversation = function (conversationId, queueId, processResponse) {
        this.putQueueConversation(queueId, conversationId, `{
            conversationAction: 'Junk',
            id: '${conversationId}'
            }`, processResponse);
    }

    this.pickAndAcceptQueueConversation = function (conversationId, queueId, employeeId, tags,
        processResponse) {
        var _this = this;
        this.putQueueConversation(queueId, conversationId, `{
            conversationAction: 'Pick',
            id: '${conversationId}'
            }`, function processPickResponse(responseData) {
                console.log(`Response for 'Pick' for conversation ${conversationId}:  `, responseData);
                _this.acceptConversation(conversationId, employeeId, tags, processResponse);
            });
    }

	this.searchContacts = function (searched, type, response) {
        if (!searched) {
            console.log('Will not fetch because no searched information given.');
        } 
		else if (!type || type == "Any") {
            this.getRequest(`directory?$search='${searched}'`, response);
        }
		else if (type == "AD") {
            this.getRequest(`directory?$search='${searched}'&$filter=Type eq Mitel.MiccSdk.Models.DirectoryEntryType'ADGroup' or Type eq Mitel.MiccSdk.Models.DirectoryEntryType'ADUser' or Type eq Mitel.MiccSdk.Models.DirectoryEntryType'ADContact'`, response);
        }
		else {
            this.getRequest(`directory?$search='${searched}'&$filter=Type eq Mitel.MiccSdk.Models.DirectoryEntryType'${type}'`, response);
        }
    };
	
	this.addContact = function (body, processResponse) {
		this.postRequest(`directory`, body, processResponse);
	}
	
	this.editContact = function (body, id, processResponse) {
		if (!id) {
            console.log('Will not fetch because no id given.');
        } 
		else {
			this.putRequest(`directory/${id}`, body, processResponse);
		}
	}
	
    this.getRequest = function (apiSubUrl, processResponse) {
        this.makeAjaxRequest(apiSubUrl, 'GET', null, processResponse);
    }

    this.postRequest = function (apiSubUrl, body, processResponse) {
        this.makeAjaxRequest(apiSubUrl, 'POST', body, processResponse);
    }

    this.putRequest = function (apiSubUrl, body, processResponse) {
        this.makeAjaxRequest(apiSubUrl, 'PUT', body, processResponse);
    }

    this.makeAjaxRequest = function (apiSubUrl, method, body, processResponse) {
        var url = `${miccSdkBase}/${apiSubUrl}`;
        console.log(`Processing ${method} request to ${url}`);

        $.ajax({
            type: method,
            url: url,
            headers: {
                Authorization: `Bearer ${bearerToken}`,
                'content-type': 'application/json'
            },
            data: body
        }).done(function (receivedData) {
            console.log('Received response:  ', receivedData);
            processResponse(receivedData);
        });
    }	
};
