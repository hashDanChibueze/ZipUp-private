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
var getBathrooms = function() {
    $.get(baseUrl + "getallnear/?lat=" + self.position.coords.latitude + "&lng=" + self.position.coords.longitude,
        function (data, status) {

        for (var i = 0; i < data.bathrooms.length; i++) {

          if (data.bathrooms[i]["loc"] != undefined) {
            console.log("creating bathroom: " + data.bathrooms[i]["name"]);
            var lat = data.bathrooms[i].location.lat;
            var lng = data.bathrooms[i].location.lng;
            var name = data.bathrooms[i].name;
            var genderNum = data.bathrooms[i].gender;
            var gender;
            var typeNum = data.bathrooms[i].access;
            var type;
            var b_id = data.bathrooms[i]._id;
            if (genderNum == 0) {
              gender = "Men's";
            } else if (genderNum == 1) {
              gender = "Women's";
            } else {
              gender = "Unisex";
            }
            if (typeNum == 0) {
              type = "Public";
            } else if (typeNum == 1) {
              type = "Private";
            } else {
              type = "Customers Only";
            }
            var newBathPos = new google.maps.LatLng(lat, lng);
            var nearby = new google.maps.Marker({
                position: newBathPos,
                map: self.map,
                title: name
            });
            var contentString = '<div class="content">' +
                '<h3 class="firstHeading">' + name + '</h3>' +
                '<div id="bodyContent">' +
                '<p>Gender: ' + gender + '<br/>' + /* Put restroom specific information in this message*/
                'Type: ' + type + '</p></div></div>';
            nearby.html = contentString;
            nearby.b_id = b_id;
            nearby.b_data = data.bathrooms[i];
            self.markers.push(nearby);
            
          }
        }
    });
};