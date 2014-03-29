var baseUrl = "http://z-api.herokuapp.com/";

$(document).bind("mobileinit", function() {
    console.log("in mobileinit");
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
});

// This is the homepage handler, that either shows the homepage,
// or redirects user to the homepage if the user is able to successfully login
$(document).on('pageinit', '#homepage', function() {
    console.log("homepage loaded");
    // see if there are credentials in local storage, if there are
        // try to login, if successful, continue to map
        // else show signin page
    // no credentials, show the homepage

    if(window.localStorage["email"] != undefined && window.localStorage["password"] != undefined &&
        window.localStorage['passwordChanged'] == "false") {
        var email = window.localStorage["email"];
        var password = window.localStorage["password"];
        $.post(baseUrl+"signin", 
            {email:email, password:password}, function(res) {
                console.log("signin successful");
                console.log(res);
                $.mobile.changePage("map.html");
        });
    } else {
        console.log("no credentials found in localStorage");
    }

});

// Handles the signup page. Tries to sign up the user, and save credentials in
// local storage
$(document).on('pageinit', '#signup', function(e) {
    console.log("singup page loaded");

    $("#signup-form").submit(function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        var form = $("#signup-form");

        var email = $("#email", form).val();
        var pass = $("#password", form).val();

        console.log(email + " " + pass);

        if (email.length > 0 && pass.length > 0) {
            $.post(baseUrl+"signup", {email: email, password: pass}, function(res) {
                console.log("signup success");
                window.localStorage['email'] = email;
                window.localStorage['password'] = pass;
                window.localStorage['passwordChanged'] = "false"; // in case user later chances password
                $.mobile.changePage("map.html"); // send user to the map
            })
            .fail(function(err) {
                console.log("error");
                $(".error", form).text(err.responseJSON.errors);
            });
        } else {
            $(".error", form).text('Please enter an email and password.');
        }
        return false;
    });
});

// Handles signing in the user. On successful sign in, saves credentials in
// local storage
$(document).on('pageinit', '#signin', function(e) {
    console.log("singin page loaded");

    $("#signin-form").submit(function(e) {
        e.stopImmediatePropagation();
        e.preventDefault();

        var form = $("#signin-form");

        var email = $("#email", form).val();
        var pass = $("#password", form).val();

        console.log(email + " " + pass);

        if (email.length > 0 && pass.length > 0) {
            $.post(baseUrl+"signin", {email: email, password: pass}, function(res) {
                console.log("signin success");
                window.localStorage['email'] = email;
                window.localStorage['password'] = pass;
                window.localStorage['passwordChanged'] = "false"; // in case user later chances password
                $.mobile.changePage("map.html"); // send user to the map
            })
            .fail(function(err) {
                console.log("error");
                $(".error").text(err.responseJSON.errors);
            });
        } else {
            $(".error", form).text('Please enter an email and password.');
        }
        return false;
    });
});
