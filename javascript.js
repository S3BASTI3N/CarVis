/**
 * Created by Sebastien on 09/09/2016.
 *
 * Most of the base code is grabbed from the example over at:
 * http://bl.ocks.org/weiglemc/6185069
 *
 * This has been adapted to suite more data dimensions and version 4 of the d3.js framework
 */
var symbolScale = 15;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 1500 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

// setup x
var xValue = function(d) { return d.year;}, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.axisBottom().scale(xScale);

// setup y
var yValue = function(d) { return d.MPG;}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.axisLeft().scale(yScale);

// setup fill color
var cValue = function(d) { return d.horsepower; };
//var color = d3.scaleOrdinal(d3.schemeCategory10);
var quantize = d3.scaleQuantize()
    .domain([0, 230])
    .range([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]); // possibly adjust range to a smaller one

var color = d3.scaleSequential(d3.interpolateViridis);

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function loadVisualisation()
{
    readDataFile("cars.csv");
}

function readDataFile(fileName)
{
    var file = d3.csv(fileName, parseRow, onDataLoaded );
}

function parseRow(d)
{
    return {
        MPG: parseInt(d.MPG),
        cylinders: parseInt(d.cylinders),
        horsepower: parseInt(d.horsepower),
        model: d.model,
        origin: d.origin,
        weight: parseInt(d.weigth), // correct for spelling weight vs weigth
        year: parseInt(d.year)
    }
}

function onDataLoaded(data)
{
    console.log("loaded data");
    console.log(data);

    var svg = appendSvg();

    renderVisualisation(svg, data);
}

function appendSvg()
{
    // add the graph canvas to the body of the webpage
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    return svg;
}

function renderVisualisation(svg, data) {
    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    var maxWeight = d3.max(data,function(d) {return d.weight;})
    var maxHorsePower = d3.max(data, function(d) {return d.horsepower});

    var container = svg.selectAll(".dot")
        .data(data)
        .enter().append("g")
        .on("mouseover", function(d) {
            d3.select(this).select("text")
                .transition()
                .duration(700)
                .style("opacity", "100");
        })
        .on("mouseout", function(d) {
            d3.select(this).select("text")
                .transition()
                .duration(500)
                .style("opacity", "0");
        });

    // Europe symbol
    container.append("circle")
        .attr("class", "dot")
        .attr("r", function(d) { return d.weight / maxWeight * symbolScale;})
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return color(quantize(cValue(d)));})
        .style("opacity", function(d) { return d.origin === "Europe" ? 1 : 0 });


    // US symbol
    container.append("rect")
        .attr("class", "rect")
        .attr("width", function(d) { return d.weight / maxWeight * 2 * symbolScale;})
        .attr("height", function(d) { return d.weight / maxWeight * 2 * symbolScale;})
        .attr("x", function(d) { return xScale(xValue(d)) - d.weight / maxWeight * symbolScale;})
        .attr("y", function(d) { return yScale(yValue(d)) - d.weight / maxWeight * symbolScale;})
        .style("fill", function(d) { return color(quantize(cValue(d)));})
        .style("opacity", function(d) { return d.origin === "US" ? 1 : 0 });

    // Japan symbol
    container.append("polygon")
        .attr("class", "polygon")
        .attr("points", "1,1 0,-1 -1,1")
        .attr("transform", function(d) {var x = xScale(xValue(d)), y = yScale(yValue(d));
                                            return "translate("+x+","+y+")" +
                                                    "scale(" + d.weight / maxWeight * symbolScale +")"})
        .style("fill", function(d) { return color(quantize(cValue(d)));})
        .style("opacity", function(d) { return d.origin === "Japan" ? 1 : 0 });

    container.append("text")
        .attr("font-family", "sans-serif")
        .attr("y", "20")
        .attr("dx", "30")
        .text(function(d){return d.model})
        .style("opacity", 0)
        .style("font-size", "2em");

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Calories");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Protein (g)");

    // X axis label
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .text("Time (Year+1900)")
    ;

    // Y axis label
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("MPG")
        .attr("font-family", "sans-serif");

    // draw legend
    var legend = svg.selectAll(".legend")
        .data(quantize.ticks())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) {return color(quantize(d))});

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})
        .attr("font-family", "sans-serif");
}