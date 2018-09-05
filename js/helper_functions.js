// --- Helper functions (for tweening the path)
       var lineTransition = function lineTransition(path) {
        if(edge_transitions){
           path.transition()
               //NOTE: Change this number (in ms) to make lines draw faster or slower
               .duration(3000)
               .attrTween("stroke-dasharray", tweenDash)
               .each("end", function(d,i) { 
                   ////Uncomment following line to re-transition
                   //d3.select(this).call(transition); 
                   
                   //We might want to do stuff when the line reaches the target,
                   //doStuffWhenLineFinishes(d,i);
               });
             }
       };
       var tweenDash = function tweenDash() {
           //This function is used to animate the dash-array property, which is a
           //  nice hack that gives us animation along some arbitrary path (in this
           //  case, makes it look like a line is being drawn from point A to B)
           var len = this.getTotalLength(),
               interpolate = d3.interpolateString("0," + len, len + "," + len);
           return function(t) { return interpolate(t); };
;       };


       function nodeTransition(path) {
        //console.log(d3.select(this).datum());
           path.transition()
               .duration(800)
               .style('stroke-width', 5)
               .style('stroke', "white")
               .each("end", function(d,i) { 
                   ////Uncomment following line to re-transition
                   d3.select(this).call(nodeTransition2); 
               });
              // console.log(b);
       };

       function nodeTransition2(path) {
           path.transition()
               .duration(800)
               .style('stroke-width', 0)
               .style('stroke', function(d){
              return (path.datum().properties.Category=="AIR" ? "#211606" : "#d2d1d1" );
            })
               .each("end", function(d,i) { 
                   ////Uncomment following line to re-transition  
                   d3.select(this).call(nodeTransition); 
               });
       };

      var neighbortransition = function neighbortransition(path) {
           path.transition()
               .duration(800)
               //.style('stroke-width', 5)
               .style('stroke', "red")
               .each("end", function(d,i) { 
                   ////Uncomment following line to re-transition
                   d3.select(this).call(neighbortransition2); 
               });
       };

       var neighbortransition2 = function neighbortransition2(path) {
           path.transition()
               .duration(800)
               //.style('stroke-width', 3)
               .style('stroke', function(d){
                  if(path.datum().properties.src_category =="AIR" && path.datum().properties.dest_category =="AIR"){ 
                  return "#5F9EA0";}
                  else if(path.datum().properties.src_category =="AIR" && path.datum().properties.dest_category =="SEAWATER"){ 
                  return "#8B008B";}
                  else if(path.datum().properties.src_category =="SEAWATER" && path.datum().properties.dest_category =="AIR"){ 
                  return "#8B008B";}
                  else if(path.datum().properties.src_category =="SEAWATER" && path.datum().properties.dest_category =="SEAWATER"){ 
                  return "#CD853F";}
            })
               .each("end", function(d,i) { 
                   ////Uncomment following line to re-transition
                   d3.select(this).call(neighbortransition); 
               });
       };


//----------------------------------------------------------------------------------------------------------------------------------------
var nodesmap= function (datapoints){
     nodeshashmap =[];    
    for (var i = 0; i <datapoints.length ; i++) //datapoints.length
    {
       if(!(datapoints[i].properties.src_vertex in nodeshashmap)){
         nodeshashmap[datapoints[i].properties.src_vertex]= new Array (datapoints[i].properties.dest_vertex); 
         //console.log(i+ " "+ datapoints[i].properties.dest_vertex + " "+ datapoints[i].properties.src_vertex + " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
       }
       else {
         var inarray = nodeshashmap[datapoints[i].properties.src_vertex];
         //console.log(i+ " "+ datapoints[i].properties.src_vertex + " "+ inarray.length+ " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
         //console.log(datapoints[i].properties.dest_vertex  + " "+ inarray.indexOf(datapoints[i].properties.dest_vertex))
         if((inarray.indexOf(datapoints[i].properties.dest_vertex == -1))){
          inarray.push(datapoints[i].properties.dest_vertex);         
         }
        }// else end

        if(!(datapoints[i].properties.dest_vertex in nodeshashmap)){
         nodeshashmap[datapoints[i].properties.dest_vertex]= new Array (datapoints[i].properties.src_vertex); 
         //console.log(i+ " "+ datapoints[i].properties.dest_vertex + " "+ datapoints[i].properties.src_vertex + " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
       }
       else {
         var inarray = nodeshashmap[datapoints[i].properties.dest_vertex];
         if((inarray.indexOf(datapoints[i].properties.src_vertex == -1))){
          inarray.push(datapoints[i].properties.src_vertex);         
         }
        }// else end
     }// for loop
     //console.log(nodeshashmap);
 } // function nodesmap   

  var nodesmapfull_bray= function (datapoints){   
        nodesfullmap=[];
    for (var i = 0; i <datapoints.length ; i++) //datapoints.length
    {    
       if(!(datapoints[i].properties.src_vertex in nodesfullmap)){
        var array= [];
        array[datapoints[i].properties.dest_vertex]=datapoints[i].properties.bray_distance;

         nodesfullmap[datapoints[i].properties.src_vertex]= array; 
         //console.log(i+ " "+ datapoints[i].properties.dest_vertex + " "+ datapoints[i].properties.src_vertex + " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
       }
       else {
         var inarray = nodesfullmap[datapoints[i].properties.src_vertex];
         //console.log(i+ " "+ datapoints[i].properties.src_vertex + " "+ inarray.length+ " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
         //console.log(datapoints[i].properties.dest_vertex  + " "+ inarray.indexOf(datapoints[i].properties.dest_vertex))
         if(!(datapoints[i].properties.dest_vertex in inarray)){
          inarray[datapoints[i].properties.dest_vertex] = datapoints[i].properties.bray_distance;         
         }
        }// else end

        if(!(datapoints[i].properties.dest_vertex in nodesfullmap)){
         var array= [];
        array[datapoints[i].properties.src_vertex]=datapoints[i].properties.bray_distance;

         nodesfullmap[datapoints[i].properties.dest_vertex]= array;
         //console.log(i+ " "+ datapoints[i].properties.dest_vertex + " "+ datapoints[i].properties.src_vertex + " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
       }
       else {
         var inarray = nodesfullmap[datapoints[i].properties.dest_vertex];
         if(!(datapoints[i].properties.src_vertex in inarray)){
          inarray[datapoints[i].properties.src_vertex] = datapoints[i].properties.bray_distance;         
         }
        }// else end
     }//for loop   
     // console.log(nodesfullmap);
 } // function nodesmap
 
   var nodesmapfull_all= function (datapoints){   
        nodesallmap=[];
    for (var i = 0; i <datapoints.length ; i++) //datapoints.length
    {    
       if(!(datapoints[i].properties.src_vertex in nodesallmap)){
        var array= [];
        array[datapoints[i].properties.dest_vertex]={bray: datapoints[i].properties.bray_distance, color:datapoints[i].properties.dest_color,env: datapoints[i].properties.dest_environ};
         nodesallmap[datapoints[i].properties.src_vertex]= array; 
         //console.log(i+ " "+ datapoints[i].properties.dest_vertex + " "+ datapoints[i].properties.src_vertex + " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
       }
       else {
         var inarray = nodesallmap[datapoints[i].properties.src_vertex];
         //console.log(i+ " "+ datapoints[i].properties.src_vertex + " "+ inarray.length+ " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
         //console.log(datapoints[i].properties.dest_vertex  + " "+ inarray.indexOf(datapoints[i].properties.dest_vertex))
         if(!(datapoints[i].properties.dest_vertex in inarray)){
          inarray[datapoints[i].properties.dest_vertex] = {bray: datapoints[i].properties.bray_distance,color:datapoints[i].properties.dest_color,env: datapoints[i].properties.dest_environ };         
         }
        }// else end

        if(!(datapoints[i].properties.dest_vertex in nodesallmap)){
         var array= [];
        array[datapoints[i].properties.src_vertex]={bray: datapoints[i].properties.bray_distance,color:datapoints[i].properties.src_color,env: datapoints[i].properties.src_environ };

         nodesallmap[datapoints[i].properties.dest_vertex]= array;
         //console.log(i+ " "+ datapoints[i].properties.dest_vertex + " "+ datapoints[i].properties.src_vertex + " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
       }
       else {
         var inarray = nodesallmap[datapoints[i].properties.dest_vertex];
         if(!(datapoints[i].properties.src_vertex in inarray)){
          inarray[datapoints[i].properties.src_vertex] = {bray: datapoints[i].properties.bray_distance, color:datapoints[i].properties.src_color,env: datapoints[i].properties.src_environ };        
         }
        }// else end
     }//for loop   
     //console.log(nodesallmap);
 } // function nodesmap 



 var nodesmap_filter= function (datapoints){   

       if(!(datapoints.properties.src_vertex in nodeshashmap_filter)){
         nodeshashmap_filter[datapoints.properties.src_vertex]= new Array (datapoints.properties.dest_vertex); 
         //console.log(i+ " "+ datapoints[i].properties.dest_vertex + " "+ datapoints[i].properties.src_vertex + " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
       }
       else {
         var inarray = nodeshashmap_filter[datapoints.properties.src_vertex];
         //console.log(i+ " "+ datapoints[i].properties.src_vertex + " "+ inarray.length+ " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
         //console.log(datapoints[i].properties.dest_vertex  + " "+ inarray.indexOf(datapoints[i].properties.dest_vertex))
         if((inarray.indexOf(datapoints.properties.dest_vertex == -1))){
          inarray.push(datapoints.properties.dest_vertex);         
         }
        }// else end

        if(!(datapoints.properties.dest_vertex in nodeshashmap_filter)){
         nodeshashmap_filter[datapoints.properties.dest_vertex]= new Array (datapoints.properties.src_vertex); 
         //console.log(i+ " "+ datapoints[i].properties.dest_vertex + " "+ datapoints[i].properties.src_vertex + " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
       }
       else {
         var inarray = nodeshashmap_filter[datapoints.properties.dest_vertex];
         if((inarray.indexOf(datapoints.properties.src_vertex == -1))){
          inarray.push(datapoints.properties.src_vertex);         
         }
        }// else end
     //console.log(nodeshashmap_filter);
 } // function nodesmap 

 var nodesmap_filter_bray= function (datapoints){   

       if(!(datapoints.properties.src_vertex in nodesmap_bray)){
        var array= [];
        array[datapoints.properties.dest_vertex]=datapoints.properties.bray_distance;

         nodesmap_bray[datapoints.properties.src_vertex]= array; 
         //console.log(i+ " "+ datapoints[i].properties.dest_vertex + " "+ datapoints[i].properties.src_vertex + " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
       }
       else {
         var inarray = nodesmap_bray[datapoints.properties.src_vertex];
         //console.log(i+ " "+ datapoints[i].properties.src_vertex + " "+ inarray.length+ " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
         //console.log(datapoints[i].properties.dest_vertex  + " "+ inarray.indexOf(datapoints[i].properties.dest_vertex))
         if(!(datapoints.properties.dest_vertex in inarray)){
          inarray[datapoints.properties.dest_vertex] = datapoints.properties.bray_distance;         
         }
        }// else end

        if(!(datapoints.properties.dest_vertex in nodesmap_bray)){
         var array= [];
        array[datapoints.properties.src_vertex]=datapoints.properties.bray_distance;

         nodesmap_bray[datapoints.properties.dest_vertex]= array;
         //console.log(i+ " "+ datapoints[i].properties.dest_vertex + " "+ datapoints[i].properties.src_vertex + " "+ nodeshashmap[datapoints[i].properties.src_vertex]);
       }
       else {
         var inarray = nodesmap_bray[datapoints.properties.dest_vertex];
         if(!(datapoints.properties.src_vertex in inarray)){
          inarray[datapoints.properties.src_vertex] = datapoints.properties.bray_distance;         
         }
        }// else end
     //console.log(nodesmap_bray);
 } // function nodesmap 
//----------------------------------------------------------------------------------------------------------------------------------------
       

  function svgclick(){
     svg.on('click', function() { 
     //console.log("svg"); 
     neig =[];

     d3.selectAll('g#nodesg').selectAll("circle") //here's how you get all the nodes
         .each(function(d,i) {
           if(this.id.length >0){ 
               d3.select(this).attr("opacity",1);
           } 
         });
       d3.selectAll('g#nodesg').selectAll("rect") //here's how you get all the nodes
           .each(function(d,i) {
             if(this.id.length >0){ 
                 d3.select(this).attr("opacity",1);
             } 
           });

        d3.selectAll('g#edgesg').selectAll("path") //here's how you get all the nodes
         .each(function(d,i) {
           if(this.id.length >0){ 
               d3.select(this).attr("opacity",1);
           } 
         });
         d3.event.stopPropagation();
     });

     svg.on('mouseover', function() { 
            //console.log("mouseover on svg");
            d3.select("[id='" + "nodesg" + "']").select(".text").remove(); 
            d3.select("[id='" + "nodesg" + "']").selectAll(".rects")
              .attr('width', 10)
              .attr('height', 10)
              .attr("stroke-width", "3px")
              .attr("stroke", "#d2d1d1")
              
              ; 
              
             d3.select("[id='" + "nodesg" + "']").selectAll(".circles")
              .attr('r', 5)
              .attr("stroke-width", "3px")
              //.attr("stroke", "#211606") //31708F
              .attr("stroke", function(d){
                    //console.log(d);
                    return "#211606";
              })
              ;  
              //console.log(d3.select("[id='" + "nodesg" + "']").selectAll(".circles"));

              d3.select("[id='" + "edgesg" + "']").select(".arc").transition()
              .duration(1)
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
            });   
    });
  }     