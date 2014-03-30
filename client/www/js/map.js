var baseUrl = "http://z-api.herokuapp.com/";

$(document).bind("mobileinit", function() {
    console.log("in mobileinit");
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
});

$(document).ajaxStart(function() {
    console.log("in loading animation");
    $.mobile.loading('show', {
        text: "Fetching..."
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
        mapTypeControl: false,
        streetViewControl: false,
        panControl: false,
        zoom: 16
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"),
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

    getBathrooms(position, map);
};

var getBathrooms = function(position, map) {
    console.log("getting nearby bathrooms");
    $.get(baseUrl+"getallnear/"+position.coords.latitude+","+position.coords.longitude, 
        function (data, status) {
            
            var infowindow = new google.maps.InfoWindow();
            var marker;

            for (var i = 0; i < data.bathrooms.length; i++) {
                var currentB = data.bathrooms[i];
                if (currentB["location"] != undefined) {
                    console.log("creating bathroom: " + data.bathrooms[i]["name"]);
                    
                    // get details about each bathroom
                    var lat = currentB.location.lat;
                    var lng = currentB.location.lng;
                    var name = currentB.name;
                    var genderNum = currentB.gender;
                    var upvotes = currentB.upvotes;
                    var downvotes = currentB.downvotes;
                    var gender;
                    var typeNum = currentB.access;
                    var type;
                    var b_id = currentB._id;

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
                    
                    marker = new google.maps.Marker({
                        position: newBathPos,
                        map: map,
                        title: name
                    });

                    var content = '<div class="content">' +
                        '<h3 class="firstHeading">' + name + '</h3>' +
                        '<div id="bodyContent">' +
                        '<p>Gender: ' + gender + '<br/>' +
                        'Upvotes: ' + upvotes + '<br/>' +
                        'Downvotes: ' + downvotes + '<br/>' +'</p></div></div>';

                    google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
                        return function() {
                            infowindow.setContent(content);
                            infowindow.open(map,marker);
                        };
                    })(marker,content,infowindow));
                }

            }
    });
};
