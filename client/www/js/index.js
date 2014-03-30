var app = {
    // Application Constructor
    initialize: function() {
        //this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        console.log("binding");
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
            console.log("on device");
            document.addEventListener("deviceready", this.onDeviceReady, true);
        } else {
            console.log("on desktop");
            $(document).ready(this.onDeviceReady);
        }
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log("in onDeviceReady");
        //navigator.geolocation.getCurrentPosition(showOnMap);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) { // I didn't really use this, yet I left it in here as it's in the demo
        
    }
};


var viewModel = new ViewModel();

$(document).ready(function () {
    console.log("applying bindings");
    ko.applyBindings(viewModel);
});
