// stores url where data is stored
var myUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
// creates map
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});
// adds geographical layer to map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// function for determining color of circles by earthquake depth
function getColor(d) {
  return d > 90  ? '#BD0026' :
      d > 70  ? '#E31A1C' :
      d > 50  ? '#FC4E2A' :
      d > 30   ? '#FD8D3C' :
      d > 10   ? '#FEB24C' :
      d > -10   ? '#FED976' :
            '#FFEDA0';
}

// queries data
d3.json(myUrl, function(data) {
  // var that stores features information
  var feat = data.features;

// creates legend 
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through density intervals + generates a label with a square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i class="circle" style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

    return div;
  };
// adds legend to the map
  legend.addTo(myMap);

  // console.log(feat)
  // creates circles
  feat.forEach( function(f) {
   console.log(f.geometry.coordinates.slice(0, 2))
    // sets locations
    L.circle(f.geometry.coordinates.slice(0, 2).reverse(), {
      fillOpacity: 0.75,
      color: "black",
      // changes color based on above function
      fillColor: getColor(f.geometry.coordinates.slice(2)),
      // changes radius based on earthquake magnitude
      radius: 10000*f.properties.mag 
      // displays info when circle is clicked
    }).bindPopup("<h3>Depth: " + f.geometry.coordinates.slice(2) + "</h3> <hr> <h3>Magnitude: " + f.properties.mag + "</h3>" + "</h3> <hr> <h3>Long and Lat: " + f.geometry.coordinates.slice(0, 2) + "</h3>" ).addTo(myMap); }
);

})






