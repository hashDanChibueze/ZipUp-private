var app = {
    server : 'http://z-api.herokuapp.com',
    //uuid : window.device.uuid,
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        //document.addEventListener('deviceready', this.onDeviceReady, false);
        $(document).ready(app.onDeviceReady);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};

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
    self.map = new google.maps.Map(document.getElementById("map_canvas"),
        mapOptions);
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: self.map,
        title: "You are here!",
        icon: pinImage,
        shadow: pinShadow
    });
};

ko.bindingHandlers.map = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        console.log("in the binding");
        navigator.geolocation.getCurrentPosition(showOnMap);

        // var mapObj = ko.utils.unwrapObservable(valueAccessor());
        // console.log(mapObj);
        // var latLng = new google.maps.LatLng(
        //     ko.utils.unwrapObservable(mapObj.lat),
        //     ko.utils.unwrapObservable(mapObj.lng));
        // var mapOptions = { center: latLng,
        //                   zoom: 17, 
        //                   mapTypeId: google.maps.MapTypeId.ROADMAP};
        
        // mapObj.googleMap = new google.maps.Map(element, mapOptions);
        
        // mapObj.marker = new google.maps.Marker({
        //     map: mapObj.googleMap,
        //     position: latLng,
        //     title: "You Are Here",
        //     draggable: true
        // });     
        
        // mapObj.onChangedCoord = function(newValue) {
        //     var latLng = new google.maps.LatLng(
        //         ko.utils.unwrapObservable(mapObj.lat),
        //         ko.utils.unwrapObservable(mapObj.lng));
        //     mapObj.googleMap.setCenter(latLng);                 
        // };
        
        // mapObj.onMarkerMoved = function(dragEnd) {
        //     var latLng = mapObj.marker.getPosition();
        //     mapObj.lat(latLng.lat());
        //     mapObj.lng(latLng.lng());
        // };
        
        // mapObj.lat.subscribe(mapObj.onChangedCoord);
        // mapObj.lng.subscribe(mapObj.onChangedCoord);  
        
        // google.maps.event.addListener(mapObj.marker, 'dragend', mapObj.onMarkerMoved);
        
        // $("#" + element.getAttribute("id")).data("mapObj",mapObj);
    }
};
var viewModel = new ViewModel();

$(document).ready(function () {
    console.log("applying bindings");
    ko.applyBindings(viewModel);
});
