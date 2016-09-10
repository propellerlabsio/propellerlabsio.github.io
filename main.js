d3.xml("logo.svg").mimeType("image/svg+xml").get(function (error, xml) {
  if (error) throw error;
  document
    .getElementById("logoContainer")
    .appendChild(xml.documentElement);

  adjustBaseLogo();
  rippleSurface();
  rotateProp();
});

/**
 * Adjust the basic logo file to suit our needs
 */
function adjustBaseLogo() {

  // Adjust svg height and width
  var svg = d3.select("svg");
  var origHeight = svg.attr("height");
  var origWidth = svg.attr("width");
  svg
    .attr("height", "200")
    .attr("width", "200")
    .attr("viewBox", "0 0 " + origHeight + " " + origWidth)
    .attr("preserveAspectRatio", "xMidYMid");


  // Scale image down
  // d3.select("#logo").attr("transform", "scale(.3)");

  // Adjust colors to white for dark background
  var COLOR = "#eeeeee";
  d3.select("#flask").style("stroke", COLOR);
  d3.select("#fluid").style("stroke", COLOR);
  d3.select("#prop_cone").style("fill", COLOR);
  d3.select("#blade1").style("fill", COLOR);
  d3.select("#blade2").style("fill", COLOR);
  d3.select("#blade3").style("fill", COLOR);
}

function rotateProp() {

  var prop = d3.select("#propeller");
  var propCenter = getPropCenterVector();
  var originalTransform = prop.attr("transform");
  var startTransform = 'rotate(0,' + propCenter.x + "," + propCenter.y + ") " + originalTransform;
  var endTransform = 'rotate(360,' + propCenter.x + "," + propCenter.y + ") " + originalTransform;

  repeat();

  function repeat() {
    prop
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .attrTween("transform", function () {
        return d3.interpolateString(startTransform, endTransform);
      })
      .on("end", repeat)
  }
}

function rippleSurface() {
  const halftime = 1500;
  var fluid = d3.select("#fluid");
  var originalPath = fluid.attr("d");
  var fluidReverse = d3.select("#fluid-reverse");
  var reversePath = fluidReverse.attr("d");

  repeat();

  function repeat() {
    fluid
      .transition()
      .ease(d3.easeLinear)
      .duration(halftime)
      .attr("d", reversePath)
      .transition()
      .ease(d3.easeLinear)
      .duration(halftime)
      .attr("d", originalPath)
      .on("end", repeat);
  }
}

/**
 * Returns object with x and y of propeller center
 */
function getPropCenterVector(sMatrixTransform) {
  // Get prop center in form of "matrix(a,b,c,d,e,f)" 
  var sMatrixTransform = d3.select("#propCenter").attr("transform");

  // Convert string matrix transform to array of floats
  var openParens = sMatrixTransform.indexOf("(");
  var stringValues = sMatrixTransform.substring(openParens + 1);
  var stringValues = stringValues.substring(0, stringValues.length - 1);
  var arrayValues = stringValues.split(",");
  var arrayFloats = arrayValues.map(function (stringValue) {
    return parseFloat(stringValue);
  })

  // Build vector object
  var vector = {};
  vector.x = arrayFloats[0] + arrayFloats[2] + arrayFloats[4];
  vector.y = arrayFloats[1] + arrayFloats[3] + arrayFloats[5];
  return vector;

}