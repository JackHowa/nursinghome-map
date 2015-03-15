// this is the center of MO 
var center = [38.524170, -92.557949] 


// init map for chart div 
var map = L.map('chart').setView(center, 7);

// sets up open street map 
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Initialize the SVG layer 

	map._initPathRoot()    

// We simply pick up the SVG from the map object

	var svg = d3.select("#chart").select("svg"),
	g = svg.append("g");

// these are where the nursing homes are, in order 
// need to append info to them

	d3.json("js/hack-location.json", function(collection) {
		/* Add a LatLng object to each item in the dataset */
		collection.objects.forEach(function(d) {
			d.LatLng = new L.LatLng(d.circle.coordinates[0],
									d.circle.coordinates[1])
		})

		var feature = g.selectAll("circle")
			.data(collection.objects)
			.enter().append("circle")
			.style("stroke", "black")  
			.style("opacity", .6) 
			.style("fill", "red")
			.attr("r", 5);  

// ok so we know where the nursing homes are ... 

		





// these update on re-zoom 

		map.on("viewreset", update);
		update();

		function update() {
			feature.attr("transform", 
			function(d) { 
				return "translate("+ 
					map.latLngToLayerPoint(d.LatLng).x +","+ 
					map.latLngToLayerPoint(d.LatLng).y +")";
				}
			)
		}
	})		


