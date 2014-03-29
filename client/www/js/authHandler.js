var baseUrl = "http://z-api.herokuapp.com/";

$(document).bind("mobileinit", function() {
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
});

$(document).on('pageinit', '#homepage', function() {
    console.log("homepage loaded");
    // see if there are credentials in local storage, if there are
        // try to login, if successful, continue to map
        // else show signin page
    // no credentials, show the homepage

    if(window.localStorage["email"] != undefined && window.localStorage["password"] != undefined) {
        var email = window.localStorage["email"];
        var password = window.localStorage["password"];
        $.post(baseUrl+"signin", 
            {email:email, password:password}, function(res) {
                console.log(res);
        });
    } else {
        console.log("no creds found");
    }

});

$(document).on('pageinit', '#signup', function() {
    console.log("singup page loaded");

    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        console.log("on device");
        // document.addEventListener("deviceready", this.onDeviceReady, true);
        alert = navigator.notification.alert;
    } else {
        console.log("on desktop");
        // $(document).ready(this.onDeviceReady);
    }

    $("#submitButton").bind('touchdown mousedown', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        var email = $("#email").val();
        var pass = $("#password").val();
        if (email.length > 0 && pass.length > 0) {
            $.ajax({
                url: baseUrl+"signup",
                type: 'POST',
                data: {email: email, password: pass},
                contentType: 'application/json; charset=utf-8',
                success: function(result, status) {
                    // everything successful, save credentials, and send user to map
                    $.mobile.changePage("map.html");
                    window.localStorage['email'] = email;
                    window.localStorage['password'] = pass;
                    window.localStorage['passwordChanged'] = false;
                },
                error: function(err, textStatus, exception) {
                    alert(err.responseJSON.errors, null);
                    //$(".error").text(err.responseJSON.errors);
                }
            });
        } else {
            alert('Please enter an email and password', null);
            // $(".error").text('Please enter an email and password.');
        }
        return false;
    });

});
