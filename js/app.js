// model part of mvvm
var setup = {
    locations: [
          {title: 'Malibu Lagoon State Beach', location: {lat: 34.0336, lng: -118.6804}, type: 'Beach'},
          {title: 'Zuma Beach', location: {lat: 34.0218, lng: -118.8312}, type: 'Beach'},
          {title: 'Malibu Creek State Park', location: {lat: 34.0980, lng: -118.7314}, type: 'Park'},
          {title: 'Solstice Canyon', location: {lat: 34.0390, lng: -118.7552}, type: 'Canyon'},
          {title: 'Escondido Falls', location: {lat: 34.0432, lng: -118.7795}, type: 'Waterfalls'},
        ],
    searchOptions: [
        {name: 'Beach'},
        {name: 'Canyon'},
        {name: 'Waterfalls'},
        {name: 'Park'}
]};
var map;
var marker;
var markers = new Array();

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 34.0259, lng: -118.7798},
          zoom: 10,
          mapTypeControl: false
        }); 
      
        
      }

    var ViewModel = function(data) {
        var self = this;
        this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < setup.locations.length; i++) {
          // Get the position from the location array.
          this.position = setup.locations[i].location;
          this.title = setup.locations[i].title;
          // Create a marker per location, and put into markers array.
          marker = new google.maps.Marker({
            position: this.position,
            map: map,
            title: this.title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            whenClicked()
          });
          bounds.extend(markers[i].position);
            }
            // Extend the boundaries of the map for each marker
            map.fitBounds(bounds);
      }
      var whenClicked = function(event) {
        populateInfoWindow(this, largeInfowindow);
        google.maps.Animation.BOUNCE
      }
      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('insert request');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick',function(){
            infowindow.setMarker = null;
          });
        }
};

ko.applyBindings(new ViewModel(setup));
