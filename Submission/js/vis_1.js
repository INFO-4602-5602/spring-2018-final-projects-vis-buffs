// reference: http://bl.ocks.org/juan-cb/faf62e91e3c70a99a306

// data = [
//     {label:"Category 1", value:19},
//     {label:"Category 2", value:5},
//     {label:"Category 3", value:13},
//     {label:"Category 4", value:17},
//     {label:"Category 5", value:19},
//     {label:"Category 6", value:27}
// ];


d3.csv("data/restaurant_category_rating_sel_avg.csv", function(data) {

  var div = d3.select("#vis_1").append("div").attr("class", "toolTip");

  var axisMargin = 20,
    margin = 40,
    valueMargin = 4,
    width = parseInt('500px', 10),
    height = parseInt('400px', 10),
    barHeight = (height - axisMargin - margin * 2) * 0.4 / data.length,
    barPadding = (height - axisMargin - margin * 2) * 0.6 / data.length,
    data, bar, svg, scale, xAxis, labelWidth = 0;

  max = d3.max(data, function(d) {
    return d.avg;
  });

  svg = d3.select('#vis_1')
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  bar = svg.selectAll("g")
    .data(data)
    .enter()
    .append("g");

  bar.attr("class", "bar")
    .attr("cx", 0)
    .attr("transform", function(d, i) {
      return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
    });

  bar.append("text")
    .attr("class", "label")
    .attr("y", barHeight / 2)
    .attr("dy", ".35em") //vertical align middle
    .text(function(d) {
      return d.category;
    }).each(function() {
      labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
    });

  scale = d3.scale.linear()
    .domain([0, max])
    .range([0, width - margin * 2 - labelWidth]);

  xAxis = d3.svg.axis()
    .scale(scale)
    .tickSize(-height + 2 * margin + axisMargin)
    .orient("bottom");

  bar.append("rect")
    .attr("transform", "translate(" + labelWidth + ", 0)")
    .attr("height", barHeight)
    .attr("width", function(d) {
      return scale(d.avg);
    });

  bar.append("text")
    .attr("class", "value")
    .attr("y", barHeight / 2)
    .attr("dx", -valueMargin + labelWidth) //margin right
    .attr("dy", ".35em") //vertical align middle
    .attr("text-anchor", "end")
    .text(function(d) {
      return (d.avg);
    })
    .attr("x", function(d) {
      var width = this.getBBox().width;
      return Math.max(width + valueMargin, scale(d.avg));
    });

  bar.on("mousemove", function(d) {
    div.style("left", d3.event.pageX + 10 + "px");
    div.style("top", d3.event.pageY - 25 + "px");
    div.style("display", "inline-block");
    div.html((d.category) + "<br>" + (d.avg));
  });
  bar.on("mouseout", function(d) {
    div.style("display", "none");
  });

  svg.insert("g", ":first-child")
    .attr("class", "axisHorizontal")
    .attr("transform", "translate(" + (margin + labelWidth) + "," + (height - axisMargin - margin) + ")")
    .call(xAxis);

});