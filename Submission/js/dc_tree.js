var treeData = [{
  "name": "Top Level",
  "parent": "null",
  "type": "orange",
  "children": [{
      "name": "Level 2: A",
      "parent": "Top Level",
      "type": "red",
      "children": [{
          "name": "Level 3: A",
          "parent": "Level 2: A",
          "type": "red"
        },
        {
          "name": "Level 3: B",
          "parent": "Level 2: A",
          "type": "black",
        }
      ]
    },
    {
      "name": "Level 2: B",
      "parent": "Top Level",
      "type": "black",
      "children": [{
          "name": "Level 3: C",
          "parent": "Level 2: A",
          "type": "red",
          "children": [{
              "name": "Level 4: A",
              "parent": "Level 3: B",
              "type": "red",
            },
            {
              "name": "Level 4: B",
              "parent": "Level 3: B",
              "type": "black",
            }
          ]
        },
        {
          "name": "Level 3: D",
          "parent": "Level 2: A",
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
  .attr("fill", "blue")
  .attr("transform", "translate(305," + 0 + ")");
var lr_circle = t_svg.append("circle")
  .attr("r", 6.5)
  .attr("fill", "blue")
  .attr("transform", "translate(305," + 0 + ")");
var rll_circle = t_svg.append("circle")
  .attr("r", 6.5)
  .attr("fill", "blue")
  .attr("transform", "translate(305," + 0 + ")");
var rlr_circle = t_svg.append("circle")
  .attr("r", 6.5)
  .attr("fill", "blue")
  .attr("transform", "translate(305," + 0 + ")");
var rr_circle = t_svg.append("circle")
  .attr("r", 6.5)
  .attr("fill", "blue")
  .attr("transform", "translate(305," + 0 + ")");


//dcTree(ballpath[6]);

var ll = [6, 4];
var lr = [6, 5];
var rll = [7, 2, 0];
var rlr = [7, 2, 1];
var rr = [7, 3];
var intervals = 65;

setInterval(function ppp() {
  if (intervals < 24) {
    moveNode(ll_circle, ll);
  }
  if (intervals < 4) {
    moveNode(lr_circle, lr);
  }
  if (intervals < 1) {
    moveNode(rll_circle, rll);
  }
  if (intervals < 7) {
    moveNode(rlr_circle, rlr);
  }
  if (intervals < 64) {
    moveNode(rr_circle, rr);
  }
  intervals += 1;
  if (intervals > 65) intervals = 65;
}, 120);

function dc_start() {
  intervals = 0;
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

// function transition(dcpath) {
//   t_circle.transition()
//     .duration(500)
//     .attrTween("transform", translateAlong(dcpath))
//     .each("end", transition);
// }

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