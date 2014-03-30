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
        $('#update-name').val(data.user.profile.name);
    });
};


// TODO make this be called when submit button is pressed on update profile
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
$('#account-page-link').click(getAndShowAccountInfo);
$('#update-profile-link').click(onUpdateProfileClick);
$('#update-submit').click(onSubmitProfileUpdate);