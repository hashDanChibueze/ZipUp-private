var baseUrl = "http://z-api.herokuapp.com/";

$(document).bind("mobileinit", function() {
    console.log("in mobileinit");
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
});

$(document).ajaxStart(function() {
    console.log("in loading animation");
    $.mobile.loading('show', {
        text: "Signing up..."
    });
});

$(document).ajaxStop(function() {
    console.log("in stop animation");
    $.mobile.loading('hide');
});

// Show the main map with user's position and bathrooms close to the user
$(document).on('pageinit', '#main-app', function() {
    console.log("map page loaded");
    // $("#map-page").click();
    navigator.geolocation.getCurrentPosition(showOnMap);
});


// Draws a marker with the passed position on a map
var showOnMap = function(position) {
    console.log("showing map");
    var pinColor = "EEEEEE";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34));

    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var myLatlng = new google.maps.LatLng(latitude, longitude);
    var location = latitude + "," + longitude;
    var mapOptions = {
        center: myLatlng,
        zoom: 17
    };
    map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);

    var infowindow = new google.maps.InfoWindow({
        content: 'You are here!'
    });
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: pinImage
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
    });
};
