var ViewModel = function(init) {
    var self = this;
    self.markers = [];
    self.mapOne = ko.observable({
        lat: ko.observable(12.24),
        lng: ko.observable(24.54)
    });
    self.infowindow = null;

    
    // var showOnMap = function(position) {
    //     var pinColor = "EEEEEE";
    //     var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
    //         new google.maps.Size(21, 34),
    //         new google.maps.Point(0, 0),
    //         new google.maps.Point(10, 34));
    //     var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
    //         new google.maps.Size(40, 37),
    //         new google.maps.Point(0, 0),
    //         new google.maps.Point(12, 35));

    //     var latitude = position.coords.latitude;
    //     var longitude = position.coords.longitude;
    //     var myLatlng = new google.maps.LatLng(latitude, longitude);
    //     var location = latitude + "," + longitude;
    //     var mapOptions = {
    //         center: myLatlng,
    //         zoom: 17
    //     };
    //     self.map = new google.maps.Map(document.getElementById("map_canvas"),
    //         mapOptions);
    //     var marker = new google.maps.Marker({
    //         position: myLatlng,
    //         map: self.map,
    //         title: "You are here!",
    //         icon: pinImage,
    //         shadow: pinShadow
    //     });
    // };

    // var initalize = function() {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(showOnMap);
    //     } else {
    //         body.innerHTML = "Geolocation is not supported by this browser.";
    //     }
    //     self.infowindow = new google.maps.InfoWindow({
    //         content: "placeholder",
    //         maxWidth: 300
    //     });
    // };

}