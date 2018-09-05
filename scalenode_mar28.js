


 function drawblocks_onebig(nodename){
    if(svg.select("#blocks"))svg.select("#blocks").remove();   
      var svgb= svg.append("g").attr("id", "blocks"); 


      var sourcenode_species =genetodna[nodename];
      var clicked_chr_index = chrnames.indexOf(sourcenode_species) +1;
      var cond=false;
      //console.log(sourcenode_species+ " "+ temp);

    for (var i =1;i<=noofcolumns;i++){
        for (var j=1;j<=noofchr;j++){
	          var c = ""+i+j;//console.log(c);
	          //console.log(rectmap[+c])       
	          if(i == clicked_chr_index && rectmap[+c] != nodename ) continue;   //
	          else   if(i == clicked_chr_index) cond=true; 
	          		if(!cond){  
			           svgb.append("rect")
			              .attr("id", rectmap[+c])              
			              .attr("x", (onecolumnwidth/3)+onecolumnwidth*(i-1))
			              .attr("y", (heightgap/4)+(onerectheight+heightgap)*(j-1))
			              .attr("width", rectwidth)
			              .attr("height", onerectheight)
			              .attr("fill", "white" )
			              .attr("fill-opacity", 0)
			              .attr("stroke", function(d){return colorarr[i]})
			              .attr("stroke-opacity", 1)
			              .attr("class","zoomi")   
			              .on("click", function(d,i) {
			                var n =d3.select(this)["0"]["0"].id;
			                timer[c] = setTimeout(function() {
			                  if (!prevent) {
			                    chrclicked(n);                    
			                  }
			                  prevent = false;
			                }, delay);
			              })
			              .on("dblclick", function(d) {
			                var n =d3.select(this)["0"]["0"].id;
			                clearTimeout(timer[c]);
			                prevent = true;
			                chrdblclicked(n);
			              })           
			              // .on( "click" , chrclicked )
			              // .on( "dblclick" , chrdblclicked )
			              .style( "stroke-width" , "3px" );


			           svgb.append("g").attr("id", "blockstext").append("text")
			                      .attr("class","semanticzoom")
			                      .attr("id", function(d){ if(c=="47") return "test"})
			                     .attr("x", (onecolumnwidth/3)+onecolumnwidth*(i-1) + (rectwidth+5))
			                     .attr("y", (heightgap/4)+(onerectheight+heightgap)*(j-1) + (onerectheight/2)+10)
			                     .style("text-anchor", "start")
			                     .style("font-size", "20px")
			                     .style("font-weight", "1000")
			                     .text(function(d){ return rectmap[+c]}) ;


	                }


	        if(cond){
	          svgb.append("rect")
	              .attr("id", rectmap[+c])              
	              .attr("x", (onecolumnwidth/3)+onecolumnwidth*(i-1))
	              .attr("y", (heightgap/4)+(onerectheight+heightgap)*(1-1))
	              .attr("width", rectwidth)
	              .attr("height", bigrectheight)
	              .attr("fill", "white" )
	              .attr("fill-opacity", 0)
	              .attr("stroke", function(d){return colorarr[i]})
	              .attr("stroke-opacity", 1)
	              .attr("class","zoomi")   
	              .on("click", function(d,i) {
	                var n =d3.select(this)["0"]["0"].id;
	                timer[c] = setTimeout(function() {
	                  if (!prevent) {
	                    chrclicked(n);                    
	                  }
	                  prevent = false;
	                }, delay);
	              })
	              .on("dblclick", function(d) {
	                var n =d3.select(this)["0"]["0"].id;
	                clearTimeout(timer[c]);
	                prevent = true;
	                chrdblclicked(n);
	              })           
	              // .on( "click" , chrclicked )
	              // .on( "dblclick" , chrdblclicked )
	              .style( "stroke-width" , "3px" );


	           svgb.append("g").attr("id", "blockstext").append("text")
	                      .attr("class","semanticzoom")
	                      .attr("id", function(d){ if(c=="47") return "test"})
	                     .attr("x", (onecolumnwidth/3)+onecolumnwidth*(i-1) + (rectwidth+5))
	                     .attr("y", (heightgap/4)+(bigrectheight/2)*(2-1) + (onerectheight/2)*0)
	                     .style("text-anchor", "start")
	                     .style("font-size", "20px")
	                     .style("font-weight", "1000")
	                     .text(function(d){ return rectmap[+c]}) ;

	            cond=false;
	        }            
        }//for jloop
          svgb.append("g").attr("id", "coltext").append("text")
          .attr("x", (onecolumnwidth/3)+onecolumnwidth*(i-1) + (rectwidth/2))
          .attr("y", (heightgap/4)+(onerectheight+heightgap)*(noofchr-1) + (onerectheight)+20)
          .style("text-anchor", "middle")
          .style("font-size", "24px")
          .style("font-weight", "1000")
          .attr("fill", function(d){return colorarr[i]})
          .text(function(d){ return chrnames[i-1]}) ;

    }//fori loop
  }


  function returnpos_onebig(chrname, number){
    return (d3.scale.linear().domain([1,chrlengths[chrname]])
                      .range([1,bigrectheight])(number));
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
    svg.append("g").attr("id","genesg").selectAll("rect")
      // .data(data.filter(function(d){ 
      //   if(genetodna[d.Chr] == firstNeighbour || genetodna[d.Chr] == secondNeighbour || d.Chr == sourcenode) return true; // for drawing genes and all genes of its neighbors species
      //    //if(neighb_genes.indexOf(d.Gene) != -1) {console.log(d.Gene); return true;}
      //   // return neighb_genes.includes(d.Gene) || d.Chr == sourcenode;
      // }))
      .data(dat)
      .enter()
      .append("rect")
      .attr("id", function(d,i){genetochr[d.Gene]=genetodna[d.Chr]; return d.Gene.replace(".", "_");})          
      .attr("x", function(d,i) {
          //console.log(svg.select("#" + d.Chr)["0"]["0"].y.animVal.value )
          return svg.select("#" + d.Chr)["0"]["0"].x.animVal.value + 1;
      })
      .attr("y", function(d,i) {
      	if(d.Chr == sourcenode) return (svg.select("#" + d.Chr)["0"]["0"].y.animVal.value)+returnpos_onebig(d.Chr, d.Start);
        else    return (svg.select("#" + d.Chr)["0"]["0"].y.animVal.value)+returnpos(d.Chr, d.Start);
                    
       })
      .attr("width", function(d) {
      //console.log(d)
        return rectwidth-2;//d.MeanLandOcean * 10;
      })
      .attr("height", function(d,i) {
            return returnpos(d.Chr, d.End - d.Start);                        
       })
      .attr("fill", function(d,i){return svg.select("#" + d.Chr)["0"]["0"].attributes[7].value})  // "rgb(233, 71, 44)" )
      .attr("fill-opacity", 0.05)//.01
      // .attr("stroke", function(d,i){return svg.select("#" + d.Chr)["0"]["0"].attributes[7].value})
      // .attr("stroke-opacity", 0.001)
      .attr("class","zoomi")
      .append("svg:title")
      .text(function(d) { return d.Gene; });     
  }; 