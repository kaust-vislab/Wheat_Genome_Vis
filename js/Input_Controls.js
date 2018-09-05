//controls events

//unfortunately, we have to keep track of global state

$('#airs').change(function() {
  //console.log("airs" + $("#airs").prop('checked') + " "+ $("#seas").prop('checked') );
  airsample= $("#airs").prop('checked');
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();

})

$('#seas').change(function() {
  //console.log("seas" + $("#airs").prop('checked') + " "+ $("#seas").prop('checked'));
  seasample=$("#seas").prop('checked');
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();

})

$('#check1').change(function() {
  check1= $("#check1").prop('checked');
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();
})

$('#check2').change(function() {
  check2= $("#check2").prop('checked');
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();
})

$('#check3').change(function() {
  check3= $("#check3").prop('checked');
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();
})

$('#check4').change(function() {
  check4= $("#check4").prop('checked');
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();
})

$('#check5').change(function() {
  check5= $("#check5").prop('checked');
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();
})

$('#check6').change(function() {
  check6= $("#check6").prop('checked');
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();
})

$('#check7').change(function() {
  check7= $("#check7").prop('checked');
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();
})


$('#aerial').change(function() {
  // console.log($("#aerial").prop('checked'));
  show_air_air = $("#aerial").prop('checked');
  //$("#apply").prop('disabled', false);
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();
  //piechart('analytics_chart');

})

$('#aerial2').change(function() {
  // console.log($("#aerial").prop('checked'));
  show_air_sea = $("#aerial2").prop('checked');
  //$("#apply").prop('disabled', false);
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();
})

$('#aerial3').change(function() {
  // console.log($("#aerial").prop('checked'));
  show_sea_sea = $("#aerial3").prop('checked');
  //$("#apply").prop('disabled', false);
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  draw_Legends();
})


// $("#braySlider").on("slide", function(slideEvt) {
// 	console.log(slideEvt.value);
//   bray_threshold = slideEvt.value;
//   filtered_features = filter_edges_data(edges_data);
//   draw_edges(filtered_features);
//   draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
//   draw_Legends();
// });


$('#animate_edge').change(function() {
  edge_transitions = $("#animate_edge").prop('checked');
})

$("#reset").on("click", function(){
  // console.log("Clicked Apply!");
  onProjectionChange(projection_type); 
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
});

$('#zooming').change(function() {
  var zoomstatus = $("#zooming").prop('checked');
  if(zoomstatus) enableZoom();
  else disableZoom();
  onProjectionChange(projection_type); 
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
})

$('#textbox1').change(function() {
   //console.log($('#textbox1').val())
   var str = $('#textbox1').val();
   if(str.length>0){ 
    d3.selectAll('g#nodesg').selectAll("circle") //here's how you get all the nodes
    .each(function(d,i) {
      if(this.id.length >0){ 
         if(this.id.toLowerCase().includes(str.toLowerCase())){
            //console.log(this.id + " "+ this.id.length + " "+ d.properties.Category); 
            d3.select(this).call(animateFirstStep);
          }
          else d3.select(this).transition().delay(0).duration(1).attr("r", 5 );
      } 
    });
    d3.selectAll('g#nodesg').selectAll("rect") //here's how you get all the nodes
      .each(function(d,i) {
        if(this.id.length >0){ 
           if(this.id.toLowerCase().includes(str.toLowerCase())){
              d3.select(this).call(animateFirstSteprect);
            }
            else d3.select(this).transition().delay(0).duration(1).attr('width', 10).attr('height', 10);
        } 
      });
    }//if
    else if(str.length==0){
      d3.selectAll('g#nodesg').selectAll("circle") //here's how you get all the nodes
          .each(function(d,i) {
            if(this.id.length >0)
               d3.select(this).transition().delay(0).duration(1).attr("r", 5 );
          });
      d3.selectAll('g#nodesg').selectAll("rect") //here's how you get all the nodes
            .each(function(d,i) {
              if(this.id.length >0)
                 d3.select(this).transition().delay(0).duration(1).attr('width', 10).attr('height', 10);
            });
    }
})

function animateFirstStep(path){
    path.transition()
        .delay(0)
        .duration(1000)
        .attr("r", 10)
        .each("end", function(d,i) { 
            d3.select(this).call(animateSecondStep); 
        });
};

function animateSecondStep(path){
    path.transition()
        .delay(0)
        .duration(1000)
        .attr("r", 5)
        .each("end", function(d,i) { 
            d3.select(this).call(animateFirstStep); 
        });
};

function animateFirstSteprect(path){
    path.transition()
        .delay(0)
        .duration(1000)
        .attr("width", 20)
        .attr("height", 20)
         .each("end", function(d,i) { 
            d3.select(this).call(animateSecondSteprect); 
        });
};

function animateSecondSteprect(path){
    path.transition()
        .delay(0)
        .duration(1000)
        .attr("width", 10)
        .attr("height", 10)
        .each("end", function(d,i) { 
            d3.select(this).call(animateFirstSteprect); 
        });
};

$('#nodev').on("click",function(){ 
   projection_type= $("#mySelect :selected").text();
  onProjectionChange(projection_type); 
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));

  $('#caloptions').hide();
});

$('#cal').on("click",function(){ 
   //alert("click fired" + " "+ this.value);
   $('#caloptions').show();
   showcal(); 

});

function ColorScaleChange(val){
  //console.log(val.value);
  showcal(); 
}
function OrderChange(val){
  //console.log(val.value);
  showcal(); 
}
function ProjectionChange(val) {
  projection_type= val.value;
  onProjectionChange(projection_type); 
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
}

function onProjectionChange(projectiontype){
  //d3.select("#map").empty();
  //d3.select("#map").remove();
  //svg.selectAll("g").remove();
  //svg.selectAll("*").remove();
  d3.selectAll('svg').remove();
  svg.remove();
  //svg.selectAll("*").update();


  svg0 = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", legend_height);
   draw_Legends();

  if(projectiontype == "Rectangular" ){
    //console.log("rect");
    //height=480;
     projection = d3.geo.equirectangular()
      .scale(153)
      .translate([width/2,height/4]);
  }
  else if(projectiontype == "Orthographic" ){
    //console.log("ortho");
    projection = d3.geo.orthographic()
        .scale(450)
        .rotate([λ(0), φ(0)])
        .clipAngle(90)
        .translate([width / 2, height / 2])
        .precision(0.1);
      
  }
  else if(projectiontype == "Mercator" ){
    //console.log("mer");

   projection = d3.geo.mercator()
       .scale((width - 3) / (2 * Math.PI))
       .translate([width / 2, height / 2]);
  }
  else //if(projectiontype == "Azimuthal" )
  {
   // console.log("Azimuthal");

    projection = d3.geo.azimuthalEquidistant()
       .scale(150)
       .rotate([λ(0), φ(0)])
       .clipAngle(180 - 1e-3)
       .translate([width / 2, height / 2])
       .precision(0.1);
  }

    path = d3.geo.path()
       .projection(projection);

    graticule = d3.geo.graticule();

    svg = d3.select("#map").append("svg")
       .attr("width", width)
       .attr("height", height)
       .call(zoom)
       .append("g");
   //console.log(svg);

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
         //console.log(svg);
   });

   // and now for fancy mouse interaction
   // var p1=0;
   // var p2=0;
   // var drag = d3.behavior.drag()
   //   .on("drag", function() {
   //     p1 += d3.event.dx;
   //     p2 += d3.event.dy;
   //     projection.rotate([λ(p1), φ(p2)]);
   //     svg.selectAll("path").attr("d", path);
   // });
   // svg.call(drag);
 
}

var timeout, timeout2;
var envtypes = ['Name Asc', 'Name Des', 'Color', 'Environment']; 
var coltypes =['Red', 'Green', 'Blue', ]


$('#animate_view').change(function() {
  if($("#animate_view").prop('checked')){
      timeout = setTimeout(function() {
  d3.select("input[value=\"calendar\"]").property("checked", true).each(change); }, 6000);

function change() {
 //console.log(this.value+ " "+ timeout);
  if (this.value === "calendar"){
    timeout2 = setTimeout(function() {
  d3.select("input[value=\"map\"]").property("checked", true).each(change); }, 16000);
  $('#caloptions').show();

  d3.select("#orderby").property( "value",  envtypes[Math.floor(Math.random() * envtypes.length)]);
  d3.select("#colorscale").property( "value",  coltypes[Math.floor(Math.random() * coltypes.length)]);

  showcal(); 
  }
   else{
    timeout = setTimeout(function() {
    d3.select("input[value=\"calendar\"]").property("checked", true).each(change); }, 6000);
   
     projection_type= $("#mySelect :selected").text();
  onProjectionChange(projection_type); 
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));

  $('#caloptions').hide();
  }
}//chNGE FNC
  } //if($("#animate_view").prop('checked')){
  else {
  timeout= clearTimeout(timeout);
  timeout2= clearTimeout(timeout2);
}
  
});

 timeout = setTimeout(function() {
  d3.select("input[value=\"calendar\"]").property("checked", true).each(change); }, 6000);

function change() {
 //console.log(this.value+ " "+ timeout);
  if (this.value === "calendar"){
    timeout2 = setTimeout(function() {
  d3.select("input[value=\"map\"]").property("checked", true).each(change); }, 16000);
  $('#caloptions').show();

  d3.select("#orderby").property( "value",  envtypes[Math.floor(Math.random() * envtypes.length)]);
  d3.select("#colorscale").property( "value",  coltypes[Math.floor(Math.random() * coltypes.length)]);

  showcal(); 
  }
   else{
    timeout = setTimeout(function() {
    d3.select("input[value=\"calendar\"]").property("checked", true).each(change); }, 6000);
   
     projection_type= $("#mySelect :selected").text();
  onProjectionChange(projection_type); 
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices($("#airs").prop('checked'), $("#seas").prop('checked'));
  wordcloud('wordcloud', nodesmap_bray["MLSP.AIR.004"]);
  $('#caloptions').hide();
  }
}//chNGE FNC





