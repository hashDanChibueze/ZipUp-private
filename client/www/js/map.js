var baseUrl = "http://z-api.herokuapp.com/";
var map; // global for use in add.js may need to refactor
var bathInfoWindow; // singleton
var BIDSet;
var API_KEY = "AIzaSyA_3-FTpr5X41YFGR-xFHVZMbjcU-BJp1Q"; // google maps api key (jeff's acc)
var currentBID;

function getReq(url, success) {
    return $.ajax({
        url: url,
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('access', window.localStorage.token)},
        success: success
    });
}
function postReq(url, data, success) {
    return $.ajax({
        url: url,
        type: "POST",
        data: data,
        beforeSend: function(xhr){xhr.setRequestHeader('access', window.localStorage.token)},
        success: success
    });
}

$(document).bind("mobileinit", function() {
    console.log("in mobileinit");
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
});

$(document).ajaxStart(function() {
    // console.log("in loading animation");
    $.mobile.loading('show', {
        text: "Fetching..."
    });
});

$(document).ajaxStop(function() {
    // console.log("in stop animation");
    $.mobile.loading('hide');
});

// Show the main map with user's position and bathrooms close to the user
$(document).on('pageinit', '#main-app', function() {
    console.log("map page loaded");
    $('#loading').hide();
    $('#content').show();
    BIDSet = new MiniSet();
    bathInfoWindow = new google.maps.InfoWindow();
    // $("#map-page").click();
    navigator.geolocation.getCurrentPosition(showOnMap);
    $('#map-page-link').click(function() {
        if ($('#account-page-link').hasClass("ui-state-persist")) {
            google.maps.event.trigger(map, 'resize');
        }
        $('#header ul li a').removeClass("ui-state-persist");
        $('#map-page-link').addClass("ui-state-persist");
        $('#toast').hide();
    });
    $('#add-page-link').click(function() {
        if ($('#account-page-link').hasClass("ui-state-persist")) {
            google.maps.event.trigger(map, 'resize');
        }
        $('#header ul li a').removeClass("ui-state-persist");
        $('#add-page-link').addClass("ui-state-persist");
        toast("Click on the map to add a bathroom");
    });
    $('#account-page-link').click(function() {
        $('#header ul li a').removeClass("ui-state-persist");
        $('#account-page-link').addClass("ui-state-persist");
    });
    $('#toast').hide();
    $('#uemail').text(window.localStorage.email); // set user email on account page
    if (window.localStorage.loc) {
        $('#ulocation').text(window.localStorage.loc);
    }
    $('#change-email').val(window.localStorage.email); // set user email on change email page
});
$(document).bind('pagechange', '#main-app', function (event, data) {
    if (data.toPage[0].id == 'main-app') {
        google.maps.event.trigger(map, 'resize'); // prevent greyboxes
    }
});

// Draws a marker with the passed position on a map
var showOnMap = function(position) {
    console.log("showing map");
    var pinColor = "EEEEEE";
    var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" +
        pinColor,
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
        //streetViewControl: false,
        panControl: false,
        zoom: 17,
        tilt: 45,
        
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

    google.maps.event.addListener(map, "idle", function (event) {
            //console.log("idle");
            getBathrooms(map.getCenter(), map);
        });

    getBathrooms(myLatlng, map);
};

// gets all bathrooms near LatLng position and displays them to map
var getBathrooms = function(LatLng, map) {
    //console.log("getting nearby bathrooms");
    getReq(baseUrl+"getallnear/"+LatLng.lat()+","+LatLng.lng(),
        function (data, status) {
            
            var marker;

            for (var i = 0; i < data.bathrooms.length; i++) {
                var currentB = data.bathrooms[i];
                var b_id = currentB._id;
                if (currentB["location"] != undefined && !BIDSet.has(b_id)) {
                    var name = currentB.name;
                    console.log("creating bathroom: " + name);
                    BIDSet.add(b_id);

                    // get details about each bathroom
                    var lat = currentB.location.lat;
                    var lng = currentB.location.lng;
                    var genderNum = currentB.gender;
                    var upvotes = currentB.upvotes;
                    var downvotes = currentB.downvotes;
                    var gender;
                    var typeNum = currentB.access;
                    var type;
                    
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
                        //animation: google.maps.Animation.DROP
                    });
                    var netVotes = upvotes - downvotes;
                    var style = "";
                    if (netVotes > 0) {
                        style = "color: green;";
                    } else if (netVotes < 0) {
                        style = "color: red;";
                    }
                    var content = '<div class="content">' +
                        '<h3 class="firstHeading">' + name + '</h3>' +
                        '<div id="bodyContent">' +
                        '<p>Gender: ' + gender + '<br/>' +
                        'Rating: <span style="' +style+'">' + netVotes +
                        '</span></p>' + "<a href='#bathroom-details-page' id='add-confirm' data-theme='b' role='button' data-icon='arrow-r' class='ui-btn-inline ui-link ui-btn ui-icon-arrow-r ui-btn-icon-left ui-shadow ui-corner-all' onclick='onDetailsLoad()' style='color: #6F6F6F;' data-role='button' data-transition='slide'>Details</a></div></div>";
                    var markerClickCallback = function (marker, content, infowindow, b_id) {
                        return function() {
                            infowindow.setContent(content);
                            infowindow.open(map, marker);
                            currentBID = b_id;
                        };
                    };
                    google.maps.event.addListener(marker, 'click', markerClickCallback(marker, content, bathInfoWindow, b_id));
                }
            }
        });
};
function save (key, value) {
    window.localStorage[key] = value;
};

function toast(message) {
    $('#toast').text(message);
    $('#toast').fadeIn("slow");
    setTimeout(function(){$('#toast').fadeOut("slow")}, 2000);
};