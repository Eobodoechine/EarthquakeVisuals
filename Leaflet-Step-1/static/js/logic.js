// Store our API endpoint inside url
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(url, function(data) {
  earthquake(data.features);
});

// Creating map object
//var myMap = L.map("map", {
  //center: [37.0902, -95.7129],
  //zoom: 5
//});

// Adding tile layer
//L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
 // attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
 // tileSize: 512,
 // maxZoom: 18,
 // zoomOffset: -1,
 // id: "mapbox/streets-v11",
 // accessToken: API_KEY
// }).addTo(myMap);


d3.json(url).then(function(response) {
  // var data = response.features[0].geometry.coordinates[0]
  // console.log(data);
  Eq(response.features);
});
function Eq(print) {
  var markers = [];

  for (var i = 0; i < print.length; i++) {
    var lat = print[i].geometry.coordinates[1]
    var lng = print[i].geometry.coordinates[0]
    var latlng = [lat,lng]
    var magnitude = print[i].properties.mag
    var depth = print[i].geometry.coordinates[2]
    var color = "";
    if (depth < 10){
      color = "lime"
    }
    else if (depth < 30) {
      color = "green"
    }
    else if (depth < 50) {
      color = "yellow"
    }
    else if (depth < 70) {
      color = "orange"
    }
    else if (depth < 90) {
      color = "red"
    }
    else {
      color = "maroon"
    }
    markers.push(
      L.circle(latlng, {
        stroke: false,
        fillOpacity: 0.5,
        color: "white",
        fillColor: color,
        radius: magnitude*11000
      }).bindPopup("<h3>" + print[i].properties.title +
          "</h3><hr><p>" + new Date(print[i].properties.time) + "</p>")
    )
  }
  console.log(markers)
  var earthquakes = L.layerGroup(markers)

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });



 // Creating map object
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 5,
  layers: [satellite]
});

myMap.addLayer(earthquakes);
function legendColor(depth){
  if (depth < 10){
    return "lime"
  }
  else if (depth < 30) {
    return "green"
  }
  else if (depth < 50) {
    return "yellow"
  }
  else if (depth < 70) {
    return "orange"
  }
  else if (depth < 90) {
    return "red"
  }
  else {
    return "maroon"
  }
}

// Create a legend to display information about our map
var legend = L.control({
  position: "bottomright",
  fillColor: "white"
});

// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  var depth = [9, 29, 49, 69, 89, 500];
  var labels = ["<10", "10-30", "30-50", "50-70", "70-90", "90+"];
  div.innerHTML = '<div>Depth (km)</div>';
  for (var i = 0; i < depth.length; i++){
    div.innerHTML += '<i style="background:' + legendColor(depth[i]) + '">&nbsp;&nbsp;&nbsp;&nbsp;</i>&nbsp;'+
                    labels[i] + '<br>';
  }
  return div;
};
// Add the legend to the map
legend.addTo(myMap);
};

