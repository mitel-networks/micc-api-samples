var micc = new Micc('localhost');

function toggleAccordion(elementId, objButton) {
	if(objButton.innerText == "Show login") {
		objButton.innerText = "Hide login";
	} else if(objButton.innerText == "Hide login") {
		objButton.innerText = "Show login";
	}
	
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
			//you can write code here to process the data from the login
			//Remember to not to expose the access token here
			var toggleLoginButton = document.getElementById('toggleLogin');
			if(responseData.access_token) {
				this.toggleAccordion('login-accordian', toggleLoginButton);
				
				toggleLoginButton.innerText = $('#username').val() + " is logged in";
				
				var searchDiv = document.getElementById('contactSearch');
				searchDiv.style.visibility = 'visible';
				
				var addDiv = document.getElementById('contactAdd');
				addDiv.style.visibility = 'visible';
				
				var editDiv = document.getElementById('contactEdit');
				editDiv.style.visibility = 'visible';
			}
		}
    );
}

function searchContacts() {
    micc.searchContacts(
		$('#toSearch').val(),
		$('#typeSelector').val(), 
		function(responseData) { 
			//you can write code here to process the response data
		}
    );
}

function addContact() {
	var name = $('#name').val();
	var email = $('#email').val();
	var phone = $('#phone').val();
	var phoneExt = $('#ext').val();
	var mobilephone = $('#mobilephone').val();
	
	micc.addContact(
		`{
			"Name":"${name}",
			"Email":"${email}",
			"Phone":"${phone}",
			"Extension":"${phoneExt}",
			"MobilePhone":"${mobilephone}"
		}`, 
		function(responseData) {
			//you can write code here to process the response data
		});
}

function editContact() {
	var id = $('#idEdit').val();
	var name = $('#nameEdit').val();
	var email = $('#emailEdit').val();
	var phone = $('#phoneEdit').val();
	var phoneExt = $('#extEdit').val();
	var mobilephone = $('#mobilephoneEdit').val();
	
	micc.editContact(
		`{
			"Name":"${name}",
			"Email":"${email}",
			"Phone":"${phone}",
			"Extension":"${phoneExt}",
			"MobilePhone":"${mobilephone}"
		}`, 
		id,
		function(responseData) {
			//you can write code here to process the response data
		});
}