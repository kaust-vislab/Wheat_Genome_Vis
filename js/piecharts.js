

function piechart(className){

   var element = $("." + className);
   var width= 300;//element.parent().width() ;
   var height =320, radius = 65, pad=15;


  //   var btn= $('<input type="button" class="btn btn-success" style="margin-left:170px;" value="Update"/>').bind( "click", function() {
  //     changeData();
  // });
  // element.append(btn);

  var arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(10);

  var labelArc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 45);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.population; });

   d3.select("." + className).selectAll('svg').remove();
   var svg = d3.select("." + className).append("svg").attr("width",width).attr("height",height);

  var c10 = d3.scale.category10();
  var salesData=[
    {label:"Air", color:"#3366CC",population: tot_air_samples},
    {label:"Sea", color:"grey",population: tot_sea_samples}
  ];

  var salesData2=[
      {label:"Air-Air", color:"#5F9EA0", population: tot_air_air_samples},
      {label:"Air-Sea", color:"#8B008B", population: tot_air_sea_samples},
      {label:"Sea-Sea", color:"#CD853F", population: tot_sea_sea_samples},
    ];

  var salesData3=[
      {label:"N Atlantic", color:"cyan", population: gr1},
      {label:"S Atlantic", color:"red", population: gr2},
      {label:"I Ocean", color:"blue", population: gr3},
      {label:"W Pacific", color:"green", population: gr4},
      {label:"C Pacific", color:"rgba(0, 0, 0, 0.23)", population: gr5},
      {label:"E Pacific", color:"magenta", population: gr6},
      {label:"C Atlantic", color:"yellow", population: gr7},
    ];

  var salesData4=[
      {label:"0-0.2", color:c10(1), population: br1},
      {label:"0.2-0.3", color:c10(2), population: br2},
      {label:"0.3-0.6", color:c10(3), population: br3},
      {label:"0.6-0.8", color:c10(4), population: br4},
      {label:"0.8-1.0", color:c10(5), population: br5},
    ];

//<!----------------------------------------------------------First pie-------------------------------------------------------------------------> 
   var firstpie= svg.append("g")
                 .attr("transform", "translate(" + (radius+pad) + "," + (radius+1.5*pad)+ ")");


   var g = firstpie.selectAll(".arc")
               .data(pie(salesData))
               .enter().append("g")
               .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { 
        return d.data.color; })
        .on("mouseover", function(d, i) {

          var endAngle = d.endAngle + 0;
          var startAngle = d.startAngle - 0;
         
          var arcOver = d3.svg.arc()
                          .outerRadius(radius + 9).endAngle(endAngle).startAngle(startAngle);
         
            d3.select(this)
               .attr("stroke","white")
               .transition()
               .duration(1000)
               .attr("d", arcOver)             
               .attr("stroke-width",6);

          firstpie.append("text")
            .attr("dy", ".5em")
            .style("text-anchor", "middle")
            .style("font-size", 28)
            .attr("class","label")
            .style("fill", function(d,i){return "black";})
            .text(d.data.label +":"+ d.data.population);
          
      })
      .on("mouseout", function(d) {
         d3.select(this).transition()            
               .attr("d", arc)
               .attr("stroke","none");     
        firstpie.select(".label").remove();
      })
      .append("svg:title")
      .html(function(d) { 
            return d.data.label+ ":"+ d.data.population; 
      });


      // Add a label to the larger arcs, translated to the arc centroid and rotated.
       g.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("text")
           .attr("dy", ".25em")
           .attr("text-anchor", "middle")
           .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")rotate(" + angle(d) + ")"; })
           .text(function(d) { return d.data.label; });
//<!----------------------------------------------------------First pie ends------------------------------------------------------------------------->           


var secondpie= svg.append("g")
                 .attr("transform", "translate(" + (2*(radius+pad)+radius) + "," + (radius+1.5*pad)+ ")");


   var g2 = secondpie.selectAll(".arc")
               .data(pie(salesData2))
               .enter().append("g")
               .attr("class", "arc");

  g2.append("path")
      .attr("d", arc)
      .style("fill", function(d) { 
        return d.data.color; })
        .on("mouseover", function(d, i) {

          var endAngle = d.endAngle + 0;
          var startAngle = d.startAngle - 0;
         
          var arcOver = d3.svg.arc()
                          .outerRadius(radius + 9).endAngle(endAngle).startAngle(startAngle);
         
            d3.select(this)
               .attr("stroke","white")
               .transition()
               .duration(1000)
               .attr("d", arcOver)             
               .attr("stroke-width",6);

          secondpie.append("text")
            .attr("dy", ".5em")
            .style("text-anchor", "middle")
            .style("font-size", 24)
            .attr("class","label")
            .style("fill", function(d,i){return "black";})
            .text(d.data.label +":"+ d.data.population);
          
      })
      .on("mouseout", function(d) {
         d3.select(this).transition()            
               .attr("d", arc)
               .attr("stroke","none");     
        secondpie.select(".label").remove();
      })
      .append("svg:title")
      .html(function(d) { 
            return d.data.label+ ":"+ d.data.population; 
      });


      // Add a label to the larger arcs, translated to the arc centroid and rotated.
       g2.filter(function(d) { 
        //console.log(d.endAngle + " "+ d.startAngle + " "+ d.data.label + " "+ angle(d));
         return d.endAngle - d.startAngle > .2; })
           .append("text")
           .attr("dy", ".25em")
           .attr("text-anchor", "middle")
           .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")rotate(" + angle(d) + ")"; })
           .text(function(d) { return d.data.label; });

//<!----------------------------------------------------------Second pie ends------------------------------------------------------------------------->  

var thirdpie= svg.append("g")
                 .attr("transform", "translate(" + ((radius+pad)) + "," + (2*(radius+pad)+radius +1.5*pad)+ ")");


   var g3 = thirdpie.selectAll(".arc")
               .data(pie(salesData3))
               .enter().append("g")
               .attr("class", "arc");

  g3.append("path")
      .attr("d", arc)
      .style("fill", function(d) { 
        return d.data.color; })
        .on("mouseover", function(d, i) {

          var endAngle = d.endAngle + 0;
          var startAngle = d.startAngle - 0;
         
          var arcOver = d3.svg.arc()
                          .outerRadius(radius + 9).endAngle(endAngle).startAngle(startAngle);
         
            d3.select(this)
               .attr("stroke","white")
               .transition()
               .duration(1000)
               .attr("d", arcOver)             
               .attr("stroke-width",6);

          thirdpie.append("text")
            .attr("dy", ".5em")
            .style("text-anchor", "middle")
            .style("font-size", 20)
            .attr("class","label")
            .style("fill", function(d,i){return "black";})
            .text(d.data.label +":"+ d.data.population);
          
      })
      .on("mouseout", function(d) {
         d3.select(this).transition()            
               .attr("d", arc)
               .attr("stroke","none");     
        thirdpie.select(".label").remove();
      })
      .append("svg:title")
      .html(function(d) { 
            return d.data.label+ ":"+ d.data.population; 
      });


      // Add a label to the larger arcs, translated to the arc centroid and rotated.
       g3.filter(function(d) { 
            return d.endAngle - d.startAngle > .2; })
           .append("text")
           .attr("dy", ".25em")
           .attr("text-anchor", "middle")
           .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")rotate(" + angle(d) + ")"; })
           .text(function(d) { return d.data.label; });

//<!----------------------------------------------------------third pie ends-------------------------------------------------------------------------> 

var fourthpie= svg.append("g")
                 .attr("transform", "translate(" + (2*(radius+pad)+radius) + "," + (2*(radius+pad)+radius+1.5*pad)+ ")");


   var g4 = fourthpie.selectAll(".arc")
               .data(pie(salesData4))
               .enter().append("g")
               .attr("class", "arc");

  g4.append("path")
      .attr("d", arc)
      .style("fill", function(d) { 
        return d.data.color; })
        .on("mouseover", function(d, i) {

          var endAngle = d.endAngle + 0;
          var startAngle = d.startAngle - 0;
         
          var arcOver = d3.svg.arc()
                          .outerRadius(radius + 9).endAngle(endAngle).startAngle(startAngle);
         
            d3.select(this)
               .attr("stroke","white")
               .transition()
               .duration(1000)
               .attr("d", arcOver)             
               .attr("stroke-width",6);

          fourthpie.append("text")
            .attr("dy", ".5em")
            .style("text-anchor", "middle")
            .style("font-size", 28)
            .attr("class","label")
            .style("fill", function(d,i){return "black";})
            .text(d.data.label +":"+ d.data.population);
          
      })
      .on("mouseout", function(d) {
         d3.select(this).transition()            
               .attr("d", arc)
               .attr("stroke","none");     
        fourthpie.select(".label").remove();
      })
      .append("svg:title")
      .html(function(d) { 
            return d.data.label+ ":"+ d.data.population; 
      });


      // Add a label to the larger arcs, translated to the arc centroid and rotated.
       g4.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("text")
           .attr("dy", ".25em")
           .attr("text-anchor", "middle")
           .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")rotate(" + angle(d) + ")"; })
           .text(function(d) { return d.data.label; });

//<!----------------------------------------------------------fourth pie ends-------------------------------------------------------------------------> 

//<!----------------------------------------------------------Legends text-------------------------------------------------------------------------> 
  var text = svg.append("g")
      .attr("transform", "translate (0,"+0+")")
      .attr("class", "legend-items");

      text.append("text")
            .attr("x", (radius+pad))
            .attr("y", 12)
            .attr("font-size", "18px")
            .attr("text-anchor", "middle")
            .attr("class", "legend-title")
            .text("Samples") ;

      text.append("text")
            .attr("x", ((2*(radius+pad)+radius)))
            .attr("y", 12)
            .attr("font-size", "18px")
            .attr("text-anchor", "middle")
            .attr("class", "legend-title")
            .text("Relationships") ; 
            
        text.append("text")
            .attr("x", (radius+pad))
            .attr("y", (2*(radius+pad) + pad))
            .attr("font-size", "18px")
            .attr("text-anchor", "middle")
            .attr("class", "legend-title")
            .text("Environments") ; 
                 
       text.append("text")
            .attr("x", ((2*(radius+pad)+radius)))
            .attr("y", (2*(radius+pad)+pad))
            .attr("font-size", "18px")
            .attr("text-anchor", "middle")
            .attr("class", "legend-title")
            .text("Bray Distance") ;            

//<!----------------------------------------------------------Legends text-------------------------------------------------------------------------> 




function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }

}