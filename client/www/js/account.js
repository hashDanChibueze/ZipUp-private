var baseUrl = "http://z-api.herokuapp.com/";
var getAndShowAccountInfo = function() {
    $.get(baseUrl + "account", function (data, status) {
        $('#account #email').html = data.user.email;
        $('#account #reviewcount').html = "Not implemented";
        $('#account #location').html = data.user.location;
    })
};