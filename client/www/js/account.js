// called when user navigate to me tab
var getAndShowAccountInfo = function() {
    getReq(baseUrl + "account", function (data, status) {
        window.localStorage['email'] = data.user.email;
        window.localStorage['loc'] = data.user.profile.location;
        $('#uemail').text(data.user.email);
        $('#ureviewcount').text(data.user.voted_bathrooms.length);
        $('#ulocation').text(data.user.location);
    });
};

// called when user navigates to change email page
var onUpdateEmailStart = function() {
    var input = $('#change-email');
    var form = $('#change-email-form');
    $(".error", form).hide();
    $(".error", form).text("");
    input.val(window.localStorage.email);
};

// when submitting an email change
var onUpdateEmailFinish = function(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    var form = $('#change-email-form');
    var email = $('#change-email').val();
    var formData = {
        "email": email
    };
    postReq(baseUrl + "account/profile/", formData, function() {
        // TODO display some temporary success message or toast
        console.log("succesfully changed email");
        save('email', email);
        $('#uemail').text(email);
        history.back();
    }).fail(function(err) {
        console.log("error");
        $(".error", form).text(err.responseJSON.errors);
    });
};

// called when user navigates to change location page
var onUpdateLocationStart = function() {
    var input = $('#change-loc');
    input.val(window.localStorage.loc);
    getReq(baseUrl + "account", function (data, status) {
        input.val(data.user.profile.location);
    });
};
var onUpdateLocationFinish = function(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    var form = $('#change-loc-form');
    var loc = $('#change-loc').val();
    var formData = {
        "location": loc
    };
    postReq(baseUrl + "account/profile/", formData, function() {
        // TODO display some temporary success message or toast
        console.log("succesfully changed loc");
        save('loc', loc);
        $('#ulocation').text(loc);
        history.back();
    }).fail(function(err) {
        console.log("error");
        $(".error", form).text(err.responseJSON.errors);
    });
};

var onSignout = function() {
    save('token', null);
    save('email', null);
    getReq(baseUrl + "signout");
    window.location.replace('/');
};

$('#account-page-link').click(getAndShowAccountInfo);
$('#change-email-link').click(onUpdateEmailStart);
$('#change-email-form').submit(onUpdateEmailFinish);
$('#change-loc-link').click(onUpdateLocationStart);
$('#change-loc-form').submit(onUpdateLocationFinish);
$('#signout-link').click(onSignout);