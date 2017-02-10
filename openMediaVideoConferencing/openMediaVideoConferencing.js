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
		function(responseData) {
		//write code here to process the data from the login
		//Remember to not to expose the access token here
    }
    );
}

function postOpenMedia() {

	var id = generateGuid();

    micc.postOpenMedia(`{
        "targetUri": "https://appear.in/52105",
                        "targetUriEmbedded": "true",
                        "previewUrl": "",
                        "id": "${id}",
                        "historyUrl": "https://appear.in/",
                        "from": "Random Kiosk User",
                        "to": "Company X",
                        "subject": "Sample Open Media App"
    }`, function(responseData) {
        console.log('Response from POST open media:  ', responseData);
		
		window.location = "https://appear.in/52105";
    });
}

function generateGuid()
            {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }