// reference: http://bl.ocks.org/NPashaP/a74faf20b492ad377312
// integrate the map design with Yelp rating data

function tooltipHtml(n, d) { /* function to create html content string in tooltip div. */
  return "<h4>" + n + "</h4><table>" +
    //"<tr><td>Low</td><td>"+(d.low)+"</td></tr>"+
    "<tr><td>Average</td><td>" + (d.avg) + "</td></tr>" +
    //"<tr><td>High</td><td>"+(d.high)+"</td></tr>"+
    "</table>";
}

var sampleData = {}; /* Sample random data. */
["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
  "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH",
  "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT",
  "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN",
  "WI", "MO", "AR", "OK", "KS", "LS", "VA"
]
.forEach(function(d) {
  var low = 5.0 * Math.random(),
    mid = 5.0 * Math.random(),
    high = 5.0 * Math.random();
  sampleData[d] = {
    avg: ((low + mid + high) / 3).toFixed(2),
    color: d3.interpolate("#fee8c8", "#e34a33")(low / 5)
  };
});

/* draw states on id #statesvg */
uStates.draw("#statesvg", sampleData, tooltipHtml);

d3.select("vis_2").style("height", "400px");