      
      function chorddiagram(){
        spinner.spin(document.getElementById("vis"));
        clickednodes_check= false; drawonlycrossedge=false; inalledge=false; inoverview=true; inexploredet=false;
        $("#dragging").prop('checked', false).change(); $("#dragging").attr('disabled','disabled'); dragging=false;//  zoom dragg button off
        $("#zooming").prop('checked', false).change();$("#zooming").attr('disabled','disabled');  zooming=false;
        $("#zooming2").prop('checked', false).change();  $("#zooming2").attr('disabled','disabled'); 
        $("#zooming3").prop('checked', false).change(); $("#zooming3").attr('disabled','disabled');  
        $("#mousehighlight").prop('checked', false).change();$("#mousehighlight").attr('disabled','disabled'); 
        $("#viewportedges").attr('disabled','disabled');  
        $("#highlightcross").attr('disabled','disabled');  

        reinitexploredetail();hide_details_controls();

        setTimeout(function() {
        $('#all')["0"].style.borderColor= "#d43f3a"; 
        $('#clicked')["0"].style.borderColor= "#d43f3a";
        $('#cross')["0"].style.borderColor= "#d43f3a"; 
        $('#reset')["0"].style.borderColor= "#d43f3a"; 
        $('#exploredet')["0"].style.borderColor= "#d43f3a"; 

        $('#chord')["0"].style.borderColor= "#333"; 

        svg.select("#blocks").remove();   
        svg.select("#edgesg").remove();        
        svg.select("#genesg").remove();
        svg.select("#circle").remove();  
        svg.select("#stackbar").remove();      
        
        d3.select("#topg").attr("transform", "translate(" + (0) + "," + (0) + ")");
        generatechord(chord, chordforhover);
        spinner.stop();
        },1);       
      }

      function alledges(){
        var d1 = new Date().getTime();
        spinner.spin(document.getElementById("vis"));
        if(swappingcheck_alledge) updategeneinfo();
        clickednodes_check= false; drawonlycrossedge=false; inalledge=true;inoverview=false;inexploredet=false;
        nodename="";
        $("#dragging").prop('checked', false).change(); $("#dragging").attr('disabled','disabled'); dragging=false;//  zoom dragg button off
        $("#zooming").prop('checked', false).change();$("#zooming").attr('disabled','disabled');  zooming=false;
        $("#zooming2").prop('checked', false).change();  $("#zooming2").attr('disabled','disabled'); 
        $("#zooming3").prop('checked', false).change(); $("#zooming3").attr('disabled','disabled');  
        $("#mousehighlight").prop('checked', false).change();$("#mousehighlight").attr('disabled','disabled'); 
        $("#viewportedges").attr('disabled','disabled'); $("#highlightcross").removeAttr('disabled');
        reinitexploredetail();hide_details_controls();

        setTimeout(function() {
        $('#clicked')["0"].style.borderColor= "#d43f3a";
        $('#cross')["0"].style.borderColor= "#d43f3a"; 
        $('#reset')["0"].style.borderColor= "#d43f3a"; 
        $('#chord')["0"].style.borderColor= "#d43f3a";
        $('#exploredet')["0"].style.borderColor= "#d43f3a"; 

        $('#all')["0"].style.borderColor= "#333"; 

        svg.select("#blocks").remove();   
        svg.select("#edgesg").remove();        
        svg.select("#genesg").remove(); 
        svg.select("#circle").remove(); 
        svg.select("#stackbar").remove();       
        
        drawblocks();
        drawgenes(genesdata);
        drawedges(edgesdata);
        d3.select("#topg").attr("transform", "translate(" + (translatetopg_val) + "," + (0) + ")");
        var d2 = new Date().getTime();console.log(d2 + " "+ (d2-d1)/1000);
        spinner.stop();
        },1);       
      }

      function clickednodesedges(){
        spinner.spin(document.getElementById("vis"));
        clickednodes_check= true; drawonlycrossedge=false; inalledge=false;inoverview=false;inexploredet=false;
        doubleclickedrect =false;
        nodename="";

        $("#dragging").removeAttr('disabled');$("#zooming").removeAttr('disabled');$("#zooming2").removeAttr('disabled');$("#zooming3").removeAttr('disabled');
        $("#mousehighlight").removeAttr('disabled');
        $("#viewportedges").removeAttr('disabled');
        $("#highlightcross").removeAttr('disabled');
        reinitexploredetail();hide_details_controls();
          setTimeout(function() {
          $('#all')["0"].style.borderColor= "#d43f3a";
          $('#cross')["0"].style.borderColor= "#d43f3a";
          $('#reset')["0"].style.borderColor= "#d43f3a";  
          $('#chord')["0"].style.borderColor= "#d43f3a";
          $('#exploredet')["0"].style.borderColor= "#d43f3a"; 

          $('#clicked')["0"].style.borderColor= "#333";    

          svg.select("#edgesg").remove();  
          svg.select("#genesg").remove(); 
          svg.select("#circle").remove();   
          svg.select("#stackbar").remove();  
          //svg.call(zoom.transform, d3.zoomIdentity);
          svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
          svg.attr("transform",d3.zoomIdentity);

          zoom.scale(1);
          zoom.translate([0, 0]);

          drawblocks();  
          d3.select("#topg").attr("transform", "translate(" + (translatetopg_val) + "," + (0) + ")");
          spinner.stop();
          },1);     

      }

      function crossedges(){
        var d1 = new Date().getTime();
        spinner.spin(document.getElementById("vis"));
        clickednodes_check= false; drawonlycrossedge=true; inalledge=false;inoverview=false;inexploredet=false;
        nodename="";
        $("#dragging").prop('checked', false).change(); $("#dragging").attr('disabled','disabled'); dragging=false;//  zoom dragg button off
        // $("#zooming").prop('checked', false).change();$("#zooming").attr('disabled','disabled');  zooming=false;
        // $("#zooming2").prop('checked', false).change();  $("#zooming2").attr('disabled','disabled'); 
        // $("#zooming3").prop('checked', false).change(); $("#zooming3").attr('disabled','disabled');  
        $("#mousehighlight").prop('checked', false).change();$("#mousehighlight").removeAttr('disabled'); 
        $("#highlightcross").prop('checked', false).change();$("#highlightcross").attr('disabled','disabled'); 
        $("#zooming").removeAttr('disabled');$("#zooming2").removeAttr('disabled');$("#zooming3").removeAttr('disabled');
        $("#viewportedges").removeAttr('disabled');
        reinitexploredetail();hide_details_controls();

        setTimeout(function() {
            $('#all')["0"].style.borderColor= "#d43f3a";
            $('#clicked')["0"].style.borderColor= "#d43f3a"; 
            $('#reset')["0"].style.borderColor= "#d43f3a"; 
            $('#chord')["0"].style.borderColor= "#d43f3a";
            $('#exploredet')["0"].style.borderColor= "#d43f3a"; 

            $('#cross')["0"].style.borderColor= "#333";  
            svg.select("#blocks").remove();   
            svg.select("#edgesg").remove();        
            svg.select("#genesg").remove();  
            svg.select("#circle").remove();    
            svg.select("#stackbar").remove();  
            svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
            svg.attr("transform",d3.zoomIdentity);
            d3.select("#topg").attr("transform", "translate(" + (translatetopg_val) + "," + (0) + ")");
            zoom.scale(1);
            zoom.translate([0, 0]) 
            
            drawblocks();
            if(swappingcheck_alledge){  // is swapped then calculate genes and edges new positions nad filtering otherwise use precomputed
                var dat=filter_cross(edgesdata);// for doing computation by filter_cross method
                drawgenes_cross(dat[1]);
                drawedges_cross(dat[0]); 
            }
            else{
                drawgenes_cross(genes_cross_data);
                drawedges_cross(edge_cross_data);
            }
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
        clickednodes_check= false; drawonlycrossedge=false;doubleclickedrect =false; inalledge=false; inoverview=false;inexploredet=false;
        nodename="";
          setTimeout(function() {
          $('#all')["0"].style.borderColor= "#d43f3a";
          $('#cross')["0"].style.borderColor= "#d43f3a"; 
          $('#clicked')["0"].style.borderColor= "#d43f3a"; 
          $('#chord')["0"].style.borderColor= "#d43f3a";
          $('#exploredet')["0"].style.borderColor= "#d43f3a"; 

          $('#reset')["0"].style.borderColor= "#333";    
          reinitexploredetail();hide_details_controls();

          svg.select("#edgesg").remove();  
          svg.select("#genesg").remove();
          svg.select("#circle").remove();   
          svg.select("#stackbar").remove();   
          //svg.call(zoom.transform, d3.zoomIdentity);
          svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
          d3.select("#topg").attr("transform", "translate(" + (translatetopg_val) + "," + (0) + ")");
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


  function addCheckbox(name) {
     var container = $('#drop');
     var id = container.find('input').length+1; 
     var co= colorarr2[genetodna[name]];
     var container2= $('<li />', {id:id, style:"width:165px ; text-align:left;"}).appendTo(container);
     $('<input />', { type: 'checkbox', id: 'cb'+id, value: name, style: "display: inline-block; margin-left:20px;vertical-align: sub;    width: 15px;height: 15px;" }).appendTo(container2);
     var label=$('<label />', { 'for': 'cb'+id, text: name,class:"check", style: "display: inline-block;padding: 0px 0px; font-weight: bold;color:"+ co+";min-width: 125px;    margin-left: 5px; margin-bottom: 0px;" }).appendTo(container2);
  }
  function reinitexploredetail(){
     $('#drop').empty();
     var keys=Object.keys(numbertochr);
     for(var i=0; i<keys.length;i++){  
        addCheckbox(numbertochr[keys[i]]);     
     }
     $(".checkbox-menu22").on("change", "input[type='checkbox']", function() {
        $(this).closest("li")["0"].style.backgroundColor ="#5aa8f6";
        if($(this).prop('checked')) $("#exploredet").html("Explore Details: " + $(this).val()  + " <span class=\"caret\"></span>");
        else {
          $("#exploredet").html("Explore Details " + "" + "<span class=\"caret\"></span>");
          $(this).closest("li")["0"].style.backgroundColor ="transparent";
        }
    });

    // to turn other checkbox to uncheck
    $('input:checkbox').click(function() {
          // console.log($('input:checkbox').not(".checkbox.checkbox-danger").not(this));
        $('input:checkbox').not(".checkbox.checkbox-danger").not(this).prop('checked', false);
      var templi= $('input:checkbox').not(".checkbox.checkbox-danger").not(this).closest("li");
      for (var l=0;l<templi.length;l++){
       templi[l].style.backgroundColor ="transparent";
      }
    }); 
    $("#exploredet").html("Explore Details " + "" + "<span class=\"caret\"></span>");
  }

  function onexploredetail(name, cond){
    spinner.spin(document.getElementById("vis")); 
    $('#all')["0"].style.borderColor= "#d43f3a";
    $('#cross')["0"].style.borderColor= "#d43f3a"; 
    $('#clicked')["0"].style.borderColor= "#d43f3a"; 
    $('#chord')["0"].style.borderColor= "#d43f3a";
    $('#reset')["0"].style.borderColor= "#d43f3a"; 

    $('#exploredet')["0"].style.borderColor= "#333"; 

    clickednodes_check= false; drawonlycrossedge=false;doubleclickedrect =false; inalledge=false; inoverview=false;inexploredet=true;
    $("#dragging").prop('checked', false).change(); $("#dragging").attr('disabled','disabled'); dragging=false;//  zoom dragg button off
    // $("#highlightcross").prop('checked', $("#highlightcross").prop('checked')); 
    $("#zooming").removeAttr('disabled');$("#zooming2").removeAttr('disabled');$("#zooming3").removeAttr('disabled');
    $("#mousehighlight").removeAttr('disabled');
    $("#viewportedges").removeAttr('disabled');
    $("#highlightcross").removeAttr('disabled');

    if(cond =="check"){
      // spinner.spin(document.getElementById("vis"));      
      nodename="";
      exploredet_name=name;
      explore_detail(name);
      spinner.stop();
    }
    else if(cond =="uncheck"){
      // spinner.spin(document.getElementById("vis"));
      clickednodes_check= false; drawonlycrossedge=false;doubleclickedrect =false; inalledge=false; inoverview=false;
      nodename="";exploredet_name="";
      setTimeout(function() {     
        svg.select("#edgesg").remove();  
        svg.select("#genesg").remove();
        svg.select("#circle").remove();   
        svg.select("#stackbar").remove(); 
        svg.select("#blocks").remove();   
        //svg.call(zoom.transform, d3.zoomIdentity);
        svg.selectAll('.zoomi').attr("transform",d3.zoomIdentity);
        d3.select("#topg").attr("transform", "translate(" + (translatetopg_val) + "," + (0) + ")");
       // zoom.transform(svg, d3.zoomIdentity);
        zoom.scale(1);
        zoom.translate([0, 0])
        // drawblocks();  
        spinner.stop();
        },1);
    }

  }
  function colorthemechange(val) {
    // console.log("theme change ");

    var theme1 =["rgb(255, 182, 18)","#4682B4"," #BA55D3","#3CB371"];
    var theme2=["#b33040e6", "#B8860Bbd", "#C71585db", "#6B8E23"];
    var theme3=["#00CED1", "#FF5722bd","#CD853F","#DA70D6"];

    if(val.value == "t1") color1=theme1[0], color2 = theme1[1], color3= theme1[2], color4=theme1[3];
    else if(val.value == "t2") color1=theme2[0], color2 = theme2[1], color3= theme2[2], color4=theme2[3];
    else if(val.value == "t3") color1=theme3[0], color2 = theme3[1], color3= theme3[2], color4=theme3[3];

    function acc(sel){ 
      if(sel == "t1") return theme1;
      else if(sel == "t2") return theme2;
      else if(sel == "t3") return theme3;
    }
    // colorarr={1:color1, 2:color2, 3:color3, 4:color4}; //1:rgb(233, 71, 44)          rgb(255, 182, 18),     blue"rgb(34, 91, 154)"  greenrgb(19, 72, 45)
    // colorarr2={"Barley":color1, "WheatA":color2, "WheatB":color3, "WheatD":color4}; 
    for(var i=1; i<=4;i++ ){
      var inp_col= colorarr[i];
      if(theme1.indexOf(inp_col) != -1) colorarr[i]= acc(val.value)[theme1.indexOf(inp_col)];
      else if(theme2.indexOf(inp_col) != -1) colorarr[i]= acc(val.value)[theme2.indexOf(inp_col)];
      else if(theme3.indexOf(inp_col) != -1) colorarr[i]= acc(val.value)[theme3.indexOf(inp_col)];
    } // change color arr such taht in case of swap those corresponding color changes.
    colorarr2["Barley"]= color1; colorarr2["WheatA"]= color2; colorarr2["WheatB"]= color3; colorarr2["WheatD"]= color4; 
    updategeneinfo();

    reinitexploredetail();

    if(inoverview) chorddiagram();
    else if(inalledge) alledges();
    else if(drawonlycrossedge) crossedges();
    else if(clickednodes_check) {
      if(!check_doubleclickrect && nodename  && nodename.length>1) chrclicked(nodename);
      else if(check_doubleclickrect && nodename && nodename.length>1) chrdblclicked(nodename);
      else clickednodesedges();
    }
    else if(inexploredet) {explore_detail(exploredet_name); $("#exploredet").html("Explore Details: " + exploredet_name + " <span class=\"caret\"></span>");}
    else resetfunc();
    // console.log(clickednodes_check + " " + drawonlycrossedge+ " "+ inalledge + " "+ inoverview);

  }

var counter=0;
  function animateFirstSteprect(path){
      path.transition()
          .delay(0)
          .duration(1000)
          .attr("fill-opacity", 1)
          .style( "stroke-width" , highlighted_edge_stroke_width )
          .style( "stroke" , genehighlightcolor )
           .each("end", function(d,i) { 
            counter++;
              if(counter <5) d3.select(this).call(animateSecondSteprect); 
              else counter =0;
          });
  };

  function animateSecondSteprect(path){
      path.transition()
          .delay(0)
          .duration(1000)
          .attr("fill-opacity", gene_opcaity )
          .style( "stroke-width" , "0px" )
          .style( "stroke" , "none" )
          .each("end", function(d,i) { 
              d3.select(this).call(animateFirstSteprect); 
          });
  };
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