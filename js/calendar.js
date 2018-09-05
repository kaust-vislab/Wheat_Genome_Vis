
var margin = {top: 50, right: 50, bottom: 20, left: 50};
var numrows = 131;
var numcols = 131, n=131;


var rowLabels = new Array(numrows);
var columnLabels = new Array(numrows);
var matrix = new Array(numrows);
var roworders,colorders;


var greenrange =["#006400", "#228B22", "#3CB371",  "#90EE90", "#90EE90"]; //green
var bluerange =   ["#0000CD", "#4169E1", "#1E90FF", "#00BFFF", "#87CEFA"]; //blue
var redrange =    ["maroon", "#A52A2A", "#DC143C", "#FF6347", "#F08080"]; //red
 
var colorMap = d3.scale.linear()
    .domain([0, 0.3,0.5,0.8, 1])
    .range(redrange); //green
    //.range(["#0000CD", "#4169E1", "#1E90FF", "#00BFFF", "#87CEFA"]); //blue
    //.range(["maroon", "#A52A2A", "#DC143C", "#FF6347", "#F08080"]); //red

var xscale, yscale;
   

function calendarCalculations(){

  //console.log("inside calcalculations");
    
    var count=0;
    for  (var i in nodesallmap) {
        var x = "MLSP.AIR.039"; if(i == x) x= "MLSP.AIR.012";
        //console.log(i + "  "+nodesallmap[x][i]);
    rowLabels[count]= {label:i, color: nodesallmap[x][i].color, env:nodesallmap[x][i].env};//i;//(i.slice(5, i.length));
    columnLabels[count]= {label:i, color: nodesallmap[x][i].color, env:nodesallmap[x][i].env};//i;// (i.slice(5, i.length));
    count++;
    }
    //columnLabels.sort(function(a, b) { return d3.ascending(a.label, b.label); });
    //rowLabels.sort(function(a, b) { return d3.ascending(a.label, b.label); });
    //console.log(rowLabels);
    //console.log(columnLabels);

      // Precompute the orders.
 roworders = {
    NameAsc: d3.range(n).sort(function(a, b) { return d3.ascending(rowLabels[a].label, rowLabels[b].label); }),
    NameDes: d3.range(n).sort(function(a, b) { return d3.descending(rowLabels[a].label, rowLabels[b].label); }),
    Color: d3.range(n).sort(function(a, b) { return d3.ascending(rowLabels[a].color, rowLabels[b].color);  }),
    Environment: d3.range(n).sort(function(a, b) { return d3.ascending(rowLabels[a].env, rowLabels[b].env); })
  };

 colorders = {
    NameAsc: d3.range(n).sort(function(a, b) { return d3.ascending(columnLabels[a].label, columnLabels[b].label); }),
    NameDes: d3.range(n).sort(function(a, b) { return d3.descending(columnLabels[a].label, columnLabels[b].label); }),
    Color: d3.range(n).sort(function(a, b) { return d3.ascending(columnLabels[a].color, columnLabels[b].color);  }),
    Environment: d3.range(n).sort(function(a, b) { return d3.ascending(columnLabels[a].env, columnLabels[b].env); })
  };



    matrix = new Array(numrows);
    for (var i = 0; i < rowLabels.length; i++) {
      matrix[i] = new Array(numcols);
      for (var j = 0; j < columnLabels.length; j++) {
        var bray;
        if(rowLabels[i].label  ==  columnLabels[j].label) bray =0;
        else bray= nodesfullmap[rowLabels[i].label][columnLabels[j].label];
        //matrix[i][j] = bray;
        matrix[i][j] = {bray_distance: bray, src_vertex: rowLabels[i].label, dest_vertex: columnLabels[j].label} ;
      }
    }
    //console.log(matrix);
}

function sortby(type){
    //console.log(type);
    // if(type == "Name Asc"){
    //     columnLabels.sort(function(a, b) { return d3.ascending(a.label, b.label); });
    //     rowLabels.sort(function(a, b) { return d3.ascending(a.label, b.label); });
    // }
    // else if(type == "Name Des"){
    //     columnLabels.sort(function(a, b) { return d3.descending(a.label, b.label); });
    //     rowLabels.sort(function(a, b) { return d3.descending(a.label, b.label); });
    // }
    // else if(type == "Color"){
    //     columnLabels.sort(function(a, b) { return d3.ascending(a.color, b.color); });
    //     rowLabels.sort(function(a, b) { return d3.ascending(a.color, b.color); });
    // }
    // else if(type == "Environment"){
    //     columnLabels.sort(function(a, b) { return d3.ascending(a.env, b.env); });
    //     rowLabels.sort(function(a, b) { return d3.ascending(a.env, b.env); });
    // }
    if(type == "Order By") return;
    else if(type == "Name Asc") type ="NameAsc"
    else if(type == "Name Des") type ="NameDes"
    xscale.domain(roworders[type]);
    yscale.domain(colorders[type]);
}
function showcal(){
	//console.log("inside showcal");
  d3.selectAll('svg').remove();
  svg.remove();

  var element = $("#" + "map");
  var width= element.parent().width()-100;
  var height = width;
svg = d3.select("#map").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    //.style("margin-left", -margin.left + "px")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

xscale = d3.scale.ordinal()
    .domain(d3.range(numcols))
    .rangeBands([0, width]);

yscale = d3.scale.ordinal()
    .domain(d3.range(numrows))
    .rangeBands([0, height]); 

   // The default sort order.
  xscale.domain(roworders.NameAsc);
  yscale.domain(colorders.NameAsc);
  sortby($("#orderby :selected").text());

if($("#colorscale :selected").text() == "Red") colorMap = d3.scale.linear().domain([0, 0.3,0.5,0.8, 1]).range(redrange);
else if($("#colorscale :selected").text() == "Blue") colorMap = d3.scale.linear().domain([0, 0.3,0.5,0.8, 1]).range(bluerange);
else if($("#colorscale :selected").text() == "Green") colorMap = d3.scale.linear().domain([0, 0.3,0.5,0.8, 1]).range(greenrange);



var cell = svg.selectAll(".cell")
    .data(matrix)
  .enter().append("g")
    .attr("class", "cell")
    .attr("transform", function(d, i) { return "translate(0," + yscale(i) + ")"; });

cell.selectAll(".cell")
    .data(function(d) { return d; })
  .enter().append("rect")
    .attr("class", "cell")
    .attr("x", function(d, i) { return xscale(i); })
    .attr("width", xscale.rangeBand())
    .attr("height", yscale.rangeBand())
    .attr("stroke-width", "0.2px")
    .attr("stroke", "white");


var rows = svg.selectAll(".rows")
    .data(rowLabels)
  .enter().append("g")
    .attr("class", "row")
    .attr("transform", function(d, i) { return "translate(0," + yscale(i) + ")rotate(0)"; });

rows.append("line")
    .attr("x2", width);

rows.append("text")
    .attr("x", -5)
    .attr("y", yscale.rangeBand() / 2)
    .attr("dy", ".32em")
    .attr("id",function(d){
        return d.label + "_src";
    })
    .attr("text-anchor", "end")
    .attr("font-size", 8)
    .attr("fill", function(d){ return d.color == "yellow"? "#FEDF00": d.color;})
    .text(function(d, i) { 
    	if(d.label.includes("AIR")) return d.label.slice(5, d.label.length); 
        else return d.label.slice(6, d.label.length); })
     .append("svg:title")
    .html(function(d) { 
       var t= "Name:"+ d.label + "<br/>" +"Env:"+ d.env ;
       return t; })   
    ;



var column = svg.selectAll(".column")
    .data(columnLabels)
    .enter().append("g")
    .attr("class", "column")
    .attr("transform", function(d, i) { return "translate(" + xscale(i) + ")rotate(-90)"; });

column.append("line")
    .attr("x1", -width);

column.append("text")
    .attr("x", 6)
    .attr("y", yscale.rangeBand() / 2)
    .attr("dy", ".32em")
    .attr("id",function(d){
        return d.label+ "_dest";
    })
    .attr("text-anchor", "start")
    .attr("font-size", 8)
    .attr("fill", function(d){ return d.color == "yellow"? "#FEDF00": d.color;})
    .text(function(d, i) { 
	    if(d.label.includes("AIR")) return d.label.slice(5, d.label.length); 
        else return d.label.slice(6, d.length);  })
    .append("svg:title")
    .html(function(d) { 
       var t= "Name:"+ d.label + "<br/>" +"Env:"+ d.env ;
       return t; }) ;

cell.selectAll(".cell")
    .data(function(d, i) { return matrix[i]; })
    .style("opacity", function(d, i) { return (1-d.bray_distance <0.7) ? 0.7: 1-d.bray_distance  ; })
    .style("fill", function(d){
        return colorMap(d.bray_distance);
    })
    .on("mouseenter", cellmouseenter)
    .on("mouseleave", cellmouseleave)
    .append("svg:title")
    .html(function(d) { 
       var t= "Src_Name:"+ d.src_vertex + "<br/>" +"Dest_Name:"+ d.dest_vertex+ "<br/>" + "Bray Distance:"+ d.bray_distance ;
       return t; });
}

  // function orderchange() {
  //   //clearTimeout(timeout);
  //   sortby($("#orderby :selected").text());
  //   //console.log(rowLabels);
  //   //console.log(columnLabels);
    
  //   var t = svg.transition().duration(2500);

  //   t.selectAll(".row")
  //       .delay(function(d, i) { return yscale(i) * 1; })
  //       .attr("transform", function(d, i) { return "translate(0," + yscale(i) + ")"; });//console.log(d);console.log(yscale(i));

  //   t.selectAll(".cell")
  //       .delay(function(d) { return yscale(d.bray) * 10; })
  //       .attr("transform", function(d,i) { console.log(d);return "translate("+ xscale(i)+"," + yscale(i) + ")";});

  //   t.selectAll(".column")
  //       .delay(function(d, i) { return xscale(i) * 1; })
  //       .attr("transform", function(d, i) { return "translate(" + xscale(i) + ")rotate(-90)"; });
  // }
  //   var timeout = setTimeout(function() {
  //   orderchange();
  //   d3.select("#orderby").property("selectedIndex", 2).node().focus();
  // }, 5000);

function cellmouseenter(d){
    // console.log("mouseenter");
     //console.log(d);
     d3.select(this)
       .attr("stroke-width", "2px")
       .attr("stroke", "#FF00FF");

     d3.select("[id='" + (d.src_vertex+"_src") + "']")
        .transition()
        .duration(800)
        .attr("font-size", 10)
        .attr("fill", "#A0522D"); 
        
     d3.select("[id='" + (d.dest_vertex+"_dest") + "']")
        .transition()
        .duration(800)
        .attr("font-size", 10)
        .attr("fill", "#A0522D");      
}

function cellmouseleave(d){
    // console.log("mouseleave");
    //console.log(d);
    d3.select(this)
       .attr("stroke-width", "0.2px")
       .attr("stroke", "white");

    d3.select("[id='" + (d.src_vertex+"_src") + "']")
        .transition()
        .duration(800)
        .attr("font-size", 8)
        .attr("fill", function(d){ return d.color == "yellow"? "#FEDF00": d.color;}); 

    d3.select("[id='" + (d.dest_vertex+"_dest") + "']")
        .transition()
        .duration(800)
        .attr("font-size", 8)
        .attr("fill", function(d){ return d.color == "yellow"? "#FEDF00": d.color;});   
}