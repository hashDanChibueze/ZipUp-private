var app = {
    viewModel : null,
    server : 'http://z-api.herokuapp.com',
    uuid : window.device.uuid,
    map : null,
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
        app.uuid = window.device.uuid;
        app.viewModel = new ViewModel();
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};
