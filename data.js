			var mapOptions = {
				  center: new google.maps.LatLng(45.4153, 25.3137),
				  zoom: 6,
				  mapTypeId: google.maps.MapTypeId.ROADMAP
				};
			var map = new google.maps.Map(document.getElementById("map_canvas"),
					mapOptions);
					
$('#countries').change(function(){
	var country = $('#countries').val();
    map.setCenter(new google.maps.LatLng(coords[country]['lat'], coords[country]['long']));
});

			var image = 'tower.png';
			var countries = [];
			var coords = {};
                  
			 $.getJSON("airports.json", function(airportsdb) {
                    $.each(airportsdb.posts, function(i, data) {                    
		                if (countries.indexOf(data.country) == -1){
		                	countries.push(data.country);
		                	coords[data.country] = {
		                							'lat':data.lat, 
		                							'long':data.long
		              		};
		                }
						var contentString = "<div class='element '><h1>" + data.icao + "</h1><p>City: " + data.city + "</p><p>DST: " + data.dst + " </p><p>Timezone: " + data.tzone + "</p><p>Country: " + data.country + "</p><p>Lat/Long: " + data.lat + " | " + data.long + "</p></div>";
						var infowindow = new google.maps.InfoWindow({
							content: contentString
						});
						  var marker = new google.maps.Marker({
							  position: new google.maps.LatLng(data.lat, data.long),
							  map: map,
							  title:data.icao,
							  icon: image
						  });
						  google.maps.event.addListener(marker, 'click', function() {
						  		infowindow.open(map,marker);
						  });
                    });                   
                   countries.sort();
                    var fragment = '';
					$.each(countries, function(key, country){
						fragment += '<option value="'+country+'">'+country+'</option>';
					});
					$('#countries').append(fragment);
                });
