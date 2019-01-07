//-------------------------------Word Cloud-----------------------------------------------------
//-----------------------------------------------------------------------------------------------
function wordcloud( freqarr,x,y){  //className,

  var width_wc=  200;  //element.parent().width()
  var height_wc =200;

  if(svg.select("#wordcloud"))svg.select("#wordcloud").remove();
  if(y>(height-80)) y= y-height_wc;
  var svgwc= svg.append("g")
       .attr("id", "wordcloud")
       // .attr("transform", "translate(" + ((onecolumnwidth*3)-(onecolumnwidth/3.5)) + "," + (height-(rectheight+10))+ ")");
       .attr("transform", "translate("+ (x+45) +","+ (y-10)+ ")");

  // console.log(freqarr);
  var frequency_list=[];
  for(var i in freqarr){
  	frequency_list.push({text: (i), size: returntextsize(freqarr[i])}); // + ":"+freqarr[i].toFixed(0)+""
  }
  
   var borderPath = svgwc.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", height_wc)
            .attr("width", width_wc)
            .style("stroke", "black")
            .style("fill", "white")
            .style("stroke-width", "1px");


    d3.layout.cloud().size([width_wc, height_wc])
            .words(frequency_list)
            .rotate(function(d){return (~~(Math.random() * 6) - 3) * 0; })
            .fontSize(function(d) { return d.size; })
            //.fontWeight([900])
            .on("end", draw)
            .start();

    function draw(words) {
        // d3.select("." + className).append("svg")
        //         .attr("width", width)
        //         .attr("height", height)
        //         .attr("class", "wordcloud")
           // .append("g")
           // .attr("id", "wordcloud")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                // .attr("transform", "translate("+ (1000)+",75)")
                // .attr("transform", "translate("+ (x+100) +","+ y+ ")")
           svgwc.append("g")
                .attr("transform", "translate("+ (width_wc/4) +","+ (height_wc/2)+ ")")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { 
                  return ((d.size) *1) + "px"; })
                  // .style("font-weight", "400");
                .style("font-weight", function(d) { 
                  return (returntextweight(d.size) *1) ; })
                .style("fill", function(d, i) { return colorarr2[genetodna[d.text]]; })  //color(i)
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })                
                .text(function(d) { return d.text; })
                .on("mouseover", function(d) {
                	d3.select(this).transition()
			            .ease("cubic-out")
			            .duration("100")
			            //.attr("rotate", 2)
                  .style("font-size", function(d) { return (d.size+10) + "px"; })
                     })
                .on("mouseout", function(d) {
                	d3.select(this).transition()
			            .ease("cubic-out")
			            .duration("100")
			            //.attr("rotate", 0)
                  .style("font-size", function(d) { return (d.size) + "px"; })
                     }) ;
    }
}

function returntextsize(cedges){
      var w=30;
      if(cedges<10) w=0;
      else if(cedges>=10 && cedges <50) w=15;
      else if(cedges>=50 && cedges <100) w=20;
      else if(cedges>=100 && cedges <200) w=25;
      else if(cedges>=200 && cedges <500) w=30;
      else if(cedges>=500 && cedges <1000) w=33;
      else if(cedges>=1000 && cedges <2000) w=37;
      else if(cedges>=2000 ) w=40;
      return w+10;
}

function returntextweight(cedges){
      var w=700,t=800;
      if(cedges<0.3) w=600;
      else if(cedges>=0.3 && cedges <0.4) w=500;
      else if(cedges>=0.4 && cedges <0.5) w=400;
      else if(cedges>=0.5 && cedges <0.6) w=300;
      else if(cedges>=0.6 && cedges <0.7) w=200;
      else if(cedges>=0.8 && cedges <=1.0) w=150;
      return t;
}
//-------------------------------Word Cloud ends-----------------------------------------------------
//-----------------------------------------------------------------------------------------------

function drawWordCloud(word_count,x,y){  

      var width_wc=  250; 
      var height_wc =250;

      if(svg.select("#wordcloud"))svg.select("#wordcloud").remove();
      if(y>(height-200)) y= y-height_wc;
      var svgwc= svg.append("g")
           .attr("id", "wordcloud")
           .attr("transform", "translate("+ (x+45) +","+ (y-10)+ ")");

        var fill = d3.scale.category20();
        var word_entries = d3.entries(word_count);

        var xScale = d3.scale.linear()
           .domain([0, d3.max(word_entries, function(d) {
              return d.value;
            })
           ])
           .range([20,80]);

        var borderPath = svgwc.append("rect")
                 .attr("x", 0)
                 .attr("y", 0)
                 .attr("rx", 6)
                 .attr("ry", 6)
                 .attr("height", height_wc)
                 .attr("width", width_wc)
                 .style("stroke", "black")
                 .style("fill", "white")
                 .style("stroke-width", "0.2px");

        d3.layout.cloud().size([width_wc, height_wc])
          .timeInterval(20)
          .words(word_entries)
          .fontSize(function(d) { return xScale(+d.value); })
          .text(function(d) { return d.key; })
          .rotate(function() { return ~~(Math.random() * 2) * 90; })
          .font("Impact")
          .on("end", draw)
          .start();

        function draw(words) {
         svgwc.append("g")
              .attr("width", width_wc)
              .attr("height", height_wc)
              .attr("transform", "translate(" + [width_wc >> 1, height_wc >> 1] + ")")
              .selectAll("text")
              .data(words)
              .enter().append("text")
              .style("font-size", function(d) { return xScale(d.value) + "px"; })
              .style("font-family", "Impact")
              .style("fill", function(d, i) { return colorarr2[genetodna[d.text]]; }) // fill(i)
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d.key; });
        }

        d3.layout.cloud().stop();
}// end function drawwordcloud
