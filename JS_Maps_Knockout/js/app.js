// model part of mvvm
var setup = {
    locations: [
          {title: 'Malibu Lagoon State Beach', 
          location: {lat: 34.0336, lng: -118.6804}, 
          type: 'Beach'},

          {title: 'Zuma Beach', 
          location: {lat: 34.0218, lng: -118.8312}, 
          type: 'Beach'},

          {title: 'Malibu Creek State Park', 
          location: {lat: 34.0980, lng: -118.7314}, 
          type: 'Park'},

          {title: 'Solstice Canyon', 
          location: {lat: 34.0390, lng: -118.7552}, 
          type: 'Canyon'},

          {title: 'Santa Monica Mountains', 
          location: {lat: 34.1203, lng: -118.9318}, 
          type: 'Mountains'},
        ]
};

// initialize map, marker, markers
var map;
var marker;
var markers = new Array();

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 34.0259, lng: -118.7798},
          zoom: 10,
          mapTypeControl: false
        }); 
      
        //maps api will be loaded before viewmodel loads
        google.maps.event.addListenerOnce(map, 'idle', function(){  
        ko.applyBindings(new ViewModel(setup));
})
};

//viewmodel starts here
var ViewModel = function(data) {
    var self = this;
    //google maps error handling
    if (map == null) {
        error = ko.observable(true);
    } else {
        error = ko.observable(false);
    }
    var largeInfoWindow = new google.maps.InfoWindow();
    for (var i = 0; i < setup.locations.length; i++) {
      // Get the position from the location array.
      this.position = setup.locations[i].location;
      this.title = setup.locations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: this.position,
        map: map,
        title: this.title,
        animation: google.maps.Animation.DROP,
        type: setup.locations[i].type,
        id: i
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open an infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfoWindow)
      });
        };
  // Populate infowindow with wikipedia ajax request, follows udacity course code
    function populateInfoWindow(marker, infowindow) {
        var self = this;
        marker.setAnimation(google.maps.Animation.BOUNCE)
        setTimeout(function(){ marker.setAnimation(null); }, 750);
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            var content = "<h4>Wikipedia links</h4>";
            //Wikipedia request from Udacity course, 
            //changed a little bit to add more details
            var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' 
                        + marker.title + '&format=json&callback=wikiCallback';
            var wikiRequestTimeout = setTimeout(function(){
                infowindow.setContent("failed to get wikipedia resources"); //error handling
            }, 1000);
            $.ajax({
                url: wikiUrl,
                dataType: "jsonp",
                jsonp: "callback",
                success: function(  response  ){
                    var articleList = response[1];
                    for (var i = 0; i < articleList.length; i++) {
                        articleStr = articleList[i];
                        url = 'http://en.wikipedia.org/wiki/' + articleStr;
                        //prints url and the first few words for readers
                        content += '<li><a href="' + url + '">'
                                 + articleStr + '</a></li>' + response[2] + '...'  
                        infowindow.setContent(content);
                    };
                        //does not allow error to show
                        clearTimeout(wikiRequestTimeout);
                    }
                });
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick',function(){
                infowindow.setMarker = null;
            });
        }};

    //search options
    options = ko.observableArray([
            'None',
            'Beach',
            'Park',
            'Mountains',
            'Canyon'
        ]);

    //https://jsfiddle.net/pkysylevych/tfAJy/ for inspiration on purely set-up 
    //array for list elements to show
    self.markersList =  ko.observableArray();
    //value for dropdown initialized at None
    self.selectedType = ko.observable("None");
    //filter function and list view
    self.filteredAction = ko.computed(function() {
        if (self.selectedType() == "None") { 
            self.markersList([]); //resets markers list to empty to filter
            for (var i = 0; i < markers.length; i++) {
                self.markersList.push(markers[i]);
                markers[i].setVisible(true)
        } 
        }
        else {
            self.markersList([]); //resets markers list to empty to filter
            len = markers.length
            for (var i = 0; i < len; i++) {
                markers[i].setVisible(false);
                if (self.selectedType() == markers[i].type) {
                    //become visible if they are the right type
                    markers[i].setVisible(true); 
                    self.markersList.push(markers[i]) //correct type get displayed
                }
        }
        }
    })

    //bounce and open infowindow when list view is clicked
    self.listOpenWindow = function(title) {
        populateInfoWindow(title, largeInfoWindow)
         
    }


};


