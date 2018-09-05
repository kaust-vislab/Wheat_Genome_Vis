function drawfilteredges(data,sourcenode){
  // var d1 = new Date().getTime();
   var source_all_genes = chrtogenes[sourcenode]; 
   var neighb_genes=[];
   var edgesfilterdata=[];
   for(var i=0;i<source_all_genes.length ;i++){ 
    var n = genesneighbours[source_all_genes[i]];   
    var source =  source_all_genes[i];    
    if(n) {
      for(var j=0;j<n.length  ;j++){ 
        var target = n[j];
          var source_col_index = chrnames.indexOf(genesinfo[source].species);
          var target_col_index = chrnames.indexOf(genesinfo[target].species);
          if(source_col_index==-1 || target_col_index==-1 || Math.abs(target_col_index- source_col_index) >1) continue; 
        var temp={"source":source, "target":target};
        edgesfilterdata.push(temp);
      } 
    }
   }

    svg.append( "g" ).attr("id","edgesg").selectAll( "links23" )
                 .data( edgesfilterdata )
                 .enter()
                 .append("path")
                 .attr("class","links23")
                 .attr("d", function(d){return link(d)})
                 // .attr("class","edges")
                 .style( "stroke-width" , function(d){
                          // if( Math.abs(svg.select("#" + d.source.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f - svg.select("#" + d.target.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f ) >100) return "1px";
                          if(Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos) >crossedge_threshold) return stroke_width_cross;
                          else return stroke_width_straight;
                       } )
                 // .style( "stroke" , function(d,i){ //console.log(svg.select("#" + d.target.replace(".", "_")));
                 //        if(svg.select("#" + d.target.replace(".", "_"))["0"]["0"])
                 //           return svg.select("#" + d.target.replace(".", "_"))["0"]["0"].attributes[4].value;
                 //         else return "black";
                 //        } ) // with rect stroke attribute 7
                 .style( "stroke" , function(d,i){return genesinfo[d.target].color; })
                 .style("fill","transparent")
                 .style( "opacity" , function(d){
                          // if( Math.abs(svg.select("#" + d.source.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f - svg.select("#" + d.target.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f ) >100) return 1;
                          if(Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos)>crossedge_threshold) return stroke_opacity_cross;
                          else return stroke_opacity_straight;
                        } )
                 .on( "mouseover" , edgemouseover )
                 .on( "mouseout" , edgemouseout )
                 .attr("id", function(d){ return (d.source.replace(".", "_") +""+d.target.replace(".", "_"));})
                 .append("svg:title")
                 .text(function(d) { return d.source + " "+ d.target; });
              
    svg.select("#" + "edgesg").moveToBack();
    // svg.select("#" + "blockstext").moveToFront();
    // var d2 = new Date().getTime();console.log(d2 + " edges drawn  "+ (d2-d1)/1000); 
}

function drawedges(data){
  var d1 = new Date().getTime();
    var filter_data=[];
    data.forEach(d => { 
      var source_col_index = chrnames.indexOf(genesinfo[d.source].species);
      var target_col_index = chrnames.indexOf(genesinfo[d.target].species);
      if(source_col_index==-1 || target_col_index==-1 || Math.abs(target_col_index- source_col_index) >1) return; 
          var temp={"source":d.source, "target":d.target};
          filter_data.push(temp);
    });

    svg.append( "g" ).attr("id","edgesg").selectAll( "links23" )
                 .data( filter_data )
                 .enter()
                 .append("path")
                 .attr("class","links23")
                 .attr("d", function(d){return link_all(d)})
                 // .attr("class","edges")
                 .style( "stroke-width" , stroke_width_straight)
                 // .style( "stroke" , function(d,i){return svg.select("#" + d.target.replace(".", "_"))["0"]["0"].attributes[4].value} ) // with rect stroke attribute 7genesinfo[d.Gene].color
                 .style( "stroke" , function(d){return genesinfo[d.target].color; })
                 .style("fill","transparent")
                 .style( "opacity" , function(d){
                          // if( Math.abs(svg.select("#" + d.source.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f - svg.select("#" + d.target.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f ) >100) return 1;
                          if(Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos )>crossedge_threshold) return stroke_opacity_cross;
                          else return stroke_opacity_straight;
                        })
                 // .on( "mouseover" , edgemouseover )
                 // .on( "mouseout" , edgemouseout );
                 // .append("svg:title")
                 // .text(function(d) { return d.source + " "+ d.target; });        
    
    svg.select("#" + "edgesg").moveToBack();
    // svg.select("#" + "blockstext").moveToFront();
    var d2 = new Date().getTime();console.log(d2 + " all edges  "+ (d2-d1)/1000);
}


function link_all(d) {     
  if(edgestopath[d.source+""+d.target]) return edgestopath[d.source+""+d.target];
  else if(edgestopath[d.target+""+d.source]) return edgestopath[d.target+""+d.source];
}
function link(d) {      
  // var source_col_index = chrnames.indexOf(genetochr[d.source]);
  // var target_col_index = chrnames.indexOf(genetochr[d.target]);
  var source_col_index = chrnames.indexOf(genesinfo[d.source].species);
  var target_col_index = chrnames.indexOf(genesinfo[d.target].species); 

  var srcy=svg.select("#" + d.source.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f;
  var tary=svg.select("#" + d.target.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f;
  var srcx=svg.select("#" + d.source.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.e;
  var tarx=svg.select("#" + d.target.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.e;
  // if(source_col_index==-1 || target_col_index==-1 || Math.abs(target_col_index- source_col_index) >1) return; 
  // if(showviewportonlyedges && (srcy < currentscreenbounds[1] || srcy > currentscreenbounds[3] || tary < currentscreenbounds[1] || tary > currentscreenbounds[3]  ))return;
  if(showviewportonlyedges && (srcy < 0 || srcy > height || tary < 0 || tary > height ))return;
    if(source_col_index < target_col_index){              
        var x0 = +(srcx) +rectwidth-1 ,
            x1 = +(tarx)-1,
            xi = d3.interpolateNumber( x0 , x1 ) ,
            x2 = xi( curvature ) ,
            x3 = xi(1 - curvature) ,
            y0 = srcy,
            y1 = tary;
            return "M" + x0 + "," + y0
                + "C" + x2 + "," + y0
                + " " + x3 + "," + y1
                + " " + x1 + "," + y1;          
    }
    else if(target_col_index < source_col_index){              
       var x0 = +(srcx)-1 ,
            x1 = +(tarx) +rectwidth-1,
            xi = d3.interpolateNumber( x0 , x1 ) ,
            x2 = xi( curvature ) ,
            x3 = xi(1 - curvature) ,
            y0 = srcy ,
            y1 = tary;
            return "M" + x0 + "," + y0
                + "C" + x2 + "," + y0
                + " " + x3 + "," + y1
                + " " + x1 + "," + y1;
    }
}

d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
};
d3.selection.prototype.moveToBack = function() {  
        return this.each(function() { 
            var firstChild = this.parentNode.firstChild; 
            if (firstChild) { 
                this.parentNode.insertBefore(this, firstChild); 
            } 
        });
};

function edgemouseover(d){
  if(!showmousehighlights) return;
  d3.select(this).style( "stroke-width" , highlighted_edge_stroke_width );
  d3.select(this).style( "stroke" , edgehighlightcolor );
  d3.select(this).style( "opacity" , "1" );

  svg.select("#" + d.source.replace(".", "_")).style( "fill-opacity" , "1" );
  svg.select("#" + d.source.replace(".", "_")).style( "stroke" , genehighlightcolor )
  
  svg.select("#" + d.target.replace(".", "_")).style( "fill-opacity" , "1" );
  svg.select("#" + d.target.replace(".", "_")).style( "stroke" , genehighlightcolor )
};
function edgemouseout(d){
  if(!showmousehighlights) return;
  d3.select(this).style( "stroke-width" , ((Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos )>crossedge_threshold) ? stroke_width_cross:stroke_width_straight));
  d3.select(this).style( "stroke" , svg.select("#" + d.target.replace(".", "_"))["0"]["0"].attributes[4].value );
  d3.select(this).style( "opacity" , ((Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos )>crossedge_threshold) ? stroke_opacity_cross:stroke_opacity_straight) );

  svg.select("#" + d.source.replace(".", "_")).style( "fill-opacity" , gene_opcaity )
  svg.select("#" + d.source.replace(".", "_")).style( "stroke" , "none" )
  
  svg.select("#" + d.target.replace(".", "_")).style( "fill-opacity" , gene_opcaity )
  svg.select("#" + d.target.replace(".", "_")).style( "stroke" , "none" )
};

function drawedges_cross(data){
  // var d1 = new Date().getTime();
    svg.append( "g" ).attr("id","edgesg").selectAll( "links23" )
                 .data( data )
                 .enter()
                 .append("path")
                 .attr("class","links23")
                 .attr("d", function(d){return link(d)})
                 // .attr("class","edges")
                 .style( "stroke-width" , function(d){
                          if(Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos) >crossedge_threshold) return stroke_width_cross;
                          else return stroke_width_straight;
                       })
                 // .style( "stroke" , function(d,i){return svg.select("#" + d.target.replace(".", "_"))["0"]["0"].attributes[4].value} ) // with rect stroke attribute 7genesinfo[d.Gene].color
                 .style( "stroke" , function(d){return genesinfo[d.target].color; })
                 .style("fill","transparent")
                 .style( "opacity" , function(d){
                          // if( Math.abs(svg.select("#" + d.source.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f - svg.select("#" + d.target.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f ) >100) return 1;
                          if(Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos)>10) return stroke_opacity_cross;
                          else return stroke_opacity_straight;
                        })
                 // .style("opacity", 0.2)
                 .on( "mouseover" , edgemouseover )
                 .on( "mouseout" , edgemouseout )
                 .attr("id", function(d){ return (d.source.replace(".", "_") +""+d.target.replace(".", "_"));})
                 .append("svg:title")
                 .text(function(d) { return d.source + " "+ d.target; });        
    
    svg.select("#" + "edgesg").moveToBack();
    // svg.select("#" + "blockstext").moveToFront();
    // var d2 = new Date().getTime();console.log(d2 + " all edges  "+ (d2-d1)/1000);
}

    //draw edges attrs
    // svg.append( "g" ).attr("id","edgesg").selectAll( "links23" )
    //              .data( data )
    //              .enter()
    //              .append("path")
    //              .attr("class","links23")
    //              .attrs(function(d, i) { 
    //               return { 
    //                       d: link(d), 
    //                       "stroke-width":"0.4px", 
    //                       stroke: genesinfo[d.target].color,
    //                       fill:"transparent",                       
    //                       opacity:(Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos )>10) ? 1: 0.2
    //                      }; 
    //               })
    //              .on( "mouseover" , edgemouseover )
    //              .on( "mouseout" , edgemouseout );   
        //drawfilteredges attrs
        // svg.append( "g" ).attr("id","edgesg").selectAll( "links23" )
        //          .data( edgesfilterdata )
        //          .enter()
        //          .append("path")
        //          .attr("class","links23")
        //          .attrs(function(d, i) { 
        //           return { 
        //                   d: link(d), 
        //                   "stroke-width":(Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos) >10) ? "1px": "0.4px", 
        //                   stroke: genesinfo[d.target].color,
        //                   fill:"transparent",                       
        //                   opacity:(Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos )>10) ? 1: 0.2, 
        //                   id:   (d.source.replace(".", "_") +""+d.target.replace(".", "_"))                
        //                  }; 
        //           })
        //          .on( "mouseover" , edgemouseover )
        //          .on( "mouseout" , edgemouseout )
        //          // .attr("id", function(d){ return (d.source.replace(".", "_") +""+d.target.replace(".", "_"));})
        //          .append("svg:title")
        //          .text(function(d) { return d.source + " "+ d.target; });