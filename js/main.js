
// the canvas dimensions
  var element = $("#" + "map");
  var width= element.parent().width()-100;
  var height = 960;
//var width = 960,  height = 960;
   var legend_height=70;


var show_air_air = false, show_air_sea =true, show_sea_sea=false;
var bray_threshold1 = 0.5, bray_threshold2=0.8;
var check1=true, check2=true, check3=true, check4=true, check5=true, check6=true, check7=true;
var airsample=true; seasample=true;
var edge_transitions=true;

var tot_air_samples=0,tot_sea_samples=0, tot_air_air_samples=0, tot_air_sea_samples=0, tot_sea_sea_samples=0;
var gr1=0,gr2=0,gr3=0,gr4=0,gr5=0,gr6=0,gr7=0;
var br1=0,br2=0,br3=0,br4=0,br5=0;

// functions to map screen coordinates to lat,long
var λ = d3.scale.linear()
    .domain([0, width])
    .range([-180, 180]);

var φ = d3.scale.linear()
    .domain([0, height])
    .range([90, -90]);


// setup map projections
// var projection = d3.geo.azimuthalEquidistant()
//     .scale(150)
//     .rotate([λ(0), φ(0)])
//     .clipAngle(180 - 1e-3)
//     .translate([width / 2, height / 2])
//     .precision(0.1);
var projection_type = "Mercator";
  var  projection = d3.geo.mercator()
        .scale((width - 3) / (2 * Math.PI))
        .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg0 = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", legend_height);

var zoom = d3.behavior.zoom()
             .on("zoom", function () {
              svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
              }); 

var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);

var y = d3.scale.linear()
    .domain([0, height])
    .range([height, 0]);

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "secondrect")
    .call(zoom)
    .append("g")
    ;
   

function enableZoom() {
  zoom = d3.behavior.zoom()
             .on("zoom", function () {
              svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
              }); 
    svg.call(zoom);
}

function disableZoom() {
  zoom.on("zoom", null);
    svg.on(".zoom", null);
}

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

//-----------------------------------------------------------------------------------------------

var check_environment = function(src_env, dest_env){
  if(!check1 &&  (src_env.includes("1.North Atlantic") || dest_env.includes("1.North Atlantic"))) return false;
  if(!check2 &&  (src_env.includes("2.South Atlantic") || dest_env.includes("2.South Atlantic"))) return false;
  if(!check3 &&  (src_env.includes("3.Indian Ocean") || dest_env.includes("3.Indian Ocean"))) return false;
  if(!check4 &&  (src_env.includes("4.W Pacific") || dest_env.includes("4.W Pacific"))) return false;
  if(!check5 &&  (src_env.includes("5.Central Pacific") || dest_env.includes("5.Central Pacific"))) return false;
  if(!check6 &&  (src_env.includes("6.E Pacific") || dest_env.includes("6.E Pacific"))) return false;
  if(!check7 &&  (src_env.includes("7.Central Atlantic") || dest_env.includes("7.Central Atlantic"))) return false;

  return true;
}
var show_vertex_ofdisplayed_edge = true;
var displayedvertices = [];
var nodeshashmap =[], nodeshashmap_filter =[], nodesmap_bray=[], nodesfullmap=[],nodesallmap=[];
// now load the edges represented by geojson
var edges = svg.append("g")
            .attr("class", "edges");
var edges_data = [];
var filtered_features = [];

var filter_edges_data = function(datapoints){
  displayedvertices=[];
  nodeshashmap_filter =[]; 
  nodesmap_bray=[];
  //nodesmap(datapoints); // calculate 2d array of all data 131 x 131 only names
  nodesmapfull_bray(datapoints);
  nodesmapfull_all(datapoints);
  return datapoints.filter(function(d){
    //console.log(d.properties.src_environ + " "+ d.properties.dest_environ + " "+ check_environment(d.properties.src_environ, d.properties.dest_environ));
    if(show_air_air && d.properties.src_category =="AIR" && d.properties.dest_category =="AIR" && airsample && check_environment(d.properties.src_environ, d.properties.dest_environ)){
      if(d.properties.bray_distance >= bray_threshold1 && d.properties.bray_distance <= bray_threshold2){
        //if(!(displayedvertices.indexOf(d.properties.src_vertex) >-1))displayedvertices.push(d.properties.src_vertex)
        //console.log(d.properties.src_vertex + "   "+displayedvertices.indexOf(d.properties.src_vertex));
          if (!(displayedvertices.indexOf(d.properties.src_vertex) >-1))displayedvertices.push(d.properties.src_vertex);
          if (!(displayedvertices.indexOf(d.properties.dest_vertex) >-1))displayedvertices.push(d.properties.dest_vertex);
          nodesmap_filter(d);
          nodesmap_filter_bray(d);
          return true;
      }
    }
    else if(show_air_sea && d.properties.src_category =="AIR" && d.properties.dest_category =="SEAWATER" && airsample && seasample && check_environment(d.properties.src_environ, d.properties.dest_environ)){
      //console.log(d.properties.src_vertex + " "+ d.properties.dest_vertex + " "+ d.properties.bray_distance + " " + (d.properties.bray_distance < 0.65 ? "yessssssssssssssssssssssssssssssssssssssss": " "));
      if(d.properties.bray_distance >= bray_threshold1 && d.properties.bray_distance <= bray_threshold2){
             if (!(displayedvertices.indexOf(d.properties.src_vertex) >-1))displayedvertices.push(d.properties.src_vertex);
             if (!(displayedvertices.indexOf(d.properties.dest_vertex) >-1))displayedvertices.push(d.properties.dest_vertex);
             nodesmap_filter(d);
             nodesmap_filter_bray(d);
                return true;
            }
    }
    else if(show_air_sea && d.properties.src_category =="SEAWATER" && d.properties.dest_category =="AIR" && airsample && seasample && check_environment(d.properties.src_environ, d.properties.dest_environ)){
      //console.log(d.properties.src_vertex + " "+ d.properties.dest_vertex + " "+ d.properties.bray_distance + " " + (d.properties.bray_distance < 0.65 ? "yesssssssssssssssssssssssssssssssss": " "));
      if(d.properties.bray_distance >= bray_threshold1 && d.properties.bray_distance <= bray_threshold2){
             if (!(displayedvertices.indexOf(d.properties.src_vertex) >-1))displayedvertices.push(d.properties.src_vertex);
             if (!(displayedvertices.indexOf(d.properties.dest_vertex) >-1))displayedvertices.push(d.properties.dest_vertex);
             nodesmap_filter(d);
             nodesmap_filter_bray(d);
                return true;
            }
    }
    else if(show_sea_sea && d.properties.src_category =="SEAWATER" && d.properties.dest_category =="SEAWATER" && seasample && check_environment(d.properties.src_environ, d.properties.dest_environ)){
          if(d.properties.bray_distance >= bray_threshold1 && d.properties.bray_distance <= bray_threshold2){
              if (!(displayedvertices.indexOf(d.properties.src_vertex) >-1))displayedvertices.push(d.properties.src_vertex);
              if (!(displayedvertices.indexOf(d.properties.dest_vertex) >-1))displayedvertices.push(d.properties.dest_vertex);
              nodesmap_filter(d);
              nodesmap_filter_bray(d);
                    return true;
                }
    }
    else return false;

    // if(show_air_air){
    //   return d.properties.bray_distance < bray_threshold;
    // }
    // else{
    //   return (d.properties.src_category!=d.properties.dest_category)
    //   && (d.properties.bray_distance < bray_threshold);
    // }
    });
};

var draw_edges = function(datapoints){
  tot_air_air_samples=0, tot_air_sea_samples=0, tot_sea_sea_samples=0;
  br1=0,br2=0,br3=0,br4=0,br5=0;
  edges.selectAll("path").remove();
  svg.selectAll("g").remove(); // remove all g i.e vertices, edges and paths
  edges = svg.append("g")
            .attr("class", "edges")
            .attr("id","edgesg");

  edges.selectAll("path")
            .data(datapoints)
            .enter()
            .append("path")
            .attr("class","arc")
            .attr("stroke", function(d){
              if(d.properties.src_category =="AIR" && d.properties.dest_category =="AIR"){ 
                tot_air_air_samples= ++tot_air_air_samples;
                return "#5F9EA0";}
              if(d.properties.src_category =="AIR" && d.properties.dest_category =="SEAWATER"){ 
                tot_air_sea_samples= ++tot_air_sea_samples;
                return "#8B008B";}
              if(d.properties.src_category =="SEAWATER" && d.properties.dest_category =="AIR"){ 
                tot_air_sea_samples= ++tot_air_sea_samples;
                return "#8B008B";}
              if(d.properties.src_category =="SEAWATER" && d.properties.dest_category =="SEAWATER"){ 
                tot_sea_sea_samples= ++tot_sea_sea_samples;
                return "#CD853F";}
   
            })
            .attr("id", function(d){
                return (d.properties.src_vertex + "_" + d.properties.dest_vertex);
            })
            .attr("stroke-opacity", function(d){
              var bray= d.properties.bray_distance;
              if(bray<0.2){ br1 =++ br1; return "0.9";}
              else if(bray>=0.2 && bray <0.3){ br2 =++ br2; return "0.7";}
              else if(bray>=0.3 && bray <0.6) { br3 =++ br3;return "0.5";}
              else if(bray>=0.6 && bray <0.8) { br4 =++ br4;return "0.35";}
              else if(bray>=0.8 && bray <=1.0) { br5 =++ br5;return ".25";}
              return "0.8";
            })
            .attr("stroke-width", function(d){
              var bray= d.properties.bray_distance;
              if(bray<0.2) return "4";
              else if(bray>=0.2 && bray <0.3) return "3";
              else if(bray>=0.3 && bray <0.6) return "2";
              else if(bray>=0.6 && bray <0.8) return "1.0";
              else if(bray>=0.8 && bray <=1.0) return ".6";

              return "1.8";
            })
            .attr("d", path)
            .call(lineTransition)
            .on("mouseover", edge_mouseover)
            //.on("mousemove", edge_mouseover)
            .on("mouseout", edge_mouseout)
            .append("svg:title")
            .html(function(d) { 
                var t= "Source:"+d.properties.src_vertex + " , " + "Destination:"+  d.properties.dest_vertex+  "<br/>" + 
                        "Src_Env:" + d.properties.src_environ + " , " + "Dest_Env:" + d.properties.dest_environ  + "<br/>" + 
                        "Src_Description:" + d.properties.src_description + " , " + "Dest_Description:" + d.properties.dest_description  + "<br/>" +  
                        "Src_Color:" + d.properties.src_color+ " , " + "Dest_Color:" + d.properties.dest_color  + "<br/>" +
                        "Src_Category:" + d.properties.src_category+ " , " + "Dest_Category:" + d.properties.dest_category  + "<br/>" +
                        "Bray Distance:" + d.properties.bray_distance;
                return t; })
                ;
};

function edge_mouseover(d) {

  //console.log(svg.selectAll("path"). attr("id"));
    d3.select(this)
        .transition()
        .duration(800)
        .style('stroke-width', 8);
    d3.select(this).moveToFront();

    d3.select("[id='" + d.properties.src_vertex + "']").moveToFront();
    d3.select("[id='" + d.properties.dest_vertex + "']").moveToFront();

    if(d.properties.src_category == "AIR") d3.select("[id='" + d.properties.src_vertex + "']").attr("r",5);
    else d3.select("[id='" + d.properties.src_vertex + "']").attr("width",10).attr("height",10);

    if(d.properties.dest_category == "AIR") d3.select("[id='" + d.properties.dest_vertex + "']").attr("r",5);
    else d3.select("[id='" + d.properties.dest_vertex + "']").attr("width",10).attr("height",10);

    d3.select("[id='" + d.properties.src_vertex + "']")
        .call(nodeTransition);

    d3.select("[id='" + d.properties.dest_vertex + "']")
            .call(nodeTransition);
}

function edge_mouseout(d) {
   var bray= d.properties.bray_distance;
   var w=1;
      if(bray<0.2) w=4;
      else if(bray>=0.2 && bray <0.3) w=3;
      else if(bray>=0.3 && bray <0.6) w=2;
      else if(bray>=0.6 && bray <0.8) w=1.0;
      else if(bray>=0.8 && bray <=1.0) w=0.6;
    d3.select(this)
        .transition()
        .duration(800)
        .style('stroke-width', w);

    d3.select("[id='" + d.properties.src_vertex + "']")
        .transition()
        .duration(800)
        .style('stroke-width', 3)
        .style('stroke', function(d){
              return (d.properties.Category=="AIR" ? "#211606" : "#d2d1d1" );
            });

    d3.select("[id='" + d.properties.dest_vertex + "']")
        .transition()
        .duration(800)
        .style('stroke-width', 3)
        .style('stroke', function(d){
              return (d.properties.Category=="AIR" ? "#211606" : "#d2d1d1" );
            });    
}

d3.json("data/bray_edges.geojson", function(error, datapoints) {
  if(error) throw error;

  // remove SEAWATER <--> SEAWATER edges
  // edges_data = datapoints.features.filter(function(d){
  //     return (d.properties.src_category != "SEAWATER" || d.properties.dest_category != "SEAWATER");
  // });
  edges_data= datapoints.features;
  filtered_features = filter_edges_data(edges_data);
  draw_edges(filtered_features);
  draw_vertices(true,true);
  draw_Legends();  
});


//-------------------------------------------------------------------------------------------------------------------------------------------------------
var shapes;
// let's load the vertices from a geojson file
var draw_vertices = function(drawair,drawsea){
  //console.log("inside vertices");
  //svg.selectAll("g").remove(); // remove all g i.e vertices and edges
  neig =[];
  tot_air_samples=0,tot_sea_samples=0;
  gr1=0,gr2=0,gr3=0,gr4=0,gr5=0,gr6=0,gr7=0;
  var locations = svg.append("g"). attr("id", "nodesg");
  d3.json("data/sampledata.geojson", function(error, datapoints) {
    if(error) throw error;

     shapes= locations.selectAll("path")
                .data(datapoints.features)
                .enter();
    if(drawair){
        shapes.append("circle")
              .filter(function(d){ 
               var cond =true;
               if (show_vertex_ofdisplayed_edge) cond=(displayedvertices.indexOf(d.properties.Column1) >-1);
               if(d.properties.Category=="AIR" && cond ){
                if(!check1 && d.properties.Env.includes("1.North Atlantic")) return false;
                else if(!check2 && d.properties.Env.includes("2.South Atlantic")) return false;
                else if(!check3 && d.properties.Env.includes("3.Indian Ocean")) return false;
                else if(!check4 && d.properties.Env.includes("4.W Pacific")) return false;
                else if(!check5 && d.properties.Env.includes("5.Central Pacific")) return false;
                else if(!check6 && d.properties.Env.includes("6.E Pacific")) return false;
                else if(!check7 && d.properties.Env.includes("7.Central Atlantic")) return false;

                 return d.properties.Category=="AIR";
               }
               else return false;
                })
              .attr("class", "circles")
              .attr("id", function(d){
                          return d.properties.Column1;
                          })
              .attr("cx", function(d){
                return projection(d.geometry.coordinates)[0];
              })
              .attr("cy", function(d){
                 return projection(d.geometry.coordinates)[1];
              })
              .attr("fill", function(d){
                    tot_air_samples=tot_air_samples+1;
                if(d.properties.Env.includes("1.North Atlantic")) gr1= ++gr1;
                else if(d.properties.Env.includes("2.South Atlantic")) gr2= ++gr2;
                else if(d.properties.Env.includes("3.Indian Ocean")) gr3= ++gr3;
                else if(d.properties.Env.includes("4.W Pacific")) gr4= ++gr4;
                else if(d.properties.Env.includes("5.Central Pacific")) gr5= ++gr5;
                else if(d.properties.Env.includes("6.E Pacific")) gr6= ++gr6;
                else if(d.properties.Env.includes("7.Central Atlantic")) gr7= ++gr7;
                //console.log(gr1 + " "+ gr7);
                if(d.properties.color == "black") return "rgba(0, 0, 0, 0.33)";
                return d.properties.color;
              })
              .attr("r", "5")
              .attr("stroke", "#211606") //31708F
              .attr("stroke-width", "3px")
              .attr("d", path)
              .on("mouseenter", vertex_mouseover)
              .on("click", vertex_mouseclick)
              .on("dblclick", vertex_mousedblclick)
              .on("mouseout", vertex_mouseout)
              .on("mouseleave", vertex_mouseout)
              .append("svg:title")
              .html(function(d) { 
                var t= "Name:"+d.properties.Column1 + "<br/>" + "Color:"+  d.properties.color+  "<br/>" + "Env:" + d.properties.Env + "<br/>" + "Category:"+ d.properties.Category ;
                return t; });

                
     }
     if(drawsea){
              shapes.append("rect")
                    .filter(function(d){ 
                      var cond =true;
                      if (show_vertex_ofdisplayed_edge) cond=(displayedvertices.indexOf(d.properties.Column1) >-1);
                      if(d.properties.Category=="SEAWATER" && cond){
                         if(!check1 && d.properties.Env.includes("1.North Atlantic")) return false;
                         else if(!check2 && d.properties.Env.includes("2.South Atlantic")) return false;
                         else if(!check3 && d.properties.Env.includes("3.Indian Ocean")) return false;
                         else if(!check4 && d.properties.Env.includes("4.W Pacific")) return false;
                         else if(!check5 && d.properties.Env.includes("5.Central Pacific")) return false;
                         else if(!check6 && d.properties.Env.includes("6.E Pacific")) return false;
                         else if(!check7 && d.properties.Env.includes("7.Central Atlantic")) return false;
                      return d.properties.Category=="SEAWATER";
                      }
                      else return false;
                     })
                    .attr("class", "rects")
                    .attr("id", function(d){
                          return d.properties.Column1;
                          })
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr("fill", function(d){
                          return d.properties.color;
                     })
                    .attr("x", function(d){
                          return (projection(d.geometry.coordinates)[0]) -5;
                          })
                    .attr("y", function(d){
                          tot_sea_samples=tot_sea_samples+1;
                          return (projection(d.geometry.coordinates)[1])-5;
                          })
                    .attr("stroke", "#d2d1d1")
                    .attr("stroke-width", "3px")
                    .attr("d", path)
                    .on("mouseenter", vertex_mouseover)
                    .on("click", vertex_mouseclick)
                    .on("dblclick", vertex_mousedblclick)
                    .on("mouseout", vertex_mouseout)
                    .on("mouseleave", vertex_mouseout)
                    .append("svg:title")
                    .html(function(d) { 
                        var t= "Name:"+d.properties.Column1 + "<br/>" + "Color:"+  d.properties.color+  "<br/>" + "Env:" + d.properties.Env + "<br/>" + "Category:"+ d.properties.Category ;
                        return t; }); 
                        
      }
              
      piechart('analytics_chart');
      svgclick();
      //console.log("end of draw verexes");
  });

  d3.select(self.frameElement).style("height", height + "px");
} // end draw vertices function


var neig=[];
function vertex_mousedblclick(d) {
  //console.log(d);
 var clickednode = d3.select(this).attr("id");
 neigarr= nodeshashmap_filter[clickednode];
 neig=neig.concat(clickednode);
 neig=neig.concat(neigarr);
 
 d3.selectAll('g#nodesg').selectAll("circle") //here's how you get all the nodes
    .each(function(d,i) {
      if(this.id.length >0){ 
         if(!(this.id == clickednode || neig.indexOf(this.id) >-1)){
            //console.log(this.id + " "+ this.id.length + " "+ d.properties.Category); 
            d3.select(this).attr("opacity",0);
          }
          else d3.select(this).attr("opacity",1);
      } 
    });
  d3.selectAll('g#nodesg').selectAll("rect") //here's how you get all the nodes
      .each(function(d,i) {
        if(this.id.length >0){ 
           if(!(this.id == clickednode || neig.indexOf(this.id) >-1)){
              //console.log(this.id + " "+ this.id.length + " "+ d.properties.Category); 
              d3.select(this).attr("opacity",0);
            }
            else d3.select(this).attr("opacity",1);
        } 
      });

   d3.selectAll('g#edgesg').selectAll("path") //here's how you get all the nodes
    .each(function(d,i) {
        // console.log(this.id + " "+ this.id.includes(clickednode) + " "+ neig); 
        // console.log(d.properties.src_vertex + " " + neig.indexOf(d.properties.src_vertex) + " "+ 
        //                 d.properties.dest_vertex + " " + neig.indexOf(d.properties.dest_vertex));
      if(this.id.length >0){ 
         if(!(neig.indexOf(d.properties.src_vertex) >-1 && neig.indexOf(d.properties.dest_vertex) >-1 )){
            
            d3.select(this).attr("opacity",0);
          }
          else d3.select(this).attr("opacity",1);
      } 
    });   
    d3.event.stopPropagation();
};

function vertex_mouseclick(d) {
  wordcloud('wordcloud', nodesmap_bray[d3.select(this).attr("id")]);
  d3.event.stopPropagation();
}

function vertex_mouseover(d) {
  //console.log("over  "+ d3.select(this).attr("id"));
  d3.select("[id='" + "nodesg" + "']").select(".text").remove(); 
  if(d3.select(this).attr("id").includes("WC")){
    d3.select(this)
        .transition()
        .duration(800)
        .attr('width', 15)
        .attr('height', 15);
    d3.select(this).moveToFront();
  }
  else
  {
    d3.select(this)
        .transition()
        .duration(800)
        .attr("r", 8);
        d3.select(this).moveToFront();
  }
  var neighbors= nodeshashmap_filter[d3.select(this).attr("id")];
  for(var n=0; n<neighbors.length;n++){
    var p1=d3.select(this).attr("id")+"_"+neighbors[n];
    var p2=neighbors[n]+"_"+d3.select(this).attr("id");

    var braydist = nodesmap_bray[d3.select(this).attr("id")][neighbors[n]];

    d3.select("[id='" + p1 + "']")// nodes neigbor edges transition
        .transition()
        .duration(800)
        .call(neighbortransition);

    d3.select("[id='" + p2 + "']")// nodes neigbor edges transition
        .transition()
        .duration(800)
        .call(neighbortransition);   

    d3.select("[id='" + neighbors[n] + "']") // nodes neigbor vertex transition
        .call(nodeTransition);  // (d3.select("[id='" + neighbors[n] + "']"), braydist)   
      
     d3.select("[id='" + "nodesg" + "']")
       .append("text")
        .transition().delay(50)
        .attr("class", "text")
        .attr("x", function(d){
            return projection(d3.select("[id='" + neighbors[n] + "']").datum().geometry.coordinates)[0];
        })
        .attr("y", function(d){
            return projection(d3.select("[id='" + neighbors[n] + "']").datum().geometry.coordinates)[1]+2;
        })
        .text(braydist.toFixed(1)+"")
        .attr("text-anchor", "middle")
        .attr( "font-size", "10")     
        .attr("font-weight", "bold")
        .attr( "font-style", "italic")         
        .attr("fill",  "red")
        .attr("opacity", d3.select("[id='" + neighbors[n] + "']").attr("opacity") ==0  ? 0:1);     
     

    d3.select("[id='" + p1 + "']").moveToFront();  
    d3.select("[id='" + p2 + "']").moveToFront();  
  }//for loop
  
}

function vertex_mouseout(d) {
  //console.log("out  "+ d3.select(this).attr("id"));
  if(d3.select(this).attr("id").includes("WC")){
    //console.log("outrect  "+ d3.select(this).attr("id"));
    d3.select(this)
        .transition()
        .duration(800)
        .attr('width', 10)
        .attr('height', 10);
  }
  else
    d3.select(this)
        .transition()
        .duration(800)
        .attr("r", 5 );
 
  var neighbors= nodeshashmap_filter[d3.select(this).attr("id")];
  for(var n=0; n<neighbors.length;n++){
    var p1=d3.select(this).attr("id")+"_"+neighbors[n];
    var p2=neighbors[n]+"_"+d3.select(this).attr("id");

    d3.select("[id='" + p1 + "']") // nodes neigbor edges transition
        .transition()
        .duration(800)
        .style('stroke', function(d){
                  if(d.properties.src_category =="AIR" && d.properties.dest_category =="AIR"){ 
                  return "#5F9EA0";}
                  else if(d.properties.src_category =="AIR" && d.properties.dest_category =="SEAWATER"){ 
                  return "#8B008B";}
                  else if(d.properties.src_category =="SEAWATER" && d.properties.dest_category =="AIR"){ 
                  return "#8B008B";}
                  else if(d.properties.src_category =="SEAWATER" && d.properties.dest_category =="SEAWATER"){ 
                  return "#CD853F";}
            });

    d3.select("[id='" + p2 + "']") // nodes neigbor edges transition
        .transition()
        .duration(800)
        .style('stroke', function(d){
                  if(d.properties.src_category =="AIR" && d.properties.dest_category =="AIR"){ 
                  return "#5F9EA0";}
                  else if(d.properties.src_category =="AIR" && d.properties.dest_category =="SEAWATER"){ 
                  return "#8B008B";}
                  else if(d.properties.src_category =="SEAWATER" && d.properties.dest_category =="AIR"){ 
                  return "#8B008B";}
                  else if(d.properties.src_category =="SEAWATER" && d.properties.dest_category =="SEAWATER"){ 
                  return "#CD853F";}
            });   

    d3.select("[id='" + neighbors[n] + "']")// nodes neigbor vertex transition
        .transition()
        .duration(800)
        .style('stroke-width', 3)
        .style('stroke', function(d){
              return (d.properties.Category=="AIR" ? "#211606" : "#d2d1d1" );
            });   
            
      d3.select("[id='" + "nodesg" + "']").select(".text").remove();          
  }//for loop        
}

d3.selection.prototype.moveToFront = function() { 
  return this.each(function() { 
    this.parentNode.appendChild(this); 
  }); 
}; 

svgclick();

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


