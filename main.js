function generatechord(matrix1){
  var showchords=1;
  svg.select("#blocks").remove();   
  svg.select("#edgesg").remove();        
  svg.select("#genesg").remove();  

  var widthc = width-0,//1200,
      heightc = height-0,
      outerRadius = Math.min(widthc, heightc) / 2 - 100,
      innerRadius = outerRadius - 28;

  var formatPercent = d3.format(".3f");

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
      .attr("transform", "translate(" + widthc / 2 + "," + heightc / 2 + ")");

  svgc.append("circle")
      .attr("r", outerRadius)
      .style("fill","none");


  d3.csv("species-oceanic.csv", function(cities) {
    // Compute the chord layout.
    layout.matrix(matrix1);



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
     // return "green";
      // if(matrix1[d.source.index][d.target.index] < 0) return 'red';
      //         else return 'green';
      return cities[d.source.index].color;
        //return colors(d.source.index); 
      });

    //Set the ending color (at 100%)
    grads.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", function(d){ 
          //return "red";
      // if(matrix1[d.target.index][d.source.index] < 0) return 'red';
      //         else return 'green';
      return cities[d.target.index].color;
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
        .style("fill", function(d, i) { return cities[i].color; })
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
      .style("fill", function(d, i) { return cities[i].color; })
    .attr("shape-rendering","crispEdges")
    .attr("font-family","Arial")
    .attr("font-size","20px");


    // Add the chords.
    var chord = svgc.selectAll(".chord")
        .data(layout.chords)
      .enter().append("path")
        .attr("class", "chord")
        .style("fill", function(d,i) {     
          // console.log(cities[d.source.index].name + " "+ cities[d.target.index].name + " "+ d.source.value);
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
          // console.log(cities[d.source.index].name + " "+ cities[d.target.index].name + " "+ d.source.value);
          var s=cities[d.source.index].name.charAt(2);
          var t =cities[d.target.index].name.charAt(2);
          if(s == t) return cities[d.target.index].color; 
          else return "red"
        })
        .style("stroke-width", function(d, i) { return '1px'; })
        .attr("d", path)
        // .on("mouseover", chordmouseover)
        // .on("mouseout", chordmouseout);

    //Add an elaborate mouseover title for each chord.
    chord.append("title").text(function(d) {
      //console.log(matrix2[d.source.index][d.target.index]);
      var temp=1;
      if(matrix1[d.source.index][d.target.index] < 0) temp=-1;
      return cities[d.source.index].name
          + " <-> " + cities[d.target.index].name
          + ": " + formatPercent(d.source.value*temp);
          // + "\n" + cities[d.target.index].name
          // + " → " + cities[d.source.index].name
          // + ": " + formatPercent(d.target.value*temp);
    });

   function mouseover(d, i) {
       svg.selectAll("path.chord")
        .filter(function(d) { 
          //console.log(d);
          if(showchords==1)  return d.source.index !== i && d.target.index !== i; 
          else if(showchords==2) { 
             if(matrix1[d.source.index][d.target.index] > 0) return d.source.index !== i && d.target.index !== i; 
          }
          else if(showchords==3) { 
             if(matrix1[d.source.index][d.target.index] < 0) return d.source.index !== i && d.target.index !== i; 
          }
        })
        .transition()
        .style("opacity", 0.15);
    }
    function mouseout(d, i) {
       svg.selectAll("path.chord")
        .filter(function(d) { 
          if(showchords==1)  return d.source.index !== i && d.target.index !== i; 
          else if(showchords==2) { 
             if(matrix1[d.source.index][d.target.index] > 0) return d.source.index !== i && d.target.index !== i; 
          }
          else if(showchords==3) { 
             if(matrix1[d.source.index][d.target.index] < 0) return d.source.index !== i && d.target.index !== i; 
          }
        })
        .transition()
        .style("opacity", 1);
    }
    
  function chordmouseover(d, i) {
       svg.selectAll("path.chord")
        .filter(function(d) { 
          //console.log(d);
          if(showchords==1)  return true; 
          else if(showchords==2) { 
             if(matrix1[d.source.index][d.target.index] > 0) return true; 
          }
          else if(showchords==3) { 
             if(matrix1[d.source.index][d.target.index] < 0) return true; 
          }
        })
        .transition()
        .style("opacity", 0.15);

        if(showchords==2) { 
             if(matrix1[d.source.index][d.target.index] > 0) d3.select(this).transition().style("opacity", 1);
          }
          else if(showchords==3) { 
             if(matrix1[d.source.index][d.target.index] < 0) d3.select(this).transition().style("opacity", 1);
          }
          else d3.select(this).transition().style("opacity", 1);
        
    }
    function chordmouseout(d, i) {
       svg.selectAll("path.chord")
        .filter(function(d) { 
          if(showchords==1)  return true; 
          else if(showchords==2) { 
             if(matrix1[d.source.index][d.target.index] > 0) return true; 
          }
          else if(showchords==3) { 
             if(matrix1[d.source.index][d.target.index] < 0) return true; 
          }
        })
        .transition()
        .style("opacity", 1);
    }

 //Append Legend
// var teams = [
//   "Global Solutions " ,
//   "Local Solutions",
//   "Ecosystems and services",  "Climate Drivers","",
//   "Effectiveness = 5",
//   "Effectiveness = 4 - 4.99",
//   "Effectiveness = 3 - 3.99",
//   "Effectiveness = 2 - 2.99",
//   "Effectiveness = 1 - 1.99"];

// var colors = [ "#DF7C00", "#BFAE40", "#8bc48a", "#DB7093", "white", "red","rgba(0,0,255,0.75)","#696969","cyan", "purple"];  //#083E77 bluish

// var color = d3.scale.ordinal()      //custom color scale for teams
//                 .range(colors)
//                 .domain(teams);
// svg.append("rect")   
// .attr("x",((width/4)))
// .attr("y",-height/3)
// .attr("width",180)
// .attr("height",210)
// .attr("style","fill-opacity:0;stroke:black;stroke-width:1.5px");

// var legend = svg.append("g")
//     .attr("class", "legend")
//     .attr("width", 150)
//     .attr("height", 150)
//     .attr("transform", "translate("+ ((width/4)+5) + ",-"+ ((height/3)-10) +" )");

// var gs = legend.selectAll("g.keybox")
//           .data(teams).enter().append("g")
//           .attr("class", "keybox")
//           .attr("width", 80)
//           .attr("height", 15);

// gs.append("text")
//   .attr("class","keybox").attr("x",function(d,i){
//     if(i<10){return 15;}
//     else{return 90;}})
//   .attr("y",function(d,i){
//     if(i<10){return i*20 +9;}
//     else{return (i-4)*20 +9;}})
//   .text(function(d,i){
//     return teams[i];})
//   .attr("font-size","14px");
  

// gs.append("rect")        
//   .attr("x",function(d,i){
//     if(i<10){return 0;}
//     else{return 75;}})
//   .attr("y",function(d,i){
//      if(i<10){return i*20;
//      }
//      else{return (i-4) * 20;}})
//   .attr("width",10)
//   .attr("height",10)
//   .style("fill",function(d, i){
//     return colors[i];});



  //});
});

} //#8bc48a #fd8b8a