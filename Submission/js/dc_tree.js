var treeData = [{
  "name": "user-category avg rating < -0.326 (scaled)",
  "parent": "null",
  "type": "orange",
  "children": [{
      "name": "polarity < -0.424 (scaled)",
      "parent": "Top Level",
      "type": "red",
      "children": [{
          "name": "Not recommended",
          "parent": "polarity < -0.424 (scaled)",
          "type": "red"
        },
        {
          "name": "recommended",
          "parent": "polarity < -0.424 (scaled)",
          "type": "black",
        }
      ]
    },
    {
      "name": "polarity < -1.015 (scaled)",
      "parent": "Top Level",
      "type": "black",
      "children": [{
          "name": "user-category review count < -0.393 (scaled)",
          "parent": "polarity < -1.015 (scaled)",
          "type": "red",
          "children": [{
              "name": "Not recommended",
              "parent": "user-category review count < -0.393 (scaled)",
              "type": "red",
            },
            {
              "name": "Recommended",
              "parent": "user-category review count < -0.393 (scaled)",
              "type": "black",
            }
          ]
        },
        {
          "name": "Recommended",
          "parent": "polarity < -1.015 (scaled)",
          "type": "black",
        }
      ]
    }
  ]
}];


// ************** Generate the tree diagram	 *****************
var margin = {
    top: 40,
    right: 120,
    bottom: 20,
    left: 120
  },
  width = 960 - margin.right - margin.left,
  height = 400 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree()
  .size([height, width]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) {
    return [1.8 * d.x, d.y];
  });
//console.log(diagonal);

var t_svg = d3.select("#dc_tree").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (margin.left + 120) + "," + margin.top + ")");


var ballpath = [];

root = treeData[0];

update(root);

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) {
    d.y = d.depth * 100;
  });

  // Declare the nodes…
  var node = t_svg.selectAll("g.node")
    .data(nodes, function(d) {
      return d.id || (d.id = ++i);
    });

  // Enter the nodes.
  var nodeEnter = node.enter().append("g")
    .attr("class", "tree_node")
    .attr("transform", function(d) {
      return "translate(" + 1.8 * d.x + "," + d.y + ")";
    });

  nodeEnter.append("circle")
    .attr("r", 10)
    .style("fill", function(d) {
      return d.type
    });


  nodeEnter.append("text")
    .attr("y", function(d) {
      return d.children || d._children ? -18 : 18;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) {
      return d.name;
    })
    .style("fill-opacity", 1);

  // Declare the links…
  var link = t_svg.selectAll("path.link")
    .data(links, function(d) {
      //console.log(d.target.id);
      return d.target.id;
    });

  // Enter the links.
  var tree_path = link.enter().insert("path", "g")
    .attr("class", "tree_link")
    .attr("d", diagonal);

  ballpath = tree_path[0];

}

//////////////dc tree test///////////////////
var ll_circle = t_svg.append("circle")
  .attr("r", 6.5)
  .attr("fill", "red")
  .attr("transform", "translate(305," + 0 + ")");
var lr_circle = t_svg.append("circle")
  .attr("r", 6.5)
  .attr("fill", "black")
  .attr("transform", "translate(305," + 0 + ")");
var rll_circle = t_svg.append("circle")
  .attr("r", 6.5)
  .attr("fill", "red")
  .attr("transform", "translate(305," + 0 + ")");
var rlr_circle = t_svg.append("circle")
  .attr("r", 6.5)
  .attr("fill", "black")
  .attr("transform", "translate(305," + 0 + ")");
var rr_circle = t_svg.append("circle")
  .attr("r", 6.5)
  .attr("fill", "black")
  .attr("transform", "translate(305," + 0 + ")");


//dcTree(ballpath[6]);

var ll = [6, 4];
var lr = [6, 5];
var rll = [7, 2, 0];
var rlr = [7, 2, 1];
var rr = [7, 3];
var intervals = 65;
var result_count = 0;


t_svg.append("text")
  .attr("x", 88)
  .attr("y", 260)
  .attr("class", "test_result")
  .attr("id", "vll")
  .text("66");

t_svg.append("text")
  .attr("x", 200)
  .attr("y", 260)
  .attr("class", "test_result")
  .attr("id", "vlr")
  .text("66");

t_svg.append("text")
  .attr("x", 510)
  .attr("y", 260)
  .attr("class", "test_result")
  .attr("id", "vrr")
  .text("66");

t_svg.append("text")
  .attr("x", 350)
  .attr("y", 360)
  .attr("class", "test_result")
  .attr("id", "vrll")
  .text("66");

t_svg.append("text")
  .attr("x", 460)
  .attr("y", 360)
  .attr("class", "test_result")
  .attr("id", "vrlr")
  .text("66");


setInterval(function ppp() {
  if (intervals < 24) {
    moveNode(ll_circle, ll);
    d3.select("#vll").text(intervals % 24 + 1);
    result_count += 1;
  }
  if (intervals < 4) {
    moveNode(lr_circle, lr);
    d3.select("#vlr").text(intervals % 4 + 1);
    result_count += 1;
  }
  if (intervals < 1) {
    moveNode(rll_circle, rll);
    d3.select("#vrll").text("1");
    result_count += 1;
  }
  if (intervals < 7) {
    moveNode(rlr_circle, rlr);
    d3.select("#vrlr").text(intervals % 7 + 1);
    result_count += 1;
  }
  if (intervals < 64) {
    moveNode(rr_circle, rr);
    d3.select("#vrr").text(intervals % 64 + 1);
    result_count += 1;
  }
  intervals += 1;
  if (intervals > 65) intervals = 65;
  d3.select("#result").text(result_count);
}, 201);

function dc_start() {
  d3.select("#total").text("100");
  intervals = 0;
  result_count = 0;
}


function moveNode(node, route) {
  var n = route.length;
  var i = 0;
  move();

  function move() {
    node.transition()
      .duration(100)
      .attrTween("transform", translateAlong(ballpath[route[i]]))
      .each("end", function() {
        if (i < n - 1) {
          i += 1;
          move();
        }
      });
  }
}


// Returns an attrTween for translating along the specified path element.
function translateAlong(path) {
  var l = path.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = path.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}