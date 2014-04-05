var baseUrl = "http://z-api.herokuapp.com/";

// TODO make this be called when user navigate to me tab
var getAndShowAccountInfo = function() {
    $.get(baseUrl + "account", function (data, status) {
        $('#account #email').html = data.user.email;
        $('#account #reviewcount').html = "Not implemented";
        $('#account #location').html = data.user.location;
    })
};

// TODO make this be called
var onUpdateProfileClick = function() {
    // TODO make this local information shouldn't have to perform a request
    $.get(baseUrl + "account", function (data, status) {
        // if success
        $('#update-email').val(data.user.email);
        //$('#update-name').val(data.user.profile.name);
    });
};

// when submitting an email change
var onUpdateEmail = function(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    var form = $('#change-profile-form');
    var email = $('#update-email').val();
    var formData = {
        "email": email
    };
    $.post(baseUrl + "account/profile/", formData, function() {
        // TODO display some temporary success message or toast
        console.log("succesfully changed email");
        window.location.href = "map.html#account-page";
    }).fail(function(err) {
        console.log("error");
        $(".error", form).text(err.responseJSON.errors);
    });
};

// When submitting multiple changed values at once
var onSubmitProfileUpdate = function() {
    var email = $('#update-email').val();
    var password = $('#update-password').val();
    var name = $('#update-name').val();
    var location = $('#update-location').val();
    var formData = {
        "email": email,
        "name": name,
        "location": location
    };
    if (email || name) {
        $.ajax({
            type: "POST",
            url: baseUrl + "account/profile/",
            data: formData,
            success: function() {
                // say success
            }
        });
    }
    if (password) {
        $.ajax({
            type: "POST",
            url: baseUrl + "account/password/",
            data: {"password": password},
            success: function() {
                // say success
            }
        });
    }
};
var onSignout = function() {
    window.localStorage['email'] = null;
    window.localStorage['password'] = null;
    window.location.href = "/";
};

$('#account-page-link').click(getAndShowAccountInfo);
$('#update-profile-link').click(onUpdateProfileClick);
$('#change-profile-form').submit(onUpdateEmail);
$('#signout-link').click(onSignout);