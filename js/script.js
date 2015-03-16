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


// navigational things 

	d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

// ok now these should be what - not where - the data is 
// this is an ajax call to cross-ref my data with location eventually 

d3.json("js/nursinghours.json", function(data) {

	var allNursingHours = data.dataset.row;

	var nested = {}; 

	var hoursArray


// these are what I'm looking for specifically 

$.each(allNursingHours, function(i, item) {


		if (!nested[item.est_ID]) {
			nested[item.est_ID] = {
				"id" : item.est_ID,
				"name" : item.est_name,
				"address" : item.Street+", "+item.City+", "+item.State+" "+item.zip,
				"RNtime" : item.CR/RN/Day
			}
		}

	
		nested[item.est_ID].violations.push(item);

	});

	$.each(nested, function(i, item) {
		hoursArray.push(item);
	});

	hoursArray.forEach(function(d) {
		var coord = locations[d.id];
		d.LatLng = new L.LatLng(coord.lat, coord.lon);
	});


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


