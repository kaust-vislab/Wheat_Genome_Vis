
// the canvas dimensions
var width = 960,
    height = 960;

// functions to map screen coordinates to lat,long
var λ = d3.scale.linear()
    .domain([0, width])
    .range([-180, 180]);

var φ = d3.scale.linear()
    .domain([0, height])
    .range([90, -90]);


// var projection = d3.geo.mercator()
var projection = d3.geo.orthographic()
    .scale(450)
    .rotate([λ(0), φ(0)])
    .clipAngle(90)
    .translate([width / 2, height / 2])
    .precision(0.1);


var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);

svg.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");

svg.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

// now let's load the countries and draw them.
d3.json("data/world-110m.json", function(error, world) {
  if (error) throw error;

  svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);
});


// now load the edges represented by geojson
var edges = svg.append("g")
            .attr("class", "edges");
var edges_data = [];
var filtered_features = [];

var filter_edges_data = function(datapoints){
  return datapoints.filter(function(d){
    if(show_aerial_links){
      return d.properties.bray_distance < bray_threshold;
    }
    else{
      return (d.properties.src_category!=d.properties.dest_category)
      && (d.properties.bray_distance < bray_threshold);
    }
  });
};

var draw_edges = function(datapoints){

  edges.selectAll("path").remove();
  edges.selectAll("path")
            .data(datapoints)
            .enter()
            .append("path")
            .attr("stroke", function(d){
              return d.properties.src_category == d.properties.dest_category?"#1b9e77":"#7570b3";
            })
            .attr("stroke-opacity", function(d){
              return d.properties.src_category == d.properties.dest_category?"0.5":"0.8";
            })
            .attr("stroke-width", function(d){
              return d.properties.src_category == d.properties.dest_category?"1.0":"1.8";
            })
            .attr("d", path);
};

d3.json("data/bray_edges.geojson", function(error, datapoints) {
  if(error) throw error;

  // remove SEAWATER <--> SEAWATER edges
  edges_data = datapoints.features.filter(function(d){
      return (d.properties.src_category != "SEAWATER" || d.properties.dest_category != "SEAWATER");
  });

  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
});

// let's load the vertices from a geojson file
var locations = svg.append("g");
d3.json("data/sampledata.geojson", function(error, datapoints) {
  if(error) throw error;
  // console.log(datapoints);

  locations.selectAll("path")
            .data(datapoints.features)
            .enter()
            .append("path")
            .attr("fill", function(d){
              return d.properties.Category=="AIR"?"#5D5D5F":"#2F6CD4";
            })
            .attr("stroke", "#434344")
            .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");


// and now for fancy mouse interaction
var p1=0;
var p2=0;
var drag = d3.behavior.drag()
  .on("drag", function() {
    p1 += d3.event.dx;
    p2 += d3.event.dy;
    projection.rotate([λ(p1), φ(p2)]);
    svg.selectAll("path").attr("d", path);
});
svg.call(drag);


//controls events

//unfortunately, we have to keep track of global state
var show_aerial_links = true;
var bray_threshold = 0.65;

$('#aerial').change(function() {
  // console.log($("#aerial").prop('checked'));
  show_aerial_links = $("#aerial").prop('checked');
  $("#apply").prop('disabled', false);
})


$("#braySlider").on("slide", function(slideEvt) {
	// console.log(slideEvt.value);
  bray_threshold = slideEvt.value;
  $("#apply").prop('disabled', false);
});

$("#apply").on("click", function(){
  // console.log("Clicked Apply!");
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);

  $("#apply").prop('disabled', true);
});
