      
      function chorddiagram(){
        spinner.spin(document.getElementById("vis"));
        clickednodes_check= false; drawonlycrossedge=false;
        $("#dragging").prop('checked', false).change(); $("#dragging").attr('disabled','disabled'); dragging=false;//  zoom dragg button off
        $("#zooming").prop('checked', false).change();$("#zooming").attr('disabled','disabled');  zooming=false;
        $("#zooming2").prop('checked', false).change();  $("#zooming2").attr('disabled','disabled'); 
        $("#zooming3").prop('checked', false).change(); $("#zooming3").attr('disabled','disabled');  
        $("#mousehighlight").prop('checked', false).change();$("#mousehighlight").attr('disabled','disabled'); 
        $("#viewportedges").attr('disabled','disabled');   

        setTimeout(function() {
        $('#all')["0"].style.borderColor= "#d43f3a"; 
        $('#clicked')["0"].style.borderColor= "#d43f3a";
        $('#cross')["0"].style.borderColor= "#d43f3a"; 
        $('#reset')["0"].style.borderColor= "#d43f3a"; 

        $('#chord')["0"].style.borderColor= "#333"; 

        svg.select("#blocks").remove();   
        svg.select("#edgesg").remove();        
        svg.select("#genesg").remove();
        svg.select("#circle").remove();      
        
        generatechord(chord);
        spinner.stop();
        },1);       
      }

      function alledges(){
        var d1 = new Date().getTime();
        spinner.spin(document.getElementById("vis"));
        if(swappingcheck_alledge) updategeneinfo();
        clickednodes_check= false; drawonlycrossedge=false;
        $("#dragging").prop('checked', false).change(); $("#dragging").attr('disabled','disabled'); dragging=false;//  zoom dragg button off
        $("#zooming").prop('checked', false).change();$("#zooming").attr('disabled','disabled');  zooming=false;
        $("#zooming2").prop('checked', false).change();  $("#zooming2").attr('disabled','disabled'); 
        $("#zooming3").prop('checked', false).change(); $("#zooming3").attr('disabled','disabled');  
        $("#mousehighlight").prop('checked', false).change();$("#mousehighlight").attr('disabled','disabled'); 
        $("#viewportedges").attr('disabled','disabled');   

        setTimeout(function() {
        $('#clicked')["0"].style.borderColor= "#d43f3a";
        $('#cross')["0"].style.borderColor= "#d43f3a"; 
        $('#reset')["0"].style.borderColor= "#d43f3a"; 
        $('#chord')["0"].style.borderColor= "#d43f3a";

        $('#all')["0"].style.borderColor= "#333"; 

        svg.select("#blocks").remove();   
        svg.select("#edgesg").remove();        
        svg.select("#genesg").remove(); 
        svg.select("#circle").remove();      
        
        drawblocks();
        drawgenes(genesdata);
        drawedges(edgesdata);
        var d2 = new Date().getTime();console.log(d2 + " "+ (d2-d1)/1000);
        spinner.stop();
        },1);       
      }

      function clickednodesedges(){
        spinner.spin(document.getElementById("vis"));
        clickednodes_check= true; drawonlycrossedge=false;
        doubleclickedrect =false;

        $("#dragging").removeAttr('disabled');$("#zooming").removeAttr('disabled');$("#zooming2").removeAttr('disabled');$("#zooming3").removeAttr('disabled');$("#mousehighlight").removeAttr('disabled');$("#viewportedges").removeAttr('disabled');

          setTimeout(function() {
          $('#all')["0"].style.borderColor= "#d43f3a";
          $('#cross')["0"].style.borderColor= "#d43f3a";
          $('#reset')["0"].style.borderColor= "#d43f3a";  
          $('#chord')["0"].style.borderColor= "#d43f3a";

          $('#clicked')["0"].style.borderColor= "#333";    

          svg.select("#edgesg").remove();  
          svg.select("#genesg").remove(); 
          svg.select("#circle").remove();   
          //svg.call(zoom.transform, d3.zoomIdentity);
          svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
          svg.attr("transform",d3.zoomIdentity);
          zoom.scale(1);
          zoom.translate([0, 0])

          drawblocks();  
          spinner.stop();
          },1);     

      }

      function crossedges(){
        var d1 = new Date().getTime();
        spinner.spin(document.getElementById("vis"));
        clickednodes_check= false; drawonlycrossedge=true;
        $("#dragging").prop('checked', false).change(); $("#dragging").attr('disabled','disabled'); dragging=false;//  zoom dragg button off
        $("#zooming").prop('checked', false).change();$("#zooming").attr('disabled','disabled');  zooming=false;
        $("#zooming2").prop('checked', false).change();  $("#zooming2").attr('disabled','disabled'); 
        $("#zooming3").prop('checked', false).change(); $("#zooming3").attr('disabled','disabled');  
        $("#mousehighlight").prop('checked', false).change();$("#mousehighlight").removeAttr('disabled'); 
        $("#viewportedges").attr('disabled','disabled'); 

        setTimeout(function() {
            $('#all')["0"].style.borderColor= "#d43f3a";
            $('#clicked')["0"].style.borderColor= "#d43f3a"; 
            $('#reset')["0"].style.borderColor= "#d43f3a"; 
            $('#chord')["0"].style.borderColor= "#d43f3a";

            $('#cross')["0"].style.borderColor= "#333";  
            svg.select("#blocks").remove();   
            svg.select("#edgesg").remove();        
            svg.select("#genesg").remove();  
            svg.select("#circle").remove();    
            svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
            svg.attr("transform",d3.zoomIdentity);
            zoom.scale(1);
            zoom.translate([0, 0]) 
            
            drawblocks();
            var dat=filter_cross(edgesdata);
            drawgenes_cross(dat[1]);
            drawedges_cross(dat[0]);
            // drawgenes(genesdata);
            // drawedges_cross(edgesdata);
            var d2 = new Date().getTime();console.log(d2 + " "+ (d2-d1)/1000);
            spinner.stop();
        },5);    
      }
      
      function filter_cross(edges){
        var edge_cross_data=[], genes_cross_data=[];
        var tem=[];
        edges.forEach(d => { 
            var source_col_index = chrnames.indexOf(genesinfo[d.source].species);
            var target_col_index = chrnames.indexOf(genesinfo[d.target].species);
            
            if(source_col_index==-1 || target_col_index==-1 || Math.abs(target_col_index- source_col_index) >1) return; 
            if(Math.abs(genesinfo[d.target].ypos - genesinfo[d.source].ypos) <crossedge_threshold) return;
            var temp={"source":d.source, "target":d.target};
            edge_cross_data.push(temp);
            if(! tem.includes(d.source)){
             tem.push(d.source);
             var temp={"Chr":genesinfo[d.source].Chr, "Gene":d.source, "Start":genesinfo[d.source].Start  , "End":genesinfo[d.source].End};
             genes_cross_data.push(temp);
           }
            if(! tem.includes(d.target)){
             tem.push(d.target);
             var temp={"Chr":genesinfo[d.target].Chr, "Gene":d.target, "Start":genesinfo[d.target].Start  , "End":genesinfo[d.target].End};
             genes_cross_data.push(temp);
           }        
        });
          return [edge_cross_data, genes_cross_data];


      }

      function resetfunc(){
        spinner.spin(document.getElementById("vis"));
        clickednodes_check= false; drawonlycrossedge=false;doubleclickedrect =false;
          setTimeout(function() {
          $('#all')["0"].style.borderColor= "#d43f3a";
          $('#cross')["0"].style.borderColor= "#d43f3a"; 
          $('#clicked')["0"].style.borderColor= "#d43f3a"; 
          $('#chord')["0"].style.borderColor= "#d43f3a";

          $('#reset')["0"].style.borderColor= "#333";    

          svg.select("#edgesg").remove();  
          svg.select("#genesg").remove();
          svg.select("#circle").remove();    
          //svg.call(zoom.transform, d3.zoomIdentity);
          svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
         // zoom.transform(svg, d3.zoomIdentity);
          zoom.scale(1);
          zoom.translate([0, 0])
          drawblocks();  
          spinner.stop();
          },1); 
      }


       function getScreenBounds() {
         return [getPoint(0,0).x ,getPoint(0,0).y, getPoint(width,height).x,getPoint(width,height).y];
        
            function getPoint(x,y) {
            var container = svg.node();
            var svg22 = container.ownerSVGElement || container;
            var point = svg22.createSVGPoint();
            point.x = x; point.y = y;
            point = point.matrixTransform(container.getScreenCTM().inverse());
            return point;
          }
      }
      function zz() {
           var e = d3.event;
          if(clickednodes_check && zooming){
               svg.selectAll('.zoomi').attr("transform", [
                 "translate(" + [0, zoom.translate()[1]] + ")",
                 "scale(" + [1,e.scale] +  ")"
               ].join(" "));  

               // svg.selectAll('.semanticzoom').attr({
               //       transform:  "translate(" + [0,zoom.translate()[1] ] + ")" 
               //     });  
               if(e.scale >1) svg.selectAll('.blocktext').attr("opacity", "0");
               else svg.selectAll('.blocktext').attr("opacity", "1");
           }                          
      } 


	 //draw genes without transforms
          // .attr("x", function(d,i) {
     //          //console.log(svg.select("#" + d.Chr)["0"]["0"].y.animVal.value )
     //         return svg.select("#" + d.Chr)["0"]["0"].x.animVal.value + 1;
     //      })
          // .attr("y", function(d,i) {
     //           return (svg.select("#" + d.Chr)["0"]["0"].y.animVal.value)+
     //                    //(onerectheight/data.length)*i;
     //               returnpos(d.Chr, d.Start);
                        
     //       })      
     //drawgenes stroke
     // .attr("stroke", function(d,i){return svg.select("#" + d.Chr)["0"]["0"].attributes[7].value})
          // .attr("stroke-opacity", 0.001)