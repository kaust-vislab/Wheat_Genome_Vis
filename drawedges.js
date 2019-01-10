function drawfilteredges(a,b){for(var c=chrtogenes[b],e=[],d=0;d<c.length;d++){var f=genesneighbours[c[d]],h=c[d];if(f)for(var g=0;g<f.length;g++){var k=f[g],l=chrnames.indexOf(genesinfo[h].species),m=chrnames.indexOf(genesinfo[k].species);-1==l||-1==m||1<Math.abs(m-l)||e.push({source:h,target:k})}}var n=0;svg.append("g").attr("id","edgesg").selectAll("links23").data(e).enter().append("path").attr("class","links23").attr("d",function(a){return link(a)}).style("stroke-width",function(a){return Math.abs(genesinfo[a.target].ypos-
genesinfo[a.source].ypos)>crossedge_threshold?(n++,highlightcrossedges?stroke_width_cross_highlight:stroke_width_cross):stroke_width_straight}).style("stroke",function(a,b){return genesinfo[a.target].color}).style("fill","transparent").style("opacity",function(a){return Math.abs(genesinfo[a.target].ypos-genesinfo[a.source].ypos)>crossedge_threshold?highlightcrossedges?stroke_opacity_cross_highlight:stroke_opacity_cross:stroke_opacity_straight}).on("mouseover",edgemouseover).on("mouseout",edgemouseout).attr("id",
function(a){return a.source.replace(".","_")+""+a.target.replace(".","_")}).append("svg:title").text(function(a){return a.source+" "+a.target});svg.select("#edgesg").moveToBack();TotalEdges_displayed=e.length;TotalCEdges_displayed=n;analytics()}
function drawedges(a){var b=(new Date).getTime(),c=[];a.forEach(function(a){var b=chrnames.indexOf(genesinfo[a.source].species),d=chrnames.indexOf(genesinfo[a.target].species);-1==b||-1==d||1<Math.abs(d-b)||c.push({source:a.source,target:a.target})});var e=0;svg.append("g").attr("id","edgesg").selectAll("links23").data(c).enter().append("path").attr("class","links23").attr("d",function(a){return link_all(a)}).style("stroke-width",function(a){return Math.abs(genesinfo[a.target].ypos-genesinfo[a.source].ypos)>
crossedge_threshold?highlightcrossedges?stroke_width_cross_highlight:stroke_width_cross:stroke_width_straight}).style("stroke",function(a){return genesinfo[a.target].color}).style("fill","transparent").style("opacity",function(a){return Math.abs(genesinfo[a.target].ypos-genesinfo[a.source].ypos)>crossedge_threshold?(e++,highlightcrossedges?stroke_opacity_cross_highlight:stroke_opacity_cross):stroke_opacity_straight});svg.select("#edgesg").moveToBack();TotalEdges_displayed=c.length;TotalCEdges_displayed=
e;analytics();a=(new Date).getTime();console.log(a+" all edges  "+(a-b)/1E3)}function link_all(a){if(edgestopath[a.source+""+a.target])return edgestopath[a.source+""+a.target];if(edgestopath[a.target+""+a.source])return edgestopath[a.target+""+a.source]}
function link(a){var b=chrnames.indexOf(genesinfo[a.source].species),c=chrnames.indexOf(genesinfo[a.target].species),e=svg.select("#"+a.source.replace(".","_"))["0"]["0"].transform.animVal["0"].matrix.f,d=svg.select("#"+a.target.replace(".","_"))["0"]["0"].transform.animVal["0"].matrix.f,f=svg.select("#"+a.source.replace(".","_"))["0"]["0"].transform.animVal["0"].matrix.e;a=svg.select("#"+a.target.replace(".","_"))["0"]["0"].transform.animVal["0"].matrix.e;if(!showviewportonlyedges||!(0>e||e>height||
0>d||d>height)){if(b<c)return b=+f+rectwidth-1,c=+a-1,a=d3.interpolateNumber(b,c),f=a(curvature),a=a(1-curvature),"M"+b+","+e+"C"+f+","+e+" "+a+","+d+" "+c+","+d;if(c<b)return b=+f-1,c=+a+rectwidth-1,a=d3.interpolateNumber(b,c),f=a(curvature),a=a(1-curvature),"M"+b+","+e+"C"+f+","+e+" "+a+","+d+" "+c+","+d}}d3.selection.prototype.moveToFront=function(){return this.each(function(){this.parentNode.appendChild(this)})};
d3.selection.prototype.moveToBack=function(){return this.each(function(){var a=this.parentNode.firstChild;a&&this.parentNode.insertBefore(this,a)})};
function edgemouseover(a){showmousehighlights&&(d3.select(this).style("stroke-width",highlighted_edge_stroke_width),d3.select(this).style("stroke",edgehighlightcolor),d3.select(this).style("opacity","1"),svg.select("#"+a.source.replace(".","_")).style("fill-opacity","1"),svg.select("#"+a.source.replace(".","_")).style("stroke",genehighlightcolor),svg.select("#"+a.target.replace(".","_")).style("fill-opacity","1"),svg.select("#"+a.target.replace(".","_")).style("stroke",genehighlightcolor))}
function edgemouseout(a){showmousehighlights&&(d3.select(this).style("stroke-width",Math.abs(genesinfo[a.target].ypos-genesinfo[a.source].ypos)>crossedge_threshold?stroke_width_cross:stroke_width_straight),d3.select(this).style("stroke",svg.select("#"+a.target.replace(".","_"))["0"]["0"].attributes[4].value),d3.select(this).style("opacity",Math.abs(genesinfo[a.target].ypos-genesinfo[a.source].ypos)>crossedge_threshold?stroke_opacity_cross:stroke_opacity_straight),svg.select("#"+a.source.replace(".",
"_")).style("fill-opacity",gene_opcaity),svg.select("#"+a.source.replace(".","_")).style("stroke","none"),svg.select("#"+a.target.replace(".","_")).style("fill-opacity",gene_opcaity),svg.select("#"+a.target.replace(".","_")).style("stroke","none"))}
function drawedges_cross(a){TotalCEdges_displayed=TotalEdges_displayed=a.length;analytics();svg.append("g").attr("id","edgesg").selectAll("links23").data(a).enter().append("path").attr("class","links23").attr("d",function(a){return link(a)}).style("stroke-width",function(a){return Math.abs(genesinfo[a.target].ypos-genesinfo[a.source].ypos)>crossedge_threshold?stroke_width_cross:stroke_width_straight}).style("stroke",function(a){return genesinfo[a.target].color}).style("fill","transparent").style("opacity",
function(a){return 10<Math.abs(genesinfo[a.target].ypos-genesinfo[a.source].ypos)?stroke_opacity_cross:stroke_opacity_straight}).on("mouseover",edgemouseover).on("mouseout",edgemouseout).attr("id",function(a){return a.source.replace(".","_")+""+a.target.replace(".","_")}).append("svg:title").text(function(a){return a.source+" "+a.target});svg.select("#edgesg").moveToBack()};