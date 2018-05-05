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
  height = 500 - margin.top - margin.bottom;

var i = 0;

var tree = d3.layout.tree()
  .size([height, width]);

var diagonal = d3.svg.diagonal()
  .projection(function(d) {
    return [1.8 * d.x, d.y];
  });

var t_svg = d3.select("#dc_tree").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (margin.left + 30) + "," + margin.top + ")");

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
  //.style("fill", "#fff");

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
      return d.target.id;
    });

  // Enter the links.
  link.enter().insert("path", "g")
    .attr("class", "tree_link")
    .attr("d", diagonal);
}