function updateBarChart(group, colorChosen, datasetBarChart) {
    var currentDatasetBarChart = datasetBarChosen(group, datasetBarChart);      // Holds the age-group values for selected cabin class
    var basics = d3BarChartBase();
    
// Set the dimensions of svg
    var margin = basics.margin,
        width = basics.width,
        height = basics.height,
        colorBar = basics.colorBar,
        barPadding = basics.barPadding,
        misc = basics.misc;

// Define x-axis
    var xScale = d3.scaleLinear()
        .domain([0, currentDatasetBarChart.length])
        .range([0, width]);

// Define y-axis
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(currentDatasetBarChart, function(d) { return d.measure; })])
        .range([height,0]);
    
// Define capture svg element
    var svg = d3.select("#barChart svg");
          
// Title
    svg.selectAll("text.title")
    .attr("x", (width + margin.left + margin.right)/2)
    .attr("y", misc.title)
    .attr("class","title")              
    .attr("text-anchor", "middle")
    .text("Age-group Breakdown of Survivors from "+group);      // Add custom title text for the selected group
    
// Select each bar of bar-chart and update data values based on the selected group to render new bar heights
    var plot = d3.select("#barChartPlot")
    .datum(currentDatasetBarChart);

    // Add animation for updating the bars gracefully
    plot.selectAll("rect")
        .data(currentDatasetBarChart)
        .transition()
        .duration(750)
        .attr("x", function(d, i) {
            return xScale(i);
            })
        .attr("width", width / currentDatasetBarChart.length - barPadding)  
        .attr("y", function(d) {
            return yScale(d.measure);
            }) 
        .attr("height", function(d) {
            return height-yScale(d.measure);
            })
        .attr("fill", colorChosen)      // Update the color of bars
            ;
          
    plot.selectAll("text.yAxis") 
        .data(currentDatasetBarChart)
        .transition()
        .duration(750)
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) { 
            return (i * (width / currentDatasetBarChart.length)) + ((width / currentDatasetBarChart.length - barPadding) / 2);      // Update the x-axis (age-group) values
        })
        .attr("y", function(d) {
            return yScale(d.measure) - misc.ylabel;     // Update y-axis (bar-height measures)
        })
        .text(function(d) {
            return formatAsInteger(d.measure)+"%";
            })
        .attr("class", "yAxis")                   
        ;
        
}

