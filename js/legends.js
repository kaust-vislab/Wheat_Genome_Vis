
var draw_Legends = function (){
  var boxwidth = width, boxheight=50; lineheight = 14, boxmargin = 2;
  var startx=150, starty=5, gap=10, vgap=90;
  var margin = { "left": 0, "top": 3 };
  var y1, y2= starty*6, y2text=starty*8;

var title = ['LEGENDS'],
    titleheight = 2; //title.length*lineheight + boxmargin;
    

var legend = svg0.append("g")
    .attr("transform", "translate ("+margin.left+","+margin.top+")")
    .attr("class", "legend");

// make legend box 
var lb = legend.append("rect")
    .attr("transform", "translate (0,"+titleheight+")")
    .attr("class", "legend-box")
    .attr("id", "legendrect")
    .attr("width", boxwidth)
    .attr("height", boxheight);

// make quantized key legend items
var li = legend.append("g")
    //.attr("transform", "translate (8,"+(titleheight+boxmargin)+")")
    .attr("text-align", "center")
    .attr("class", "legend-items")
    .attr("id", "legendg");



    li.append("text")
          .attr("x", (10))
          .attr("y", 30)
          .attr("font-size", "24px")
          .attr("class", "legend-titleM")
          .text(title) ;

    li.append("circle")
      .attr("cx", startx+5)
      .attr("cy", starty+5)
      .attr("r", 5)
      .attr("fill", "white")
      .attr("stroke", "#211606") //31708F
      .attr("stroke-width", "3px");

    li.append("text")
      .attr("x", (startx+5) + gap)
      .attr("y", 14)
      .attr("class", "legend-title")
      .text("Air Sample") ;


    li.append("rect")
          .attr("x", startx)
          .attr("y", y2)
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", "grey")
          .attr("stroke", "#d2d1d1") //31708F
          .attr("stroke-width", "3px");

    li.append("text")
          .attr("x", (startx+5) + gap)
          .attr("y", y2text)
          .attr("class", "legend-title")
          .text("Sea Sample") ; 
          
   li.append("rect")
          .attr("x", startx + vgap +gap*8)
          .attr("y", y2+2.5)
          .attr("width", 60)
          .attr("height", 5)
          .attr("fill", "#5F9EA0");

    li.append("text")
          .attr("x", (startx+5) + vgap +gap*14)
          .attr("y", y2text)
          .attr("class", "legend-title")
          .text("Air - Air") ; 

    li.append("rect")
          .attr("x", startx + vgap +gap*26)
          .attr("y", y2+2.5)
          .attr("width", 60)
          .attr("height", 5)
          .attr("fill", "#8B008B");

    li.append("text")
          .attr("x", (startx+5) + vgap +gap*32)
          .attr("y", y2text)
          .attr("class", "legend-title")
          .text("Air - Sea") ;

    li.append("rect")
          .attr("x", startx + vgap +gap*45)
          .attr("y", y2+2.5)
          .attr("width", 60)
          .attr("height", 5)
          .attr("fill", "#CD853F");

    li.append("text")
          .attr("x", (startx+5) + vgap +gap*51)
          .attr("y", y2text)
          .attr("class", "legend-title")
          .text("Sea - Sea") ;

    li.append("circle")
      .attr("cx", startx+5 + vgap + gap*2)
      .attr("cy", starty + 5)
      .attr("r", 5)
      .attr("fill", "cyan")
      .attr("stroke", "#211606") //31708F
      .attr("stroke-width", "3px");

    li.append("text")
      .attr("x", (startx+5) + vgap+ gap*3)
      .attr("y", 14)
      .attr("class", "legend-title")
      .text("N Atlantic") ;

      li.append("circle")
            .attr("cx", (startx+5) + vgap*2+ gap*3)
            .attr("cy", starty+5)
            .attr("r", 5)
            .attr("fill", "red")
            .attr("stroke", "#211606") //31708F
            .attr("stroke-width", "3px");

     li.append("text")
            .attr("x", (startx+5)+vgap*2 + gap*4)
            .attr("y", 14)
            .attr("class", "legend-title")
            .text("S Atlantic") ;

    li.append("circle")
                  .attr("cx", ((startx+5)+vgap*3 + gap*4))
                  .attr("cy", starty+5)
                  .attr("r", 5)
                  .attr("fill", "blue")
                  .attr("stroke", "#211606") //31708F
                  .attr("stroke-width", "3px");

     li.append("text")
                  .attr("x", (startx+5)+vgap*3 + gap*5)
                  .attr("y", 14)
                  .attr("class", "legend-title")
                  .text("Ind Ocean") ;

     li.append("circle")
                       .attr("cx", ((startx+5)+vgap*4 + gap*5))
                       .attr("cy", starty+5)
                       .attr("r", 5)
                       .attr("fill", "green")
                       .attr("stroke", "#211606") //31708F
                       .attr("stroke-width", "3px");

     li.append("text")
                       .attr("x", (startx+5)+vgap*4 + gap*6)
                       .attr("y", 14)
                       .attr("class", "legend-title")
                       .text("W Pacific") ;

     li.append("circle")
                            .attr("cx", ((startx+5)+vgap*5 + gap*6))
                            .attr("cy", starty+5)
                            .attr("r", 5)
                            .attr("fill", "black")
                            .attr("stroke", "#211606") //31708F
                            .attr("stroke-width", "3px");

     li.append("text")
                            .attr("x", (startx+5)+vgap*5 + gap*7)
                            .attr("y", 14)
                            .attr("class", "legend-title")
                            .text("C Pacific") ;

     li.append("circle")
                            .attr("cx", (startx+5)+vgap*6 + gap*7)
                            .attr("cy", starty+5)
                            .attr("r", 5)
                            .attr("fill", "magenta")
                            .attr("stroke", "#211606") //31708F
                            .attr("stroke-width", "3px");

     li.append("text")
                            .attr("x", (startx+5)+vgap*6 + gap*8)
                            .attr("y", 14)
                            .attr("class", "legend-title")
                            .text("E Pacific") ;
                            
     li.append("circle")
                            .attr("cx", (startx+5)+vgap*7 + gap*8)
                            .attr("cy", starty+5)
                            .attr("r", 5)
                            .attr("fill", "yellow")
                            .attr("stroke", "#211606") //31708F
                            .attr("stroke-width", "3px");

     li.append("text")
                            .attr("x", (startx+5)+vgap*7 + gap*9)
                            .attr("y", 14)
                            .attr("class", "legend-title")
                            .text("C Atlantic") ;  

var gx= (document.getElementById("legendrect").getBBox().width- document.getElementById("legendg").getBBox().width)/2;
li.attr("transform", "translate ("+gx+ ","+(titleheight+boxmargin)+")");
}