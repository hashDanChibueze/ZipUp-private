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
    $("#submitButton").bind('touchdown mousedown', function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        var email = $("#email").val();
        var pass = $("#password").val();
        if (email.length > 0 && pass.length > 0) {
            $.ajax({
                cache : false,
                url: baseUrl+"signup",
                data: {email: email, password: pass},
                type: 'post',
                async: false,
                dataType: 'json',
                success: function(result) {
                    // everything successful, save credentials, and send user to map
                    $.mobile.changePage("#main-app");
                    window.localStorage['email'] = email;
                    window.localStorage['password'] = pass;
                    window.localStorage['passwordChanged'] = false;
                },
                error: function(err, exception) {
                    $(".error").text(err.responseJSON.errors);
                }
            });
        } else {
            $(".error").text('Please enter an email and password.');
            return false;
        }
        return false;
    });
});
