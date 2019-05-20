var margin = {top: 60, right: 100, bottom: 100, left: 100},
    width = 960 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;

var smallRadius = 1,
    bigRadius = 6,
    dotDistance = 12;

var i = 0,
    duration = 750;

var totalDuration = 2000;
var frameRate = 40; // milliseconds per frame, 40 milliseconds is 1/25th of a second ie 1 frame @25fps
var totalFrames = totalDuration / frameRate;
var n = 0;
var id = 0;

var lineGenerator = d3.svg.line()
                    .x(function (v) {return v.x;})
                    .y(function (v) {return v.y;})
                    .interpolate("cardinal");

var nodes,
    edges;

var data1 = "nodes_latex.json",
    data2 = "nodes2.json";


init()
setup(data1)

function animate() {
    var animNode = d3.select("#n2")
    console.log(animNode.attr("cx"))
    animNode.transition()
            .duration(1000)
            .attr({cx : animNode.attr("cx") - 20})
    console.log(animNode.attr("cx"))
    console.log(animNode.attr("cx"))
}

function setup(data) {

    // Load data from json file
    d3.json(data, function(error, net) {
        if (error) throw error;
        nodes = net.nodes;
        edges = net.edges;
        nodes.forEach(layoutNode);
        edges.forEach(layoutEdge);
    })
}

function getElemByName(array, name) {
    return array.find(function (item) { return item["name"] == name});
}

var latex_render_url = "http://latex.codecogs.com/svg.latex?\\dpi{300}";

function layoutNode(node) {
    var svg = d3.select("svg")
    if (node.type == "delta") {
        var latex_raw = node.latex;
        var latex_query = encodeURI(latex_raw);
        svg.append("foreignObject")
         .attr({
             "x": node.x - 20,
             "y": node.y + 10,
             "width": 400,
             "height": 200,
             "requiredFeatures": "http://www.w3.org/TR/SVG11/feature#Extensibility",
             "id" : node.name
        })
         .append("xhtml:body").attr({
             "margin": 0,
             "padding": 0,
             "width": 400,
             "height": 200
        })
         .append("img").attr({
         "src": latex_render_url + latex_query
        })
    }
    else if (node.type == "latex") {
        var latex_raw = node.latex;
        var latex_query = encodeURI(latex_raw);
        svg.append("foreignObject")
         .attr({
             "x": node.x,
             "y": node.y - 20,
             "width": 400,
             "height": 200,
             "requiredFeatures": "http://www.w3.org/TR/SVG11/feature#Extensibility",
             "id" : node.name
     })
         .append("xhtml:body").attr({
             "margin": 0,
             "padding": 0,
             "width": 400,
             "height": 200
     })
         .append("img").attr({
         "src": latex_render_url + latex_query
     })
    }
    else {
    svg.append("circle").attr({
        cx: node.x,
        cy: node.y,
        r: radiusForType(node.type),
        fill: colorForType(node.type),
        stroke: "black",
        "stroke-width": 1,
        "class" : "node",
        "id" : node.name
    })
    }
}

function layoutEdge(edge) {
    var svg = d3.select("svg")
    var source = getElemByName(nodes, edge.source)
    var target = getElemByName(nodes, edge.target)
    var sourceVec = makeVector(source.x, source.y)
    var targetVec = makeVector(target.x, target.y)
    var unitVec = unitVector(subtractVectors(targetVec, sourceVec))
    var sourcePoint = sourceVectorForType(sourceVec, unitVec, source.type)
    var targetPoint = targetVectorForType(targetVec, unitVec, target.type)
    if(edge.type == "curve") {
        var points = [sourcePoint, subtractVectors(sourcePoint, {"x" : 20,"y" : 100}), subtractVectors(targetVec, {"x" : 0, "y" : 100}), addVectors(targetVec, makeVector(10,-10))]
        var pathData = lineGenerator(points)
        svg.append('path')
            .attr({
                "d" : pathData,
                "class" : "arrow",
                "stroke-width": 1.5,
                "stroke": "#000",
                "fill" : "none",
                "id" : edge.name
            });
    }
    else {
        svg.append('line')
            .attr({
                "class":"arrow",
                "stroke-width": 1.5,
                "stroke": "#000",
                "marker-end": "url(#" + edge.type + ")",
                "x1": sourcePoint.x,
                "y1": sourcePoint.y,
                "x2": targetPoint.x,
                "y2": targetPoint.y,
                "id": edge.name
                });
    }
}

function makeVector(x,y) {
    return {"x" : x, "y": y}
}

function addVectors(vec1, vec2) {
    return {"x" : vec1.x + vec2.x, "y" : vec1.y + vec2.y}
}

function subtractVectors(vec1, vec2) {
    return {"x" : vec1.x - vec2.x, "y" : vec1.y - vec2.y}
}

function multiplyVector(vector, scalar) {
    return {"x" : scalar * vector.x, "y" : scalar * vector.y }
}

function unitVector(vector) {
    var length = (vector.x ** 2 + vector.y ** 2) ** 0.5
    return {"x" : vector.x / length, "y" : vector.y / length}
}

function sourceVectorForType(vector, uVector, type) {
    switch (type) {
        case "dot":
            return addVectors(vector, multiplyVector(uVector, dotDistance))
        case "white":
            return addVectors(vector, multiplyVector(uVector, bigRadius))
        default:
            return vector
    }
}

function targetVectorForType(vector, uVector, type) {
    switch (type) {
        case "dot":
            return subtractVectors(vector, multiplyVector(uVector, dotDistance))
        case "white":
            return subtractVectors(vector, multiplyVector(uVector, bigRadius))
        default:
            return vector
    }
}

function radiusForType(type) {
        switch(type) {
            case "dot":
                return smallRadius; /* 2 */
            default:
                return bigRadius; /* 5 */
        }
}

function colorForType(type) {
    switch (type) {
        case "white":
            return "white";
        default:
            return "black";
    }
}

function init() {
    var svg = d3.select("body")
                .append("svg")
                .attr("id", "svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    defs = svg.append("defs")

    defs.append("marker")
    		  .attr({
            	"id":"arrow",
            	"viewBox":"0 -5 10 10",
            	"refX":5,
            	"refY":0,
            	"markerWidth":4,
            	"markerHeight":4,
            	"orient":"auto"
                })
            	.append("path")
            	.attr("d", "M0,-5L10,0L0,5")
            	.attr("class","arrowHead");
}

function contractStep1(path,duration) {
    var n11 = d3.select("#n11")
    var n12 = d3.select("#n12")
    var n13 = d3.select("#n13")
    var n14 = d3.select("#n14")
    var n15 = d3.select("#n15")

    var e12 = d3.select("#e12")
    var e13 = d3.select("#e13")
    var e14 = d3.select("#e14")
    var e15 = d3.select("#e15")
    var e22 = d3.select("#e22")

    n12.transition().duration(duration).attr({"cx" : n11.attr("cx"), "cy" : n11.attr("cy"), "r" : 0}).remove()
    n13.transition().duration(duration).attr({"cx" : n11.attr("cx"), "cy" : n11.attr("cy"), "r" : 0}).remove()
    n14.transition().duration(duration).attr({"cx" : n11.attr("cx"), "cy" : n11.attr("cy"), "r" : 0}).remove()
    n15.transition().duration(duration).attr({"cx" : n11.attr("cx"), "cy" : n11.attr("cy"), "r" : 0}).remove()

    e12.transition().duration(duration).attr({"x1" : n11.attr("cx"), "y1" : n11.attr("cy"), "x2" : n11.attr("cx"), "y2" : n11.attr("cy")}).remove()
    e13.transition().duration(duration).attr({"x1" : n11.attr("cx"), "y1" : n11.attr("cy"), "x2" : n11.attr("cx"), "y2" : n11.attr("cy")}).remove()
    e14.transition().duration(duration).attr({"x1" : n11.attr("cx"), "y1" : n11.attr("cy"), "x2" : n11.attr("cx"), "y2" : n11.attr("cy")}).remove()
    e15.transition().duration(duration).attr({"x1" : n11.attr("cx"), "y1" : n11.attr("cy"), "x2" : n11.attr("cx"), "y2" : n11.attr("cy")}).remove()

    var n8 = d3.select("#n8")
    var p1 = makeVector(n8.attr("cx"), n8.attr("cy"))
    var p2 = makeVector(n8.attr("cx") - 10, n8.attr("cy") - 50)
    var p3 = makeVector(n11.attr("cx") - 5, n11.attr("cy") - 50)
    var p4 = makeVector(parseFloat(n11.attr("cx")) + 5, n11.attr("cy") - 10)
    e22.transition().duration(duration).attr({"d" : lineGenerator([p1, p2, p3, p4])})
}

function contractStep2(path, duration) {
    // 7 is reference point
    // 7, 8, 9, 10, 11, 16 (is low)
    var n7 = d3.select("#n7")
    var n8 = d3.select("#n8")
    var n9 = d3.select("#n9")
    var n10 = d3.select("#n10")
    var n11 = d3.select("#n11")
    var n16 = d3.select("#n16")

    var n17 = d3.select("#n17")
    var n18 = d3.select("#n18")
    var n22 = d3.select("#n22")

    var moveVector = subtractVectors(makeVector(n16.attr("cx"), n16.attr("cy")), makeVector(n7.attr("cx"), n7.attr("cy")))
    var e7 = d3.select("#e7")
    var e8 = d3.select("#e8")
    var e9 = d3.select("#e9")
    var e10 = d3.select("#e10")
    var e11 = d3.select("#e11")
    var e22 = d3.select("#e22")

    var e16 = d3.select("#e16")
    var e17 = d3.select("#e17")
    var e18 = d3.select("#e18")
    // 7, 8, 9, 10, 11, 16 (is low)
    var delta3 = d3.select("#d3")

    var delta4 = d3.select("#d4")
    var delta2 = d3.select("#d2")

    n8.transition().duration(duration).attr({"cx" : n7.attr("cx"), "cy" : n7.attr("cy"), "r" : 0}).remove()
    n9.transition().duration(duration).attr({"cx" : n7.attr("cx"), "cy" : n7.attr("cy"), "r" : 0}).remove()
    n10.transition().duration(duration).attr({"cx" : n7.attr("cx"), "cy" : n7.attr("cy"), "r" : 0}).remove()
    n11.transition().duration(duration).attr({"cx" : n7.attr("cx"), "cy" : n7.attr("cy"), "r" : 0}).remove()
    n16.transition().duration(duration).attr({"cx" : n7.attr("cx"), "cy" : n7.attr("cy"), "r" : 0}).remove()

    e7.transition().duration(duration).attr({"x1" : n7.attr("cx"), "y1" : n7.attr("cy"), "x2" : n7.attr("cx"), "y2" : n7.attr("cy")}).remove()
    e8.transition().duration(duration).attr({"x1" : n7.attr("cx"), "y1" : n7.attr("cy"), "x2" : n7.attr("cx"), "y2" : n7.attr("cy")}).remove()
    e9.transition().duration(duration).attr({"x1" : n7.attr("cx"), "y1" : n7.attr("cy"), "x2" : n7.attr("cx"), "y2" : n7.attr("cy")}).remove()
    e10.transition().duration(duration).attr({"x1" : n7.attr("cx"), "y1" : n7.attr("cy"), "x2" : n7.attr("cx"), "y2" : n7.attr("cy")}).remove()
    e11.transition().duration(duration).attr({"x1" : n7.attr("cx"), "y1" : n7.attr("cy"), "x2" : n7.attr("cx"), "y2" : n7.attr("cy")}).remove()
    var n7Vec = makeVector(n7.attr("cx"), n7.attr("cy"))
    e22.transition().duration(duration).attr({"d" : lineGenerator([n7Vec, n7Vec, n7Vec, n7Vec])}).remove()

    // move the remainder to the left
    n17.transition().duration(duration).attr({"cx" : n17.attr("cx") - moveVector.x, "cy" : n17.attr("cy") - moveVector.y})
    n18.transition().duration(duration).attr({"x" : n18.attr("x") - moveVector.x, "y" : n18.attr("y") - moveVector.y})
    n22.transition().duration(duration).attr({"x" : n22.attr("x") - moveVector.x, "y" : n22.attr("y") - moveVector.y})

    // e16 n16 n17
    // e17 n17 n18
    // e18 n17 n22
    // e19 n18 n19
    // e20 n19 n20
    // e21 n19 n21
    e16.transition().duration(duration).attr({"x1" : e16.attr("x1") - moveVector.x, "y1" : e16.attr("y1") - moveVector.y, "x2" : e16.attr("x2") - moveVector.x, "y2" : e16.attr("y2") - moveVector.y})
    e17.transition().duration(duration).attr({"x1" : e17.attr("x1") - moveVector.x, "y1" : e17.attr("y1") - moveVector.y, "x2" : e17.attr("x2") - moveVector.x, "y2" : e17.attr("y2") - moveVector.y})
    e18.transition().duration(duration).attr({"x1" : e18.attr("x1") - moveVector.x, "y1" : e18.attr("y1") - moveVector.y, "x2" : e18.attr("x2") - moveVector.x, "y2" : e18.attr("y2") - moveVector.y})

    // move the rightmost delta to the left
    delta3.transition().duration(duration).attr({"x" : delta3.attr("x") - moveVector.x, "y" : delta3.attr("y") - moveVector.y})

    // merge delta2 and delta4
    delta4.transition().duration(duration).attr({"x": delta2.attr("x"), "y": delta2.attr("y")}).remove()
    delta2.transition().duration(duration).remove()

    var latex_raw = "\\delta^{l,m}_{p,q}";
    var latex_query = encodeURI(latex_raw);
    setTimeout(function() {
        d3.select("svg").append("foreignObject")
         .attr({
             "x": delta2.attr("x"),
             "y": delta2.attr("y"),
             "width": 400,
             "height": 200,
             "requiredFeatures": "http://www.w3.org/TR/SVG11/feature#Extensibility",
             "id" : "d2"
        })
         .append("xhtml:body").attr({
             "margin": 0,
             "padding": 0,
             "width": 400,
             "height": 200
        })
         .append("img").attr({
         "src": latex_render_url + latex_query
        })
    },duration - 200)
    // e17.transition().duration(duration).attr({"x1" : e17.attr("x1") - moveVector.x, "y1" : n17.attr("cy") - moveVector.y, "x2" : n18.attr("cx") - moveVector.x, "y2" : n18.attr("cy") - moveVector.y})
    // e18.transition().duration(duration).attr({"x1" : n17.attr("cx") - moveVector.x, "y1" : n17.attr("cy") - moveVector.y, "x2" : n22.attr("cx") - moveVector.x, "y2" : n22.attr("cy") - moveVector.y})
    // e19.transition().duration(duration).attr({"x1" : n18.attr("cx") - moveVector.x, "y1" : n18.attr("cy") - moveVector.y, "x2" : n19.attr("cx") - moveVector.x, "y2" : n19.attr("cy") - moveVector.y})
    // e20.transition().duration(duration).attr({"x1" : n19.attr("cx") - moveVector.x, "y1" : n19.attr("cy") - moveVector.y, "x2" : n20.attr("cx") - moveVector.x, "y2" : n20.attr("cy") - moveVector.y})
    // e21.transition().duration(duration).attr({"x1" : n19.attr("cx") - moveVector.x, "y1" : n19.attr("cy") - moveVector.y, "x2" : n21.attr("cx") - moveVector.x, "y2" : n21.attr("cy") - moveVector.y})
}

function contractStep3(path, duration) {

    var n7 = d3.select("#n7")

    var n17 = d3.select("#n17")
    var n18 = d3.select("#n18")
    var n22 = d3.select("#n22")
    var delta3 = d3.select("#d3")

    var e16 = d3.select("#e16")
    var e17 = d3.select("#e17")
    var e18 = d3.select("#e18")

    n17.transition().duration(duration).attr({"cx" : n7.attr("cx"), "cy" : n7.attr("cy"), "r" : 0}).remove()
    n18.transition().duration(duration).attr({"x" : n7.attr("cx"), "y" : n7.attr("cy") - 15}).remove()
    n22.transition().duration(duration).attr({"x" : n7.attr("cx"), "y" : n7.attr("cy") - 15}).remove()
    delta3.transition().duration(duration).attr({"x" : n7.attr("cx"), "y" : n7.attr("cy") - 15}).remove()

    e16.transition().duration(duration).attr({"x1" : n7.attr("cx"), "y1" : n7.attr("cy"), "x2" : n7.attr("cx"), "y2" : n7.attr("cy")}).remove()
    e17.transition().duration(duration).attr({"x1" : n7.attr("cx"), "y1" : n7.attr("cy"), "x2" : n7.attr("cx"), "y2" : n7.attr("cy")}).remove()
    e18.transition().duration(duration).attr({"x1" : n7.attr("cx"), "y1" : n7.attr("cy"), "x2" : n7.attr("cx"), "y2" : n7.attr("cy")}).remove()
    n7.transition().duration(duration).remove()

    var latex_raw = "\\mathbf{vrouwen}_n \\mathbf{haten}_{npq}";
    var latex_query = encodeURI(latex_raw);
    setTimeout(function() {
        d3.select("svg").append("foreignObject")
         .attr({
             "x": n7.attr("cx") - 10,
             "y": n7.attr("cy") - 15,
             "width": 400,
             "height": 200,
             "requiredFeatures": "http://www.w3.org/TR/SVG11/feature#Extensibility",
             "id" : "contract3"
        })
         .append("xhtml:body").attr({
             "margin": 0,
             "padding": 0,
             "width": 400,
             "height": 200
        })
         .append("img").attr({
         "src": latex_render_url + latex_query
        })
    },duration - 200)
}

function contractStep4(path, duration) {
    var n4 = d3.select("#n4")

    var n5 = d3.select("#n5")
    var n6 = d3.select("#n6")
    var contract3 = d3.select("#contract3")
    var delta2 = d3.select("#d2")

    var e4 = d3.select("#e4")
    var e5 = d3.select("#e5")
    var e6 = d3.select("#e6")

    n5.transition().duration(duration).attr({"cx" : n4.attr("cx"), "cy" : n4.attr("cy"), "r" : 0}).remove()
    n6.transition().duration(duration).attr({"x" : n4.attr("cx"), "y" : n4.attr("cy") - 15}).remove()
    contract3.transition().duration(duration).attr({"x" : n4.attr("cx"), "y" : n4.attr("cy") - 15}).remove()
    delta2.transition().duration(duration).attr({"x" : n4.attr("cx"), "y" : n4.attr("cy") - 15}).remove()

    e4.transition().duration(duration).attr({"x1" : n4.attr("cx"), "y1" : n4.attr("cy"), "x2" : n4.attr("cx"), "y2" : n4.attr("cy")}).remove()
    e5.transition().duration(duration).attr({"x1" : n4.attr("cx"), "y1" : n4.attr("cy"), "x2" : n4.attr("cx"), "y2" : n4.attr("cy")}).remove()
    e6.transition().duration(duration).attr({"x1" : n4.attr("cx"), "y1" : n4.attr("cy"), "x2" : n4.attr("cx"), "y2" : n4.attr("cy")}).remove()
    n4.transition().duration(duration).remove()

    var latex_raw = "\\mathbf{die}_{jklm} \\mathbf{vrouwen}_n \\mathbf{haten}_{nlm}";
    var latex_query = encodeURI(latex_raw);
    setTimeout(function() {
        d3.select("svg").append("foreignObject")
         .attr({
             "x": n4.attr("cx") - 10,
             "y": n4.attr("cy") - 15,
             "width": 400,
             "height": 200,
             "requiredFeatures": "http://www.w3.org/TR/SVG11/feature#Extensibility",
             "id" : "contract4"
        })
         .append("xhtml:body").attr({
             "margin": 0,
             "padding": 0,
             "width": 400,
             "height": 200
        })
         .append("img").attr({
         "src": latex_render_url + latex_query
        })
    },duration - 200)
}

function contractStep5(path, duration) {
    var n1 = d3.select("#n1")

    var n2 = d3.select("#n2")
    var n3 = d3.select("#n3")
    var contract4 = d3.select("#contract4")
    var delta1 = d3.select("#d1")

    var e1 = d3.select("#e1")
    var e2 = d3.select("#e2")
    var e3 = d3.select("#e3")

    n2.transition().duration(duration).attr({"cx" : n1.attr("cx"), "cy" : n1.attr("cy"), "r" : 0}).remove()
    n3.transition().duration(duration).attr({"x" : n1.attr("cx"), "y" : n1.attr("cy") - 15}).remove()
    contract4.transition().duration(duration).attr({"x" : n1.attr("cx"), "y" : n1.attr("cy") - 15}).remove()
    delta1.transition().duration(duration).attr({"x" : n1.attr("cx"), "y" : n1.attr("cy") - 15}).remove()

    e1.transition().duration(duration).attr({"x1" : n1.attr("cx"), "y1" : n1.attr("cy"), "x2" : n1.attr("cx"), "y2" : n1.attr("cy")}).remove()
    e2.transition().duration(duration).attr({"x1" : n1.attr("cx"), "y1" : n1.attr("cy"), "x2" : n1.attr("cx"), "y2" : n1.attr("cy")}).remove()
    e3.transition().duration(duration).attr({"x1" : n1.attr("cx"), "y1" : n1.attr("cy"), "x2" : n1.attr("cx"), "y2" : n1.attr("cy")}).remove()
    n1.transition().duration(duration).remove()

    var latex_raw = "\\mathbf{mannen}_i \\mathbf{die}_{iklm} \\mathbf{vrouwen}_n \\mathbf{haten}_{nlm}";
    var latex_query = encodeURI(latex_raw);
    setTimeout(function() {
        d3.select("svg").append("foreignObject")
         .attr({
             "x": n1.attr("cx") - 10,
             "y": n1.attr("cy") - 15,
             "width": 400,
             "height": 200,
             "requiredFeatures": "http://www.w3.org/TR/SVG11/feature#Extensibility",
             "id" : "contract3"
        })
         .append("xhtml:body").attr({
             "margin": 0,
             "padding": 0,
             "width": 400,
             "height": 200
        })
         .append("img").attr({
         "src": latex_render_url + latex_query
        })
    },duration - 200)
}

function moveNodes(dur) {
    d3.select("svg").call(contractStep1, dur)
    // downloadSVGs(2000)
}

function moveNodes2(dur) {
    d3.select("svg").call(contractStep2, dur)
}

function moveNodes3(dur) {
    d3.select("svg").call(contractStep3, dur)
}

function moveNodes4(dur) {
    d3.select("svg").call(contractStep4, dur)
}

function moveNodes5(dur) {
    d3.select("svg").call(contractStep5, dur)
}

function downloadSVGs(totalDuration) {
  try {
      var isFileSaverSupported = !!new Blob();
  } catch (e) {
      alert("blob not supported");
  }

  var html = document.getElementById("svg").outerHTML
  var blob = new Blob([html], {type: "image/svg+xml"});
  function saveas () {
    saveAs(blob, id + "_myProfile.svg");
    id++
  }

  setTimeout(saveas, totalDuration); // set dealy on saving as it interrupts the transition
  if(n++ >= totalFrames)
    return;
  setTimeout(downloadSVGs, frameRate);
}
