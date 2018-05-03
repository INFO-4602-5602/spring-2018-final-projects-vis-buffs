var width = 940,
  height = 600;

var colorcloud = d3.scale.ordinal().range(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854"]);
var svg = d3.select("#vis_3").append("svg")
  .attr("width", width)
  .attr("height", height);
var svg1 = d3.select("#vis_3").append("svg")
  .attr("width", 100)
  .attr("height", 10)
  .attr("transform", "translate(" + 400 + "," + -100 + ")");
d3.csv("data/cloud.csv", function(data) {
  showCloud(data)
  setInterval(function() {
    showCloud(data)
  }, 2000)
});

wordScale = d3.scale.linear().domain([0, 100]).range([0, 100]).clamp(true);

var svg = d3.select("#vis_3").select("svg")
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

svg1.append('rect')
  .attr('width', 15)
  .attr('height', 15)
  .style('fill', "#fc8d62")
  .style('stroke', "#fc8d62")
  .attr("transform", "translate(" + 300 + "," + 70 + ")")

svg1.append('text').text("2 star").attr("transform", "translate(" + 342 + "," + 81 + ")").attr("fill", "#fc8d62")

svg1.append('rect')
  .attr('width', 15)
  .attr('height', 15)
  .style('fill', "#8da0cb")
  .style('stroke', "#8da0cb")
  .attr("transform", "translate(" + 200 + "," + 70 + ")")

svg1.append('text').text("3 star").attr("transform", "translate(" + 242 + "," + 81 + ")").attr("fill", "#8da0cb")

svg1.append('rect')
  .attr('width', 15)
  .attr('height', 15)
  .style('fill', "#e78ac3")
  .style('stroke', "#e78ac3")
  .attr("transform", "translate(" + 100 + "," + 70 + ")")

svg1.append('text').text("4 star").attr("transform", "translate(" + 142 + "," + 81 + ")").attr("fill", "#e78ac3")

svg1.append('rect')
  .attr('width', 15)
  .attr('height', 15)
  .style('fill', "#a6d854")
  .style('stroke', "#a6d854")
  .attr("transform", "translate(" + 10 + "," + 70 + ")")

svg1.append('text').text("5 star").attr("transform", "translate(" + 42 + "," + 81 + ")").attr("fill", "#a6d854")

svg1.append('rect')
  .attr('width', 15)
  .attr('height', 15)
  .style('fill', "#66c2a5")
  .style('stroke', "#66c2a5")
  .attr("transform", "translate(" + 400 + "," + 70 + ")")

svg1.append('text').text("1 star").attr("transform", "translate(" + 442 + "," + 81 + ")").attr("fill", "#66c2a5")

function showCloud(data) {
  d3.layout.cloud().size([width, height])
    .words(data)
    .rotate(function(d) {
      return d.text.length > 3 ? 0 : 90;
    })
    .fontSize(function(d) {
      return wordScale(d.frequency);
    })
    .on("end", draw)
    .start();

  function draw(words) {
    var cloud = svg.selectAll("text").data(words)
    //Entering words
    cloud.enter()
      .append("text")
      .style("font-family", "overwatch")
      .style("fill", function(d) {
        var paringObject = data.filter(function(obj) {
          return obj.text === d.text
        });
        return colorcloud(paringObject[0].category);
      })
      .style("fill-opacity", .5)
      .attr("text-anchor", "middle")
      .attr('font-size', 1)
      .text(function(d) {
        return d.text;
      });
    cloud
      .transition()
      .duration(600)
      .style("font-size", function(d) {
        return d.size + "px";
      })
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .style("fill-opacity", 1);
  }
}