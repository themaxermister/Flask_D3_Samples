var formatAsInteger = d3.format(",");

function d3PieChart(dataset, datasetBarChart){
    var margin = {top: 30, right: 5, bottom: 20, left: 50};
    var width  = 400 - margin.left - margin.right ,
            height  = 400 - margin.top - margin.bottom,
            outerRadius  = Math.min(width, height) / 2,
            innerRadius  = outerRadius * .999,  

        // For animation
            innerRadiusFinal =  outerRadius * .5,
            innerRadiusFinal3 = outerRadius *  .45,
            color  = d3.scaleOrdinal(d3.schemeCategory10);
            
    var vis = d3.select("#pieChart")
    .append("svg:svg")      
    .data([dataset])        // Passed dataset we want to render
    .attr("width", width) 
    .attr("height", height)
    .append("svg:g")        // svg:g - Hold the pie chart and other elements together
                            // g - D3 element which stands for “group” and used to hold multiple elements together, as a group
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");       // Move the center of the pie chart from 0, 0 to radius, radius
    
    // Arc generator produces a circular or angular sector, as in a pie or donut chart
    var arc = d3.arc()      // Creates path element for us using arc data
            .outerRadius(outerRadius).innerRadius(0);
    
// For animation
    // 2 different arcs with different radius, one for mouseover and another for default position
    var arcFinal =  d3.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
    var arcFinal3 =  d3.arc().innerRadius(innerRadiusFinal3).outerRadius(outerRadius);  
    
    var pie = d3.pie()          // Create arc data for us given a list of values
        .value(function(d) { return d.measure; });      // d.measure - The data we need to render one arc
                                                        // d - D3 element which stands for data we passed initially
                                                        //  data().measure - One of the keys in our key-value pair. It holds actual numeric value we passed from backend script in JSON format.
    
    var arcs = vis.selectAll("g.slice")     // Slice element inside g element. Slice element doesn't exist yet
    .data(pie)                              // Associate the generated data with element: 
                                                // An array of arcs which have startAngle, endAngle and value properties
    .enter()                                // Identifies any DOM elements that needs to be added when the joined array is longer than the selection
                                            // Use it to create g elements for every extra data element that should be associated with a selection
    .append("svg:g")                        // Create a group g to hold all slices
    .attr("class", "slice")                 // Add the following events on SVG group
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
    .on("click", up);

    arcs.append("svg:path")
    .attr("fill", function(d, i) { return color(i); } )     // Add fill attribute for each slice and set by returning color for each slice, chosen from the color function defined above.
    .attr("d", arc)         // creates actual SVG path using associated data with the arc drawing function
    .append("svg:title")    // Add title element to each slice, which has category name and a percent value the specific slice represents. This title will be visible when user mouseovers the slice
    .text(function(d) { return d.data.category + ": " + formatAsInteger(d.data.measure)+"%"; });

// Add animation on the data
    d3.selectAll("g.slice").selectAll("path").transition()
        .duration(750)
        .delay(10)
        .attr("d", arcFinal );      // Final radius of our pie at default position.

// Add a label to the larger arcs, translated to the arc centroid and rotated.
    arcs.filter(function(d) { return d.endAngle - d.startAngle  > .2; })        // We define the pie chart's slice labels at a certain angle through filters
    .append("svg:text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("transform", function(d) { return "translate(" +  arcFinal.centroid(d) + ")"; })      // Text transformation
    .text(function(d) { return d.data.category; });     // For each slice add category name as label, using text()

// Pie chart title
    vis.append("svg:text")      // For each slice add category name as label, using text()
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text("Survivors of Titanic")
        .attr("class","title");

// Select path and anmiate the slice to a new radius
    function mouseover() {
        d3.select(this).select("path").transition()
        .duration(750)
        .attr("d", arcFinal3);
    }

    // Select path and anmiate the slice to a new radius
    function mouseout() {
        d3.select(this).select("path").transition()
        .duration(750)
        .attr("d", arcFinal);
    }

// Update barChart when a slice is clicked
    function up(d, i) {
        updateBarChart(d.data.category, color(i), datasetBarChart);
        }
    
}
