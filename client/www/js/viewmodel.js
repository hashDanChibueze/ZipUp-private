var ViewModel = function(init) {
    console.log("in view model");
    var self = this;
    self.markers = [];
    self.position = null;

    // navigator.geolocation.getCurrentPosition(function(p) {
    //     self.initialCoordinates.lat = p.coords.latitude;
    //     self.initialCoordinates.lng = p.coords.longitude
    // });

    // self.initialCoordinates = ko.observable({
    //     lat: ko.observable(position.coords.latitude),
    //     lng: ko.observable(position.coords.longitude)
    // });
    //self.initialCoordinates = ko.observable();
    self.infowindow = null;
    // var getBathrooms = function() {
    //     $.get("/getallnear/" + self.position.coords.latitude + "," + self.position.coords.longitude,
    //         function (data, status) {

    //         for (var i = 0; i < data.bathrooms.length; i++) {

    //           if (data.bathrooms[i]["loc"] != undefined) {
    //             console.log("creating bathroom: " + data.bathrooms[i]["name"]);
    //             var lat = data.bathrooms[i].location.lat;
    //             var lng = data.bathrooms[i].location.lng;
    //             var name = data.bathrooms[i].name;
    //             var genderNum = data.bathrooms[i].gender;
    //             var gender;
    //             var typeNum = data.bathrooms[i].access;
    //             var type;
    //             var b_id = data.bathrooms[i]._id;
    //             if (genderNum == 0) {
    //               gender = "Men's";
    //             } else if (genderNum == 1) {
    //               gender = "Women's";
    //             } else {
    //               gender = "Unisex";
    //             }
    //             if (typeNum == 0) {
    //               type = "Public";
    //             } else if (typeNum == 1) {
    //               type = "Private";
    //             } else {
    //               type = "Customers Only";
    //             }
    //             var newBathPos = new google.maps.LatLng(lat, lng);
    //             var nearby = new google.maps.Marker({
    //                 position: newBathPos,
    //                 map: self.map,
    //                 title: name
    //             });
    //             var contentString = '<div class="content">' +
    //                 '<h3 class="firstHeading">' + name + '</h3>' +
    //                 '<div id="bodyContent">' +
    //                 '<p>Gender: ' + gender + '<br/>' + /* Put restroom specific information in this message*/
    //                 'Type: ' + type + '</p></div></div>';
    //             nearby.html = contentString;
    //             nearby.b_id = b_id;
    //             nearby.b_data = data.bathrooms[i];
    //             self.markers.push(nearby);
                
    //           }
    //         }
    //     });
    // };

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
    //     self.position = position;
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
    //     getBathrooms();
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
    // initalize();

}
