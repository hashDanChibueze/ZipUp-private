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

ko.bindingHandlers.map = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var mapObj = ko.utils.unwrapObservable(valueAccessor());
        var latLng = new google.maps.LatLng(
            ko.utils.unwrapObservable(mapObj.lat),
            ko.utils.unwrapObservable(mapObj.lng));
        var mapOptions = { center: latLng,
                          zoom: 17, 
                          mapTypeId: google.maps.MapTypeId.ROADMAP};
        
        mapObj.googleMap = new google.maps.Map(element, mapOptions);
        
        mapObj.marker = new google.maps.Marker({
            map: mapObj.googleMap,
            position: latLng,
            title: "You Are Here",
            draggable: true
        });     
        
        mapObj.onChangedCoord = function(newValue) {
            var latLng = new google.maps.LatLng(
                ko.utils.unwrapObservable(mapObj.lat),
                ko.utils.unwrapObservable(mapObj.lng));
            mapObj.googleMap.setCenter(latLng);                 
        };
        
        mapObj.onMarkerMoved = function(dragEnd) {
            var latLng = mapObj.marker.getPosition();
            mapObj.lat(latLng.lat());
            mapObj.lng(latLng.lng());
        };
        
        mapObj.lat.subscribe(mapObj.onChangedCoord);
        mapObj.lng.subscribe(mapObj.onChangedCoord);  
        
        google.maps.event.addListener(mapObj.marker, 'dragend', mapObj.onMarkerMoved);
        
        $("#" + element.getAttribute("id")).data("mapObj",mapObj);
    }
};
var viewModel = new ViewModel();

$(document).ready(function () {   
   ko.applyBindings(viewModel);
});