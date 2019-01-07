var chrtorelchr=[]; var chrtorelchr_amount={}; var blockdata_det=[];
var b_pos={1:{i:3,j:4}, 2:{i:1,j:4}, 3:{i:3,j:3}, 4:{i:1,j:3}, 5:{i:3,j:5}, 6:{i:1,j:5}, 7:{i:3,j:2}, 8:{i:1,j:2}, 9:{i:3,j:6}, 10:{i:1,j:6},
           11:{i:3,j:1}, 12:{i:1,j:1}, 13:{i:3,j:7}, 14:{i:1,j:7}, 15:{i:4,j:1}, 16:{i:4,j:2}, 17:{i:4,j:3}, 18:{i:4,j:4}, 19:{i:4,j:5}, 20:{i:4,j:6}, 21:{i:4,j:7}};
function explore_detail(name){
  if(name.length <1)return;
	setTimeout(function() {     
	  svg.select("#edgesg").remove();  
	  svg.select("#genesg").remove();
	  svg.select("#circle").remove();   
	  svg.select("#stackbar").remove();   
	  //svg.call(zoom.transform, d3.zoomIdentity);
	  svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
	  d3.select("#topg").attr("transform", "translate(" + (translatetopg_val) + "," + (0) + ")");
	 // zoom.transform(svg, d3.zoomIdentity);
	  zoom.scale(1);
	  zoom.translate([0, 0]);
	  
	  var rel=chorddata[chrtonumber[name]];
	  chrtorelchr=[];  chrtorelchr_amount=[];
	  for (var i=0;i<rel.length;i++){
	  	if(rel[i] !== 0) {
        chrtorelchr.push(numbertochr[i]);
        // chrtorelchr_amount[numbertochr[i]] =rel[i];
        chrtorelchr_amount.push({"chrname":numbertochr[i], "conn":rel[i]});
      }
	  }    
    chrtorelchr_amount.sort(function(a, b){return a.conn > b.conn?-1:1;});
    // console.log(chrtorelchr_amount);console.log(chrtorelchr);
    blockdata_det=[];
    blockdata_det.push({"i": 2,"j":4, "name":name, "ypos": ((heightgap/4)+(onerectheight+heightgap)*(3))});
    var tem=1;
    chrtorelchr_amount.forEach(d => { 
         blockdata_det.push({"i": b_pos[tem].i,"j":b_pos[tem].j, "name":d.chrname, "ypos":((heightgap/4)+(onerectheight+heightgap)*(b_pos[tem].j-1))});
         tem++;
    });
    // console.log(blockdata_det);
	  drawdata(name);
	  // spinner.stop();    
	  },1); 
}   

function drawblocks_det(){
     if(svg.select("#blocks"))svg.select("#blocks").remove();   
     svg.selectAll("#coltext").remove();svg.selectAll("#blockstext").remove();
      svgb= svg.append("g").attr("id", "blocks");   
         svgb.selectAll("rect")
             .data(blockdata_det)
             .enter()
             .append("rect")
             .attr("id", function(d){return d.name;}) 
             // .attr("id", function(d){return rectmap[+(""+d.i+d.j)]})         
             .attr("width", rectwidth)
             .attr("height", onerectheight)
             .attr("fill", "white" )
             .attr("fill-opacity", 0)
             .attr("stroke", function(d){return colorarr2[genetodna[d.name]]})
             .attr("stroke-opacity", 1)
             .attr("class","blocks") 
             .attr("transform",transformblock_det)               
             .style( "stroke-width" , block_stroke_width )
             .on("mouseover", function(d,i) {
                  d3.select(this).style("stroke", "red");                  
             }) 
             .on("mouseout", function(d,i) { 
                  d3.select(this).style("stroke", function(d){return colorarr2[genetodna[d.name]]} );
             }) 
             .call(d3.behavior.drag()
                                   .on("drag", dragged_det)
                                   .on("dragstart", dragstart_det) 
                                   .on("dragend", dragend_det)
                  );

          svgb.append("g").attr("id", "blockstext").selectAll("text")
                   .data(blockdata_det)
                   .enter() 
                   .append("text")
                   .attr("transform",transformblocktext_det)
                   .attr("class","blocktext")
                   .attr("id", function(d){  return d.name+"text"})
                   // .attr("id", function(d){  return rectmap[+(""+d.i+d.j)]+"text"})
                   .style("text-anchor", "start")
                   .style("font-size", "20px")
                   .style("font-weight", "700")
                   .text(function(d){ return d.name;})
                   .on("mouseover", function(d,i) {
                        d3.select(this).style("fill", "red");
                        d3.select(this).style("font-size", "28px");
                   }) 
                   .on("mouseout", function(d,i) { 
                        d3.select(this).style("fill", "black");
                        d3.select(this).style("font-size", "20px");
                   }) 
                   .call(d3.behavior.drag()
                                   .on("drag", dragged_dettext)
                                   .on("dragstart", dragstart_dettext) 
                                   .on("dragend", dragend_dettext)
                        ); 
                   // .text(function(d){ return rectmap[+(""+d.i+d.j)]}) ;  
     TotalGenes_displayed = 0; TotalEdges_displayed =0;  TotalCEdges_displayed =0;    analytics();
 } 
//***********************DRAG BLOCK************************************************************************************************************
 function dragged_det(d) {
     var translate= d3.transform(this.getAttribute("transform")).translate;
     var x = d3.event.dx + translate[0]; var y = d3.event.dy + translate[1];
     d3.select(this).attr("transform", "translate(" + x + "," + y + ")" + "scale("+ d3.transform(this.getAttribute("transform")).scale + ")" );
     svg.selectAll(".blocktext").attr("transform", transformblocktext_det);
 }
 function dragstart_det(d) { 
    d3.select(this).style("stroke-width", "8px");
 }
 function dragend_det(d,i) {
  if(zoom.scale() <1.1)d.ypos = d3.transform(this.getAttribute("transform")).translate[1];
    d3.select(this).style("stroke-width", block_stroke_width );
    text.attr("transform", transform_det);
    svg.selectAll(".links23").attr("d", function(d){return link_det(d)}); // just update edges link method on zoom      
}

 function dragged_dettext(d) {
     var translate= d3.transform(this.getAttribute("transform")).translate; // text translate
     var translateb= d3.transform(d3.select("#" +d.name)["0"]["0"].getAttribute("transform")).translate;

     var x = d3.event.dx + translate[0]; var y = d3.event.dy + translate[1];
     d3.select(this).attr("transform", "translate(" + x + "," + y + ")" + "scale("+ d3.transform(this.getAttribute("transform")).scale + ")" );

     var xb = d3.event.dx + translateb[0]; var yb = d3.event.dy + translateb[1];
     d3.select("#" +d.name).attr("transform", "translate(" + xb + "," + yb + ")" + "scale("+ d3.transform(d3.select("#" +d.name)["0"]["0"].getAttribute("transform")).scale + ")" )
 }
 function dragstart_dettext(d) { 
 }
 function dragend_dettext(d,i) {
  if(zoom.scale() <1.1)d.ypos = d3.transform(this.getAttribute("transform")).translate[1];
    text.attr("transform", transform_det);
    svg.selectAll(".links23").attr("d", function(d){return link_det(d)}); // just update edges link method on zoom      
}
//***********************DRAG BLOCK END ************************************************************************************************************
 function transform_det(d) {        
   var to= svg.select("#" + d.Chr)["0"]["0"].attributes[8].value;
   t=to.slice(9, to.length);
   var xv= +t.slice(1, t.indexOf(","))
   var yv= +t.slice( t.indexOf(",")+1,t.indexOf(")"));     
   return "translate(" + (xv+1) + "," + ( (yv)+ (genesinfo[d.Gene].returnpos)*zoom.scale() ) + ")";
 }
 function transformblock_det(d){
  if(svg.select("#" + d.name)["0"]["0"].attributes[8]){
     var to= svg.select("#" + d.name)["0"]["0"].attributes[8].value;
     t=to.slice(9, to.length);
     var xv= +t.slice(1, t.indexOf(","))
     var yv= +t.slice( t.indexOf(",")+1,t.indexOf(")")); 

     return "translate(" + (xv) + "," 
               + y(d.ypos) + ")" 
               + "scale(" + [1,zoom.scale()] +  ")";

  }
  else
    return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1)) + "," 
               + y((heightgap/4)+(onerectheight+heightgap)*(d.j-1)) + ")" 
               + "scale(" + [1,zoom.scale()] +  ")";
 }
 function transformblocktext_det(d){
   var to= svg.select("#" + d.name)["0"]["0"].attributes[8].value;
   t=to.slice(9, to.length);
   var xv= +t.slice(1, t.indexOf(","))
   var yv= +t.slice( t.indexOf(",")+1,t.indexOf(")"));
   return "translate(" + (xv + (rectwidth+5)) + "," 
               + (( yv+((onerectheight*zoom.scale())/2)+10)) + ")" 
               + "scale(" + [1,1] +  ")" ;
 }

 function transforms_det(d) {
   var to= svg.select("#" + d.Chr)["0"]["0"].attributes[8].value;
   t=to.slice(9, to.length);
   var xv= +t.slice(1, t.indexOf(","))
   var yv= +t.slice( t.indexOf(",")+1,t.indexOf(")")); 
     if(d.Chr == exploredet_name) return "translate(" + (xv+1) + "," + ( (yv)+ (genesinfo[d.Gene].returnpos)*zoom.scale() ) + ")";
     else return "translate(" + (xv+1) + "," + ( (yv)+ (genesinfo[d.Gene].returnpos)*1 ) + ")";    
 }

 function transformblocks_det(d){   
     if(d.name == exploredet_name)     return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1)) + "," 
               + y((heightgap/4)+(onerectheight+heightgap)*(d.j-1)) + ")" 
               + "scale(" + [1,zoom.scale()] +  ")";          
     else return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1)) + "," 
               + ((heightgap/4)+(onerectheight+heightgap)*(d.j-1)) + ")" 
               + "scale(" + [1,1] +  ")";

 }
 function transformblocktexts_det(d){
     if(d.name == exploredet_name) return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1) + (rectwidth+5)) + "," + y((heightgap/4)+(onerectheight+heightgap)*(d.j-1) + (onerectheight/2)+10) + ")" 
               + "scale(" + [1,1] +  ")" ;            
     else return "translate(" + ((onecolumnwidth/3)+onecolumnwidth*(d.i-1) + (rectwidth+5)) + "," + ((heightgap/4)+(onerectheight+heightgap)*(d.j-1) + (onerectheight/2)+10) + ")" 
               + "scale(" + [1,1] +  ")" ;
 }

 function drawdata(nodename){     
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
           drawfiltergenes_det(genesdata,nodename);
           drawfilteredges_det(edgesdata,nodename);
           // var d2 = new Date().getTime();console.log(d2 + " chr clicked  "+ (d2-d1)/1000);
           spinner.stop();
       },1);  
   // }    
 }
 function drawfiltergenes_det(data,sourcenode){ 
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

 function drawfilteredges_det(data,sourcenode){
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
                  .attr("d", function(d){return link_det(d)})
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
                             if(highlightcrossedges) return stroke_opacity_cross_highlight; else return stroke_opacity_cross;}
                           else return stroke_opacity_straight;
                         } )
                  .on( "mouseover" , edgemouseover )
                  .on( "mouseout" , edgemouseout )
                  .attr("id", function(d){ return (d.source.replace(".", "_") +""+d.target.replace(".", "_"));})
                  .append("svg:title")
                  .text(function(d) { return d.source + " "+ d.target; });
               
     svg.select("#" + "edgesg").moveToBack();
     TotalEdges_displayed=edgesfilterdata.length; TotalCEdges_displayed=temce;
     analytics();
     showcontrols();
 }

 function link_det(d) {     
   // var tchrs= svg.select("#" + genesinfo[d.source].Chr)["0"]["0"].attributes[8].value;
   // var tchrt= svg.select("#" + genesinfo[d.target].Chr)["0"]["0"].attributes[8].value;
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
 var blocks_connections=1;
 function showcontrols(){  
  hide_details_controls();
  // if(svg.select("#controls"))svg.select("#controls").remove();
  var textcolor="black";
  var c1=width- ((onecolumnwidth/3))-Math.abs(translatetopg_val/3); 
  var rectwidth=((onecolumnwidth/3))+Math.abs(translatetopg_val)+5;
  var svg_controls = svg.append("g")
       .attr("id", "controls")
       .attr("transform", "translate(" + (c1 ) + "," + (heightgap/4)+ ")");


  var r= svg_controls .append("rect")
       // .attr("x", 0)
       // .attr("y", 0)
       .attr("width", rectwidth)
       .attr("height", 240)
       .attr("fill", "white" )
       .attr("fill-opacity", 0)
       .attr("stroke", "#d43f3a")
       .attr("stroke-width", "2px")
       .attr("stroke-opacity", 1);         
                

  svg_controls .append("text")
       .attr("x", rectwidth/2)
       .attr("y", 0)
       .attr("dy", "1.2em")
       .style("text-anchor", "middle")
       .attr("font-size", "24px")
       .attr("font-weight", "bold")
       .attr("fill", "#d43f3a")
       .text("Filters");

  var sliderval = svg_controls .append("text")
       .attr("x", rectwidth/2)
       .attr("y", 50)
       .attr("dy", "1.2em")
       .style("text-anchor", "middle")
       .attr("font-size", "12px")
       .attr("font-weight", "bold")
       .attr("fill", textcolor)
       .text("Blocks with atleast 1 connections") ;     

  var slider1 = new simpleSlider();
  blocks_connections=1;
  var slider_scale = d3.scale.linear().domain([1, 500]).range([0.00001, 1]);
  slider1.width(rectwidth-20).x(10).y(80).value(slider_scale(1)).event(function(){
          sliderval.text("Blocks with atleast "+ ( slider_scale.invert(slider1.value())).toFixed(0) +" connections");
          blocks_connections= ( slider_scale.invert(slider1.value())).toFixed(0) ;
          
  });
  slider1.event2(function(){    
    updateview_removeselblocks();
  });
  svg_controls.call(slider1);
  $('#labeld')["0"].style.display = "block";
  $('#labeld')["0"].style.transform = "translate("+(c1-Math.abs(translatetopg_val)/1.5)+"px," + "110px)";
  if($("#detail_crossedges").prop('checked')) $("#detail_crossedges").prop('checked', false).change();

  $('#labeld2')["0"].style.display = "block";
  $('#labeld2')["0"].style.transform = "translate("+(c1-Math.abs(translatetopg_val)/1.5)+"px," + "150px)";

  $('#removechr')["0"].style.display = "block";
  $('#removechr')["0"].style.transform = "translate("+(c1-Math.abs(translatetopg_val)/1.5)+"px," + "200px)";

  removechrfunc();

  $('#detail_crossedges').change(function() {// Show only cross edge toggle
  updateview_removeselblocks();
 });

}

function layoutchange(val) { // layout standard or repeat
  alert("This feature will be available later");

}
var details_selcb=[]; var con=0;
function removechrfunc(){
      $('#dropblocks').remove();  
      $('<ul />', { type: 'ul', id: "dropblocks", class:"dropdown-menu checkbox-menu23 allow-focus", style:"min-width:205px ; text-align:left;"}).appendTo($('#removechr'));
      // $('#dropblocks').empty(); 
     details_selcb=[]; 
     con++;
     for(var i=0; i<chrtorelchr.length;i++){   //chrtorelchr.length
         addCheckbox_explore(chrtorelchr[i]);     
     }     
    $(".checkbox-menu23").on("change", "input[type='checkbox']", function() {
        $(this).closest("li")["0"].style.backgroundColor ="#5aa8f6";
        if($(this).prop('checked')) {
          $("#removechr1").html("Remove Selected Blocks: " + " "  + " <span class=\"caret\"></span>");
           if(! details_selcb.includes($(this).val()))  details_selcb.push($(this).val());
           // console.log(details_selcb);
        }
        else {
          $("#removechr1").html("Remove Selected Blocks: " + " "  + " <span class=\"caret\"></span>");
          $(this).closest("li")["0"].style.backgroundColor ="transparent";
           if(details_selcb.indexOf($(this).val()) !== -1)  details_selcb.splice(details_selcb.indexOf($(this).val()), 1);
           // console.log(details_selcb);
        }
        updateview_removeselblocks();
    });    
}

  function addCheckbox_explore(name) {
     var con1 = $('#dropblocks');
     var id = con1.find('input').length+1; 
     var co= colorarr2[genetodna[name]];
     var con2= $('<li />', {id:con+"li"+id, class: "lisforul",style:"width:205px ; text-align:left;"}).appendTo(con1);
    // var con2= $('#dropblocks').append('<li  id=li'+ id + ' style="width:205px ; text-align:left;">' + "" + '</li>');
     $('<input />', { type: 'checkbox', id: con+'cbe'+id, value: name, style: "display: inline-block; margin-left:20px;vertical-align: sub; width: 15px;height: 15px;" }).appendTo(con2);//con2
     $('<label />', { 'for': con+'cbe'+id, text: name,class:"check",style: "display: inline-block;padding: 0px 0px; font-weight: bold;color:"+ co+";min-width: 125px;margin-left: 5px; margin-bottom: 0px;" }).appendTo(con2);
  }

  function hide_details_controls(){
    $('#labeld')["0"].style.display = "none";
    $('#labeld2')["0"].style.display = "none";
    $('#removechr')["0"].style.display = "none";
    if(svg.select("#controls"))svg.select("#controls").remove();
  }

  function updateview_removeselblocks(){
    // console.log("inside removeselblock  "+ n);
    setTimeout(function() {     
    svg.select("#edgesg").remove();  
    svg.select("#genesg").remove();
    svg.select("#circle").remove();   
    svg.select("#stackbar").remove();   
    //svg.call(zoom.transform, d3.zoomIdentity);
    svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
    d3.select("#topg").attr("transform", "translate(" + (translatetopg_val) + "," + (0) + ")");
   // zoom.transform(svg, d3.zoomIdentity);
    zoom.scale(1);
    zoom.translate([0, 0]);
    
    var rel=chorddata[chrtonumber[exploredet_name]];
    chrtorelchr=[];  chrtorelchr_amount=[];
    for (var i=0;i<rel.length;i++){
      if(rel[i] !== 0) {
        if(rel[i] < blocks_connections) continue;
        chrtorelchr.push(numbertochr[i]);
        // chrtorelchr_amount[numbertochr[i]] =rel[i];
        chrtorelchr_amount.push({"chrname":numbertochr[i], "conn":rel[i]});
      }
    }    
    chrtorelchr_amount.sort(function(a, b){return a.conn > b.conn?-1:1;});
    // console.log(chrtorelchr_amount);console.log(chrtorelchr);
    blockdata_det=[];
    blockdata_det.push({"i": 2,"j":4, "name":exploredet_name, "ypos": ((heightgap/4)+(onerectheight+heightgap)*(3))});
    var tem=1;
    chrtorelchr_amount.forEach(d => { 
      // console.log(d.chrname + " "+ !details_selcb.includes(d.chrname));
        if(! details_selcb.includes(d.chrname)){
            blockdata_det.push({"i": b_pos[tem].i,"j":b_pos[tem].j, "name":d.chrname, "ypos":((heightgap/4)+(onerectheight+heightgap)*(b_pos[tem].j-1))});
            tem++;
        }
    });
    // console.log(chrtorelchr_amount);
    // console.log(blockdata_det);
    drawdata_rem(exploredet_name);


    var templi= $('.lisforul').closest("li");
     for (var l=0;l<templi.length;l++){
      // console.log($('#'+ templi[l].id)["0"].childNodes["0"].checked);
      if(!chrtorelchr.includes($('#'+ templi[l].id)["0"].innerText))  templi[l].style.backgroundColor ="#9e9e9e5e";
      else {
        if($('#'+ templi[l].id)["0"].childNodes["0"].checked)   templi[l].style.backgroundColor ="#5aa8f6";
        else templi[l].style.backgroundColor ="transparent";
      }
     }

    // spinner.stop();    
    },1); 
  }


  function nodemouseover2(d){
    if(!showmousehighlights) return;        

    d3.select(this).style( "fill-opacity" , "1" );
    d3.select(this).style( "stroke" , genehighlightcolor );

    // svg.selectAll(".links23").style("opacity","0.08");

    // var tem_arr=genesneighbours[d3.select(this).attr("id").replace("_", ".")];
    var tem_arr=genesneighbours[d.Gene];
    if(tem_arr &&  !((typeof genesneighbours[d.Gene]) === "undefined")){
        tem_arr= tem_arr.filter(function(e){ return e === 0 || e });
        for (var i=0;i<tem_arr.length;i++){
          d3.select("#"+tem_arr[i].replace(".", "_")).style( "fill-opacity" , "1" );
          d3.select("#"+tem_arr[i].replace(".", "_")).style( "stroke" , genehighlightcolor );

          var edgeid= d3.select(this).attr("id").replace(".", "_") + ""+tem_arr[i].replace(".", "_");
          var edgeid2= tem_arr[i].replace(".", "_") + ""+ d3.select(this).attr("id").replace(".", "_") ;

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

    if(inexploredet) {
      if(tem_arr && tem_arr.length>0)  showegonetwork(d,tem_arr);
    }

  };
  function nodemouseout2(d){
    if(!showmousehighlights) return;
    d3.select(this).style( "fill-opacity" , gene_opcaity );
    d3.select(this).style( "stroke" , "none" );

    // var tem_arr=genesneighbours[d3.select(this).attr("id").replace("_", ".")];
    var tem_arr=genesneighbours[d.Gene];
    if(tem_arr &&  !((typeof genesneighbours[d.Gene]) === "undefined") ){
        tem_arr= tem_arr.filter(function(e){ return e === 0 || e });
        for (var i=0;i<tem_arr.length;i++){
          d3.select("#"+tem_arr[i].replace(".", "_")).style( "fill-opacity" , gene_opcaity );
          d3.select("#"+tem_arr[i].replace(".", "_")).style( "stroke" , "none" );
          // console.log(d3.select(this).attr("id")+ "  "+ tem_arr[i]+ "  "+ svg.select("#" + tem_arr[i].replace(".", "_"))["0"]["0"]);
          var edgeid= d3.select(this).attr("id").replace(".", "_") + ""+tem_arr[i].replace(".", "_");
          var edgeid2= tem_arr[i].replace(".", "_") + ""+ d3.select(this).attr("id").replace(".", "_") ;
          if(d3.select("#"+edgeid)["0"]["0"]){
              d3.select("#"+edgeid).style( "stroke-width" , ((Math.abs(genesinfo[tem_arr[i]].ypos - genesinfo[d3.select(this).attr("id").replace("_", ".")].ypos )>crossedge_threshold) ? stroke_width_cross:stroke_width_straight) ) ;
              if(svg.select("#" + tem_arr[i].replace(".", "_"))["0"]["0"])  d3.select("#"+edgeid).style( "stroke" , svg.select("#" + tem_arr[i].replace(".", "_"))["0"]["0"].attributes[4].value);//
              d3.select("#"+edgeid).style( "opacity" , ((Math.abs(genesinfo[tem_arr[i]].ypos - genesinfo[d3.select(this).attr("id").replace("_", ".")].ypos )>crossedge_threshold) ? stroke_opacity_cross:stroke_opacity_straight) );
          }
          else if(d3.select("#"+edgeid2)["0"]["0"]){
              d3.select("#"+edgeid2).style( "stroke-width" , ((Math.abs(genesinfo[tem_arr[i]].ypos - genesinfo[d3.select(this).attr("id").replace("_", ".")].ypos )>crossedge_threshold) ? stroke_width_cross:stroke_width_straight)  );
              if(svg.select("#" + tem_arr[i].replace(".", "_"))["0"]["0"]) d3.select("#"+edgeid2).style( "stroke" , svg.select("#" +d3.select(this).attr("id").replace(".", "_"))["0"]["0"].attributes[4].value);//
              d3.select("#"+edgeid2).style( "opacity" , ((Math.abs(genesinfo[tem_arr[i]].ypos - genesinfo[d3.select(this).attr("id").replace("_", ".")].ypos )>crossedge_threshold) ? stroke_opacity_cross:stroke_opacity_straight) );
          }
        }
    }
    if(inexploredet) {
      if(svg.select("#egonetwork"))svg.select("#egonetwork").remove();
    }
  };


function showegonetwork(d,tem2){
    if(svg.select("#egonetwork"))svg.select("#egonetwork").remove();
    var rectheight=300;
    var svgego= svg.append("g")
         .attr("id", "egonetwork")
         .attr("transform", "translate(" + ((onecolumnwidth*3)-(onecolumnwidth/3.5)) + "," + (height-(rectheight+10))+ ")");
// Outer Red border rect
    svgego.append("rect")
         .attr("x", -4)
         .attr("y", 0)
         .attr("width", onecolumnwidth)
         .attr("height", rectheight)
         .attr("fill", "white" )
         .attr("fill-opacity", 0)
         .attr("stroke", "#d43f3a")
         .attr("stroke-width", "2px")
         .attr("stroke-opacity", 1);         
                  

    svgego.append("text")
         .attr("x", (onecolumnwidth/2) )
         .attr("y", 0)
         .attr("dy", "1.2em")
         .style("text-anchor", "middle")
         .attr("font-size", "24px")
         .attr("font-weight", "bold")
         .attr("fill", "#d43f3a")
         .text("Gene Network");


         var posarr, posarre;
         var posarr4={0:{x:25,y:(rectheight/6)}, 1:{x:((onecolumnwidth)-(onecolumnwidth/4)-25),y:(rectheight/6)}, 2:{x:25,y:(rectheight/1.2)}, 3:{x:((onecolumnwidth)-(onecolumnwidth/4)-25),y:(rectheight/1.2)}, 10:{x:((onecolumnwidth/2)-(onecolumnwidth/8)) , y:(rectheight/2)- (15) }};
         var posarr3={0:{x:25,y:(rectheight/6)}, 1:{x:((onecolumnwidth)-(onecolumnwidth/4)-25),y:(rectheight/6)}, 2:{x:(onecolumnwidth/2) - (onecolumnwidth/8),y:(rectheight/1.2)}, 10:{x:((onecolumnwidth/2)-(onecolumnwidth/8)) , y:(rectheight/2)- (15) } };
         var posarr2={0:{x:25,y:(rectheight/2)- (15) }, 1:{x:((onecolumnwidth)-(onecolumnwidth/4)-25),y:(rectheight/2)- (15) }, 10:{x:((onecolumnwidth/2)-(onecolumnwidth/8)) , y:(rectheight/2)- (15) }};
         var posarr1={10:{x:25,y:(rectheight/2)- (15) }, 0:{x:((onecolumnwidth)-(onecolumnwidth/4)-25) , y:(rectheight/2)- (15) }};

         var posarr3e={0:{x1:25 + onecolumnwidth/8,y1:(rectheight/6)+30,x2:(onecolumnwidth/2),y2:(rectheight/2)- (15)}, 
                       1:{x1:((onecolumnwidth)-(onecolumnwidth/8)-25) ,y1:(rectheight/6)+30,x2:(onecolumnwidth/2),y2:(rectheight/2)- (15)}, 
                       2:{x1:(onecolumnwidth/2),y1:(rectheight/1.2) ,x2:(onecolumnwidth/2),y2:(rectheight/2)+ (15)} };
         var posarr2e={0:{x1:25+ onecolumnwidth/4,y1:(rectheight/2), x2:((onecolumnwidth/2)-(onecolumnwidth/8)),y2:(rectheight/2) }, 
                       1:{x1:((onecolumnwidth)-(onecolumnwidth/4)-25),y1:(rectheight/2),x2:((onecolumnwidth/2)+(onecolumnwidth/8)),y2:(rectheight/2) }};
         var posarr1e={0:{x1:((onecolumnwidth)-(onecolumnwidth/4)-25) , y1:(rectheight/2), x2:25 + (onecolumnwidth/4),y2:(rectheight/2) }};

          if(tem2.length==4) posarr=posarr4;
          else if(tem2.length==3) {posarr=posarr3;posarre=posarr3e;}
          else if(tem2.length==2) {posarr=posarr2;posarre=posarr2e;}
          else {posarr=posarr1;posarre=posarr1e;}
 // Center node
    svgego.append("rect")
         .attr("x", posarr["10"].x )
         .attr("y", posarr["10"].y  )
         .attr("rx", 6)
         .attr("ry", 6)
         .attr("width", onecolumnwidth/4)
         .attr("height", 30)
         .attr("fill", "white" )
         .attr("fill-opacity", 0)
         .attr("stroke", colorarr2[genetodna[d.Chr]])
         .attr("stroke-width", "2px")         
         .attr("stroke-opacity", 1)  ;      

    svgego.append("text")
         .attr("x", posarr["10"].x +(onecolumnwidth/8))
         .attr("y", posarr["10"].y+7)
         .attr("dy", "1.2em")
         .style("text-anchor", "middle")
         .attr("font-size", "11px")
         // .attr("font-weight", "bold")
         .attr("fill", "black")
         .text(d.Gene);

    
    for (var i=0;i<tem2.length;i++){
        svgego.append("rect")
             .attr("x", posarr[i].x )
             .attr("y", posarr[i].y)
             .attr("rx", 6)
             .attr("ry", 6)
             .attr("width", onecolumnwidth/4)
             .attr("height", 30)
             .attr("fill", "white" )
             .attr("fill-opacity", 0)
             .attr("stroke", colorarr2[genetodna[genesinfo[tem2[i].replace("_", ".")].Chr]])  //
             .attr("stroke-width", "2px")         
             .attr("stroke-opacity", 1)  ;      

        svgego.append("text")
             .attr("x", posarr[i].x + onecolumnwidth/8  )
             .attr("y", posarr[i].y + 7)
             .attr("dy", "1.2em")
             .style("text-anchor", "middle")
             .attr("font-size", "11px")
             // .attr("font-weight", "bold")
             .attr("fill", "black")
             .text(tem2[i]);

        svgego.append("line")
              .attr("x1", posarre[i].x1)
              .attr("y1", posarre[i].y1)
              .attr("x2", posarre[i].x2)
              .attr("y2", posarre[i].y2)
              .attr("stroke-width", 2)
              .attr("stroke", colorarr2[genetodna[genesinfo[tem2[i].replace("_", ".")].Chr]]);                      
    }  

}