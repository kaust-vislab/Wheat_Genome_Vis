//-------------------------------Word Cloud-----------------------------------------------------
//-----------------------------------------------------------------------------------------------
function wordcloud(className, freqarr){

  var element = $("." + className);

  //console.log(freqarr);
  var frequency_list=[];
  for(var i in freqarr){

  	frequency_list.push({text: (i+ ":"+freqarr[i].toFixed(2)+""), size: returntextsize(freqarr[i])});
  }
  
  var width= element.parent().width() ;
  var height =150;

    var color = d3.scale.category20();

   d3.select("." + className).selectAll('svg').remove();


    d3.layout.cloud().size([width-45, height])
            .words(frequency_list)
            .rotate(function(d){return (~~(Math.random() * 6) - 3) * 0; })
            .fontSize(function(d) { return d.size; })
            //.fontWeight([900])
            .on("end", draw)
            .start();

    function draw(words) {
        d3.select("." + className).append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("class", "wordcloud")
                .append("g")
                .attr("id", "wordsg")
                // without the transform, words words would get cutoff to the left and top, they would
                // appear outside of the SVG area
                .attr("transform", "translate("+ (width/4)+",75)")
                .selectAll("text")
                .data(words)
                .enter().append("text")
                .style("font-size", function(d) { 
                  return ((d.size) *1) + "px"; })
                  // .style("font-weight", "400");
                .style("font-weight", function(d) { 
                  return (returntextweight(d.size) *1) ; })
                .style("fill", function(d, i) { return color(i); })
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
                     })
                // .on("mouseout", function(d) {console.log("mouse out "+d.text+ d.size);
                // 	d3.select(this).style("font-size", function(d) { return (d.size - 50)+ "px"; });
                // 	console.log("mouse out after increase "+d.text+ d.size);
                //                              })
                ;

         //var gx= (width- document.getElementById("wordsg").getBBox().width);
        //d3.select("[id='" + "wordsg" + "']").attr("transform", "translate ("+gx+ ","+ 75+")");       
    }
}

function returntextsize(bray){
      var w=30;
      if(bray<0.3) w=30;
      else if(bray>=0.3 && bray <0.4) w=25;
      else if(bray>=0.4 && bray <0.5) w=22;
      else if(bray>=0.5 && bray <0.6) w=19;
      else if(bray>=0.6 && bray <0.7) w=15;
      else if(bray>=0.8 && bray <=1.0) w=10;
      return w;
}

function returntextweight(bray){
      var w=700,t=600;
      if(bray<0.3) w=600;
      else if(bray>=0.3 && bray <0.4) w=500;
      else if(bray>=0.4 && bray <0.5) w=400;
      else if(bray>=0.5 && bray <0.6) w=300;
      else if(bray>=0.6 && bray <0.7) w=200;
      else if(bray>=0.8 && bray <=1.0) w=150;
      return t;
}
//-------------------------------Word Cloud ends-----------------------------------------------------
//-----------------------------------------------------------------------------------------------
