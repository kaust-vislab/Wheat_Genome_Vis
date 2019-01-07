

function simpleSlider () {

    var width = 100,
        value = 0.5, /* Domain assumes to be [0 - 1] */
        event,event2,
        x = 0,
        y = 0;

    function slider (selection) {

        //Line to represent the current value
        var valueLine = selection.append("line")
            .attr("x1", x)
            .attr("x2", x + (width * value))
            .attr("y1", y)
            .attr("y2", y)
            .style({stroke: "#d43f3a",
                    "stroke-linecap": "round",
                    "stroke-width": 6 });

        //Line to show the remaining value
        var emptyLine = selection.append("line")
            .attr("x1", x + (width * value))
            .attr("x2", x + width)
            .attr("y1", y)
            .attr("y2", y)
            .style({
                "stroke": "#9e9e9ea3",
                "stroke-linecap": "round",
                "stroke-width": 6
            });

        var drag = d3.behavior.drag()
             .on("drag", function() {
                       var newX = d3.mouse(this)[0];

                       if (newX < x)
                           newX = x;
                       else if (newX > x + width)
                           newX = x + width;

                       value = (newX - x) / width;
                       valueCircle.attr("cx", newX);valueCircle.style("fill", "red");
                       valueLine.attr("x2", x + (width * value));
                       emptyLine.attr("x1", x + (width * value));

                       if (event) event();
                       d3.event.sourceEvent.stopPropagation();
              })
             .on("dragend", function() {
             		valueCircle.style("fill", "white");
             		if (event2) event2();                  
                    d3.event.sourceEvent.stopPropagation();
             });
        //Draggable circle to represent the current value
        var valueCircle = selection.append("circle")
            .attr("cx", x + (width * value))
            .attr("cy", y)
            .attr("r", 8)
            .style({
                "stroke": "black",
                "stroke-width": 0.5,
                "fill": "white"
            })
            .on("mouseover", function(d,i) {
                 d3.select(this).style("fill", "red");
                 // d3.select(this).style("font-size", "28px");
            }) 
            .on("mouseout", function(d,i) { 
                 d3.select(this).style("fill", "white");
                 // d3.select(this).style("font-size", "20px");
            }) 
            .call(drag);
    }


    slider.x = function (val) {
        x = val;
        return slider;
    }

    slider.y = function (val) {
        y = val;
        return slider;
    }

    slider.value = function (val) {
        if (val) {
            value = val;
            return slider;
        } else {
            return value;
        }
    }

    slider.width = function (val) {
        width = val;
        return slider;
    }

    slider.event = function (val) {
        event = val;
        return slider;
    }

    slider.event2 = function (val) {
        event2= val;
        return slider;
    }

    return slider;
}