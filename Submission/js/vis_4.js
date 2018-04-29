var linkpath = ("./data/friends.csv");
var nodepath = ("./data/friends40avgstars.csv");

var width = 960,
  height = 500;

var color = d3.scale.category20();

var vis4_tip = d3.select("#vis4_tip").style("opacity", 0);
// var vis4_tip = d3.select("#network_vis").append("div")
//   .attr("class", "vis4_tooltip")
//   .style("opacity", 0);

var svg_v4 = d3.select("#network_vis").append("svg")
  .attr("width", width)
  .attr("height", height);


//Want to have different labels
// SETTING UP THE FORCE LAYOUT
var force = d3.layout.force()
  //using width/height from above, but size is mainly det'd by linkDistance and charge
  .size([width, height])
  // how far between nodes
  .linkDistance(160)
  // changes how close nodes will get to each other. Neg is farther apart.
  .charge(-300);


d3.csv(nodepath, function(nodes) {

  var nodelookup = {};
  var nodecollector = {};

  count = 0;
  // we want to create a lookup table that will relate the links file and the nodes file
  nodes.forEach(function(row) {
    nodelookup[row.user_id] = count;

    nodecollector[row.user_id] = {
      name: row.user_id,
      node_size: row.average_stars
    };
    count++;
  });

  //Get all the links out of of the csv in a way that will match up with the nodes

  d3.csv(linkpath, function(linkchecker) {

    var linkcollector = {};
    indexsource = 0;
    indextarget = 0;
    count = 0;
    //console.log(nodelookup['celery'])
    linkchecker.forEach(function(link) {
      linkcollector[count] = {
        source: nodelookup[link.source],
        target: nodelookup[link.target],
        link_stroke: link.share_restaurant
      };
      //console.log(linkcollector[count])
      count++;
    });

    //console.log(linkcollector)
    var nodes = d3.values(nodecollector);
    var links = d3.values(linkcollector);

    // Create the link lines.
    var link = svg_v4.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("class", "link")
      .attr("stroke-width", function(d) {
        if (d.link_stroke == 0) return 1;
        return (Math.sqrt(d.link_stroke));
      });
    // .attr("class", function(d) {
    //   return "link " + d.type;
    // })

    // Create the node circles.
    var node = svg_v4.selectAll(".node")
      .data(nodes)
      .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

    //put in little circles to drag
    node.append("circle")
      .attr("r", function(d) {
        return (d.node_size * d.node_size * d.node_size / 4);
      })
      .attr("class", "node")
      .on("mouseover", function(d) {
        console.log(d3.event.pageX + ":" + d3.event.pageY);
        vis4_tip.transition()
          .duration(200)
          .style("opacity", .9);
        vis4_tip.html("Average Rating:" + "<br/>" + d.node_size)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        vis4_tip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .call(force.drag);

    //get it going!
    force
      .nodes(nodes)
      .links(links)
      .start();

    force.on("tick", function() {
      link.attr("x1", function(d) {
          return d.source.x;
        })
        .attr("y1", function(d) {
          return d.source.y;
        })
        .attr("x2", function(d) {
          return d.target.x;
        })
        .attr("y2", function(d) {
          return d.target.y;
        });

      //I think that translate changes all of the x and ys at once instead of one by one?
      node.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    })


  });
});