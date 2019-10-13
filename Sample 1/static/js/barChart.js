// Key-value pair in the dataset: 
// - “group”: class
// - “category”: age-group
// - “measure”: percentage

// Default group - When page is loaded and no specific class is selected, we show age-group distribution for all classes
var group = "All";

// Returns array of percentage values for a specific selected group from the whole dataset.
function datasetBarChosen(group, datasetBarChart) {
    var ds = [];
    for (x in datasetBarChart) {
        if(datasetBarChart[x].group==group){
            ds.push(datasetBarChart[x]);
        }
        }
    return ds;
}

// Returns the dimensions and color attributes of bar-chart.
function d3BarChartBase() {
    var margin = {top: 30, right: 5, bottom: 20, left: 50},
    width = 600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom,
    colorBar = d3.scaleOrdinal(d3.schemeCategory10),
    barPadding = 1,
    misc = {ylabel: 7, xlabelH: 5, title:11};
    
    return {
        margin : margin,
        width : width,
        height : height,
        colorBar : colorBar,
        barPadding : barPadding,
        misc: misc
    };
}

// Accepts dataset and renders a bar-chart
function d3BarChart(datasetBarChart) {
    var firstDatasetBarChart = datasetBarChosen(group, datasetBarChart);        // Stores array of percentage values for a group. Initially it has value for ‘all’ classes
    var basics = d3BarChartBase();      // Stores dimension of bar-chart
        var margin = basics.margin,
            width = basics.width,
            height = basics.height,
            colorBar = basics.colorBar,
            barPadding = basics.barPadding,
            misc = basics.misc;

            
    var xScale = d3.scaleLinear()
        .domain([0, firstDatasetBarChart.length])
        .range([0, width]);

    var yScale = d3.scaleLinear()
          .domain([0, d3.max(firstDatasetBarChart, function(d) { return d.measure; })])     // d3.max - To make sure that bar should not get higher than the SVG area itself
                .range([height, 0]);
    
    var svg = d3.select("#barChart")
       .append("svg")       // Append bar-chart to #barChart ID with pre-defined dimensions
       .attr("width", width + margin.left + margin.right)
       .attr("height", height  + margin.top + margin.bottom)
       .attr("id","barChartPlot");
    
// Add elements like chart title, bar-chart, x and y axis labels to it
    svg.append("text")
    .attr("x", (width + margin.left + margin.right)/2)
    .attr("y", misc.title)
    .attr("class","title")      // Append title to our chart
    .attr("text-anchor", "middle")
    .text("Age-group Breakdown of all Survivors");      // Add a default text to it     // Title is updated whenever user makes a class selection from pie-chart.

    var plot = svg
        .append("g")        // Group together other elements of the chart
        .attr("transform", "translate(" + margin.left + "," + (margin.top + misc.ylabel) + ")");
            
// Plot each bar based on firstDatasetBarChart that holds numeric values we want to plot
    plot.selectAll("rect")
    .data(firstDatasetBarChart)
    .enter()
    .append("rect")
        .attr("x", function(d, i) {
            return xScale(i);
        })

// Based on these values, we set the height of each bar
    .attr("width", width / firstDatasetBarChart.length - barPadding)
    .attr("y", function(d) {
        return yScale(d.measure);
    }) 
    .attr("height", function(d) {
        return height-yScale(d.measure);
    })
    .attr("fill", "#6B6B6B");   // Give a default color to all the bars

// Adding y-label to each bar, which is a percentage value
    plot.selectAll("text")
    .data(firstDatasetBarChart)
    .enter()
    .append("text")
    .text(function(d) {
            return formatAsInteger(d.measure)+"%";
    })
    .attr("text-anchor", "middle")
    // Define it’s x and y positions and set this value using d.measure, which is measure key in our JSON data.
    .attr("x", function(d, i) {
            return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
    })
    .attr("y", function(d) {
            return (yScale(d.measure) - misc.ylabel);
    })
    .attr("class", "yAxis");

// Add x labels to chart    
    var xLabels = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top + height + misc.xlabelH)  + ")");

    xLabels.selectAll("text.xAxis")
    .data(firstDatasetBarChart)
    .enter()
    .append("text")
    .text(function(d) { return d.category;})    // Set the age-group values which is category key in our JSON data
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) {
        return (i * (width / firstDatasetBarChart.length)) + ((width / firstDatasetBarChart.length - barPadding) / 2);
    })
    .attr("y", 15)
    .attr("class", "xAxis");
}