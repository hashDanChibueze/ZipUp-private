// sorry about global variables cannot think of how to do this better atm
// TODO fix global variables
var addMarker;
var addListener;
// Initalizes an event listener for dropping pins
var addInit = function () {
    if (!addListener) {
        var addinfowindow = new google.maps.InfoWindow();
        // TODO clean up content (simpler way to make the button?)
        var content = '<div class="content">' +
            '<h3 class="firstHeading">Are you sure?</h3>' +
            '<div id="bodyContent">' +
            "<a href='#add-details-page' data-role='button' data-transition='slide' style='text-decoration:none;'><button style='color: green;' class=' ui-btn ui-icon-arrow-r ui-btn-icon-left ui-shadow ui-corner-all green' data-icon='arrow-r'>Yes</button></a>" + '</div></div>'
        addinfowindow.setContent(content);
        addListener = google.maps.event.addListener(map, "click", function (event) {
            var lat = event.latLng.lat();
            var lng = event.latLng.lng();
            if (addMarker) {
                addMarker.setMap(null);
            }
            addMarker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                title: "Selected",
            });
            addinfowindow.open(map, addMarker);
        });
    }
};

// removes the pin dropping listener for the add page
var addDeInit = function () {
    if (addMarker) {
        addMarker.setMap(null);
    }
    google.maps.event.removeListener(addListener);
    addListener = null;
};

$('#add-page-link').click(addInit);
$('#map-page-link').click(addDeInit);
$('#add-form').submit(function (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    var form = $("#add-form");
    var bathroom_name = $('#add-name', form).val();
    var bathroom_access = $('input[name="access"]:checked').val();
    var gender = $('input[name="gender"]:checked').val();
    var voteDir = $('input[name="rating"]:checked').val();
    
    var postData = {
        "lat": addMarker.getPosition().lat(),
        "lng": addMarker.getPosition().lng(),
        "bathroom_name": bathroom_name,
        "bathroom_access": bathroom_access,
        "gender": gender,
        "voteDir": voteDir
    };

    console.log(postData);

    if (true) { // TODO validate input
        $.post(baseUrl+"addbathroom", postData, function(res) {
            console.log("addbathroom success");
            //$.mobile.changePage("map.html"); // TODO go back to add tab
        })
        .fail(function(err) {
            console.log("error");
            $(".error", form).text(err.responseJSON.errors);
        });
    } else {
        $(".error", form).text('Whoops, looks like you missed something!');
    }
    return false;
});