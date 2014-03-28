var ViewModel = function(init) {
    var self = this;
    self.markers = [];
    
    var showOnMap = function(position) {
        var pinColor = "EEEEEE";
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));
        var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
            new google.maps.Size(40, 37),
            new google.maps.Point(0, 0),
            new google.maps.Point(12, 35));

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
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: "You are here!",
            icon: pinImage,
            shadow: pinShadow
        });
    };

    var getDistanceFromLatLonInKm = function(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1); // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    var deg2rad = function(deg) {
        return deg * (Math.PI / 180)
    };

    var initalize = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showOnMap);
        } else {
            body.innerHTML = "Geolocation is not supported by this browser.";
        }
        infowindow = new google.maps.InfoWindow({
            content: "placeholder",
            maxWidth: 300
        });
    }
}