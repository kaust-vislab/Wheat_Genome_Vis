var timer = [];
var delay = 200;
var svgb;
var prevent = false;
 function drawblocks(){
      if(svg.select("#blocks"))svg.select("#blocks").remove();   
      svg.selectAll("#coltext").remove();svg.selectAll("#blockstext").remove();
       svgb= svg.append("g").attr("id", "blocks");   
           svgb.selectAll("rect")
                .data(blockdata)
                .enter()
              .append("rect")
              .attr("id", function(d){return rectmap[+(""+d.i+d.j)]})               
              // .attr("x", (onecolumnwidth/3)+onecolumnwidth*(i-1))
              // .attr("y", (heightgap/6)+(onerectheight+heightgap)*(j-1))
              .attr("width", rectwidth)
              .attr("height", onerectheight)
              .attr("fill", "white" )
              .attr("fill-opacity", 0)
              .attr("stroke", function(d){return colorarr[d.i]})
              .attr("stroke-opacity", 1)
              .attr("class","blocks") 
              .attr("transform",transformblock)  
              .on("click", function(d,i) {
                var n =d3.select(this)["0"]["0"].id;
                timer[""+d.i+d.j] = setTimeout(function() {
                  if (!prevent) {
                    chrclicked(n);                    
                  }
                  prevent = false;
                }, delay);
              })
              .on("dblclick", function(d) {
                var n =d3.select(this)["0"]["0"].id;
                clearTimeout(timer[""+d.i+d.j]);
                prevent = true;
                chrdblclicked(n);
              })        
              .style( "stroke-width" , block_stroke_width );


           svgb.append("g").attr("id", "blockstext").selectAll("text")
                    .data(blockdata)
                    .enter() 
                    .append("text")
                    .attr("transform",transformblocktext)
                    .attr("class","blocktext")
                    .attr("id", function(d){  return rectmap[+(""+d.i+d.j)]+"text"})
                    // .attr("x", (onecolumnwidth/3)+onecolumnwidth*(i-1) + (rectwidth+5))
                    // .attr("y", (heightgap/4)+(onerectheight+heightgap)*(j-1) + (onerectheight/2)+10)
                    .style("text-anchor", "start")
                    .style("font-size", "20px")
                    .style("font-weight", "700")
                    .text(function(d){ return rectmap[+(""+d.i+d.j)]}) ;   
        //}
          svgb.append("g").attr("id", "coltext").selectAll("text")
                    .data(chrnames)
                    .enter().append("text")
                    .attr("x", function(d,i){return (onecolumnwidth/3)+onecolumnwidth*(i) + (rectwidth/2)})
                    .attr("y", function(d,i){return (heightgap/4)+(onerectheight+heightgap)*(noofchr-1) + (onerectheight)+20})
                    .attr("id",function(d){return d})
                    .call(d3.behavior.drag()
                                   .on("drag", dragged)
                                   .on("dragstart", dragstart) 
                                   .on("dragend", dragend)
                          )
                    .style("text-anchor", "middle")
                    .style("font-size", "22px")
                    .style("font-weight", "800")
                    .attr("fill", function(d,i){return colorarr[i+1]})
                    .text(function(d){ return d}) ;

      //}
  }    
      // var xposarr=[onecolumnwidth,onecolumnwidth*2,onecolumnwidth*3,onecolumnwidth*4];

      function dragged(d) {
               if(clickednodes_check && dragging) d3.select(this).attr("x",this.x.animVal["0"].value + d3.event.dx);
      }
      function dragstart(d) {
        // console.log(sel_chr);
         if(clickednodes_check && dragging) d3.select(this).style("font-size", "32px");
         if(semanticzoomone){
            sel_chr=d;
            svg.selectAll("#coltext").selectAll("text").attr("fill", function(d,i){if(d == sel_chr) return "black";  else return colorarr[i+1]; });
            zoom.scale(1);
            zoom.translate([0, 0]);
          }
      }
      function dragend(d,i) {
        if(clickednodes_check && dragging){
                  d3.select(this).style("font-size", "24px");
                  var id= this.id; var ind=chrnames.indexOf(this.id);
                  var currxpos=null, nextxpos=null,prevxpos=null;
                  if(ind!=-1)currxpos=xposarr[ind];
                  if(ind+1 <4 )nextxpos = xposarr[ind];
                  if(ind-1 >=0 )prevxpos = xposarr[ind-1]; 
                  
                  if(nextxpos&& this.x.animVal["0"].value > nextxpos){
                    swap(chrnames,ind, ind+1);                    
                    //console.log(chrnames);
                    // columntext();
                    clickednodesedges();
                  }
                  else if(prevxpos&& this.x.animVal["0"].value < prevxpos){
                    swap(chrnames,ind-1, ind);
                    //console.log(chrnames);
                    //columntext();
                    clickednodesedges();
                  } 
                  else{
                    //columntext();
                    clickednodesedges();
                  }
        }
      }

      function swap(arr, p1,p2){
        var temp = arr[p1];
        arr[p1]= arr[p2];
        arr[p2]=temp;

        
        for (var i =1;i<=noofcolumns;i++){
          for (var j=1;j<=noofchr;j++){
               var c = ""+i+j;var t1;
              if(chrnames[i-1] == "Barley")  t1= "hv"+ j+"H";
              else if(chrnames[i-1] == "WheatA")  t1= "ta"+ j+"A";
              else if(chrnames[i-1] == "WheatB")  t1= "ta"+ j+"B";
              else if(chrnames[i-1] == "WheatD")  t1= "ta"+ j+"D";

              rectmap[+c] = t1;
          }
        }
       // console.log(colorarr);
        var t2=colorarr[p1+1];
        colorarr[p1+1] = colorarr[p2+1];
        colorarr[p2+1]=t2;

        // var t3=colorarr2[p1+1];
        // colorarr2[p1+1] = colorarr2[p2+1];
        // colorarr2[p2+1]=t3;
        swappingcheck_alledge=true;
      }

      var sc= d3.scale.linear();
      function returnpos(chrname, number,scale){
        return (sc.domain([1,chrlengths[chrname]])
                          .range([1,onerectheight*scale])(number));
      }
      function transform(d) {        
        var to= svg.select("#" + d.Chr)["0"]["0"].attributes[8].value;
        t=to.slice(9, to.length);
        var xv= +t.slice(1, t.indexOf(","))
        var yv= +t.slice( t.indexOf(",")+1,t.indexOf(")")); 
        if(doubleclickedrect && d.Chr == nodename)  return "translate(" + (xv+1) + "," + ( (yv)+returnpos_onebig(d.Chr, d.Start,zoom.scale()) ) + ")"; 
        // return "translate(" + (xv+1) + "," + ( (yv)+returnpos(d.Chr, d.Start,zoom.scale()) ) + ")";     
        return "translate(" + (xv+1) + "," + ( (yv)+ (genesinfo[d.Gene].returnpos)*zoom.scale() ) + ")";
      }

      function transformblock(d){
        if(doubleclickedrect && rectmap[+(""+d.i+d.j)]== nodename) return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1)) + "," 
                    + y((heightgap/4)+(onerectheight+heightgap)*(1-1)) + ")" 
                    + "scale(" + [1,zoom.scale()] +  ")";
        else  return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1)) + "," 
                    + y((heightgap/4)+(onerectheight+heightgap)*(d.j-1)) + ")" 
                    + "scale(" + [1,zoom.scale()] +  ")";
      }
      function transformblocktext(d){
        if(doubleclickedrect && rectmap[+(""+d.i+d.j)] == nodename) return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1) + (rectwidth+5)) + "," 
                    + y((heightgap/4)+(onerectheight+heightgap)*(4-1) + (onerectheight/2)+10) + ")" 
                    + "scale(" + [1,1] +  ")" ;
        else  return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1) + (rectwidth+5)) + "," 
                    + y((heightgap/4)+(onerectheight+heightgap)*(d.j-1) + (onerectheight/2)+10) + ")" 
                    + "scale(" + [1,1] +  ")" ;
      }
      function transforms(d) {
        var to= svg.select("#" + d.Chr)["0"]["0"].attributes[8].value;
        t=to.slice(9, to.length);
        var xv= +t.slice(1, t.indexOf(","))
        var yv= +t.slice( t.indexOf(",")+1,t.indexOf(")"));       
          if(doubleclickedrect && d.Chr == nodename){  
            if(genetodna[d.Chr] == sel_chr) return "translate(" + (xv+1) + "," + ( (yv)+returnpos_onebig(d.Chr, d.Start,zoom.scale()) ) + ")"; 
            else return "translate(" + (xv+1) + "," + ( (yv)+returnpos_onebig(d.Chr, d.Start,1) ) + ")"; 
          }
          // else if(genetodna[d.Chr] == sel_chr) return "translate(" + (xv+1) + "," + ( (yv)+returnpos(d.Chr, d.Start,zoom.scale()) ) + ")";
          // else return "translate(" + (xv+1) + "," + ( (yv)+returnpos(d.Chr, d.Start,1) ) + ")";     
          else if(genetodna[d.Chr] == sel_chr) return "translate(" + (xv+1) + "," + ( (yv)+ (genesinfo[d.Gene].returnpos)*zoom.scale() ) + ")";
          else return "translate(" + (xv+1) + "," + ( (yv)+ (genesinfo[d.Gene].returnpos)*1 ) + ")";    
      }

      function transformblocks(d){   
          if(doubleclickedrect && rectmap[+(""+d.i+d.j)] == nodename ){ 
            if(genetodna[rectmap[+(""+d.i+d.j)]] == sel_chr)
                 return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1)) + "," 
                    + y((heightgap/4)+(onerectheight+heightgap)*(1-1)) + ")" 
                    + "scale(" + [1,zoom.scale()] +  ")";  
            else
                 return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1)) + "," 
                    + ((heightgap/4)+(onerectheight+heightgap)*(1-1)) + ")" 
                    + "scale(" + [1,1] +  ")";
          }   
          else  if(genetodna[rectmap[+(""+d.i+d.j)]] == sel_chr)     return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1)) + "," 
                    + y((heightgap/4)+(onerectheight+heightgap)*(d.j-1)) + ")" 
                    + "scale(" + [1,zoom.scale()] +  ")";          
          else return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1)) + "," 
                    + ((heightgap/4)+(onerectheight+heightgap)*(d.j-1)) + ")" 
                    + "scale(" + [1,1] +  ")";

      }
      function transformblocktexts(d){
          if(doubleclickedrect && rectmap[+(""+d.i+d.j)] == nodename ) {
             if(genetodna[rectmap[+(""+d.i+d.j)]] == sel_chr) 
              return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1) + (rectwidth+5)) + "," 
                    + y((heightgap/4)+(onerectheight+heightgap)*(4-1) + (onerectheight/2)+10) + ")" 
                    + "scale(" + [1,1] +  ")" ;
              else 
                 return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1) + (rectwidth+5)) + "," 
                    + ((heightgap/4)+(onerectheight+heightgap)*(4-1) + (onerectheight/2)+10) + ")" 
                    + "scale(" + [1,1] +  ")" ;
          }
          else if(genetodna[rectmap[+(""+d.i+d.j)]] == sel_chr) return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1) + (rectwidth+5)) + "," + y((heightgap/4)+(onerectheight+heightgap)*(d.j-1) + (onerectheight/2)+10) + ")" 
                    + "scale(" + [1,1] +  ")" ;            
          else return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1) + (rectwidth+5)) + "," + ((heightgap/4)+(onerectheight+heightgap)*(d.j-1) + (onerectheight/2)+10) + ")" 
                    + "scale(" + [1,1] +  ")" ;
      }
      
      var text;
     // d3.tsv("TempAnomolies.tsv", function(data) { //Anomolies
      function drawgenes(data){  
        var d1 = new Date().getTime();
        var dat=[]; 
        data.forEach(d => {
            if(genesneighbours[d.Gene]){//drawing gene which has atleast 1 connection
                var cond=false;
                 for(var i=0; i<genesneighbours[d.Gene].length; i++){
                  if ( Math.abs(genesinfo[d.Gene].species_col_index- genesinfo[genesneighbours[d.Gene][i]].species_col_index) ==1) {cond=true;break;}
                  // console.log(genesneighbours[d.Gene][0]);
                }
                 if(cond) dat.push({"Chr":d.Chr, "Gene": d.Gene, "Start":d.Start,"End":d.End});
            }
        });
        text=svg.append("g").attr("id","genesg").selectAll("rect")
          .data(dat)
          .enter()
          .append("rect")
          .attr("id", function(d){ return d.Gene.replace(".", "_");})
          .attr("transform",transform)
          .attr("width", rectwidth-2)
          .attr("height", function(d) {
                return genesinfo[d.Gene].returnposheight;                      
           })
          // .attr("fill", function(d,i){return svg.select("#" + d.Chr)["0"]["0"].attributes[5].value})  // "rgb(233, 71, 44)" )
          .attr("fill", function(d){return genesinfo[d.Gene].color; })  //colorarr2[genetodna[d.Chr]]
          .attr("fill-opacity", gene_opcaity_allgenes)
          // .on( "mouseover" , nodemouseover)
          // .on( "mouseout" , nodemouseout)
          // .attr("class","nodes");//.01
        
        var d2 = new Date().getTime();console.log(d2 + " allgenes  "+ (d2-d1)/1000);      
      };

      function drawfiltergenes(data,sourcenode){ 
        // var d1 = new Date().getTime();
        var sourcenode_species =genetodna[sourcenode];
        var temp = chrnames.indexOf(sourcenode_species);
        var firstNeighbour = temp > 0 ? chrnames[temp-1] : null;
        var secondNeighbour = temp < (chrnames.length - 1) ? chrnames[temp + 1] : null;

        var source_all_genes = chrtogenes[sourcenode]; 
        var td= chrtogenesneighbor[sourcenode];
        td=td.concat(source_all_genes);
        var dat=[];        
        for (var i=0;i<td.length;i++){
          if(genetodna[genesinfo[td[i]].Chr] == firstNeighbour || genetodna[genesinfo[td[i]].Chr] == secondNeighbour || genesinfo[td[i]].Chr == sourcenode)
             dat.push({"Chr":genesinfo[td[i]].Chr, "Gene": td[i], "Start":genesinfo[td[i]].Start,"End":genesinfo[td[i]].End});
        }

        // genetochr={};
        text=svg.append("g").attr("id","genesg").selectAll("rect")
          .data(dat)
          .enter()
          .append("rect")
          .attr("id", function(d){ return d.Gene.replace(".", "_");}) //genetochr[d.Gene]=genetodna[d.Chr];
          .attr("transform",transform)         
          .attr("width", rectwidth-2)
          .attr("height", function(d) {
                // return returnpos(d.Chr, d.End - d.Start,zoom.scale()); 
                return (genesinfo[d.Gene].returnposheight)*zoom.scale();                        
           })
          // .attr("fill", function(d,i){return svg.select("#" + d.Chr)["0"]["0"].attributes[5].value})  // "rgb(233, 71, 44)" )
          .attr("fill", function(d){return genesinfo[d.Gene].color; })  //colorarr2[genetodna[d.Chr]]
          .attr("fill-opacity", gene_opcaity)//.01          
          .attr("class","nodes")
          .on( "mouseover" , nodemouseover)
          .on( "mouseout" , nodemouseout);       
          
          text2=text.append("svg:title")
          .text(function(d) { return d.Gene; });
          // var d2 = new Date().getTime();console.log(d2 + " genes  "+ (d2-d1)/1000);     
      };

      
      function nodemouseover(d){
        if(!showmousehighlights) return;

        d3.select(this).style( "fill-opacity" , "1" );
        d3.select(this).style( "stroke" , genehighlightcolor );

        // svg.selectAll(".links23").style("opacity","0.08");

        var tem=genesneighbours[d3.select(this).attr("id").replace("_", ".")];
        if(tem){
            for (var i=0;i<tem.length;i++){
              d3.select("#"+tem[i].replace(".", "_")).style( "fill-opacity" , "1" );
              d3.select("#"+tem[i].replace(".", "_")).style( "stroke" , genehighlightcolor );

              var edgeid= d3.select(this).attr("id").replace(".", "_") + ""+tem[i].replace(".", "_");
              var edgeid2= tem[i].replace(".", "_") + ""+ d3.select(this).attr("id").replace(".", "_") ;
              // console.log(d3.select(this).attr("id")+ "  "+ tem[i]+ "  "+ edgeid + " "+ edgeid2 + " "+d3.select("#"+edgeid) + "  "+ d3.select("#"+edgeid2));
              // console.log(d3.select("#"+edgeid));
              // console.log(d3.select("#"+edgeid2));
              if(d3.select("#"+edgeid)["0"]["0"]){
                  d3.select("#"+edgeid).style( "stroke-width" , highlighted_edge_stroke_width );
                  d3.select("#"+edgeid).style( "stroke" , edgehighlightcolor );
                  d3.select("#"+edgeid).style( "opacity" , "1" );
              }
              else if(d3.select("#"+edgeid2)["0"]["0"]){
                  d3.select("#"+edgeid2).style( "stroke-width" , highlighted_edge_stroke_width );
                  d3.select("#"+edgeid2).style( "stroke" , edgehighlightcolor );
                  d3.select("#"+edgeid2).style( "opacity" , "1" );
              }
            }
        }
      };
      function nodemouseout(d){
        if(!showmousehighlights) return;
        d3.select(this).style( "fill-opacity" , gene_opcaity );
        d3.select(this).style( "stroke" , "none" );
        // svg.selectAll(".links23").style("opacity","0.2");
        // console.log(d3.select(this).attr("id")+ "     "+ genesneighbours[d3.select(this).attr("id")]);

        var tem=genesneighbours[d3.select(this).attr("id").replace("_", ".")];
        if(tem){
            for (var i=0;i<tem.length;i++){
              d3.select("#"+tem[i].replace(".", "_")).style( "fill-opacity" , gene_opcaity );
              d3.select("#"+tem[i].replace(".", "_")).style( "stroke" , "none" );
              // console.log(d3.select(this).attr("id")+ "  "+ tem[i]+ "  "+ svg.select("#" + tem[i].replace(".", "_"))["0"]["0"]);
              var edgeid= d3.select(this).attr("id").replace(".", "_") + ""+tem[i].replace(".", "_");
              var edgeid2= tem[i].replace(".", "_") + ""+ d3.select(this).attr("id").replace(".", "_") ;
              if(d3.select("#"+edgeid)["0"]["0"]){
                  d3.select("#"+edgeid).style( "stroke-width" , ((Math.abs(genesinfo[tem[i]].ypos - genesinfo[d3.select(this).attr("id").replace("_", ".")].ypos )>crossedge_threshold) ? stroke_width_cross:stroke_width_straight) ) ;
                  if(svg.select("#" + tem[i].replace(".", "_"))["0"]["0"])  d3.select("#"+edgeid).style( "stroke" , svg.select("#" + tem[i].replace(".", "_"))["0"]["0"].attributes[4].value);//
                  d3.select("#"+edgeid).style( "opacity" , ((Math.abs(genesinfo[tem[i]].ypos - genesinfo[d3.select(this).attr("id").replace("_", ".")].ypos )>crossedge_threshold) ? stroke_opacity_cross:stroke_opacity_straight) );
              }
              else if(d3.select("#"+edgeid2)["0"]["0"]){
                  d3.select("#"+edgeid2).style( "stroke-width" , ((Math.abs(genesinfo[tem[i]].ypos - genesinfo[d3.select(this).attr("id").replace("_", ".")].ypos )>crossedge_threshold) ? stroke_width_cross:stroke_width_straight)  );
                  if(svg.select("#" + tem[i].replace(".", "_"))["0"]["0"]) d3.select("#"+edgeid2).style( "stroke" , svg.select("#" +d3.select(this).attr("id").replace(".", "_"))["0"]["0"].attributes[4].value);//
                  d3.select("#"+edgeid2).style( "opacity" , ((Math.abs(genesinfo[tem[i]].ypos - genesinfo[d3.select(this).attr("id").replace("_", ".")].ypos )>crossedge_threshold) ? stroke_opacity_cross:stroke_opacity_straight) );
              }
            }
        }
      };
      
     var nodename;
      function chrclicked(d){
        if(clickednodes_check){
          var d1 = new Date().getTime();
            spinner.spin(document.getElementById("vis"));
            nodename = d;//d3.select(this)["0"]["0"].id; 
           // console.log("click  "+d3.select(this)["0"]["0"].id);  
           doubleclickedrect=false;          
            setTimeout(function() {
                if(svg.select("#edgesg"))svg.select("#edgesg").remove();        
                if(svg.select("#genesg"))svg.select("#genesg").remove();
                svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
                svg.attr("transform",d3.zoomIdentity);
                zoom.scale(1);
                zoom.translate([0, 0])
                drawblocks();
                d3.select("#"+nodename).style( "stroke" , "black" );
                drawfiltergenes(genesdata,nodename);
                drawfilteredges(edgesdata,nodename);
                spinner.stop();
                var d2 = new Date().getTime();console.log(d2 + " chr clicked  "+ (d2-d1)/1000);
            },1);  
        }    
      } 

      function chrdblclicked(d){
        if(clickednodes_check){
            var d1 = new Date().getTime();
            spinner.spin(document.getElementById("vis"));
            nodename = d;//d3.select(this)["0"]["0"].id; 
            //console.log(nodename);    
            doubleclickedrect=true;   sel_chr="";     
             setTimeout(function() {
                if(svg.select("#edgesg"))svg.select("#edgesg").remove();        
                if(svg.select("#genesg"))svg.select("#genesg").remove();
                svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
                svg.attr("transform",d3.zoomIdentity);
                zoom.scale(1);
                zoom.translate([0, 0])
                drawblocks_onebig(d);
                 d3.select("#"+nodename).style( "stroke" , "black" );
                 drawfiltergenes_onebig(genesdata,nodename);
                 drawfilteredges(edgesdata,nodename);
                 spinner.stop();
                 var d2 = new Date().getTime();console.log(d2 + " chr dblclicked  "+ (d2-d1)/1000);
             },1);  
        }    
      } 

      function drawgenes_cross(data){  
        // var d1 = new Date().getTime();
        // genetochr={};
        text=svg.append("g").attr("id","genesg").selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("id", function(d){ return d.Gene.replace(".", "_");})//genetochr[d.Gene]=genetodna[d.Chr]; 
          .attr("transform",transform)
          .attr("width", rectwidth-2)
          .attr("height", function(d) {
                // return returnpos(d.Chr, d.End - d.Start,zoom.scale());  
                return genesinfo[d.Gene].returnposheight;                      
           })
          // .attr("height", 0.02)
          // .attr("fill", function(d,i){return svg.select("#" + d.Chr)["0"]["0"].attributes[5].value})  // "rgb(233, 71, 44)" )
          .attr("fill", function(d){return genesinfo[d.Gene].color; })  //colorarr2[genetodna[d.Chr]]
          .attr("fill-opacity", gene_opcaity)
          .on( "mouseover" , nodemouseover)
          .on( "mouseout" , nodemouseout)
          .attr("class","nodes");//.01
        
        text2=text.append("svg:title")
          .text(function(d) { return d.Gene; });
        // var d2 = new Date().getTime();console.log(d2 + " allgenes  "+ (d2-d1)/1000);      
      };



      //drawgenes attrs
      // text=svg.append("g").attr("id","genesg").selectAll("rect")
        //   .data(data)
        //   .enter()
        //   .append("rect")
        //   .attrs(function(d, i) { 
        //           genetochr[d.Gene]=genetodna[d.Chr];
        //           return { 
        //                   id: d.Gene.replace(".", "_"),
        //                   transform:transform(d) ,
        //                   width:rectwidth-2,
        //                   height: genesinfo[d.Gene].returnposheight,
        //                   fill: genesinfo[d.Gene].color,
        //                   "fill-opacity": 0.03,
        //                   class: "nodes"
        //                  }; 
        //    })
        //   .on( "mouseover" , nodemouseover)
        //   .on( "mouseout" , nodemouseout)
        //   .attr("class","nodes");//.01
         
        // text2=text.append("svg:title")
        //   .text(function(d) { return d.Gene; }); 
        //drawfiltergenes
      // text=svg.append("g").attr("id","genesg").selectAll("rect")
        //   .data(dat)
        //   .enter()
        //   .append("rect")
        //   .attrs(function(d, i) { 
        //           genetochr[d.Gene]=genetodna[d.Chr];
        //           return { 
        //                   id: d.Gene.replace(".", "_"),
        //                   transform:transform(d) ,
        //                   width:rectwidth-2,
        //                   height: (genesinfo[d.Gene].returnposheight)  *zoom.scale(),
        //                   fill: genesinfo[d.Gene].color,
        //                   "fill-opacity": 0.05,
        //                   class: "nodes"
        //                  }; 
        //    })         
        //   .attr("class","nodes")
        //   .on( "mouseover" , nodemouseover)
        //   .on( "mouseout" , nodemouseout);