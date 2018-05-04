
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("d3v4-scale")) :
  typeof define === "function" && define.amd ? define(["exports", "d3v4-scale"], factory) :
  (factory(global.d3v4 = global.d3v4 || {}, global.d3v4));
}(this, function(exports, d3v4Scale) {
  'use strict';

  function square(x) {
    return x * x;
  }

  function radial() {
    var linear = d3v4Scale.scaleLinear();

    function scale(x) {
      return Math.sqrt(linear(x));
    }

    scale.domain = function(_) {
      return arguments.length ? (linear.domain(_), scale) : linear.domain();
    };

    scale.nice = function(count) {
      return (linear.nice(count), scale);
    };

    scale.range = function(_) {
      return arguments.length ? (linear.range(_.map(square)), scale) : linear.range().map(Math.sqrt);
    };

    scale.ticks = linear.ticks;
    scale.tickFormat = linear.tickFormat;

    return scale;
  }

  exports.scaleRadial = radial;

  Object.defineProperty(exports, '__esModule', {value: true});
}));
    
    d3v4.select(".visualise")
      .on("change", function() {
        var attribute = d3v4.select(this).property("value");
        mode = attribute;
        change();
      })
        
    var mode = "runs";
    
    var margin = {top: 100, right: 100, bottom: 100, left: 100};
    
    var width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    var f_svg = d3v4.select("#featureranking").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var center = f_svg.append("g")
      .attr("transform", "translate(" + width / 1.7 + "," + height / 2 + ")");
    
    
    var radius = Math.min(width, height) / 2 + 10;
    var radiusTextSpacing = 50;
    
    var parseTime = d3v4.timeParse("%M:%S"),
        formatTime = d3v4.timeFormat("%M:%S");
    
    var fullCircle = 2 * Math.PI;
    
    var dotRadius = 2;
    
    var x = d3v4.scaleBand()
      .range([0, 2 * Math.PI]);
    
    var y = d3v4.scaleRadial()
      .range([0, radius]);
    
    var z = d3v4.scaleTime()
      .range([radius, 0]);
    
    // A filter shamelessly stolen from Nadieh Bremer
    var filter = f_svg.append('defs').append('filter').attr('id','glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','7').attr('result','coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
    
    var areaRuns = d3v4.areaRadial()
      .angle(function(d) { return x(d.event)})
      .outerRadius(function(d) { return y(d.run)})
      .curve(d3v4.curveCatmullRomClosed);
    
    var areaTime = d3v4.lineRadial()
      .angle(function(d) { return x(d.event); })
      .radius(function(d) { return z(d.best_time); })
      .curve(d3v4.curveCatmullRomClosed);
    
    var runs, hoverCirclesRuns, labels;
    var yTick, yAxis;
    
    d3v4.csv("data/featureranking.csv", function(d) {
      d.run = +d.run;
      return d;
    }, function(error, data) {
      if (error) throw error;
      
      data = data.sort(function(a, b) {
        return a.event < b.event;
      });
      
      x.domain(data.map(function(d) {
        return d.event;
      }));
      
      y.domain([0, d3v4.max(data, function(d) {
        return d.run;
      })]);
      
      var slowestTime = "24:00";
      
      z.domain([d3v4.min(data, function(d) {
        return d.best_time;
      }), parseTime(slowestTime)]);
      
      var xAxis = center.append("g")
        .attr("text-anchor", "middle");
      
      var xTick = xAxis.selectAll("g")
        .data(data)
      .enter().append("g");
      
      xTick.append("line")
        .attr("class", "x-tick")
        .attr("y2", radius)
        .attr("transform", function(d) {
          return "rotate(" + (x(d.event) / fullCircle * 360) + ")";
        });
      
      xTick.append("line")
        .attr("class", "x-tick-long")
        .attr("y1", radius)
        .attr("y2", radius + 30)
        .attr("transform", function(d) {
          return "rotate(" + (x(d.event) / fullCircle * 360) + ")";
        });
      
      yAxis = center.append("g")
        .attr("text-anchor", "middle");
      
      addAxis(0);
      
      labels = xTick.append("g")
        .attr("class", "label");      
      
      labels.append("text")
        .attr("y", radius + radiusTextSpacing)
        .attr("x", function(d) {
          return Math.cos(x(d.event) + Math.PI / 2) * (radius + radiusTextSpacing);
        })
        .attr("y", function(d) {
          return Math.sin(x(d.event) + Math.PI / 2) * (radius + radiusTextSpacing);
        })
        .attr("dy", "0.35em")
        .text(function(d) {
          return d.event;
        });
      
      runs = center.append("g");
      
      runs.append("path")
        .datum(data)
        .attr("class", "runs")
        .attr("d", areaRuns)
        .attr("transform", "rotate(180)")
        .style("filter" , "url(#glow)")
        .on("mouseover", function() {
          d3v4.select(".times").transition()
            .style("fill-opacity", 0.05);
        })
        .on("mouseout", function() {
          d3v4.select(".times").transition()
            .style("fill-opacity", 0.35);
        });
            
      runs.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot-run") 
        .attr("cy", function(d) {
          return y(d.run);
        })
        .attr("r", dotRadius)
        .attr("transform", function(d) {
          return "rotate(" + (x(d.event)) / fullCircle * 360 + ")";
        })
        .style("filter" , "url(#glow)");
            
      hoverCirclesRuns = center.append("g");
      
      hoverCirclesRuns.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("class", "hover-dot") 
        .attr("cy", function(d) {
          return y(d.run);
        })
        .attr("r", dotRadius * 3)
        .attr("transform", function(d) {
          return "rotate(" + (x(d.event)) / fullCircle * 360 + ")";
        })
        .on("mouseover", function(d) {
          var multiplier = mode == "runs" ? y(d.run) : z(d.best_time);
          var unit = d.run == 1 ? " run" : "runs";
          var labelText = mode == "runs" ? d.run : formatTime(d.best_time);
        
          d3v4.select(this.parentNode).append("text")
            .attr("x", function() {
              return Math.cos(x(d.event) + Math.PI / 2) * multiplier;
            })
            .attr("y", function() {
              return Math.sin(x(d.event) + Math.PI / 2) * multiplier;
            })
            .attr("dy", "-1em")
            .attr("text-anchor", "middle")
            .text(labelText);
        })
        .on("mouseout", function(d) {
          d3v4.select(this.parentNode).select("text").remove();
        });
      
  
    });
    
    function change() {
        runs.select("path")
          .transition()
          .duration(1000)
          .attr("d", function(d) {
            return mode == "time" ? areaTime(d) : areaRuns(d);
          })
          .style("fill", function() {
            return mode == "time" ? "none" : "#B06600";
          });
      
        runs.selectAll("circle")
          .transition()
          .duration(1000)
          .attr("cy", function(d) {
            return mode == "time" ? z(d.best_time) : y(d.run);
          })
          .style("fill", function() {
            return mode == "time" ? "#bfbd00" : "#B06600";
          });
        
        hoverCirclesRuns
          .selectAll("circle")
          .attr("cy", function(d) {
             return mode == "time" ? z(d.best_time) : y(d.run);
          });
        
        yTick.selectAll("circle")
          .transition()
          .duration(250)
          .attr("r", 0);
        
        yTick.selectAll("text")
          .transition()
          .duration(250)
          .attr("y", 0)
          .on("end", function() {
            yAxis.selectAll("g").remove();
            addAxis(250);
          })
    }
    
    function addAxis(time) {
        yTick = yAxis.selectAll("g")
          .data(function() {
            return mode == "runs" ? y.ticks(5).slice(1) : z.ticks(5).slice(0, -1);
          })
        .enter().append("g")
          .attr("class", "y-tick");

        yTick.append("circle")
          .transition()
          .duration(time * 3)
          .attr("r", function(d) {
            return mode == "runs" ? y(d) : z(d);
          });

        yTick.append("text")
          .transition()
          .duration(time * 3)
          .attr("y", function(d) {
            return mode == "runs" ? -y(d) : -z(d);
          })
          .attr("dy", "0.35em")
          .text(function(d) {
            return mode == "runs" ? d : formatTime(d);
          });
    }

