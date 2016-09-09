/**
 * Created by Sebastien on 09/09/2016.
 *
 * Most of the base code is grabbed from the example over at:
 * http://bl.ocks.org/weiglemc/6185069
 *
 * This has been adapted to suite more data dimensions and version 4 of the d3.js framework
 */


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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
var cValue = function(d) { return d.origin;},
    color = d3.scaleOrdinal(d3.schemeCategory10);

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

    var container = svg.selectAll(".dot")
        .data(data)
        .enter().append("g")

    container.append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return color(cValue(d));})

    container.append("text")
        .attr("font-family", "sans-serif")
        .attr("dx", xMap)
        .attr("dy", yMap)
        .text(function(d){return d.model})
        .style("opacity", 0)
        .style("text-anchor","middle")
        .on("mouseover", function(d) {
            d3.select(this)
                .transition()
                .duration(1000)
                .style("opacity", "100");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(500)
                .style("opacity", "0");
        });

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
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})
        .attr("font-family", "sans-serif");
}