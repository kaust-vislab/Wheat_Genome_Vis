function drawdata_rem(nodename){     
      spinner.spin(document.getElementById("vis"));  
       setTimeout(function() {
           if(svg.select("#edgesg"))svg.select("#edgesg").remove();        
           if(svg.select("#genesg"))svg.select("#genesg").remove();
           svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
           svg.attr("transform",d3.zoomIdentity);
           d3.select("#topg").attr("transform", "translate(" + (translatetopg_val) + "," + (0) + ")");
           zoom.scale(1);
           zoom.translate([0, 0])
           drawblocks_det();
           // d3.select("#"+nodename).style( "stroke" , "black" );
           drawfiltergenes_det_rem(genesdata,nodename);
           drawfilteredges_det_rem(edgesdata,nodename);
           // var d2 = new Date().getTime();console.log(d2 + " chr clicked  "+ (d2-d1)/1000);
           spinner.stop();
       },1);  
   // }    
 }
 function drawfiltergenes_det_rem(data,sourcenode){ 
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
     // if(genetodna[genesinfo[td[i]].Chr] == firstNeighbour || genetodna[genesinfo[td[i]].Chr] == secondNeighbour || genesinfo[td[i]].Chr == sourcenode)
     if((! details_selcb.includes(genesinfo[td[i]].Chr)) && (chrtorelchr.includes(genesinfo[td[i]].Chr) || genesinfo[td[i]].Chr == exploredet_name)    )
        dat.push({"Chr":genesinfo[td[i]].Chr, "Gene": td[i], "Start":genesinfo[td[i]].Start,"End":genesinfo[td[i]].End});
   }
   TotalGenes_displayed = dat.length;
   // genetochr={};
   text=svg.append("g").attr("id","genesg").selectAll("rect")
     .data(dat)
     .enter()
     .append("rect")
     .attr("id", function(d){ return d.Gene.replace(".", "_");}) //genetochr[d.Gene]=genetodna[d.Chr];
     .attr("transform",transform_det)         
     .attr("width", rectwidth-2)
     .attr("height", function(d) {
           // return returnpos(d.Chr, d.End - d.Start,zoom.scale()); 
           return (genesinfo[d.Gene].returnposheight)*zoom.scale();                        
      })
     // .attr("fill", function(d,i){return svg.select("#" + d.Chr)["0"]["0"].attributes[5].value})  // "rgb(233, 71, 44)" )
     .attr("fill", function(d){return genesinfo[d.Gene].color; })  //colorarr2[genetodna[d.Chr]]
     .attr("fill-opacity", gene_opcaity)//.01          
     .attr("class","nodes")
     .on( "mouseover" , nodemouseover2) // in drawblocks_genes.js
     .on( "mouseout" , nodemouseout2)
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
     .text(function(d) { return d.Gene+ "\n" ; });//+ sample_gene
     // var d2 = new Date().getTime();console.log(d2 + " genes  "+ (d2-d1)/1000);     
 };

 function drawfilteredges_det_rem(data,sourcenode){
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
           // if(source_col_index==-1 || target_col_index==-1 || Math.abs(target_col_index- source_col_index) >1) continue; 
         var temp={"source":source, "target":target};
         edgesfilterdata.push(temp);
       } 
     }
    }
     var temce=0;
     svg.append( "g" ).attr("id","edgesg").selectAll( "links23" )
                  .data( edgesfilterdata )
                  .enter()
                  .append("path")
                  .attr("class","links23")
                  .attr("d", function(d){return link_det_rem(d)})
                  // .attr("class","edges")
                  .style( "stroke-width" , function(d){
                           if(Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos) >crossedge_threshold) {
                             temce++;if(highlightcrossedges) return stroke_width_cross_highlight;  else return stroke_width_cross;}
                           else return stroke_width_straight;
                        } )
                  .style( "stroke" , function(d,i){return genesinfo[d.target].color; })
                  .style("fill","transparent")
                  .style( "opacity" , function(d){
                           // if( Math.abs(svg.select("#" + d.source.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f - svg.select("#" + d.target.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f ) >100) return 1;
                           if(Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos)>crossedge_threshold){
                             if($("#detail_crossedges").prop('checked')) return stroke_opacity_cross_highlight;
                             if(highlightcrossedges) return stroke_opacity_cross_highlight; else return stroke_opacity_cross;
                           }
                           else {
                            if($("#detail_crossedges").prop('checked')) return 0;
                            return stroke_opacity_straight;
                          }
                         } )
                  .on( "mouseover" , edgemouseover )
                  .on( "mouseout" , edgemouseout )
                  .attr("id", function(d){ return (d.source.replace(".", "_") +""+d.target.replace(".", "_"));})
                  .append("svg:title")
                  .text(function(d) { return d.source + " "+ d.target; });
               
     svg.select("#" + "edgesg").moveToBack();
     TotalEdges_displayed=edgesfilterdata.length; TotalCEdges_displayed=temce;
     analytics();
     // showcontrols();
 }

 function link_det_rem(d) {     
  var tchrs;var tchrt;
  if(svg.select("#" + genesinfo[d.source].Chr)["0"]["0"])  tchrs= svg.select("#" + genesinfo[d.source].Chr)["0"]["0"].attributes[8].value;
  else return;
  if(svg.select("#" + genesinfo[d.target].Chr)["0"]["0"]) tchrt= svg.select("#" + genesinfo[d.target].Chr)["0"]["0"].attributes[8].value;
  else return;
   var ts=tchrs.slice(9, tchrs.length);var xvs= +ts.slice(1, ts.indexOf(","));
   var tt=tchrt.slice(9, tchrt.length); var xvt= +tt.slice(1, tt.indexOf(","));

   var srcy=svg.select("#" + d.source.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f;
   var tary=svg.select("#" + d.target.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.f;
   var srcx=svg.select("#" + d.source.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.e;
   var tarx=svg.select("#" + d.target.replace(".", "_"))["0"]["0"].transform.animVal["0"].matrix.e;
  if(showviewportonlyedges && (srcy < 0 || srcy > height || tary < 0 || tary > height ))return;
     if(xvs < xvt){              
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
     else if(xvt < xvs){              
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