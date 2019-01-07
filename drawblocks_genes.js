var timer = [];
var delay = 200;
var svgb;
var prevent = false;
// var bw = d3.scale.linear().domain([0,4600]).range([1, 5]); // scale for blocks stroke width acc to cross edges
var bw = d3.scale.linear().domain([0, 100,200,500,1000,1500,2000,4600]).range([1,1.1,1.5,2,2.5,3,4, 6]); // scale for blocks stroke width acc to cross edges
// var freq_arr={"gene1": 20, "gene2": 10,"gene3": 30,"gene4": 40,"gene5": 35};
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
              .style( "stroke-width" , function(d){ return bw(crossedgesdata_sum[d.name]); } );//block_stroke_width


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
                     .on("mouseover", function(d,i) {
                         d3.select(this).style("fill", function(d){return colorarr2[genetodna[d.name]]}); 
                         var ce=chorddata_crossedges[chrtonumber[d.name]];
                         var ce_list={};
                         for(var u=0;u<ce.length;u++){
                          if(ce[u] !==0)ce_list[numbertochr[u]]=ce[u];
                         }
                         // console.log(ce);console.log(ce_list);
                         // wordcloud(ce_list, d3.transform(this.getAttribute("transform")).translate[0], d3.transform(this.getAttribute("transform")).translate[1]); 
                         drawWordCloud(ce_list, d3.transform(this.getAttribute("transform")).translate[0], d3.transform(this.getAttribute("transform")).translate[1]); 

                         // console.log(transformblocktext(d) + "  "+ d3.transform(this.getAttribute("transform")).translate);             
                    }) 
                    .on("mouseout", function(d,i) { 
                         d3.select(this).style("fill",  "black");
                         if(svg.select("#wordcloud"))svg.select("#wordcloud").remove();
                    }) 
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
      TotalGenes_displayed = 0; TotalEdges_displayed =0;  TotalCEdges_displayed =0;    analytics();
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
        // console.log(colorarr);

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
        var yv= +t.slice( t.indexOf(",")+1,t.indexOf(")"));   //console.log(doubleclickedrect+ "  "+ d.Chr + " "+ genetodna[d.Chr]+ "  selectedchr=="+ sel_chr);        
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
        TotalGenes_displayed = dat.length;
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
        text2=text.append("svg:title")
          .text(function(d) { return d.Gene + "\n" + sample_gene; });
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
        TotalGenes_displayed = dat.length;
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
          .on( "mouseout" , nodemouseout)
          .on("click", function(d,i) { 
                var txt = '';
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function(){
                  if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
                    txt = xmlhttp.responseText;
                    // console.log(txt);
                    var myWindow = window.open("", "_blank", "left=0,top=0,width=700,height=700");
                    myWindow.document.write("<title>Gene Detail</title> <center><b><h2>"+ d.Gene+ "</b></h2></center>  <br /><br />" + "<p>"+ txt + "</p>");
                    myWindow.document.close();
                  }
                };
                xmlhttp.open("GET","samplegene.txt",true);
                xmlhttp.send();
                
          });       
          
          text2=text.append("svg:title")
          .text(function(d) { return d.Gene+ "\n" + sample_gene; });
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
           doubleclickedrect=false;   check_doubleclickrect =false;    sel_chr="";      
            setTimeout(function() {
                if(svg.select("#edgesg"))svg.select("#edgesg").remove();        
                if(svg.select("#genesg"))svg.select("#genesg").remove();
                svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
                svg.attr("transform",d3.zoomIdentity);
                d3.select("#topg").attr("transform", "translate(" + (translatetopg_val) + "," + (0) + ")");
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
            doubleclickedrect=true;  check_doubleclickrect =true;  sel_chr="";     
             setTimeout(function() {
                if(svg.select("#edgesg"))svg.select("#edgesg").remove();        
                if(svg.select("#genesg"))svg.select("#genesg").remove();
                svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
                svg.attr("transform",d3.zoomIdentity);
                d3.select("#topg").attr("transform", "translate(" + (translatetopg_val) + "," + (0) + ")");
                zoom.scale(1);
                zoom.translate([0, 0])
                drawblocks_onebig(d);
                 d3.select("#"+nodename).style( "stroke" , "black" );
                 drawfiltergenes_onebig(genesdata,nodename);
                 drawfilteredges(edgesdata,nodename);
                 spinner.stop();
                 var d2 = new Date().getTime();console.log(d2 + " chr dblclicked  "+ (d2-d1)/1000 );
             },1);  
        }    
      } 

      function drawgenes_cross(data){  
        // var d1 = new Date().getTime();
        // genetochr={};
        TotalGenes_displayed = data.length;
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
          .text(function(d) { return d.Gene+ "\n" + sample_gene; });
        // var d2 = new Date().getTime();console.log(d2 + " allgenes  "+ (d2-d1)/1000);      
      };


function analytics(){
if(svg.select("#analyticsg"))svg.select("#analyticsg").remove();
var textcolor="black";
var svgan = svg.append("g")
     .attr("id", "analyticsg")
     .attr("transform", "translate(" + (width-Math.abs(translatetopg_val*3)+20) + "," + (height-150)+ ")");

svgan.append("rect")
     .attr("x", -4)
     .attr("y", 0)
     .attr("width", Math.abs(translatetopg_val*3)+20)
     .attr("height", 140)
     .attr("fill", "white" )
     .attr("fill-opacity", 0)
     .attr("stroke", "#d43f3a")
     .attr("stroke-width", "2px")
     .attr("stroke-opacity", 1);         
              

svgan.append("text")
     .attr("x", (Math.abs(translatetopg_val*3)+20)/2)
     .attr("y", 0)
     .attr("dy", "1.2em")
     .style("text-anchor", "middle")
     .attr("font-size", "24px")
     .attr("font-weight", "bold")
     .attr("fill", "#d43f3a")
     .text("Analytics");

svgan.append("text")
     .attr("x", 0)
     .attr("y", 35)
     .attr("dy", "1.2em")
     .style("text-anchor", "start")
     .attr("font-size", "16px")
     .attr("font-weight", "bold")
     .attr("fill", textcolor)
     .text("Blocks:"+ ((inexploredet == true)? (svg.select("#blocks")["0"]["0"].childNodes.length-1) : (svg.select("#blocks")["0"]["0"].childNodes.length-2)) ) ;
              
svgan.append("text")
     .attr("x", 0)
     .attr("y", 60)
     .attr("dy", "1.2em")
     .style("text-anchor", "start")
     .attr("font-size", "16px")
     .attr("font-weight", "bold")
     .attr("fill", textcolor)
     .text("Genes:"+ TotalGenes_displayed);

svgan.append("text")
     .attr("x", 0)
     .attr("y", 85)
     .attr("dy", "1.2em")
     .style("text-anchor", "start")
     .attr("font-size", "16px")
     .attr("font-weight", "bold")
     .attr("fill", textcolor)
     .text("Edges:" + TotalEdges_displayed);

svgan.append("text")
     .attr("x", 0)
     .attr("y", 110)
     .attr("dy", "1.2em")
     .style("text-anchor", "start")
     .attr("font-size", "16px")
     .attr("font-weight", "bold")
     .attr("fill", textcolor)
     .text("Cross Edges:" + TotalCEdges_displayed);          

}


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