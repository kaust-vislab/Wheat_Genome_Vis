function generatechord(matrix1, hovermatrix){
  var showchords=1;
  svg.select("#blocks").remove();   
  svg.select("#edgesg").remove();        
  svg.select("#genesg").remove();  
  svg.select("#analyticsg").remove();
  svg.select("#circle").remove();
  svg.select("#stackbar").remove();
  // svg.select("#getGradID").remove();
  svg.selectAll("linearGradient").remove();

  var widthc = width-0,//1200,
      heightc = height-0,
      outerRadius = Math.min(widthc, heightc) / 2 - 100,
      innerRadius = outerRadius - 28;

  var formatPercent = d3.format(".1f");

  var arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

  var layout = customChordLayout()// d3.layout.chord()
      .padding(.05)
      .sortSubgroups(d3.descending)
      .sortChords(d3.ascending);

  var path = d3.svg.chord()
      .radius(innerRadius-7);

  var svgc=svg.append("g")
      .attr("id", "circle")
      .attr("transform", "translate(" + (outerRadius+100) + "," + ((heightc / 2)+ 45) + ")"); //widthc / 2

  svgc.append("text")
            .attr("class", "textnumbers")                
            .attr("x", 0)
            .attr("y", -(heightc / 2)-34)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "28px")
            .attr("font-weight", "bold")
            .attr("fill", "indianred")
            .text("Chord Diagram")   ;  
  svgc.append("text")
            .attr("class", "textnumbers")                
            .attr("x", 0)
            .attr("y", -(heightc / 2) )
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "indianred")
            .text("(Showing All Genes Relationships)");                       

  svgc.append("circle")
      .attr("r", outerRadius)
      .style("fill","none");


  d3.csv("species-oceanic.csv", function(cities) {
        // Compute the chord layout.
        layout.matrix(matrix1); // matrix1 got input in the function

        ////////////////////////////////////////////////////////////
        /////////////// Create the gradient fills //////////////////
        ////////////////////////////////////////////////////////////

        //Function to create the id for each chord gradient
        function getGradID(d){ return "linkGrad-" + d.source.index + "-" + d.target.index; }

        //Create the gradients definitions for each chord
         var grads = svg.append("defs").selectAll("linearGradient")
          .data(layout.chords())
           .enter().append("linearGradient")
          .attr("id", getGradID)
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", function(d,i) { return innerRadius * Math.cos((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
          .attr("y1", function(d,i) { return innerRadius * Math.sin((d.source.endAngle-d.source.startAngle)/2 + d.source.startAngle - Math.PI/2); })
          .attr("x2", function(d,i) { return innerRadius * Math.cos((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })
          .attr("y2", function(d,i) { return innerRadius * Math.sin((d.target.endAngle-d.target.startAngle)/2 + d.target.startAngle - Math.PI/2); })

        //Set the starting color (at 0%)
        grads.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", function(d){ 
          // return cities[d.source.index].color;
          return colorarr2[genetodna[cities[d.source.index].name]];
          });
        // grads.append("stop")
        //   .attr("offset", "20%")
        //   .attr("stop-color", function(d){ 
        //       return "red";
        //   });
        // grads.append("stop")
        //   .attr("offset", "40%")
        //   .attr("stop-color", function(d){ 
        //       return "red";
        //   });
        //Set the ending color (at 100%)
        grads.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", function(d){ 
              //return "red";
          // if(matrix1[d.target.index][d.source.index] < 0) return 'red';
          //         else return 'green';
          // return cities[d.target.index].color;
          return colorarr2[genetodna[cities[d.target.index].name]];
            //return colors(d.target.index); 
          });
        ////////////////////////////////////////////////////////////

        // Add a group per neighborhood.
        var group = svgc.selectAll(".group")
            .data(layout.groups)
          .enter().append("g")
            .attr("class", "group")        
            .on("mouseover", mouseover)
            .on("mouseout", mouseout);

        // Add a mouseover title.
        group.append("title").text(function(d, i) {
           return cities[i].name;// + ", Total Value:" + formatPercent(d.value) 
        });

        // Add the group arc.
        var groupPath = group.append("path")
            .attr("id", function(d, i) { return "group" + i; })
            .attr("d", arc)
            .style("fill", function(d, i) { 
              // return cities[i].color; 
              return colorarr2[genetodna[cities[i].name]];
            })
            .style("stroke", function(d, i, j) { return "black"; })
            .style("stroke-width", function(d, i) { return '1px'; });

        // Add a text label.
        var groupText = group.append("text")
            //.attr("x", function(d, i){console.log( groupPath[0][i].getTotalLength()/2);})   //6
            .attr("dy", 25);       


          group.append("svg:text")
          .each(function(d,i) { d.angle = (d.startAngle + d.endAngle) / 2; })
          .attr("dy", ".35em")
          .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
          .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 33) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
          })
          .text(function(d,i) { return cities[i].name; })
          .style("fill", function(d, i) { 
            // return cities[i].color; 
            return colorarr2[genetodna[cities[i].name]];
          })
          .attr("shape-rendering","crispEdges")
          .attr("font-family","Arial")
          .attr("font-size","20px");


        // Add the chords.
        // var crossedge_scale = d3.scale.linear().domain([1, 1562]).range([0.3, 5]);// 1562 max cross edges within same chr of other species
        function crossedge_scale(inp){
          if(inp <50) return "1";
          else if(inp >=50 && inp <100) return "1.5";
          else if(inp >=100 && inp <300) return "2";
          else if(inp >=300 && inp <500) return "3";
          else if(inp >=500 && inp <1000) return "4";
          else return "5";            
        } 
        var chord = svgc.selectAll(".chord")
            .data(layout.chords)
          .enter().append("path")
            .attr("class", "chord")
            .style("fill", function(d,i) {     
              var s=cities[d.source.index].name.charAt(2);
              var t =cities[d.target.index].name.charAt(2);
              if(s == t) return "url(#" + getGradID(d) + ")";// return cities[d.target.index].color; 
              else return "red"
            })
            .style("fill-opacity", function(d){
              if(d.source.value <200) return 1;
              else return 0.6;
            })
            .style("stroke", function(d,i) {     
              var s=cities[d.source.index].name.charAt(2);
              var t =cities[d.target.index].name.charAt(2);
              // if(s==t) console.log(chord_crossedges[d.source.index][d.target.index] +"  "+cities[d.source.index].name+ " "+ cities[d.target.index].name + " "+ d.source.value);
              if(s == t)  return "#800000"; //return cities[d.target.index].color;
              else return "red";
            })
            .style("stroke-opacity", function(d,i) {     
              var s=cities[d.source.index].name.charAt(2);
              var t =cities[d.target.index].name.charAt(2);
              if(s == t)  return "0.7"; //return cities[d.target.index].color;
              else return "1"
            })
            .style("stroke-width", function(d, i) { 
              // return '1px';
              var s=cities[d.source.index].name.charAt(2);
              var t =cities[d.target.index].name.charAt(2);
              if(s == t) return crossedge_scale(chord_crossedges[d.source.index][d.target.index]) + "px";//return "2px";
              else return '1px';
            })
            .attr("d", path)
            .on("mouseover", chordmouseover)
            .on("mouseout", chordmouseout);

        //Add an elaborate mouseover title for each chord.
        chord.append("title").text(function(d) {
          return cities[d.source.index].name
              + " <-> " + cities[d.target.index].name
              // + ": " + formatPercent(d.source.value) 
              + ": " + formatPercent(hovermatrix[d.source.index][d.target.index]) + " connections, "
              + chord_crossedges[d.source.index][d.target.index] + " cross connections";
        });

        function mouseover(d, i) {
          syncmousehover(d3.select(this).select('title')[0][0].innerHTML);
           svg.selectAll("path.chord")
            .filter(function(d) { 
              return d.source.index !== i && d.target.index !== i;               
            })
            .transition()
            .style("opacity", 0.15);
        }
        function mouseout(d, i) {
          syncmouseout(d3.select(this).select('title')[0][0].innerHTML);
           svg.selectAll("path.chord")
            // .filter(function(d) { 
            //    return d.source.index !== i && d.target.index !== i; 
            // })
            .transition()
            .style("opacity", 1);
        }
        
        function chordmouseover(d, i) {
             svg.selectAll("path.chord")
                .transition()
                .style("opacity", 0.15);
               // update relevant stacked bar rects  
              d3.select(this).transition().style("opacity", 1);    
              var src= cities[d.source.index].name;
              var tgt= cities[d.target.index].name;
              svg.selectAll("g.cost").selectAll("rect")
                                     .style("opacity", function(d, i) { 
                                        if((d.x == src && d.x2 ==tgt) || (d.x2 == src && d.x ==tgt) )
                                           return 1; 
                                        else return 0.1;  
                                      });         
        }
        function chordmouseout(d, i) {
           svg.selectAll("path.chord") 
            .transition()
            .style("opacity", 1);
            // put rects backed to opacity 1 after exiting hover
            svg.selectAll("g.cost").selectAll("rect")
                                   .style("opacity", function(d, i) { 
                                      return 1;  
                                    }); 
        }
  }); // end d3.csv("species-oceanic.csv", function(cities) {
  gensbc(outerRadius);
} //#8bc48a #fd8b8a end of function

var xAxisG; // defining global to access above in hovering
//from chord hover update bar
function syncmousehover(name){
  xAxisG.selectAll('.tick')
          .filter(function(d) {
           if(d == name) {
              d3.select(this).selectAll('text')
                             .style("font-size", "28px")
                             .style("fill", "red");          
              svg.selectAll("g.cost").selectAll("rect").style("opacity", function(d, i) { 
                            if(d.x != name ) return 0.1;  
              });
           }
           })
}
//from chord hover out update bar
function syncmouseout(name){
  xAxisG.selectAll('.tick')
          .filter(function(d) {
           if(d == name) {
               d3.select(this).selectAll('text')
                              .style("font-size", "20px")
                              .style("text-anchor", "end")
                              .style("font-family", "Arial")
                              .style("shape-rendering", "crispEdges")
                              .style("fill", function(d){return colorarr2[[genetodna[d]]];});
               svg.selectAll("g.cost").selectAll("rect").style("opacity", function(d, i) { 
                             return 1;  
               });
           }
           })
}
//from bar hover update chord
function sync2mousehover(name){
    svg.selectAll("path.chord")
     .filter(function(d,i) { 
       return d.source.index !== chrtonumber[name] && d.target.index !== chrtonumber[name] ;        
     })
     .transition()
     .style("opacity", 0.15);
}
//from bar hover out update chord
function sync2mouseout(name){
    svg.selectAll("path.chord")
       .transition()
       .style("opacity", 1);
}  
          

function gensbc(outerRadius){
  var margin = {top: 100, right: 50, bottom: 80, left: 90};
  var widthsb = width - margin.left - margin.right -((outerRadius+100)*2 ),
      heightsb = height - margin.top - margin.bottom;
  var svgsb = svg.append("g")
                 .attr("id", "stackbar")
                 .attr("width" , widthsb)
                 .attr("transform", "translate(" + (((outerRadius+100)*2) + margin.right) + "," + margin.top+ ")"); //widthc / 2

  svgsb.append("text")
            .attr("x",  widthsb/2)
            .attr("y", -(margin.top / 2)-42)
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "28px")
            .attr("font-weight", "bold")
            .attr("fill", "indianred")
            .text("Stacked Bar Charts")   ;  
  svgsb.append("text")
            .attr("x", widthsb/2)
            .attr("y", -(margin.top / 2)-12 )
            .attr("dy", "1.2em")
            .style("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "indianred")
            .text("(Showing Only Cross Genes Relationships)");               

  var data= sbcdata; 
  // console.log(sbcdata);   
  // var colors = ["b33040", "#d25c4d", "#f2b447", "#d9d574","grey"];
  var colors=[color1,color1,color1,color1,color1,color1,color1,
              color2,color2,color2,color2,color2,color2,color2,
              color3,color3,color3,color3,color3,color3,color3,
              color4,color4,color4,color4,color4,color4,color4]; 
  // var cat= ["hv1H", "hv2H", "hv3H", "hv4H","hv5H"];
  var cat=["hv1H", "hv2H", "hv3H", "hv4H",  "hv5H",  "hv6H",  "hv7H","ta1A", "ta2A",  "ta3A",  "ta4A",  "ta5A",   "ta6A", "ta7A",
           "ta1B", "ta2B",   "ta3B",  "ta4B",  "ta5B",   "ta6B",   "ta7B",
           "ta1D", "ta2D",  "ta3D",  "ta4D",  "ta5D",   "ta6D",  "ta7D"];

  // Transpose the data into layers
  var dataset = d3.layout.stack()(cat.map(function(category) {
    return data.map(function(d) {
      return {x: (d.year), y: +d[category], x2:category};
    });
  }));

  // Set x, y and colors
  var x = d3.scale.ordinal()
    .domain(dataset[0].map(function(d) { return d.x; }))
    .rangeRoundBands([1, widthsb-1], 0.2);

  var y = d3.scale.linear()
    .domain([0, d3.max(dataset, function(d) {  return d3.max(d, function(d) { return d.y0 + d.y; });  })])
    .range([heightsb, 0]);

  // Define and draw axes
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-widthsb, 0, 0)
    .tickFormat( function(d) { return d } );

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
    //.tickFormat(d3.time.format("%Y"));

  svgsb.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  xAxisG = svgsb.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightsb + ")")
    .call(xAxis);

  xAxisG.selectAll("text")
        .attr("y", 0)
        .attr("x", -10)
        .attr("dy", ".35em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .style("font-family", "Arial")
        .style("font-size", "20px")
        .style("shape-rendering", "crispEdges")
        .attr("fill", function(d){return colorarr2[[genetodna[d]]];})
        // .attr("stroke", function(d){return colorarr2[[genetodna[d]]];});  
// on xaxis label hover show that bar in opacity dim others
  xAxisG.selectAll('.tick')
          .on('mouseover', function(d) {
            sync2mousehover(d);
            var ttt=d;
            d3.select(this).selectAll('text')
                           .style("font-size", "28px")
                           .style("fill", "red");          
            svgsb.selectAll("g.cost").selectAll("rect").style("opacity", function(d, i) { 
                          if(d.x != ttt ) return 0.1;  
            });
           })
          .on('mouseout', function(d) {
            sync2mouseout(d);
            var ttt=d;
            d3.select(this).selectAll('text')
                           .style("font-size", "20px")
                           .style("text-anchor", "end")
                           .style("font-family", "Arial")
                           .style("shape-rendering", "crispEdges")
                           .style("fill", function(d){return colorarr2[[genetodna[d]]];});
            svgsb.selectAll("g.cost").selectAll("rect").style("opacity", function(d, i) { 
                          return 1;  
            });
           });   
  // Create groups for each series, rects for each segment 
  var groups = svgsb.selectAll("g.cost")
    .data(dataset)
    .enter().append("g")
    .attr("class", "cost")
    .style("fill", function(d, i) { return colors[i]; });

  var rect = groups.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.x); })
    .attr("y", function(d) { return y(d.y0 + d.y); })
    .attr("height", function(d) { return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .attr("stroke", "black")
    .attr("stroke-width", ".5px")
    .attr("stroke-opacity", ".5")
    .on("mouseover", function(d,i) { 
      d3.select(this).moveToFront();
      d3.select(this).attr("stroke", "red");
      d3.select(this).attr("stroke-width", "4px");
      d3.select(this).attr("stroke-opacity", "1")
      tooltip.style("display", null); 
      // updating relevant chord on rect hover
      var t1= chrtonumber[d.x], t2= chrtonumber[d.x2]
      svg.selectAll("path.chord")
       .filter(function(d) { 
        return !((d.source.index == t1 && d.target.index == t2) || (d.source.index == t2 && d.target.index == t1));
       })
       .transition()
       .style("opacity", .15);

    })
    .on("mouseout", function(d,i) { 
      d3.select(this).attr("stroke", "black");
      d3.select(this).attr("stroke-width", ".5px");
      d3.select(this).attr("stroke-opacity", "0.5");
      tooltip.style("display", "none"); 
      // resetting the chords on mouse hover out
      svg.selectAll("path.chord")
         .transition()
         .style("opacity", 1);
    })
    .on("mousemove", function(d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 35;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.y + " "+ d.x + " <--> "+ d.x2 + " cross genes connections");
      // tooltip.select("text").text(d.y + " "+ crossedgestotarget[d.y] + " cross genes connections");
    });


  // Draw legend
  var legend = svgsb.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(30," + i * 19 + ")"; });
   
  legend.append("rect")
    .attr("x", widthsb - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) {return colors.slice().reverse()[i];})
    .on("mouseover", function(d,i) { 
      syncmousehover(cat[cat.length-i-1]);
      sync2mousehover(cat[cat.length-i-1]);
    })
    .on("mouseout", function(d,i) { 
      syncmouseout(cat[cat.length-i-1]);
      sync2mouseout(cat[cat.length-i-1]);
    });
   
  legend.append("text")
    .attr("x", widthsb + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .style("font-family", "Arial")
    .style("font-size", "14px")
    .style("shape-rendering", "crispEdges")
    // .attr("fill", function(d){return colorarr2[[genetodna[d]]];})
    .attr("fill", function(d,i){return colorarr2[[genetodna[cat[cat.length-i-1]]]];})
    .text(function(d, i) { return cat[cat.length-i-1];})
    .on("mouseover", function(d,i) { 
      syncmousehover(cat[cat.length-i-1]);
      sync2mousehover(cat[cat.length-i-1]);
    })
    .on("mouseout", function(d,i) { 
      syncmouseout(cat[cat.length-i-1]);
      sync2mouseout(cat[cat.length-i-1]);
    });


  // Prep the tooltip bits, initial display is hidden
  var tooltip = svgsb.append("g")
    .attr("class", "tooltip222")
    .style("display", "none");
      
  tooltip.append("rect")
    .attr("width", 100)
    .attr("height", 30)
    .attr("fill", "transparent")
    .style("opacity", 0.5);

  tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("fill", "crimson");

}