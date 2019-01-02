// model part of mvvm
var setup = {
    locations: [
          {title: 'Malibu Lagoon State Beach', location: {lat: 34.0336, lng: -118.6804}, type: 'Beach'},
          {title: 'Zuma Beach', location: {lat: 34.0218, lng: -118.8312}, type: 'Beach'},
          {title: 'Malibu Creek State Park', location: {lat: 34.0980, lng: -118.7314}, type: 'Park'},
          {title: 'Solstice Canyon', location: {lat: 34.0390, lng: -118.7552}, type: 'Canyon'},
          {title: 'Santa Monica Mountains', location: {lat: 34.1203, lng: -118.9318}, type: 'Mountains'},
        ]
};
var map;
var marker;
var markers = new Array();

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 34.0259, lng: -118.7798},
          zoom: 10,
          mapTypeControl: false
        }); 
      
        google.maps.event.addListenerOnce(map, 'idle', function(){  //maps api will be loaded before viewmodel loads
        ko.applyBindings(new ViewModel(setup));
})
};
    var ViewModel = function(data) {
        var self = this;
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
        
      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
        function populateInfoWindow(marker, infowindow) {
            var self = this;
            marker.setAnimation(google.maps.Animation.BOUNCE)
            setTimeout(function(){ marker.setAnimation(null); }, 750);
            // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                infowindow.marker = marker;
                var content = "<h4>Wikipedia links</h4>";
                //Wikipedia request from Udacity course, changed a little bit to add more details
                var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
                var wikiRequestTimeout = setTimeout(function(){
                    infowindow.setContent("failed to get wikipedia resources"); //error handling
                }, 600);
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
                            content += '<li><a href="' + url + '">' + articleStr + '</a></li>' + response[2] + '...'  
                            infowindow.setContent(content);
                        };
                            clearTimeout(wikiRequestTimeout);
                        }
                    });
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick',function(){
                    infowindow.setMarker = null;
                    });
            }};

        //function for the list of locations and filter function
        //search options
        options = ko.observableArray([
                {type: 'None'},
                {type: 'Beach'},
                {type: 'Park'},
                {type: 'Mountains'},
                {type: 'Canyon'}
            ]);
        
        self.markersList =  ko.observableArray();
        self.selectedType = ko.observable('None');
        self.filteredAction = ko.computed(function() {
            if (self.selectedType() == "None") {
                self.markersList = ko.observableArray(markers);
                return self.markersList()
            }
            else {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setVisible(false);
                    if (self.selectedType() == markers[i].type) {
                        markers[i].setVisible(true);
                        self.markersList.push(markers[i])
                    return markers
                    return self.markersList()
                    }
            }
            }
        })
        console.log(self.selectedType())

        //bounce and open infowindow when list view is clicked
        listOpenWindow = function() {
            console.log(this)
            for (var i = 0; i < markers.length; i++) {
            if (markers[i].title == this) {
                populateInfoWindow(markers[i], largeInfoWindow)
            }
           } 
        }
        



};


