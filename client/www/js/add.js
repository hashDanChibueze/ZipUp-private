var addMarker;
var addListener;
var addInit = function () {
  if (!addListener) {
    addListener = google.maps.event.addListener(map, "click", function(event) {
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
      $('#add_lat').val(lat);
      $('#add_lon').val(lng);
    });
  }
};
var addDeInit = function () {
  if (addMarker) {
    addMarker.setMap(null);
  }
  google.maps.event.removeListener(addListener);
  addListener = null;
}
$('#add-page-link').click(addInit);
$('#map-page-link').click(addDeInit);