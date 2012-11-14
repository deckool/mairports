/* GOOGLE MAPS setup */
var mapOptions = {
    center : new google.maps.LatLng(45.4153, 25.3137),
    zoom : 6,
    mapTypeId : google.maps.MapTypeId.ROADMAP
};
var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

var infowindow = new google.maps.InfoWindow({
});

var image = 'tower.png';

/* list of countries and coords. */
var countries = [];
var coords = {};
var markers = [];

/* fetch JSON file */
$.getJSON("airports.json", function(airportsdb) {
    /* for all airports found in airportsdb */
    $.each(airportsdb.posts, function(i, data) {

        /* current airport country was not found in
         * our list of countries */
        if (countries.indexOf(data.country) == -1) {
            /* add to countries list */
            countries.push(data.country);
            /* makes an object in the coords list. 
             * format: coords['Romania']['lat'] / coords['Romania']['long']) */
            coords[data.country] = {
                'lat' : data.lat,
                'long' : data.long
            };
        }

        /* GOOGLE MAPS markers & popups setup */

        /* HTML code for popups */
        var contentString = "<div class='element '><h1>" + data.icao + "</h1><p>City: " + data.city + "</p><p>DST: " + data.dst + " </p><p>Timezone: " + data.tzone + "</p><p>Country: " + data.country + "</p><p>Lat/Long: " + data.lat + " | " + data.long + "</p></div>";

        /* exclude airports without icao codes (coordinates are wrong) */
		if (data.icao !== 'NUI') {
		  var marker = new google.maps.Marker({
			  position: new google.maps.LatLng(data.lat, data.long),
			  map: map,
			  title:data.icao,
			  icon: image
		  });
		  google.maps.event.addListener(marker, 'click', function() {
		        /* there's only one infoWindow, change the contents for the current marker */
		        infowindow.setContent(contentString);
		  		infowindow.open(map,marker);
		  });
		  /* send formed markers to var markers */
		  markers.push(marker);
		  }
    });

    var markerCluster = new MarkerClusterer(map, markers);

    /* by now the countries list is filled, add all countries to the dropdown */
    populateCountries();

});

/* populate the #countries dropdown
 * with options */

function populateCountries() {

    /* make a fragment of HTML code containing
     * all the countries as <OPTION> tags */
    var fragment = '';
    $.each(countries.sort(), function(key, country) {
        fragment += '<option value="' + country + '">' + country + '</option>';
    });

    /* insert the HTML fragment in the DOM */
    $('#countries').append(fragment);

    /* watches the #countries dropwdon, when the
     country changes, fires the map to the new selected country coords. */
    $('#countries').change(function() {
        /* the name of the current country from the dropdown*/
        var country = $('#countries').val();
        /* moves map to the new coords. */
        map.setCenter(new google.maps.LatLng(coords[country]['lat'], coords[country]['long']));
    });
}
