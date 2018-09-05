


 function drawblocks_onebig(nodename){
    if(svg.select("#blocks"))svg.select("#blocks").remove();   
      var svgb= svg.append("g").attr("id", "blocks"); 

      var sourcenode_species =genetodna[nodename];
      var clicked_chr_index = chrnames.indexOf(sourcenode_species) +1;

		svgb.selectAll("rect")
			.data(blockdata.filter(function(d){
				            	if(d.i == clicked_chr_index && rectmap[""+d.i+d.j] != nodename ) return false;   //
	                            else return true; 
			 }))
			.enter()
			.append("rect")
			.attr("id", function(d){return rectmap[+(""+d.i+d.j)]})               
			.attr("width", rectwidth)
			.attr("height", function(d){  if(rectmap[+(""+d.i+d.j)]== nodename) return bigrectheight; else return onerectheight;})
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
			.data(blockdata.filter(function(d){
				 if(d.i == clicked_chr_index && rectmap[""+d.i+d.j] != nodename ) return false;   //
	             else return true; 
			}))
			.enter() 
			.append("text")
			.attr("transform",transformblocktext)
			.attr("class","blocktext")
			.attr("id", function(d){  return rectmap[+(""+d.i+d.j)]+"text"})
			.style("text-anchor", "start")
			.style("font-size", "20px")
			.style("font-weight", "700")
			.text(function(d){ return rectmap[+(""+d.i+d.j)]}) ;  
			           
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
  }


  function returnpos_onebig(chrname, number,scale){
    return (d3.scale.linear().domain([1,chrlengths[chrname]])
                      .range([1,bigrectheight *scale])(number));
  }

  function drawfiltergenes_onebig(data,sourcenode){  
    var sourcenode_species =genetodna[sourcenode];
    var temp = chrnames.indexOf(sourcenode_species);
    var firstNeighbour = temp > 0 ? chrnames[temp-1] : null
    var secondNeighbour = temp < (chrnames.length - 1) ? chrnames[temp + 1] : null;

    var source_all_genes = chrtogenes[sourcenode]; 
    // var neighb_genes=[];
    // for(var i=0;i<source_all_genes.length ;i++){          
    //  if(genesneighbours[source_all_genes[i]]) neighb_genes= neighb_genes.concat(genesneighbours[source_all_genes[i]]); 
    // }
    var td= chrtogenesneighbor[sourcenode];
    td=td.concat(source_all_genes);
    var dat=[];        
    for (var i=0;i<td.length;i++){
      if(genetodna[genesinfo[td[i]].Chr] == firstNeighbour || genetodna[genesinfo[td[i]].Chr] == secondNeighbour || genesinfo[td[i]].Chr == sourcenode)
         dat.push({"Chr":genesinfo[td[i]].Chr, "Gene": td[i], "Start":genesinfo[td[i]].Start,"End":genesinfo[td[i]].End});
    }
    //console.log(dat);
    //console.log(firstNeighbour + " "+ secondNeighbour);

    genetochr={};
    text=svg.append("g").attr("id","genesg").selectAll("rect")
      // .data(data.filter(function(d){ 
      //   if(genetodna[d.Chr] == firstNeighbour || genetodna[d.Chr] == secondNeighbour || d.Chr == sourcenode) return true; // for drawing genes and all genes of its neighbors species
      //    //if(neighb_genes.indexOf(d.Gene) != -1) {console.log(d.Gene); return true;}
      //   // return neighb_genes.includes(d.Gene) || d.Chr == sourcenode;
      // }))
      .data(dat)
      .enter()
      .append("rect")
      .attr("id", function(d,i){genetochr[d.Gene]=genetodna[d.Chr]; return d.Gene.replace(".", "_");}) 
      .attr("transform",transform)           
      // .attr("x", function(d,i) {
      //     //console.log(svg.select("#" + d.Chr)["0"]["0"].y.animVal.value )
      //     return svg.select("#" + d.Chr)["0"]["0"].x.animVal.value + 1;
      // })
      // .attr("y", function(d,i) {
      // 	if(d.Chr == sourcenode) return (svg.select("#" + d.Chr)["0"]["0"].y.animVal.value)+returnpos_onebig(d.Chr, d.Start);
      //   else    return (svg.select("#" + d.Chr)["0"]["0"].y.animVal.value)+returnpos(d.Chr, d.Start);
                    
      //  })
      .attr("width", rectwidth-2)
      .attr("height", function(d,i) {
            // return returnpos(d.Chr, d.End - d.Start,zoom.scale()); 
            return (genesinfo[d.Gene].returnposheight)*zoom.scale();                       
       })
      .attr("fill", function(d,i){return colorarr2[genetodna[d.Chr]]; })  // "rgb(233, 71, 44)" )
      .attr("fill-opacity", gene_opcaity)//.01
      // .attr("stroke", function(d,i){return svg.select("#" + d.Chr)["0"]["0"].attributes[7].value})
      // .attr("stroke-opacity", 0.001)
      .attr("class","nodes")
      .on( "mouseover" , nodemouseover)
      .on( "mouseout" , nodemouseout);

      text2=text.append("svg:title")
      .text(function(d) { return d.Gene; });     
  }; 