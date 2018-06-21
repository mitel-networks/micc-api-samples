

function getAuthToken() {
    var enterpriseip = $('#enterpriseip').val();
    var miccAuthServerPath = `http://${enterpriseip}/authorizationserver`
    var username = $('#username').val();
    var password = $('#password').val();
    var data = `grant_type=password&username=${username}&password=${password}`;
    var bearerToken = "";

    $.ajax({
        type: "POST",
        url: `${miccAuthServerPath}/token`,
        data: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }).done(function (data) {
            console.log('Login success.  Received data:  ', data);
            bearerToken = data.access_token; 
            $('#authToken').text(bearerToken);
            $('#authTokenCard').removeClass('invisible');

    });
}

function getAuthTokenClaims() {
    //request claims from api
    var enterpriseip = $('#enterpriseip').val();
    var apiPath = `http://${enterpriseip}/authorizationserver/api/account`;

        $.ajax({
            method: 'GET',
            url:apiPath,
            beforeSend: function (xhr) {
                console.log('Bearer ' + $('#authToken').html());
                xhr.setRequestHeader('Authorization', 'Bearer ' + $('#authToken').html());
            }
        }).done(function (result) {
            console.log('Claims ' + JSON.stringify(result));
            //$('#result').html(JSON.stringify(result));
            $.each(result, function(i, item){
                var $tr = $('<tr>').append(
                    $('<td>').text(i),
                    $('<td>').text(item),
                    $('</tr>')
                ); 
                $('#claimsTableBody').append($tr);
                $('#claimsTable').css({'visibility': 'visible'});   
            });
        });
}


function test(){
    $.ajax({
        type: 'GET',
        url: 'http://localhost/miccsdk/api/v1/openmedia',
        headers: {
            Authorization: `Bearer tDEOViZ9_nn37S3jpAfkdab8SFwvxVJ9jbVgnZLVSe5tzL3ErvJXYedqXPnWSPyre1yANJX2QiWD2OzDSkojayLP6WsJZKNfF4XInp_RntRmIV68pGdvReCpvL68s-zHyXR3idB3UO4JaWJpgoXTyNMEu_nadkt2RPBtnA6zww7jLhT0y9_0V-0636qixILsafdsGHSEvmp07ZoKBRcMgbKoJBMqosXLe_i17o0z64ys29qKwYOmKrljfRAy1wGPuqWlT7m5TNfocfBqq1lEVZ_h_O2qt3CnDYu42mn2saTzg1T6jUXuyxKAklO2r5LfGsn9fWeAbFUST-OCkKwJ1vRu29ZnHLgltmHwtWtVYw7QKSGW5IGLO5dUZWCVMCFDjmeWZMvsH9pP2awTrI6dM2KaIO-6v5xhMiLfTj56kAydiCbqZv3iihH5K1CX7okV5cQKxxtKeS3ITlzdZPRZh3cZ5M4c0HuHI7gvqZ5DeZe1QWblgyKnQUsdygzGexDv9xKWSSMiINIr7ZqRY7wA3dXhBhSugX8BAA3VqlSgXhMOz_DFF_sUxy4GaIKra0fpDFHZLXeu9dgAuYcer319gorm0BnyAJHnJ8twUDVuacysq7qWRg2JXNGTp9WCI8Bdas19rw`,  //insert your client's auth token here
            'content-type': 'application/json',
            
        }

    }).done(function (data) {
        console.log('Received response:  ', data);
    });
    
}

