// Entry point for interactive diagrams.
function main() {

  // Set values of true positives vs. false positives.
  var tprValue = 300;
  var fprValue = -700;

  // Parameters for main model comparison.
  var s0 = 10; // standard deviations of defaulters/payers.
  var s1 = 10;
  var d0 = 8;  // differences from means of defaulters/payers
  var d1 = 12;
  var m0 = 55; // means of overall distributions
  var m1 = 45;

  // Create items to classify: two groups with different
  // distributions of positive/negative examples.
  comparisonExample0 = new GroupModel(makeNormalItems(0, 1, 100, m0 + d0, s0)
      .concat(makeNormalItems(0, 0, 100, m0 - d0, s0)), tprValue, fprValue);
  comparisonExample1 = new GroupModel(makeNormalItems(1, 1, 100, m1 + d1, s1)
      .concat(makeNormalItems(1, 0, 100, m1 - d1, s1)), tprValue, fprValue);

  // Make a model to represent initial example of classification.
  var singleModel = new GroupModel(makeNormalItems(0, 1, 100, 65, 10)
      .concat(makeNormalItems(0, 0, 100, 35, 10)), tprValue, fprValue);

  // Make models to represent different distributions.
  var distributionExample0 = new GroupModel(makeNormalItems(0, 1, 150, 70, 7)
      .concat(makeNormalItems(0, 0, 150, 30, 7)), tprValue, fprValue);
  var distributionExample1 = new GroupModel(makeNormalItems(0, 1, 150, 60, 10)
      .concat(makeNormalItems(0, 0, 150, 40, 10)), tprValue, fprValue);


  // Need to classify to get colors to look right on histogram.
  distributionExample0.classify(0);
  distributionExample1.classify(0);

  // Make correctness matrices.
  createCorrectnessMatrix('single-correct0', singleModel);
  // Make histograms.
  createHistogram('single-histogram0', singleModel);
  // Add legends.
  createHistogramLegend('single-histogram-legend0', 0);
  // Create pie charts
  createRatePies('single-pies0', singleModel, PIE_COLORS[0]);

  // Initialize everything.
  singleModel.classify(50);
  singleModel.notifyListeners();
}

// Models for threshold classifiers
// along with simple optimization code.

// An item with an intrinsic value, predicted classification, and
// a "score" for use by a threshold classifier.
// The going assumption is that the values and predicted values
// are 0 or 1. Furthermore "1" is considered a positive/good value.
var Item = function(category, value, score) {
  this.category = category;
  this.value = value;
  this.predicted = value;
  this.score = score;
};

// A group model defines a group of items, with a threshold
// for a classifier and associated values for true and
// false positives. It also can notify listeners that an event
// has occurred to change the model.
var GroupModel = function(items, tprValue, fprValue) {
  // Data defining the model.
  this.items = items;
  this.tprValue = tprValue;
  this.fprValue = fprValue;
  // Observers of the model; needed for interactive diagrams.
  this.listeners = [];
};

// Classify according to the given threshold, and store various
// interesting metrics for future use.
GroupModel.prototype.classify = function(threshold) {
  this.threshold = threshold;

  // Classify and find positive rates.
  var totalGood = 0;
  var totalPredictedGood = 0;
  var totalGoodPredictedGood = 0;
  this.items.forEach(function(item) {
    item.predicted = item.score >= threshold ? 1 : 0;
  });
  this.tpr = tpr(this.items);
  this.positiveRate = positiveRate(this.items);

  // Find profit.
  this.profit = profit(this.items, this.tprValue, this.fprValue);
};

// GroupModels follow a very simple observer pattern; they
// have listeners which can be notified of arbitrary events.
GroupModel.prototype.addListener = function(listener) {
  this.listeners.push(listener);
};

// Tell all listeners of the specified event.
GroupModel.prototype.notifyListeners = function(event) {
  this.listeners.forEach(function(listener) {listener(event);});
};

// Create items whose scores have a
// "deterministic normal" distribution. That is, the items track
// a Gaussian curve. This not the same as actually choosing scores
// normally, but for expository purposes it's useful to have
// deterministic, smooth distributions of values.
function makeNormalItems(category, value, n, mean, std) {
  var items = [];
  var error = 0;
  for (var score = 0; score < 100; score++) {
    var e = error + n * Math.exp(-(score - mean) * (score - mean) / (2 * std * std)) /
            (std * Math.sqrt(2 * Math.PI));
    var m = Math.floor(e);
    error = e - m;
    for (var j = 0; j < m; j++) {
      items.push(new Item(category, value, score));
    }
  }
  return items;
}


// Profit of a model, subject to the given values
// for true and false positives. Note that the simple model
// in the paper assumes zero value for negatives.
function profit(items, tprValue, fprValue) {
  var sum = 0;
  items.forEach(function(item) {
    if (item.predicted == 1) {
      sum += item.value == 1 ? tprValue : fprValue;
    }
  });
  return sum;
}

// Count specified type of items.
function countMatches(items, value, predicted) {
  var n = 0;
  items.forEach(function(item) {
    if (item.value == value && item.predicted == predicted) {
      n++;
    }
  });
  return n;
}

// Calculate true positive rate
function tpr(items) {
  var totalGood = 0;
  var totalGoodPredictedGood = 0;
  items.forEach(function(item) {
    totalGood += item.value;
    totalGoodPredictedGood += item.value * item.predicted;
  });
  if (totalGood == 0) {
    return 1;
  }
  return totalGoodPredictedGood / totalGood;
}

// Calculate overall positive rate
function positiveRate(items) {
  var totalGood = 0;
  items.forEach(function(item) {
    totalGood += item.predicted;
  });
  return totalGood / items.length;
}

// Interactive diagrams for fairness demo.
// These are lightweight components customized
// for this demo.

// Side of grid in histograms and correctness matrices.
var SIDE = 7;

// Component dimensions.
var HEIGHT = 250;
var HISTOGRAM_WIDTH = 370;
var HISTOGRAM_LEGEND_HEIGHT = 60;

// Histogram bucket width
var HISTOGRAM_BUCKET_SIZE = 2;

// Padding on left; needed within SVG so annotations show up.
var LEFT_PAD = 10;

// Palette constants and functions.

// Colors of categories of items.
var CATEGORY_COLORS = ['#ef0b0b', '#c70'];

// Colors for pie slices; set by hand because of various tradeoffs.
// Order:  false negative, true negative, true positive, false positive.
var PIE_COLORS = [['#686868', '#ccc','#ef0b0b', '#f9aa9f'],
                  ['#686868', '#ccc','#c70',  '#f0d6b3']];

function itemColor(category, predicted) {
  return predicted == 0 ? '#555' : CATEGORY_COLORS[category];
}

function itemOpacity(value) {
  return .3 + .7 * value;
}

function iconColor(d) {
  return d.predicted == 0 && !d.colored ? '#555' : CATEGORY_COLORS[d.category];
}

function iconOpacity(d) {
  return itemOpacity(d.value);
}

// Icon for a person in histogram or correctness matrix.
function defineIcon(selection) {
  selection
    .attr('class', 'icon')
    .attr('stroke', iconColor)
    .attr('fill', iconColor)
    .attr('fill-opacity', iconOpacity)
    .attr('stroke-opacity', function(d) {return .4 + .6 * d.value;})
    .attr('cx', function(d) {return d.x + d.side / 2;})
    .attr('cy', function(d) {return d.y + d.side / 2;})
    .attr('r', function(d) {return d.side * .4});
}

function createIcons(id, items, width, height, pad) {
  var svg = d3v4.select('#' + id).append('svg')
    .attr('width', width)
    .attr('height', height);
  if (pad) {
    svg = svg.append('g').attr('transform', 'translate(' + pad + ',0)');
  }
  var icon = svg.selectAll('.icon')
    .data(items)
  .enter().append('circle')
    .call(defineIcon);
  return svg;
}

function gridLayout(items, x, y) {
  items = items.reverse();
  var n = items.length;
  var cols = 15;
  var rows = Math.ceil(n / cols);
  items.forEach(function(item, i) {
    item.x = x + SIDE * (i % cols);
    item.y = y + SIDE * Math.floor(i / cols);
    item.side = SIDE;
  });
}

// Shallow copy of item array.
function copyItems(items) {
  return items.map(function(item) {
    var copy = new Item(item.category, item.value, item.score);
    copy.predicted = item.predicted;
    return copy;
  });
}

// Create histogram for scores of items in a model.
function createHistogram(id, model, noThreshold, includeAnnotation) {
  var width = HISTOGRAM_WIDTH;
  var height = HEIGHT;
  var bottom = height - 16;

  // Create an internal copy.
  var items = copyItems(model.items);

  // Icons
  var numBuckets = 100 / HISTOGRAM_BUCKET_SIZE;
  var pedestalWidth = numBuckets * SIDE;
  var hx = (width - pedestalWidth) / 2;
    var scale = d3v4.scaleLinear().range([hx, hx + pedestalWidth]).
      domain([0,100]);

  function histogramLayout(items, x, y, side, low, high, bucketSize) {
    var buckets = [];
    var maxNum = Math.floor((high - low) / bucketSize);
    items.forEach(function(item) {
      var bn = Math.floor((item.score - low) / bucketSize);
      bn = Math.max(0, Math.min(maxNum, bn));
      buckets[bn] = 1 + (buckets[bn] || 0);
      item.x = x + side * bn;
      item.y = y - side * buckets[bn];
      item.side = side;
    });
  }

  histogramLayout(items, hx, bottom, SIDE, 0, 100, HISTOGRAM_BUCKET_SIZE);
  var svg = createIcons(id, items, width, height);

  var tx = width / 2;
  var topY = 60;
  var axis = d3v4.axisBottom(scale);
  svg.append('g').attr('class', 'histogram-axis')
    .attr('transform', 'translate(0,-8)')
    //.call(axis);
  d3v4.select('.domain').attr('stroke-width', 1);

  if (noThreshold) {
    return;
  }
  // Sliding threshold bar.
  var cutoff = svg.append('rect').attr('x', tx - 2).attr('y', topY - 10).
      attr('width', 3).attr('height', height - topY);

  var thresholdLabel = svg.append('text').text('loan threshold: 50')
      .attr('x', tx)
      .attr('y', 40)
      .attr('text-anchor', 'middle').attr('class', 'bold-label');

  if (includeAnnotation) {
    var annotationPad = 10;
    var annotationW = 200;
    var thresholdAnnotation = svg.append('rect')
        .attr('class', 'annotation group-unaware-annotation')
        .attr('x', tx - annotationW / 2)
        .attr('y', 30 - annotationPad)
        .attr('rx', 20)
        .attr('ry', 20)
        .attr('width', annotationW)
        .attr('height', 30);
   }

  function setThreshold(t, eventFromUser) {
    t = Math.max(0, Math.min(t, 1000));
    if (eventFromUser) {
      t = HISTOGRAM_BUCKET_SIZE * Math.round(t / HISTOGRAM_BUCKET_SIZE);
    } else {
      tx = Math.round(scale(t));
    }
    tx = Math.max(0, Math.min(width - 4, tx));
    var rounded = SIDE * Math.round(tx / SIDE);
    cutoff.attr('x', rounded);
    var labelX = Math.max(50, Math.min(rounded, width - 70));
    thresholdLabel.attr('x', labelX).text('Star: ' + d3v4.format(",.1f")(t/20*1.4));
    if (includeAnnotation) {
      thresholdAnnotation.attr('x', tx - annotationW / 2);
    }
    svg.selectAll('.icon').call(defineIcon);
  }
  var drag = d3v4.drag()
    .on('drag', function() {
      var oldTx = tx;
      tx += d3v4.event.dx;
      var t = scale.invert(tx);
      setThreshold(t, true);
      if (tx != oldTx) {
        model.classify(t);
        model.notifyListeners('histogram-drag');
      }
  });
  svg.call(drag);
  model.addListener(function(event) {
    for (var i = 0; i < items.length; i++) {
      items[i].predicted = items[i].score >= model.threshold ? 1 : 0;
    }
    setThreshold(model.threshold, event == 'histogram-drag');
  });
}

// Draw full legend for histogram, with all four possible
// categories of people.
function createHistogramLegend(id, category) {
  var width = HISTOGRAM_WIDTH;
  var height = HISTOGRAM_LEGEND_HEIGHT;
  var centerX = width / 2;
  var boxSide = 16;
  var centerPad = 1;

  // Create SVG.
  var svg = d3v4.select('#' + id).append('svg')
    .attr('width', width)
    .attr('height', height);

  // Create boxes.
  svg.append('rect').attr('width', boxSide).attr('height', boxSide)
    .attr('x', centerX - boxSide - centerPad).attr('y', boxSide)
    .attr('fill', itemColor(category, 0))
    .attr('fill-opacity', itemOpacity(1));
  svg.append('rect').attr('width', boxSide).attr('height', boxSide)
    .attr('x', centerX + centerPad).attr('y', boxSide)
    .attr('fill', itemColor(category, 1))
    .attr('fill-opacity', itemOpacity(1));

  svg.append('rect').attr('width', boxSide).attr('height', boxSide)
    .attr('x', centerX - boxSide - centerPad).attr('y', 0)
    .attr('fill', itemColor(category, 0))
    .attr('fill-opacity', itemOpacity(0));
  svg.append('rect').attr('width', boxSide).attr('height', boxSide)
    .attr('x', centerX + centerPad).attr('y', 0)
    .attr('fill', itemColor(category, 1))
    .attr('fill-opacity', itemOpacity(0));

  // Draw text.
  var textPad = 4;
  svg.append('text')
      .text('low b rating/ high user rating')
      .attr('x', centerX - boxSide - textPad)
      .attr('y', 2 * boxSide - textPad)
      .attr('text-anchor', 'end')
      .attr('class', 'legend-label');
  svg.append('text')
      .text('low b rating/ low user rating')
      .attr('x', centerX - boxSide - textPad)
      .attr('y', boxSide - textPad)
      .attr('text-anchor', 'end')
      .attr('class', 'legend-label');
  svg.append('text')
      .text('high b rating / high user rating')
      .attr('x', centerX + boxSide + textPad)
      .attr('y', 2 * boxSide - textPad)
      .attr('text-anchor', 'start')
      .attr('class', 'legend-label');
  svg.append('text')
      .text('high b rating /low user rating')
      .attr('x', centerX + boxSide + textPad)
      .attr('y', boxSide - textPad)
      .attr('text-anchor', 'start')
      .attr('class', 'legend-label');
}

// A much simpler legend, used in the top diagram,
// with only two categories of people and a different layout.
function createSimpleHistogramLegend(id, category) {
  var width = HISTOGRAM_WIDTH;
  var height = HISTOGRAM_LEGEND_HEIGHT;
  var centerX = width / 2;
  var boxSide = 16;
  var centerPad = 1;
  var lx = 50;

  // Create SVG.
  var svg = d3v4.select('#' + id).append('svg')
    .attr('width', width)
    .attr('height', height);

  // Create boxes.
  svg.append('rect').attr('width', boxSide).attr('height', boxSide)
    .attr('x', centerX + centerPad).attr('y', 0)
    .attr('fill', itemColor(category, 1))
    .attr('fill-opacity', itemOpacity(1));
  svg.append('rect').attr('width', boxSide).attr('height', boxSide)
    .attr('x', lx).attr('y', 0)
    .attr('fill', itemColor(category, 1))
    .attr('fill-opacity', itemOpacity(0));

  // Draw text.
  var textPad = 4;
  svg.append('text')
      .text('would pay back loan')
      .attr('x', centerX + boxSide + textPad)
      .attr('y', boxSide - textPad)
      .attr('text-anchor', 'start')
      .attr('class', 'legend-label');
  svg.append('text')
      .text('would default on loan')
      .attr('x', lx + boxSide + textPad)
      .attr('y', boxSide - textPad)
      .attr('text-anchor', 'start')
      .attr('class', 'legend-label');
}

// Create a pie chart.
function createPie(id, values, colors, svg, ox, oy, radius) {
  var angles = [];
  function makeAngles(values) {
    var total = 0;
    for (var i = 0; i < values.length; i++) {
      total += values[i];
    }
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
      var start = 2 * Math.PI * sum / total;
      sum += values[i];
      var end = 2 * Math.PI * sum / total;
      angles[i] = [start, end];
    }
  }
  makeAngles(values);
  var slices = svg.selectAll('.slice-' + id);
  function makeArc(d) {
    return d3v4.arc()
      .innerRadius(0)
      .outerRadius(radius)
      .startAngle(d[0]).endAngle(d[1])();
  }
  slices.data(angles).enter().append('path')
    .attr('class', 'slice-' + id)
    .attr('d', makeArc)
    .attr('fill', function(d, i) {return colors[i]})
    .attr('transform', 'translate(' + ox + ',' + oy + ')');
  return function(newValues) {
    makeAngles(newValues);
    svg.selectAll('.slice-' + id)
        .data(angles)
        .attr('d', makeArc);
  }
}

// Create a nice label for percentages; the return value is a callback
// to update the number.
function createPercentLabel(svg, x, y, text, labelClass, statClass) {
  var label = svg.append('text').text(text)
      .attr('x', x).attr('y', y).attr('class', labelClass);
  var labelWidth = label.node().getComputedTextLength();
  var stat = svg.append('text').text('')
      .attr('x', x + labelWidth + 4).attr('y', y).attr('class', statClass);

  // Return a function that updated the label.
  return function(value) {
    var formattedValue = Math.round(100 * value) + '%';
    stat.text(formattedValue);
  }
}

// Helper for multiline explanations.
function explanation(svg, lines, x, y) {
  lines.forEach(function(line) {
    svg.append('text').text(line)
        .attr('x', x).attr('y', y += 16).attr('class', 'explanation');
  });
}

// Create two pie charts: 1. for all classification rates
// and 2. true positive rates.
function createRatePies(id, model, palette, includeAnnotations) {
  var width = 300;
  var lx = 0;
  var height = 170;
  var svg = d3v4.select('#' + id).append('svg')
    .attr('width', width)
    .attr('height', height);
  // Add a little margin so the annotation rectangle
  // around "True Positive Rate" doesn't get cut off.
  svg = svg.append('g').attr('transform', 'translate(10,0)');
  var tprColors = [palette[0], palette[2]];
  var cy = 120;
  var tprPie = createPie('tpr-' + id, [1,1], tprColors, svg, 45, cy, 40);
  var allPie = createPie('all-' + id, [1,1,1,1], palette, svg, 195, cy, 40);
  var topY = 35;

  var tprLabel = createPercentLabel(svg, lx, topY, 'True Positive Rate',
      'pie-label', 'pie-number');
  var posLabel = createPercentLabel(svg, width / 2, topY, 'Positive Rate',
      'pie-label', 'pie-number');

  // Add annotation labels, if requested:
  if (includeAnnotations) {
    var tprAnnotation = svg.append('rect')
        .attr('class', 'annotation equal-opportunity-annotation')
        .attr('x', -8)
        .attr('y', 14)
        .attr('rx', 20)
        .attr('ry', 20)
        .attr('width', width / 2 - 10)
        .attr('height', 30);
    var posAnnotation = svg.append('rect')
        .attr('class', 'annotation demographic-parity-annotation')
        .attr('x', width / 2 - 10)
        .attr('y', 14)
        .attr('rx', 20)
        .attr('ry', 20)
        .attr('width', width / 2 - 30)
        .attr('height', 30);
  }

  // Add explanations of positive rates
  explanation(svg, ['percentage of high b',
     'rating gets high u rating'], 0, topY);
  explanation(svg, ['percentage of all',
     'b gets high u rating'], width / 2 + 4, topY);

  model.addListener(function() {
    var items = model.items;
    tprPie([countMatches(items, 1, 0),
            countMatches(items, 1, 1)]);
    allPie([countMatches(items, 1, 0), countMatches(items, 0, 0),
            countMatches(items, 1, 1), countMatches(items, 0, 1)]);
    tprLabel(model.tpr);
    posLabel(model.positiveRate);
  });
}

// Creates matrix view of dots representing correct and
// incorrect items.
function createCorrectnessMatrix(id, model) {
  var width = 300;
  var height = 170;
  var correct, incorrect;
  function layout() {
    correct = model.items.filter(function(item) {
      return item.value == item.predicted;
    });
    incorrect = model.items.filter(function(item) {
      return item.value != item.predicted;
    });
    gridLayout(correct, 2, 80);
    gridLayout(incorrect, width / 2 + 4, 80);
  }

  layout();
  var svg = createIcons(id, model.items, width, height, LEFT_PAD);

  var topY = 18;
  var correctLabel = createPercentLabel(svg, 0, topY, 'Correct',
      'pie-label', 'pie-number');
  var incorrectLabel = createPercentLabel(svg, width / 2 + 4, topY, 'Incorrect',
      'pie-label', 'pie-number');

  // Add explanation of correct decisions.
  explanation(svg, ['users give low/high', 'rating to business', 'with low/high rating'], 0, topY);
  explanation(svg, ['users give low/high', 'rating to business', 'with high/low rating'], width / 2 + 4, topY);

  // Add explanation of incorrect
  model.addListener(function() {
    layout();
    correctLabel(correct.length / model.items.length);
    incorrectLabel(incorrect.length / model.items.length);
    svg.selectAll('.icon').call(defineIcon);
  });
}
